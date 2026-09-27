// lib/parser.js

// Multilingual keyword mapping across BRICS languages (English, Hindi, Marathi, Portuguese, Russian, Chinese)
const KEYWORD_MAPS = {
  education: [
    /school/i, /classroom/i, /teacher/i, /student/i, /education/i, /college/i,
    /shala/i, /shalet/i, /varga/i, /shikshan/i, /abhyasika/i,
    /escola/i, /sala de aula/i, /professor/i, /educação/i, /colégio/i,
    /школа/i, /класс/i, /учитель/i, /студент/i, /образование/i,
    /学校/i, /教室/i, /老师/i, /学生/i, /教育/i
  ],
  roads: [
    /road/i, /pothole/i, /pavement/i, /bridge/i, /highway/i, /street/i, /transit/i,
    /rasta/i, /sadak/i, /khadda/i, /khadde/i, /signal/i,
    /estrada/i, /rua/i, /buraco/i, /pavimento/i, /ponte/i, /rodovia/i, /asfalto/i,
    /дорога/i, /яма/i, /асфальт/i, /мост/i, /трасса/i, /улица/i,
    /道路/i, /坑洼/i, /桥梁/i, /公路/i, /交通/i
  ],
  water: [
    /water/i, /leak/i, /drain/i, /sewage/i, /pipeline/i, /tap/i, /tanker/i,
    /pani/i, /paani/i, /nal/i, /bamba/i, /pipe/i,
    /água/i, /vazamento/i, /esgoto/i, /encanamento/i, /torneira/i, /abastecimento/i,
    /вода/i, /утечка/i, /труба/i, /водопровод/i, /канализация/i,
    /水/i, /漏水/i, /管道/i, /污水/i, /自来水/i
  ],
  health: [
    /hospital/i, /clinic/i, /doctor/i, /dispensary/i, /medical/i, /bed/i, /health/i,
    /dawakhana/i, /aarogya/i, /rogya/i, /nurse/i, /ilaj/i,
    /saúde/i, /clínica/i, /médico/i, /posto de saúde/i, /leito/i, /enfermaria/i,
    /больница/i, /поликлиника/i, /врач/i, /медицина/i, /здоровье/i,
    /医院/i, /诊所/i, /医生/i, /医疗/i, /健康/i
  ],
  sanitation: [
    /garbage/i, /trash/i, /cleaning/i, /toilet/i, /waste/i, /sanitation/i,
    /kachra/i, /ghaan/i, /sandaas/i, /washroom/i, /drainage/i, /safai/i,
    /lixo/i, /limpeza/i, /banheiro/i, /saneamento/i, /resíduos/i,
    /мусор/i, /уборка/i, /туалет/i, /санитария/i, /отходы/i,
    /垃圾/i, /清洁/i, /厕所/i, /环卫/i, /下水道/i
  ],
  skill: [
    /skill/i, /vocational/i, /training/i, /employment/i, /job/i, /livelihood/i,
    /naukri/i, /rojgar/i, /udyog/i, /prashikshan/i, /iti/i,
    /capacitação/i, /treinamento/i, /emprego/i, /trabalho/i, /profissional/i,
    /обучение/i, /профессия/i, /работа/i, /курсы/i, /квалификация/i,
    /培训/i, /技能/i, /就业/i, /工作/i, /职业/i
  ]
};

/**
 * Calculates a multi-factor trust score between 0-10 based on evidence richness.
 */
export function calculateTrustScore(submission) {
  let score = 2.0; // Base score for raw text submission
  
  if (submission.audio_url) score += 1.5; // Audio verification (+1.5)
  if (submission.image_url) score += 2.5; // Photo evidence verification (+2.5)
  if (submission.gps_lat && submission.gps_lng) score += 2.5; // GPS location attestation (+2.5)
  if (submission.user_name && submission.user_name.trim().length > 2) score += 1.5; // Profile integrity (+1.5)
  
  return Math.min(score, 10.0);
}

/**
 * Detects language family dynamically from text characteristics
 */
