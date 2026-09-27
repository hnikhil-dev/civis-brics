// lib/brics_dataset.js
/**
 * Sovereign BRICS Real-World Benchmark Datasets for Track 1: AI for DPI & Governance
 * Covers 5 Core Member States:
 * - 🇮🇳 India (Pune South-East Urban District)
 * - 🇧🇷 Brazil (São Paulo East Metropolitan Subprefecture)
 * - 🇿🇦 South Africa (City of Johannesburg Metropolitan Region)
 * - 🇨🇳 China (Guangzhou Urban Development District)
 * - 🇷🇺 Russia (Moscow Central Administrative District)
 */

export const INITIAL_MOCK_DATA = {
  // 1. Hierarchical Administrative Units (25 Sectors/Wards)
  wards: [
    // --- INDIA (Pune Metropolitan Region) ---
    { id: 1, country_code: 'IND', name: 'Ward 1 - Koregaon Park Extension', population: 45000, equity_score: 4.8 },
    { id: 2, country_code: 'IND', name: 'Ward 2 - Hadapsar Industrial Zone', population: 78000, equity_score: 5.9 },
    { id: 3, country_code: 'IND', name: 'Ward 3 - Wanowrie Central', population: 92000, equity_score: 6.7 },
    { id: 4, country_code: 'IND', name: 'Ward 4 - Kondhwa Khurd', population: 115000, equity_score: 8.5 },
    { id: 5, country_code: 'IND', name: 'Ward 5 - Mundhwa Junction', population: 68000, equity_score: 6.8 },

    // --- BRAZIL (São Paulo Metropolitan Region) ---
    { id: 101, country_code: 'BRA', name: 'Setor 1 - Mooca Centro', population: 75000, equity_score: 4.2 },
    { id: 102, country_code: 'BRA', name: 'Setor 2 - Tatuapé Leste', population: 98000, equity_score: 5.1 },
    { id: 103, country_code: 'BRA', name: 'Setor 3 - Penha de França', population: 128000, equity_score: 6.5 },
    { id: 104, country_code: 'BRA', name: 'Setor 4 - Itaquera Zona Leste', population: 215000, equity_score: 7.9 },
    { id: 105, country_code: 'BRA', name: 'Setor 5 - São Mateus Periferia', population: 165000, equity_score: 8.3 },

    // --- SOUTH AFRICA (City of Johannesburg Metropolitan) ---
    { id: 201, country_code: 'ZAF', name: 'Ward 201 - Sandton Financial Zone', population: 52000, equity_score: 3.5 },
    { id: 202, country_code: 'ZAF', name: 'Ward 202 - Rosebank Commercial', population: 64000, equity_score: 4.1 },
    { id: 203, country_code: 'ZAF', name: 'Ward 203 - Braamfontein University Corridor', population: 89000, equity_score: 6.2 },
    { id: 204, country_code: 'ZAF', name: 'Ward 204 - Alexandra Urban Renewal Area', population: 185000, equity_score: 8.9 },
    { id: 205, country_code: 'ZAF', name: 'Ward 205 - Soweto Central Infrastructure Hub', population: 240000, equity_score: 7.8 },

    // --- CHINA (Guangzhou Urban Development District) ---
    { id: 301, country_code: 'CHN', name: 'Tianhe District Digital Core', population: 154000, equity_score: 3.8 },
    { id: 302, country_code: 'CHN', name: 'Yuexiu Heritage & Transit Hub', population: 112000, equity_score: 4.5 },
    { id: 303, country_code: 'CHN', name: 'Haizhu Green Island Corridor', population: 168000, equity_score: 5.8 },
    { id: 304, country_code: 'CHN', name: 'Baiyun Northern Industrial Extension', population: 285000, equity_score: 7.2 },
    { id: 305, country_code: 'CHN', name: 'Huangpu New Logistics & Science City', population: 195000, equity_score: 6.4 },

    // --- RUSSIA (Moscow Central Administrative District) ---
    { id: 401, country_code: 'RUS', name: 'Tverskoy Central District', population: 78000, equity_score: 3.2 },
    { id: 402, country_code: 'RUS', name: 'Basmanny Innovation District', population: 110000, equity_score: 4.9 },
    { id: 403, country_code: 'RUS', name: 'Tagansky Transit Sector', population: 135000, equity_score: 5.8 },
    { id: 404, country_code: 'RUS', name: 'Lefortovo Industrial Renovation Zone', population: 98000, equity_score: 7.4 },
    { id: 405, country_code: 'RUS', name: 'Danilovsky Thermal Upgrade Corridor', population: 104000, equity_score: 7.6 }
  ],

  // 2. Dynamic Sector Telemetry: Education Indicators
  education_indicators: [
    // India
    { ward_id: 1, school_capacity_ratio: 0.75, avg_school_distance: 1.2 },
    { ward_id: 2, school_capacity_ratio: 0.95, avg_school_distance: 2.8 },
    { ward_id: 3, school_capacity_ratio: 1.35, avg_school_distance: 4.8 },
    { ward_id: 4, school_capacity_ratio: 1.10, avg_school_distance: 3.5 },
    { ward_id: 5, school_capacity_ratio: 0.85, avg_school_distance: 2.2 },
    // Brazil
    { ward_id: 101, school_capacity_ratio: 0.80, avg_school_distance: 1.4 },
    { ward_id: 102, school_capacity_ratio: 0.90, avg_school_distance: 2.0 },
    { ward_id: 103, school_capacity_ratio: 1.15, avg_school_distance: 3.2 },
    { ward_id: 104, school_capacity_ratio: 1.40, avg_school_distance: 4.5 },
    { ward_id: 105, school_capacity_ratio: 1.30, avg_school_distance: 4.0 },
    // South Africa
    { ward_id: 201, school_capacity_ratio: 0.70, avg_school_distance: 1.0 },
    { ward_id: 202, school_capacity_ratio: 0.85, avg_school_distance: 1.8 },
    { ward_id: 203, school_capacity_ratio: 1.05, avg_school_distance: 2.5 },
    { ward_id: 204, school_capacity_ratio: 1.45, avg_school_distance: 5.2 },
    { ward_id: 205, school_capacity_ratio: 1.35, avg_school_distance: 4.6 },
    // China
    { ward_id: 301, school_capacity_ratio: 0.78, avg_school_distance: 0.9 },
    { ward_id: 302, school_capacity_ratio: 0.88, avg_school_distance: 1.5 },
    { ward_id: 303, school_capacity_ratio: 0.98, avg_school_distance: 2.1 },
    { ward_id: 304, school_capacity_ratio: 1.25, avg_school_distance: 3.8 },
    { ward_id: 305, school_capacity_ratio: 1.10, avg_school_distance: 2.9 },
    // Russia
    { ward_id: 401, school_capacity_ratio: 0.72, avg_school_distance: 0.8 },
    { ward_id: 402, school_capacity_ratio: 0.85, avg_school_distance: 1.6 },
    { ward_id: 403, school_capacity_ratio: 0.95, avg_school_distance: 2.3 },
    { ward_id: 404, school_capacity_ratio: 1.28, avg_school_distance: 3.9 },
    { ward_id: 405, school_capacity_ratio: 1.20, avg_school_distance: 3.4 }
  ],

  // 3. Dynamic Sector Telemetry: Road Quality & Transit Indicators
  road_indicators: [
    // India
    { ward_id: 1, road_quality_index: 8.5, public_transit_dist: 0.5 },
    { ward_id: 2, road_quality_index: 6.0, public_transit_dist: 1.5 },
    { ward_id: 3, road_quality_index: 5.2, public_transit_dist: 1.8 },
    { ward_id: 4, road_quality_index: 4.0, public_transit_dist: 2.5 },
    { ward_id: 5, road_quality_index: 2.8, public_transit_dist: 3.2 },
    // Brazil
    { ward_id: 101, road_quality_index: 7.8, public_transit_dist: 0.6 },
    { ward_id: 102, road_quality_index: 6.5, public_transit_dist: 1.2 },
    { ward_id: 103, road_quality_index: 5.0, public_transit_dist: 2.0 },
    { ward_id: 104, road_quality_index: 3.5, public_transit_dist: 3.8 },
    { ward_id: 105, road_quality_index: 3.2, public_transit_dist: 4.2 },
    // South Africa
    { ward_id: 201, road_quality_index: 8.9, public_transit_dist: 0.4 },
    { ward_id: 202, road_quality_index: 7.5, public_transit_dist: 0.8 },
    { ward_id: 203, road_quality_index: 5.8, public_transit_dist: 1.6 },
    { ward_id: 204, road_quality_index: 3.0, public_transit_dist: 4.5 },
    { ward_id: 205, road_quality_index: 4.2, public_transit_dist: 3.1 },
    // China
    { ward_id: 301, road_quality_index: 9.1, public_transit_dist: 0.3 },
    { ward_id: 302, road_quality_index: 8.0, public_transit_dist: 0.7 },
    { ward_id: 303, road_quality_index: 7.2, public_transit_dist: 1.1 },
    { ward_id: 304, road_quality_index: 4.4, public_transit_dist: 2.9 },
    { ward_id: 305, road_quality_index: 6.8, public_transit_dist: 1.5 },
    // Russia
    { ward_id: 401, road_quality_index: 8.8, public_transit_dist: 0.4 },
    { ward_id: 402, road_quality_index: 7.6, public_transit_dist: 0.9 },
    { ward_id: 403, road_quality_index: 5.9, public_transit_dist: 1.7 },
    { ward_id: 404, road_quality_index: 4.1, public_transit_dist: 3.0 },
    { ward_id: 405, road_quality_index: 4.5, public_transit_dist: 2.8 }
  ],

  // 4. Dynamic Sector Telemetry: Water & Sanitation Indicators
  water_indicators: [
    // India
    { ward_id: 1, water_scarcity_index: 1.5, supply_hours_daily: 24.0 },
    { ward_id: 2, water_scarcity_index: 4.5, supply_hours_daily: 6.0 },
    { ward_id: 3, water_scarcity_index: 5.0, supply_hours_daily: 4.0 },
    { ward_id: 4, water_scarcity_index: 8.8, supply_hours_daily: 1.2 },
    { ward_id: 5, water_scarcity_index: 6.5, supply_hours_daily: 3.0 },
    // Brazil
    { ward_id: 101, water_scarcity_index: 3.2, supply_hours_daily: 20.0 },
    { ward_id: 102, water_scarcity_index: 4.0, supply_hours_daily: 16.0 },
    { ward_id: 103, water_scarcity_index: 5.5, supply_hours_daily: 10.0 },
    { ward_id: 104, water_scarcity_index: 7.9, supply_hours_daily: 4.5 },
    { ward_id: 105, water_scarcity_index: 8.2, supply_hours_daily: 3.8 },
    // South Africa
    { ward_id: 201, water_scarcity_index: 1.8, supply_hours_daily: 24.0 },
    { ward_id: 202, water_scarcity_index: 3.0, supply_hours_daily: 22.0 },
    { ward_id: 203, water_scarcity_index: 5.2, supply_hours_daily: 12.0 },
    { ward_id: 204, water_scarcity_index: 8.7, supply_hours_daily: 2.5 },
    { ward_id: 205, water_scarcity_index: 7.5, supply_hours_daily: 5.0 },
    // China
    { ward_id: 301, water_scarcity_index: 1.2, supply_hours_daily: 24.0 },
    { ward_id: 302, water_scarcity_index: 2.5, supply_hours_daily: 24.0 },
    { ward_id: 303, water_scarcity_index: 4.8, supply_hours_daily: 18.0 },
    { ward_id: 304, water_scarcity_index: 6.9, supply_hours_daily: 8.0 },
    { ward_id: 305, water_scarcity_index: 5.0, supply_hours_daily: 15.0 },
    // Russia
    { ward_id: 401, water_scarcity_index: 1.5, supply_hours_daily: 24.0 },
    { ward_id: 402, water_scarcity_index: 2.8, supply_hours_daily: 24.0 },
    { ward_id: 403, water_scarcity_index: 4.2, supply_hours_daily: 20.0 },
    { ward_id: 404, water_scarcity_index: 7.5, supply_hours_daily: 6.0 },
    { ward_id: 405, water_scarcity_index: 7.0, supply_hours_daily: 8.0 }
  ],

  // 5. Dynamic Sector Telemetry: Health & Hospital Capacity Indicators
  health_indicators: [
    // India
    { ward_id: 1, health_center_distance: 0.8, beds_per_thousand: 4.5 },
    { ward_id: 2, health_center_distance: 2.5, beds_per_thousand: 2.1 },
    { ward_id: 3, health_center_distance: 3.2, beds_per_thousand: 1.8 },
    { ward_id: 4, health_center_distance: 5.5, beds_per_thousand: 0.8 },
    { ward_id: 5, health_center_distance: 4.0, beds_per_thousand: 1.2 },
    // Brazil
    { ward_id: 101, health_center_distance: 1.1, beds_per_thousand: 3.8 },
    { ward_id: 102, health_center_distance: 2.0, beds_per_thousand: 2.5 },
    { ward_id: 103, health_center_distance: 3.1, beds_per_thousand: 1.9 },
    { ward_id: 104, health_center_distance: 4.8, beds_per_thousand: 1.1 },
    { ward_id: 105, health_center_distance: 5.6, beds_per_thousand: 0.7 },
    // South Africa
    { ward_id: 201, health_center_distance: 0.9, beds_per_thousand: 5.1 },
    { ward_id: 202, health_center_distance: 1.5, beds_per_thousand: 3.6 },
    { ward_id: 203, health_center_distance: 2.4, beds_per_thousand: 2.3 },
    { ward_id: 204, health_center_distance: 6.1, beds_per_thousand: 0.6 },
    { ward_id: 205, health_center_distance: 4.9, beds_per_thousand: 1.0 },
    // China
    { ward_id: 301, health_center_distance: 0.6, beds_per_thousand: 6.2 },
    { ward_id: 302, health_center_distance: 1.2, beds_per_thousand: 4.5 },
    { ward_id: 303, health_center_distance: 2.2, beds_per_thousand: 3.1 },
    { ward_id: 304, health_center_distance: 4.6, beds_per_thousand: 1.4 },
    { ward_id: 305, health_center_distance: 3.2, beds_per_thousand: 2.4 },
    // Russia
    { ward_id: 401, health_center_distance: 0.7, beds_per_thousand: 5.8 },
    { ward_id: 402, health_center_distance: 1.8, beds_per_thousand: 4.0 },
    { ward_id: 403, health_center_distance: 2.8, beds_per_thousand: 2.7 },
    { ward_id: 404, health_center_distance: 4.9, beds_per_thousand: 1.3 },
    { ward_id: 405, health_center_distance: 4.2, beds_per_thousand: 1.6 }
  ],

  // 6. Multilingual Sovereign Citizen Submissions
  submissions: [
    // --- INDIA ---
    {
      id: 'sub-ind-1',
      country_code: 'IND',
      user_name: 'Amit Sharma',
      raw_text: 'Ward 4 Kondhwa water supply is highly irregular and contaminated. Water tanker mafia charging heavy rates.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Web Form',
      gps_lat: 18.479,
      gps_lng: 73.890,
      created_at: new Date(Date.now() - 3600000 * 36).toISOString()
    },
    {
      id: 'sub-ind-2',
      country_code: 'IND',
      user_name: 'Ramesh Kale',
      raw_text: 'Mundhwa road holds lots of potholes near the signal. Road is completely broken and dangerous for two wheelers.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Voice Note',
      gps_lat: 18.538,
      gps_lng: 73.915,
      created_at: new Date(Date.now() - 3600000 * 18).toISOString()
    },
    {
      id: 'sub-ind-3',
      country_code: 'IND',
      user_name: 'Pooja Patil',
      raw_text: 'Wanowrie primary school has over 60 kids per class. We urgently need new classrooms built.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Web Form',
      gps_lat: 18.488,
      gps_lng: 73.896,
      created_at: new Date(Date.now() - 3600000 * 8).toISOString()
    },

    // --- BRAZIL ---
    {
      id: 'sub-bra-1',
      country_code: 'BRA',
      user_name: 'Carlos Oliveira',
      raw_text: 'O córrego no Setor Mooca transborda em toda tempestade de verão, alagando oficinas e residências.',
      audio_url: null,
      image_url: null,
      language: 'Português',
      channel: 'Web Form',
      gps_lat: -23.555,
      gps_lng: -46.602,
      created_at: new Date(Date.now() - 3600000 * 40).toISOString()
    },
    {
      id: 'sub-bra-2',
      country_code: 'BRA',
      user_name: 'Mariana Souza',
      raw_text: 'Falta saneamento básico e rede de esgoto tratada nas vielas de Itaquera. Crianças brincando perto de água poluída.',
      audio_url: null,
      image_url: null,
      language: 'Português',
      channel: 'Voice Note',
      gps_lat: -23.541,
      gps_lng: -46.456,
      created_at: new Date(Date.now() - 3600000 * 22).toISOString()
    },
    {
      id: 'sub-bra-3',
      country_code: 'BRA',
      user_name: 'Juliana Mendes',
      raw_text: 'A Unidade Básica de Saúde em São Mateus está sobrecarregada, faltam médicos de família e leitos básicos.',
      audio_url: null,
      image_url: null,
      language: 'Português',
      channel: 'Web Form',
      gps_lat: -23.606,
      gps_lng: -46.478,
      created_at: new Date(Date.now() - 3600000 * 10).toISOString()
    },

    // --- SOUTH AFRICA ---
    {
      id: 'sub-zaf-1',
      country_code: 'ZAF',
      user_name: 'Sipho Ndlovu',
      raw_text: 'The electrical substation in Alexandra Ward 204 blows fuses weekly due to overloaded transformers, plunging blocks into darkness.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Web Form',
      gps_lat: -26.103,
      gps_lng: 28.094,
      created_at: new Date(Date.now() - 3600000 * 48).toISOString()
    },
    {
      id: 'sub-zaf-2',
      country_code: 'ZAF',
      user_name: 'Thabo Mokoena',
      raw_text: 'Water supply cuts are daily in Soweto Ward 205. The old pipes have burst and clean drinking water is wasted into the streets.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Voice Note',
      gps_lat: -26.267,
      gps_lng: 27.858,
      created_at: new Date(Date.now() - 3600000 * 25).toISOString()
    },
    {
      id: 'sub-zaf-3',
      country_code: 'ZAF',
      user_name: 'Lerato Khumalo',
      raw_text: 'Braamfontein student corridor streetlights are destroyed. Walking to university library at night is hazardous.',
      audio_url: null,
      image_url: null,
      language: 'English',
      channel: 'Web Form',
      gps_lat: -26.192,
      gps_lng: 28.034,
      created_at: new Date(Date.now() - 3600000 * 14).toISOString()
    },

    // --- CHINA ---
    {
      id: 'sub-chn-1',
      country_code: 'CHN',
      user_name: '李伟 (Li Wei)',
      raw_text: '白云区北部物流通道常年受到重型集装箱卡车碾压，沥青路面出现大面积坑槽与龟裂，严重影响交通安全。',
      audio_url: null,
      image_url: null,
      language: 'Mandarin',
      channel: 'Web Form',
      gps_lat: 23.272,
      gps_lng: 113.273,
      created_at: new Date(Date.now() - 3600000 * 30).toISOString()
    },
    {
      id: 'sub-chn-2',
      country_code: 'CHN',
      user_name: '张敏 (Zhang Min)',
      raw_text: '海珠生态岛老街区暴雨排水管网容量不足，汛期出现雨水倒灌，急需改建生态海绵蓄排系统。',
      audio_url: null,
      image_url: null,
      language: 'Mandarin',
      channel: 'Web Form',
      gps_lat: 23.093,
      gps_lng: 113.317,
      created_at: new Date(Date.now() - 3600000 * 16).toISOString()
    },
    {
      id: 'sub-chn-3',
      country_code: 'CHN',
      user_name: '陈建国 (Chen Jianguo)',
      raw_text: '天河数字科技核心区青年工程师聚集，建议扩建人工智能与数字化职业技能实训中心。',
      audio_url: null,
      image_url: null,
      language: 'Mandarin',
      channel: 'Voice Note',
      gps_lat: 23.136,
      gps_lng: 113.361,
      created_at: new Date(Date.now() - 3600000 * 5).toISOString()
    },

    // --- RUSSIA ---
    {
      id: 'sub-rus-1',
      country_code: 'RUS',
      user_name: 'Алексей Иванов (Alexei Ivanov)',
      raw_text: 'В районе Лефортово теплотрасса требует капитального ремонта до наступления заморозков, трубы изношены.',
      audio_url: null,
      image_url: null,
      language: 'Russian',
      channel: 'Web Form',
      gps_lat: 55.758,
      gps_lng: 37.702,
      created_at: new Date(Date.now() - 3600000 * 34).toISOString()
    },
    {
      id: 'sub-rus-2',
      country_code: 'RUS',
      user_name: 'Елена Морозова (Elena Morozova)',
      raw_text: 'На площади у Таганского транспортного узла трамвайные пути разбиты, дорожное покрытие просело.',
      audio_url: null,
      image_url: null,
      language: 'Russian',
      channel: 'Web Form',
      gps_lat: 55.741,
      gps_lng: 37.654,
      created_at: new Date(Date.now() - 3600000 * 20).toISOString()
    },
    {
      id: 'sub-rus-3',
      country_code: 'RUS',
      user_name: 'Дмитрий Кузнецов (Dmitry Kuznetsov)',
      raw_text: 'В Басманном округе районный диагностический центр перегружен, запись к специалистам на месяц вперед.',
      audio_url: null,
      image_url: null,
      language: 'Russian',
      channel: 'Voice Note',
      gps_lat: 55.766,
      gps_lng: 37.669,
      created_at: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ],

  // 7. AI Extracted & Categorized Grievance Issues
  extracted_issues: [
    // India
    { id: 1, submission_id: 'sub-ind-1', category: 'water', issue_details: 'Contaminated water supply and low pressure in Kondhwa', ward_id: 4, confidence_score: 0.96, status: 'verified', trust_score: 4.8, is_campaign: false },
    { id: 2, submission_id: 'sub-ind-2', category: 'roads', issue_details: 'Hazardous potholes near Mundhwa signal bridge', ward_id: 5, confidence_score: 0.94, status: 'verified', trust_score: 4.2, is_campaign: false },
    { id: 3, submission_id: 'sub-ind-3', category: 'education', issue_details: 'School classroom overcrowding (over 60 students)', ward_id: 3, confidence_score: 0.91, status: 'pending_review', trust_score: 4.0, is_campaign: false },
    // Brazil
    { id: 101, submission_id: 'sub-bra-1', category: 'water', issue_details: 'Mooca river canal overflows during storm season', ward_id: 101, confidence_score: 0.97, status: 'verified', trust_score: 4.7, is_campaign: false },
    { id: 102, submission_id: 'sub-bra-2', category: 'sanitation', issue_details: 'Lack of treated sanitation and sewage piping in Itaquera', ward_id: 104, confidence_score: 0.93, status: 'verified', trust_score: 4.5, is_campaign: false },
    { id: 103, submission_id: 'sub-bra-3', category: 'health', issue_details: 'Severe patient overcrowding at São Mateus primary clinic', ward_id: 105, confidence_score: 0.89, status: 'pending_review', trust_score: 3.8, is_campaign: false },
    // South Africa
    { id: 201, submission_id: 'sub-zaf-1', category: 'skill', issue_details: 'Frequent electrical transformer blowouts in Alexandra', ward_id: 204, confidence_score: 0.95, status: 'verified', trust_score: 4.6, is_campaign: false },
    { id: 202, submission_id: 'sub-zaf-2', category: 'water', issue_details: 'Soweto broken municipal water pipes and daily outages', ward_id: 205, confidence_score: 0.96, status: 'verified', trust_score: 4.9, is_campaign: false },
    { id: 203, submission_id: 'sub-zaf-3', category: 'roads', issue_details: 'Vandalized streetlights along Braamfontein corridor', ward_id: 203, confidence_score: 0.92, status: 'pending_review', trust_score: 3.9, is_campaign: false },
    // China
    { id: 301, submission_id: 'sub-chn-1', category: 'roads', issue_details: 'Heavy logistics freight asphalt degradation in Baiyun', ward_id: 304, confidence_score: 0.98, status: 'verified', trust_score: 4.8, is_campaign: false },
    { id: 302, submission_id: 'sub-chn-2', category: 'water', issue_details: 'Haizhu stormwater drainage overflow during typhoon season', ward_id: 303, confidence_score: 0.95, status: 'verified', trust_score: 4.4, is_campaign: false },
    { id: 303, submission_id: 'sub-chn-3', category: 'skill', issue_details: 'Demand for digital AI vocational training center in Tianhe', ward_id: 301, confidence_score: 0.90, status: 'pending_review', trust_score: 4.1, is_campaign: false },
    // Russia
    { id: 401, submission_id: 'sub-rus-1', category: 'water', issue_details: 'Lefortovo central district heating pipeline deterioration', ward_id: 404, confidence_score: 0.97, status: 'verified', trust_score: 4.9, is_campaign: false },
    { id: 402, submission_id: 'sub-rus-2', category: 'roads', issue_details: 'Tagansky transit square tram track road subsidence', ward_id: 403, confidence_score: 0.94, status: 'verified', trust_score: 4.3, is_campaign: false },
    { id: 403, submission_id: 'sub-rus-3', category: 'health', issue_details: 'Basmanny diagnostic polyclinic appointment bottleneck', ward_id: 402, confidence_score: 0.91, status: 'pending_review', trust_score: 3.7, is_campaign: false }
  ],

  // 8. Sovereign Demand Clusters (Aggregated Citizen Intent Nodes)
  demand_clusters: [
    // --- INDIA ---
    { id: 1, country_code: 'IND', category: 'water', ward_id: 4, title: 'Ward 4 Clean Water Pipeline Upgrade', summary: 'Consolidated demand for clean water supply network expansion in Kondhwa Khurd due to low pressure and contamination.', citizen_count: 42, spam_count: 2, status: 'active' },
    { id: 2, country_code: 'IND', category: 'roads', ward_id: 5, title: 'Ward 5 Main Road Repair & Streetlighting', summary: 'Multiple requests to resurface the main junction road and install streetlights to reduce night accidents.', citizen_count: 31, spam_count: 0, status: 'active' },
    { id: 3, country_code: 'IND', category: 'education', ward_id: 3, title: 'Ward 3 Public School Classroom Expansion', summary: 'High demand to build a new wing of classrooms at the Wanowrie Central School to handle student overflow.', citizen_count: 26, spam_count: 1, status: 'active' },
    { id: 4, country_code: 'IND', category: 'health', ward_id: 4, title: 'Ward 4 Community Health Sub-Center', summary: 'Requests for a localized health dispensary since the nearest hospital is over 5km away.', citizen_count: 18, spam_count: 0, status: 'active' },
    { id: 5, country_code: 'IND', category: 'skill', ward_id: 2, title: 'Ward 2 Youth Vocational Training Center', summary: 'Suggestions to set up a skill center near the industrial area to train local youths in assembly work.', citizen_count: 15, spam_count: 1, status: 'active' },

    // --- BRAZIL ---
    { id: 101, country_code: 'BRA', category: 'water', ward_id: 101, title: 'Mooca Tamanduateí Drainage & Flood Canal', summary: 'Consolidated community plea to dredge and expand the Tamanduateí tributary canal to prevent recurrent industrial flooding.', citizen_count: 45, spam_count: 1, status: 'active' },
    { id: 102, country_code: 'BRA', category: 'sanitation', ward_id: 104, title: 'Itaquera Sanitation & Drinking Water Extension', summary: 'Citizen demand for underground sewage and potable drinking water mains in eastern peripheral communities.', citizen_count: 38, spam_count: 2, status: 'active' },
    { id: 103, country_code: 'BRA', category: 'roads', ward_id: 103, title: 'Penha Intermodal Bus Rapid Transit Corridor', summary: 'Requests for protected bus lanes and pavement resurfacing connecting Penha station to outer sub-neighborhoods.', citizen_count: 29, spam_count: 0, status: 'active' },
    { id: 104, country_code: 'BRA', category: 'health', ward_id: 105, title: 'São Mateus Family Health Clinic (UBS) Expansion', summary: 'High demand for maternal care and daily physician coverage in high-deficit peripheral sectors.', citizen_count: 34, spam_count: 0, status: 'active' },
    { id: 105, country_code: 'BRA', category: 'skill', ward_id: 102, title: 'Tatuapé Youth Digital Technology Hub', summary: 'Community demand to convert vacant municipal space into a free coding and creative economy incubator.', citizen_count: 22, spam_count: 1, status: 'active' },

    // --- SOUTH AFRICA ---
    { id: 201, country_code: 'ZAF', category: 'skill', ward_id: 204, title: 'Alexandra Substation Resilience & Power Grid', summary: 'Urgent requests to reinforce the 12th Avenue power substation with heavy-duty transformers and anti-surge equipment.', citizen_count: 53, spam_count: 2, status: 'active' },
    { id: 202, country_code: 'ZAF', category: 'water', ward_id: 205, title: 'Soweto Clean Potable Water Pipeline Replacement', summary: 'Replacement of brittle cast-iron water pipes with high-density polyethylene mains to halt massive daily water losses.', citizen_count: 47, spam_count: 1, status: 'active' },
    { id: 203, country_code: 'ZAF', category: 'roads', ward_id: 203, title: 'Braamfontein Solar Streetlighting & Safety Corridor', summary: 'Solar-powered LED streetlighting installation across key student commuting routes to curb muggings.', citizen_count: 36, spam_count: 0, status: 'active' },
    { id: 204, country_code: 'ZAF', category: 'health', ward_id: 204, title: 'Alexandra Maternal & Child Primary Health Clinic', summary: 'Construction of a localized 24-hour maternal healthcare and emergency clinic in Region E.', citizen_count: 28, spam_count: 0, status: 'active' },
    { id: 205, country_code: 'ZAF', category: 'roads', ward_id: 202, title: 'Rosebank Multi-Modal Commuter Terminal Repair', summary: 'Resurfacing taxi ranks and pedestrian walkways around the Gautrain and public bus connection hub.', citizen_count: 24, spam_count: 1, status: 'active' },

    // --- CHINA ---
    { id: 301, country_code: 'CHN', category: 'roads', ward_id: 304, title: 'Baiyun Northern Heavy Logistics Transit Corridor', summary: 'Re-engineering heavy freight asphalt corridor with reinforced concrete sub-base to withstand high-volume logistics.', citizen_count: 49, spam_count: 0, status: 'active' },
    { id: 302, country_code: 'CHN', category: 'water', ward_id: 303, title: 'Haizhu Ecological Stormwater Drainage & Sponge Grid', summary: 'Installation of subterranean retention tanks and permeable ecological paving to mitigate flash flood hazards.', citizen_count: 39, spam_count: 1, status: 'active' },
    { id: 303, country_code: 'CHN', category: 'skill', ward_id: 301, title: 'Tianhe Artificial Intelligence Skills Incubator', summary: 'Municipal public-private collaboration to provide open digital training and robotic automation apprenticeships.', citizen_count: 33, spam_count: 0, status: 'active' },
    { id: 304, country_code: 'CHN', category: 'health', ward_id: 302, title: 'Yuexiu Heritage District Integrated Healthcare Clinic', summary: 'Modernization of geriatric and chronic disease monitoring facilities in historic high-density Yuexiu.', citizen_count: 27, spam_count: 0, status: 'active' },
    { id: 305, country_code: 'CHN', category: 'sanitation', ward_id: 305, title: 'Huangpu Automated Waste Sorting & Sanitation Facility', summary: 'Zero-emission smart solid waste transfer station servicing new science city residential complexes.', citizen_count: 21, spam_count: 1, status: 'active' },

    // --- RUSSIA ---
    { id: 401, country_code: 'RUS', category: 'water', ward_id: 404, title: 'Lefortovo District Thermal Grid & Heating Pipes Overhaul', summary: 'Full pre-insulated replacement of district heating conduits before winter freeze to secure hot water and radiators.', citizen_count: 46, spam_count: 1, status: 'active' },
    { id: 402, country_code: 'RUS', category: 'roads', ward_id: 403, title: 'Tagansky Transit Ring Tramway & Surface Modernization', summary: 'Vibration-damping tram line reconstruction and heavy-duty polymer asphalt paving at Taganskaya interchange.', citizen_count: 37, spam_count: 0, status: 'active' },
    { id: 403, country_code: 'RUS', category: 'education', ward_id: 405, title: 'Danilovsky STEM Technical High School Wing', summary: 'Expansion of engineering laboratories and robotic fabrication workshops for district school students.', citizen_count: 25, spam_count: 0, status: 'active' },
    { id: 404, country_code: 'RUS', category: 'health', ward_id: 402, title: 'Basmanny Comprehensive Outpatient Diagnostic Center', summary: 'Installation of high-capacity MRI/CT diagnostic equipment to eliminate multi-week specialist wait times.', citizen_count: 32, spam_count: 1, status: 'active' },
    { id: 405, country_code: 'RUS', category: 'sanitation', ward_id: 401, title: 'Tverskoy Storm Runoff & Snow Clearing Optimization', summary: 'Underground thermal melt chambers and storm drainage grates to prevent winter ice hazard accumulation.', citizen_count: 19, spam_count: 0, status: 'active' }
  ],

  // 9. Cluster Submission Mappings
  cluster_mappings: [
    { submission_id: 'sub-ind-1', cluster_id: 1 },
    { submission_id: 'sub-ind-2', cluster_id: 2 },
    { submission_id: 'sub-ind-3', cluster_id: 3 },
    { submission_id: 'sub-bra-1', cluster_id: 101 },
    { submission_id: 'sub-bra-2', cluster_id: 102 },
    { submission_id: 'sub-bra-3', cluster_id: 104 },
    { submission_id: 'sub-zaf-1', cluster_id: 201 },
    { submission_id: 'sub-zaf-2', cluster_id: 202 },
    { submission_id: 'sub-zaf-3', cluster_id: 203 },
    { submission_id: 'sub-chn-1', cluster_id: 301 },
    { submission_id: 'sub-chn-2', cluster_id: 302 },
    { submission_id: 'sub-chn-3', cluster_id: 303 },
    { submission_id: 'sub-rus-1', cluster_id: 401 },
    { submission_id: 'sub-rus-2', cluster_id: 402 },
    { submission_id: 'sub-rus-3', cluster_id: 404 }
  ],

  // 10. Capital Infrastructure Projects (Base Cost in INR for cross-currency parity)
  projects: [
    // --- INDIA (Pune Metropolitan) ---
    { id: 1, country_code: 'IND', cluster_id: 1, title: 'Clean Water Pipeline Upgrade', category: 'water', ward_id: 4, estimated_cost: 350000, status: 'Approved', citizen_rating: 4.8 },
    { id: 2, country_code: 'IND', cluster_id: 2, title: 'Main Road Repair & Streetlighting', category: 'roads', ward_id: 5, estimated_cost: 280000, status: 'Proposed', citizen_rating: 4.2 },
    { id: 3, country_code: 'IND', cluster_id: 3, title: 'Public School Classroom Expansion', category: 'education', ward_id: 3, estimated_cost: 420000, status: 'Approved', citizen_rating: 4.6 },
    { id: 4, country_code: 'IND', cluster_id: 4, title: 'Community Health Sub-Center', category: 'health', ward_id: 4, estimated_cost: 600000, status: 'Proposed', citizen_rating: 4.5 },
    { id: 5, country_code: 'IND', cluster_id: 5, title: 'Youth Vocational Training Center', category: 'skill', ward_id: 2, estimated_cost: 450000, status: 'Tendering', citizen_rating: 4.1 },

    // --- BRAZIL (São Paulo East) ---
    { id: 101, country_code: 'BRA', cluster_id: 101, title: 'Mooca Tamanduateí Drainage Canal', category: 'water', ward_id: 101, estimated_cost: 520000, status: 'Approved', citizen_rating: 4.9 },
    { id: 102, country_code: 'BRA', cluster_id: 102, title: 'Itaquera Sanitation & Water Mains', category: 'sanitation', ward_id: 104, estimated_cost: 480000, status: 'Proposed', citizen_rating: 4.7 },
    { id: 103, country_code: 'BRA', cluster_id: 103, title: 'Penha Intermodal Bus Rapid Transit', category: 'roads', ward_id: 103, estimated_cost: 750000, status: 'Approved', citizen_rating: 4.4 },
    { id: 104, country_code: 'BRA', cluster_id: 104, title: 'São Mateus Family Health Clinic (UBS)', category: 'health', ward_id: 105, estimated_cost: 620000, status: 'Proposed', citizen_rating: 4.6 },
    { id: 105, country_code: 'BRA', cluster_id: 105, title: 'Tatuapé Youth Digital Tech Hub', category: 'skill', ward_id: 102, estimated_cost: 390000, status: 'Tendering', citizen_rating: 4.3 },

    // --- SOUTH AFRICA (Johannesburg Region) ---
    { id: 201, country_code: 'ZAF', cluster_id: 201, title: 'Alexandra Substation Resilience Upgrade', category: 'skill', ward_id: 204, estimated_cost: 580000, status: 'Approved', citizen_rating: 4.9 },
    { id: 202, country_code: 'ZAF', cluster_id: 202, title: 'Soweto Clean Potable Water Pipeline', category: 'water', ward_id: 205, estimated_cost: 490000, status: 'Approved', citizen_rating: 4.8 },
    { id: 203, country_code: 'ZAF', cluster_id: 203, title: 'Braamfontein Solar Safety Corridor', category: 'roads', ward_id: 203, estimated_cost: 320000, status: 'Proposed', citizen_rating: 4.2 },
    { id: 204, country_code: 'ZAF', cluster_id: 204, title: 'Alexandra Maternal & Child Clinic', category: 'health', ward_id: 204, estimated_cost: 710000, status: 'Proposed', citizen_rating: 4.7 },
    { id: 205, country_code: 'ZAF', cluster_id: 205, title: 'Rosebank Commuter Interchange Repair', category: 'roads', ward_id: 202, estimated_cost: 840000, status: 'Construction', citizen_rating: 4.5 },

    // --- CHINA (Guangzhou Development District) ---
    { id: 301, country_code: 'CHN', cluster_id: 301, title: 'Baiyun Northern Freight Transit Corridor', category: 'roads', ward_id: 304, estimated_cost: 650000, status: 'Approved', citizen_rating: 4.8 },
    { id: 302, country_code: 'CHN', cluster_id: 302, title: 'Haizhu Ecological Sponge Drainage Network', category: 'water', ward_id: 303, estimated_cost: 540000, status: 'Approved', citizen_rating: 4.6 },
    { id: 303, country_code: 'CHN', cluster_id: 303, title: 'Tianhe Artificial Intelligence Incubator', category: 'skill', ward_id: 301, estimated_cost: 880000, status: 'Proposed', citizen_rating: 4.5 },
    { id: 304, country_code: 'CHN', cluster_id: 304, title: 'Yuexiu Heritage District Integrated Clinic', category: 'health', ward_id: 302, estimated_cost: 430000, status: 'Proposed', citizen_rating: 4.4 },
    { id: 305, country_code: 'CHN', cluster_id: 305, title: 'Huangpu Automated Sanitation Facility', category: 'sanitation', ward_id: 305, estimated_cost: 360000, status: 'Completed', citizen_rating: 4.9 },

    // --- RUSSIA (Moscow Central Administrative) ---
    { id: 401, country_code: 'RUS', cluster_id: 401, title: 'Lefortovo District Thermal Pipeline Overhaul', category: 'water', ward_id: 404, estimated_cost: 680000, status: 'Approved', citizen_rating: 4.9 },
    { id: 402, country_code: 'RUS', cluster_id: 402, title: 'Tagansky Transit Ring Tramway Asphalt', category: 'roads', ward_id: 403, estimated_cost: 410000, status: 'Approved', citizen_rating: 4.5 },
    { id: 403, country_code: 'RUS', cluster_id: 403, title: 'Danilovsky STEM Technical High School Wing', category: 'education', ward_id: 405, estimated_cost: 510000, status: 'Proposed', citizen_rating: 4.4 },
    { id: 404, country_code: 'RUS', cluster_id: 404, title: 'Basmanny Comprehensive Diagnostic Center', category: 'health', ward_id: 402, estimated_cost: 640000, status: 'Proposed', citizen_rating: 4.6 },
    { id: 405, country_code: 'RUS', cluster_id: 405, title: 'Tverskoy Storm Runoff & Snow Clearing Grid', category: 'sanitation', ward_id: 401, estimated_cost: 350000, status: 'Tendering', citizen_rating: 4.2 }
  ],

  // 11. Immutable Cryptographic Decision Audit Logs
  decision_logs: [
    { id: 1, timestamp: new Date(Date.now() - 3600000 * 24).toISOString(), project_id: 1, action: 'Approved', actor: 'Ministerial Planning Board (IND)', previous_state: 'Proposed', new_state: 'Approved', reason: 'Pareto-optimal allocation: severe water scarcity index (8.8/10)' },
    { id: 2, timestamp: new Date(Date.now() - 3600000 * 20).toISOString(), project_id: 101, action: 'Approved', actor: 'Secretaria de Infraestrutura Urbana (BRA)', previous_state: 'Proposed', new_state: 'Approved', reason: 'High citizen demand (45 submissions) and Tamanduateí flood risk' },
    { id: 3, timestamp: new Date(Date.now() - 3600000 * 16).toISOString(), project_id: 201, action: 'Approved', actor: 'City of Johannesburg Region E (ZAF)', previous_state: 'Proposed', new_state: 'Approved', reason: 'Critical power grid reliability and Alexandra substation deficit' },
    { id: 4, timestamp: new Date(Date.now() - 3600000 * 12).toISOString(), project_id: 301, action: 'Approved', actor: 'Guangzhou Urban Planning Commission (CHN)', previous_state: 'Proposed', new_state: 'Approved', reason: 'High freight transit volume and heavy road degradation score' },
    { id: 5, timestamp: new Date(Date.now() - 3600000 * 8).toISOString(), project_id: 401, action: 'Approved', actor: 'Moscow Urban Development Board (RUS)', previous_state: 'Proposed', new_state: 'Approved', reason: 'Winter heating network risk assessment and Lefortovo cluster density' }
  ]
};
