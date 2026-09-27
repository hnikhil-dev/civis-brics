// lib/clustering.js
import { supabase } from './supabase';

/**
 * Tokenizes text and returns a set of lowercase words.
 */
export function getWordTokens(text) {
  if (!text) return new Set();
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 2)
  );
}

/**
 * Computes Jaccard Similarity between two texts (Intersection / Union).
 * Robust for keyword overlapping semantic matching.
 */
export function calculateJaccardSimilarity(text1, text2) {
  const words1 = getWordTokens(text1);
  const words2 = getWordTokens(text2);
  
  if (words1.size === 0 || words2.size === 0) return 0;
  
  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Computes Cosine Similarity between two dense embedding vectors.
 */
export function calculateCosineSimilarity(vecA, vecB) {
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length === 0 || vecB.length === 0) {
    return 0;
  }
  const minLen = Math.min(vecA.length, vecB.length);
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < minLen; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

/**
 * Computes real physical distance (in km) between two geographical points using the Haversine formula.
 */
export function calculateHaversineDistance(lat1, lon1, lat2, lon2) {
  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;
  const toRad = deg => (deg * Math.PI) / 180.0;
  const R = 6371; // Earth's mean radius in km

  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Generates character 3-grams for phonetic / cross-lingual morphological overlap.
 */
function getCharNGrams(text, n = 3) {
  if (!text) return new Set();
  const clean = text.toLowerCase().replace(/\s+/g, ' ');
  const ngrams = new Set();
  for (let i = 0; i <= clean.length - n; i++) {
    ngrams.add(clean.substring(i, i + n));
  }
  return ngrams;
}

/**
 * Computes subword character n-gram similarity for multilingual and typo tolerance.
 */
function calculateSubwordSimilarity(text1, text2) {
  const ng1 = getCharNGrams(text1, 3);
  const ng2 = getCharNGrams(text2, 3);
  if (ng1.size === 0 || ng2.size === 0) return 0;
  const intersection = new Set([...ng1].filter(x => ng2.has(x)));
  const union = new Set([...ng1, ...ng2]);
  return intersection.size / union.size;
}

/**
 * Hybrid Semantic-Spatial Similarity Matcher
 * Blends dense embeddings (if present), word/subword overlap, and Haversine spatial proximity.
 */
export function computeCompositeMatchScore(submission, clusterText, clusterCoords = null) {
  let semanticScore = 0;

  // 1. Vector cosine similarity if available
  if (submission.embedding && Array.isArray(submission.embedding)) {
    // If cluster has centroid embedding
    if (clusterCoords && clusterCoords.embedding) {
      semanticScore = calculateCosineSimilarity(submission.embedding, clusterCoords.embedding);
    }
  }

  // 2. Lexical and morphological semantic similarity
  const wordJaccard = calculateJaccardSimilarity(submission.raw_text || '', clusterText || '');
  const subwordJaccard = calculateSubwordSimilarity(submission.raw_text || '', clusterText || '');
  const lexicalScore = (wordJaccard * 0.6) + (subwordJaccard * 0.4);

  semanticScore = Math.max(semanticScore, lexicalScore);

  // 3. Spatial proximity blending
  if (submission.gps_lat && submission.gps_lng && clusterCoords && clusterCoords.lat && clusterCoords.lng) {
    const distKm = calculateHaversineDistance(
      submission.gps_lat, submission.gps_lng,
      clusterCoords.lat, clusterCoords.lng
    );
    if (distKm !== null) {
      // Exponential spatial decay: 0.5km -> 0.90, 2km -> 0.67, 5km -> 0.36
      const spatialProximity = Math.exp(-distKm / 3.0);
      // Weighted composite score (70% semantic, 30% spatial proximity)
      return (semanticScore * 0.70) + (spatialProximity * 0.30);
    }
  }

  return semanticScore;
}

/**
 * Main Production Clustering and Spam / Astroturfing Detection Engine
 */
export async function clusterSubmission(submission, parsed) {
  const { category, ward_id, issue_details } = parsed;

  // 1. Fetch active clusters for the same category and administrative unit
  const { data: clusters, error: clusterErr } = await supabase
    .from('demand_clusters')
    .select('*')
    .eq('category', category)
    .eq('ward_id', ward_id || 0)
    .eq('status', 'active');

  if (clusterErr) {
    console.error("Error fetching clusters for matching:", clusterErr);
  }

  let matchedCluster = null;
  let highestMatchScore = 0;
  let isCampaign = false;

  if (clusters && clusters.length > 0) {
    // 2. Run hybrid similarity matching against active clusters
    for (const cluster of clusters) {
      const matchScoreTitle = computeCompositeMatchScore(
        { ...submission, raw_text: issue_details },
        cluster.title
      );
      const matchScoreSummary = computeCompositeMatchScore(
        { ...submission, raw_text: issue_details },
        cluster.summary
      );
      const maxMatch = Math.max(matchScoreTitle, matchScoreSummary);

      // Adaptive threshold: >= 0.32 constitutes a meaningful community demand match
      if (maxMatch >= 0.32 && maxMatch > highestMatchScore) {
        highestMatchScore = maxMatch;
        matchedCluster = cluster;
      }
    }

    // 3. Dynamic Astroturfing & Bot-Flood Detection
    // High lexical identity (>= 0.78) indicates coordinated petition templates
    if (highestMatchScore >= 0.78) {
      isCampaign = true;
    }
  }

  // Record campaign metadata
  parsed.is_campaign = isCampaign;
  
  // Insert extracted issue
  const { error: issueErr } = await supabase
    .from('extracted_issues')
    .insert({
      submission_id: submission.id,
      category: parsed.category,
      issue_details: parsed.issue_details,
      ward_id: parsed.ward_id,
      confidence_score: parsed.confidence_score,
      status: parsed.status,
      trust_score: parsed.trust_score,
      is_campaign: isCampaign
    });

  if (issueErr) {
    console.error("Error inserting extracted issue:", issueErr);
  }

  if (matchedCluster) {
    // 4. Update existing cluster with anti-astroturfing counters
    const currentCitizen = matchedCluster.citizen_count || 1;
    const currentSpam = matchedCluster.spam_count || 0;

    const updatedCount = isCampaign ? currentCitizen : currentCitizen + 1;
    const updatedSpam = isCampaign ? currentSpam + 1 : currentSpam;

    await supabase
      .from('demand_clusters')
      .update({
        citizen_count: updatedCount,
        spam_count: updatedSpam
      })
      .eq('id', matchedCluster.id);

    // Save cluster mapping
    await supabase
      .from('cluster_mappings')
      .insert({
        submission_id: submission.id,
        cluster_id: matchedCluster.id
      });

    return {
      clusterId: matchedCluster.id,
      action: "merged",
      isCampaign,
      matchScore: Math.round(highestMatchScore * 100) / 100,
      clusterTitle: matchedCluster.title
    };
  } else {
    // 5. Create a new demand cluster dynamically
    const unitLabel = ward_id ? `Sector ${ward_id}` : 'General Regional Pool';
    const clusterTitle = `${unitLabel} ${category.toUpperCase()} Infrastructure Need`;
    const clusterSummary = `Consolidated citizen demand for ${category} improvements in ${unitLabel}: "${issue_details}"`;

    const { data: newCluster, error: newClusterErr } = await supabase
      .from('demand_clusters')
      .insert({
        category,
        ward_id,
        title: clusterTitle,
        summary: clusterSummary,
        citizen_count: 1,
        spam_count: 0,
        status: 'active'
      });

    if (newClusterErr) {
      console.error("Error creating new cluster:", newClusterErr);
      return { error: newClusterErr.message };
    }

    // Retrieve newly created cluster
    const { data: createdClusters } = await supabase
      .from('demand_clusters')
      .select('*')
      .eq('category', category)
      .eq('ward_id', ward_id || 0)
      .order('id', { ascending: false })
      .limit(1);

    const createdCluster = createdClusters && createdClusters[0];

    if (createdCluster) {
      // Map submission to newly formed cluster
      await supabase
        .from('cluster_mappings')
        .insert({
          submission_id: submission.id,
          cluster_id: createdCluster.id
        });

      // 6. Synthesize corresponding proposed project with dynamic baseline cost
      const estimatedCost = getCategoryDynamicCost(category, ward_id);
      await supabase
        .from('projects')
        .insert({
          cluster_id: createdCluster.id,
          title: clusterTitle,
          category,
          ward_id: ward_id || 1,
          estimated_cost: estimatedCost,
          status: 'Proposed'
        });

      return {
        clusterId: createdCluster.id,
        action: "created",
        isCampaign: false,
        matchScore: 1.0,
        clusterTitle
      };
    }
    
    return { error: "Failed to map new cluster" };
  }
}

/**
 * Estimates baseline capital cost per domain category in standard base units
 */
function getCategoryDynamicCost(category, wardId = null) {
  const COST_TIERS = {
    education: 420000,
    roads: 280000,
    water: 350000,
    health: 600000,
    sanitation: 380000,
    skill: 450000
  };
  return COST_TIERS[category] || 300000;
}