function detectLanguageFamily(text) {
  if (!text) return 'English';
  if (/[\u0900-\u097F]/.test(text)) return 'Hindi/Marathi';
  if (/[\u0400-\u04FF]/.test(text)) return 'Russian';
  if (/[\u4E00-\u9FFF]/.test(text)) return 'Mandarin Chinese';
  if (/\b(não|para|com|estrada|rua|água|saúde|escola|lixo|você)\b/i.test(text)) return 'Portuguese';
  return 'English';
}

/**
 * Fallback Rule-Based Parser (Runs locally when Gemini API key is missing or offline)
 */
function runLocalRuleParser(text, trustScore) {
  const cleanText = text || '';
  const detectedLang = detectLanguageFamily(cleanText);

  // 1. Category classification via multilingual keyword mapping
  let category = "roads";
  let maxMatches = 0;

  Object.entries(KEYWORD_MAPS).forEach(([cat, regexes]) => {
    let matches = 0;
    regexes.forEach(regex => {
      if (regex.test(cleanText)) {
        matches++;
      }
    });
    if (matches > maxMatches) {
      maxMatches = matches;
      category = cat;
    }
  });

  // 2. Dynamic Sector / Ward identification
  let wardId = null;
  const sectorRegex = /(?:ward|sector|setor|район|区)[ ]*([0-9]{1,3})/i;
  const match = cleanText.match(sectorRegex);
  if (match) {
    wardId = parseInt(match[1], 10);
  }

  // 3. Dynamic rule confidence score
  let confidenceScore = 0.35 + (0.15 * Math.max(maxMatches, wardId ? 1 : 0));
  confidenceScore = Math.min(confidenceScore, 0.85);

  return {
    category,
    issue_details: cleanText,
    ward_id: wardId,
    confidence_score: confidenceScore,
    status: confidenceScore >= 0.70 ? 'verified' : 'pending_review',
    trust_score: trustScore,
    original_language: detectedLang
  };
}

/**
 * Live Gemini Ingestion Parser for BRICS Multilingual Inputs
 */
async function runGeminiParser(text, trustScore, apiKey) {
  const modelUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
  
  const systemPrompt = `You are the cognitive multi-lingual parser for CIVIS-BRICS, an international Digital Public Good for infrastructure planning.
Extract structured civic infrastructure requests from any language across BRICS nations (English, Portuguese, Russian, Hindi, Mandarin, etc.).
Return ONLY valid JSON matching this schema:
{
  "category": "education" | "roads" | "water" | "health" | "sanitation" | "skill",
  "issue_details": "Clear, concise English canonical translation and summary of the civic proposal",
  "ward_id": integer sector or ward number if identified in the text or null,
  "confidence_score": 0.0 to 1.0 (how sure you are of the category and details),
  "original_language": "Name of language detected (e.g. English, Portuguese, Russian, Hindi, Marathi, Chinese)"
}`;

  try {
    const response = await fetch(modelUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              { text: `${systemPrompt}\n\nRaw Citizen Input: "${text}"` }
            ]
          }
        ],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    const parsed = JSON.parse(responseText);

    return {
      category: parsed.category || 'roads',
      issue_details: parsed.issue_details || text,
      ward_id: parsed.ward_id || null,
      confidence_score: parsed.confidence_score || 0.5,
      status: (parsed.confidence_score || 0.5) >= 0.70 ? 'verified' : 'pending_review',
      trust_score: trustScore,
      original_language: parsed.original_language || 'English'
    };
  } catch (error) {
    console.error("Gemini Ingest Parser failed, falling back to rule engine:", error);
    return runLocalRuleParser(text, trustScore);
  }
}

/**
 * Primary Parser Interface
 */
export async function parseSubmission(submission) {
  const trustScore = calculateTrustScore(submission);
  const apiKey = process.env.GEMINI_API_KEY;
  const text = submission.raw_text || '';

  if (apiKey && apiKey.trim().length > 10) {
    return await runGeminiParser(text, trustScore, apiKey);
  } else {
    return runLocalRuleParser(text, trustScore);
  }
}

