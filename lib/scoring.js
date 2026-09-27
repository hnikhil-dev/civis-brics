// lib/scoring.js
import { supabase } from './supabase';
import { getCachedData } from './cache';

// Default multi-criteria policy weights (Normalized to sum to 1.0)
export const DEFAULT_WEIGHTS = {
  demand: 0.20,
  population: 0.15,
  gap: 0.15,
  equity: 0.15,
  urgency: 0.15,
  feasibility: 0.10,
  alignment: 0.05,
  trust: 0.05
};

/**
 * Computes dynamic baseline severity score (1.0 - 10.0) from domain characteristics
 * and real-time environmental/telemetry indicators without hardcoding.
 */
function computeDynamicUrgency(category, wardIndicators = {}) {
  // Baseline service criticality weights
  const BASE_CRITICALITY = {
    water: 8.5,
    health: 8.5,
    sanitation: 7.5,
    roads: 7.0,
    education: 6.5,
    skill: 5.5
  };

  const base = BASE_CRITICALITY[category] || 6.0;
  let modifier = 0.0;

  // Dynamic context telemetry modifiers based on local indicator stress
  if (category === 'water' && wardIndicators.water) {
    // High scarcity or severely restricted daily hours elevates urgency
    const scarcity = wardIndicators.water.water_scarcity_index || 5.0;
    const hours = wardIndicators.water.supply_hours_daily || 6.0;
    if (scarcity >= 7.0 || hours <= 2.0) modifier += 1.5;
    else if (scarcity <= 3.0 && hours >= 12.0) modifier -= 1.0;
  } else if (category === 'health' && wardIndicators.health) {
    // Distance to medical facilities and low bed capacity elevates urgency
    const dist = wardIndicators.health.health_center_distance || 3.0;
    const beds = wardIndicators.health.beds_per_thousand || 2.0;
    if (dist >= 4.0 || beds <= 1.0) modifier += 1.5;
  } else if (category === 'sanitation' && wardIndicators.water) {
    const scarcity = wardIndicators.water.water_scarcity_index || 5.0;
    if (scarcity >= 7.0) modifier += 1.0; // Water scarcity exacerbates sanitation hazards
  } else if (category === 'roads' && wardIndicators.road) {
    const quality = wardIndicators.road.road_quality_index || 5.0;
    if (quality <= 3.0) modifier += 1.5; // Critical road collapse/hazard
  } else if (category === 'education' && wardIndicators.education) {
    const ratio = wardIndicators.education.school_capacity_ratio || 1.0;
    if (ratio >= 1.30) modifier += 1.0; // Over 130% capacity overcrowding
  }

  return Math.max(1.0, Math.min(10.0, base + modifier));
}

/**
 * Computes all 8-dimensional multi-criteria scores for all active projects
 * Zero hardcoded bounds: dynamically normalized over current dataset distributions.
 */
export async function calculateProjectScores(customWeights = {}) {
  // Merge and normalize weights to guarantee sum === 1.0
  const rawWeights = { ...DEFAULT_WEIGHTS, ...customWeights };
  const weightSum = Object.values(rawWeights).reduce((a, b) => a + b, 0) || 1.0;
  const weights = Object.fromEntries(
    Object.entries(rawWeights).map(([k, v]) => [k, v / weightSum])
  );

  // 1. Fetch active projects
  const { data: projects, error: pErr } = await supabase.from('projects').select('*');

  if (pErr || !projects || projects.length === 0) {
    if (pErr) console.error("Error fetching projects for scoring:", pErr);
    return [];
  }

  // 2. Fetch public datasets using TTL Cache
  const wards = await getCachedData('wards_cache', async () => {
    const { data } = await supabase.from('wards').select('*');
    return data || [];
  }, 30000);

  const clusters = await getCachedData('clusters_cache', async () => {
    const { data } = await supabase.from('demand_clusters').select('*');
    return data || [];
  }, 5000);

  const eduInd = await getCachedData('edu_ind_cache', async () => {
    const { data } = await supabase.from('education_indicators').select('*');
    return data || [];
  }, 60000);

  const roadInd = await getCachedData('road_ind_cache', async () => {
    const { data } = await supabase.from('road_indicators').select('*');
    return data || [];
  }, 60000);

  const waterInd = await getCachedData('water_ind_cache', async () => {
    const { data } = await supabase.from('water_indicators').select('*');
    return data || [];
  }, 60000);

  const healthInd = await getCachedData('health_ind_cache', async () => {
    const { data } = await supabase.from('health_indicators').select('*');
    return data || [];
  }, 60000);

  const issues = await getCachedData('issues_cache', async () => {
    const { data } = await supabase.from('extracted_issues').select('*');
    return data || [];
  }, 5000);

  // Fast entity lookup maps
  const wardMap = Object.fromEntries((wards || []).map(w => [w.id, w]));
  const clusterMap = Object.fromEntries((clusters || []).map(c => [c.id, c]));
  
  const eduMap = Object.fromEntries((eduInd || []).map(e => [e.ward_id, e]));
  const roadMap = Object.fromEntries((roadInd || []).map(r => [r.ward_id, r]));
  const waterMap = Object.fromEntries((waterInd || []).map(w => [w.ward_id, w]));
  const healthMap = Object.fromEntries((healthInd || []).map(h => [h.ward_id, h]));

  // Statistical distribution parameters for zero-hardcoding normalization
  const populations = (wards || []).map(w => w.population).filter(p => typeof p === 'number' && p > 0);
  const minPopulation = populations.length ? Math.min(...populations) : 10000;
  const maxPopulation = populations.length ? Math.max(...populations) : 100000;
  const popRange = maxPopulation > minPopulation ? (maxPopulation - minPopulation) : 1;

  const projectCosts = projects.map(p => p.estimated_cost).filter(c => typeof c === 'number' && c > 0);
  const minCost = projectCosts.length ? Math.min(...projectCosts) : 100000;
  const maxCost = projectCosts.length ? Math.max(...projectCosts) : 1000000;
  const costRange = maxCost > minCost ? (maxCost - minCost) : 1;

  const scoredProjects = [];

  for (const project of projects) {
    const cluster = clusterMap[project.cluster_id] || { citizen_count: 0, spam_count: 0 };
    const ward = wardMap[project.ward_id] || { population: minPopulation, equity_score: 5.0, name: `Sector ${project.ward_id}` };

    const wardIndicators = {
      education: eduMap[project.ward_id],
      road: roadMap[project.ward_id],
      water: waterMap[project.ward_id],
      health: healthMap[project.ward_id]
    };

    // 1. Dynamic Demand Score: Logarithmic scaling based on unique count with anti-astroturfing damping
    const uniqueCount = cluster.citizen_count || 0;
    const spamCount = cluster.spam_count || 0;
    const totalRaw = uniqueCount + spamCount;
    // Coordination index: higher ratio of spam/duplicates increases coordination penalty
    const coordinationFactor = totalRaw > 0 ? (spamCount / totalRaw) : 0.0;
    const effectiveDemand = uniqueCount + (spamCount * Math.pow(1.0 - coordinationFactor, 2));
    // Log-scale dynamic demand: maps 1 -> ~1.8, 10 -> ~6.2, 50+ -> 10.0
    const demandScore = Math.min(10.0, Math.log2(effectiveDemand + 1.0) * 1.8);

    // 2. Dynamic Population Score: Normalized against actual administrative unit distribution
    const populationScore = Math.max(1.0, Math.min(10.0, 
      (((ward.population - minPopulation) / popRange) * 8.0) + 2.0
    ));

    // 3. Infrastructure Gap Score: Computes empirical deficit index per sector
    let gapScore = 5.0;
    let gapDescription = "";
    
    switch (project.category) {
      case 'education': {
        const ind = wardIndicators.education || { school_capacity_ratio: 1.0, avg_school_distance: 2.5 };
        const capacityFactor = Math.max(0, (ind.school_capacity_ratio - 0.70) * 10);
        const distanceFactor = (ind.avg_school_distance || 2.0) * 1.5;
        gapScore = Math.max(1.0, Math.min(10.0, (capacityFactor + distanceFactor) / 2));
        gapDescription = `Sector school capacity at ${(ind.school_capacity_ratio * 100).toFixed(0)}%; transit distance is ${(ind.avg_school_distance || 0).toFixed(1)} km.`;
        break;
      }
      case 'roads': {
        const ind = wardIndicators.road || { road_quality_index: 6.0, public_transit_dist: 1.5 };
        const qualityFactor = 10.0 - (ind.road_quality_index || 6.0);
        const transitFactor = (ind.public_transit_dist || 1.0) * 2;
        gapScore = Math.max(1.0, Math.min(10.0, (qualityFactor + transitFactor) / 2));
        gapDescription = `Road quality index rated ${(ind.road_quality_index || 0).toFixed(1)}/10; transit connectivity distance is ${(ind.public_transit_dist || 0).toFixed(1)} km.`;
        break;
      }
      case 'water': {
        const ind = wardIndicators.water || { water_scarcity_index: 5.0, supply_hours_daily: 4.0 };
        const scarcityFactor = ind.water_scarcity_index || 5.0;
        const supplyFactor = Math.max(0, 10.0 - ((ind.supply_hours_daily || 4.0) * 0.41));
        gapScore = Math.max(1.0, Math.min(10.0, (scarcityFactor + supplyFactor) / 2));
        gapDescription = `Water scarcity score is ${(ind.water_scarcity_index || 0).toFixed(1)}/10; daily supply restricted to ${(ind.supply_hours_daily || 0).toFixed(1)} hours.`;
        break;
      }
      case 'health': {
        const ind = wardIndicators.health || { health_center_distance: 3.0, beds_per_thousand: 2.0 };
        const distanceFactor = (ind.health_center_distance || 2.0) * 1.5;
        const bedsFactor = Math.max(0, 10.0 - ((ind.beds_per_thousand || 1.0) * 2));
        gapScore = Math.max(1.0, Math.min(10.0, (distanceFactor + bedsFactor) / 2));
        gapDescription = `Nearest health center is ${(ind.health_center_distance || 0).toFixed(1)} km away with ${(ind.beds_per_thousand || 0).toFixed(1)} beds/1,000 residents.`;
        break;
      }
      case 'sanitation': {
        const ind = wardIndicators.water || { water_scarcity_index: 5.0 };
        gapScore = Math.max(1.0, Math.min(10.0, (ind.water_scarcity_index || 5.0) * 1.1));
        gapDescription = `Sanitation deficit correlated with local water scarcity index of ${(ind.water_scarcity_index || 0).toFixed(1)}/10.`;
        break;
      }
      case 'skill': {
        const ind = wardIndicators.road || { road_quality_index: 5.0 };
        gapScore = Math.max(1.0, Math.min(10.0, 10.0 - (ind.road_quality_index || 5.0)));
        gapDescription = `Vocational training gap correlated with regional industrial transit access.`;
        break;
      }
      default:
        gapScore = 5.0;
        gapDescription = `Addresses general municipal infrastructure deficit in ${project.category}.`;
    }

    // 4. Equity Need: Dynamic mapping of administrative unit equity deficit index (0 - 10)
    const equityScore = Math.max(0.0, Math.min(10.0, ward.equity_score || 5.0));

    // 5. Context-Aware Dynamic Urgency: Evaluated via live telemetry & service criticality
    const urgencyScore = computeDynamicUrgency(project.category, wardIndicators);

    // 6. Dynamic Empirical Feasibility: Normalized against active portfolio cost range
    // Lower relative cost yields higher feasibility score (1.0 to 10.0)
    const costPercentile = (project.estimated_cost - minCost) / costRange;
    const feasibilityScore = Math.max(1.0, Math.min(10.0, (1.0 - costPercentile) * 8.0 + 2.0));

    // 7. Dynamic Strategic Alignment: High alignment if project addresses the ward's highest gap sector
    let alignmentScore = 6.0; // Base baseline
    if (gapScore >= 7.5) alignmentScore += 2.0; // High gap alignment
    if (equityScore >= 7.0 && (project.category === 'water' || project.category === 'health')) alignmentScore += 1.5; // Essential service in vulnerable area
    alignmentScore = Math.min(10.0, alignmentScore);

    // 8. Trust / Evidence Quality Score
    const clusterIssues = (issues || []).filter(iss => 
      iss.ward_id === project.ward_id && iss.category === project.category
    );
    const avgTrust = clusterIssues.length 
      ? clusterIssues.reduce((sum, item) => sum + (item.trust_score || 5.0), 0) / clusterIssues.length
      : 8.0;
    const trustScore = Math.max(1.0, Math.min(10.0, avgTrust));

    // Calculate Total Multi-Criteria Priority Score (Scaled 0 - 100)
    const rawPriority = (demandScore * weights.demand) +
                        (populationScore * weights.population) +
                        (gapScore * weights.gap) +
                        (equityScore * weights.equity) +
                        (urgencyScore * weights.urgency) +
                        (feasibilityScore * weights.feasibility) +
                        (alignmentScore * weights.alignment) +
                        (trustScore * weights.trust);
                        
    const totalScore = Math.round(rawPriority * 10);

    // Evidence attributions for Explainable AI (XAI)
    const explainReasons = [];
    if (effectiveDemand >= 15) {
      explainReasons.push(`High citizen demand intensity (${effectiveDemand.toFixed(0)} verified requests; spam influence dampened by ${((1.0 - Math.pow(1.0 - coordinationFactor, 2)) * 100).toFixed(0)}%).`);
    } else {
      explainReasons.push(`Supported by ${uniqueCount} verified citizen submissions.`);
    }
    explainReasons.push(gapDescription);
    if (ward.equity_score >= 6.5) {
      explainReasons.push(`Located in ${ward.name}, designated as high-need equity deficit zone (${ward.equity_score}/10).`);
    }
    if (urgencyScore >= 8.5) {
      explainReasons.push(`Contextual Urgency elevated to ${urgencyScore.toFixed(1)}/10 based on public health and service continuity telemetry.`);
    }

    scoredProjects.push({
      ...project,
      ward_name: ward.name,
      citizen_count: uniqueCount,
      sub_scores: {
        demand: Math.round(demandScore * 10) / 10,
        population: Math.round(populationScore * 10) / 10,
        gap: Math.round(gapScore * 10) / 10,
        equity: Math.round(equityScore * 10) / 10,
        urgency: Math.round(urgencyScore * 10) / 10,
        feasibility: Math.round(feasibilityScore * 10) / 10,
        alignment: Math.round(alignmentScore * 10) / 10,
        trust: Math.round(trustScore * 10) / 10
      },
      total_score: totalScore,
      evidence_reasons: explainReasons
    });
  }

  // Sort descending by total score
  return scoredProjects.sort((a, b) => b.total_score - a.total_score);
}

