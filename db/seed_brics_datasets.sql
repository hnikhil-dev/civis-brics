-- ============================================================================
-- CIVIS-BRICS: High-Fidelity Real-World Seed Data for All 5 Member States
-- Track 1: AI for Digital Public Infrastructure & Governance
-- ============================================================================

-- 1. Seed Wards / Administrative Sectors (25 Units across IND, BRA, ZAF, CHN, RUS)
INSERT INTO wards (id, name, population, equity_score) VALUES
-- India (Pune Urban District)
(1, 'Ward 1 - Koregaon Park Extension', 45000, 4.8),
(2, 'Ward 2 - Hadapsar Industrial Zone', 78000, 5.9),
(3, 'Ward 3 - Wanowrie Central', 92000, 6.7),
(4, 'Ward 4 - Kondhwa Khurd', 115000, 8.5),
(5, 'Ward 5 - Mundhwa Junction', 68000, 6.8),
-- Brazil (São Paulo East Subprefecture)
(101, 'Setor 1 - Mooca Centro', 75000, 4.2),
(102, 'Setor 2 - Tatuapé Leste', 98000, 5.1),
(103, 'Setor 3 - Penha de França', 128000, 6.5),
(104, 'Setor 4 - Itaquera Zona Leste', 215000, 7.9),
(105, 'Setor 5 - São Mateus Periferia', 165000, 8.3),
-- South Africa (City of Johannesburg Metropolitan)
(201, 'Ward 201 - Sandton Financial Zone', 52000, 3.5),
(202, 'Ward 202 - Rosebank Commercial', 64000, 4.1),
(203, 'Ward 203 - Braamfontein University Corridor', 89000, 6.2),
(204, 'Ward 204 - Alexandra Urban Renewal Area', 185000, 8.9),
(205, 'Ward 205 - Soweto Central Infrastructure Hub', 240000, 7.8),
-- China (Guangzhou Urban Development District)
(301, 'Tianhe District Digital Core', 154000, 3.8),
(302, 'Yuexiu Heritage & Transit Hub', 112000, 4.5),
(303, 'Haizhu Green Island Corridor', 168000, 5.8),
(304, 'Baiyun Northern Industrial Extension', 285000, 7.2),
(305, 'Huangpu New Logistics & Science City', 195000, 6.4),
-- Russia (Moscow Central Administrative District)
(401, 'Tverskoy Central District', 78000, 3.2),
(402, 'Basmanny Innovation District', 110000, 4.9),
(403, 'Tagansky Transit Sector', 135000, 5.8),
(404, 'Lefortovo Industrial Renovation Zone', 98000, 7.4),
(405, 'Danilovsky Thermal Upgrade Corridor', 104000, 7.6)
ON CONFLICT (id) DO UPDATE SET 
  name = EXCLUDED.name,
  population = EXCLUDED.population,
  equity_score = EXCLUDED.equity_score;

-- 2. Seed Education Indicators
INSERT INTO education_indicators (ward_id, school_capacity_ratio, avg_school_distance) VALUES
(1, 0.75, 1.2), (2, 0.95, 2.8), (3, 1.35, 4.8), (4, 1.10, 3.5), (5, 0.85, 2.2),
(101, 0.80, 1.4), (102, 0.90, 2.0), (103, 1.15, 3.2), (104, 1.40, 4.5), (105, 1.30, 4.0),
(201, 0.70, 1.0), (202, 0.85, 1.8), (203, 1.05, 2.5), (204, 1.45, 5.2), (205, 1.35, 4.6),
(301, 0.78, 0.9), (302, 0.88, 1.5), (303, 0.98, 2.1), (304, 1.25, 3.8), (305, 1.10, 2.9),
(401, 0.72, 0.8), (402, 0.85, 1.6), (403, 0.95, 2.3), (404, 1.28, 3.9), (405, 1.20, 3.4)
ON CONFLICT (ward_id) DO UPDATE SET 
  school_capacity_ratio = EXCLUDED.school_capacity_ratio,
  avg_school_distance = EXCLUDED.avg_school_distance;

-- 3. Seed Road Indicators
INSERT INTO road_indicators (ward_id, road_quality_index, public_transit_dist) VALUES
(1, 8.5, 0.5), (2, 6.0, 1.5), (3, 5.2, 1.8), (4, 4.0, 2.5), (5, 2.8, 3.2),
(101, 7.8, 0.6), (102, 6.5, 1.2), (103, 5.0, 2.0), (104, 3.5, 3.8), (105, 3.2, 4.2),
(201, 8.9, 0.4), (202, 7.5, 0.8), (203, 5.8, 1.6), (204, 3.0, 4.5), (205, 4.2, 3.1),
(301, 9.1, 0.3), (302, 8.0, 0.7), (303, 7.2, 1.1), (304, 4.4, 2.9), (305, 6.8, 1.5),
(401, 8.8, 0.4), (402, 7.6, 0.9), (403, 5.9, 1.7), (404, 4.1, 3.0), (405, 4.5, 2.8)
ON CONFLICT (ward_id) DO UPDATE SET 
  road_quality_index = EXCLUDED.road_quality_index,
  public_transit_dist = EXCLUDED.public_transit_dist;

-- 4. Seed Water Indicators
INSERT INTO water_indicators (ward_id, water_scarcity_index, supply_hours_daily) VALUES
(1, 1.5, 24.0), (2, 4.5, 6.0), (3, 5.0, 4.0), (4, 8.8, 1.2), (5, 6.5, 3.0),
(101, 3.2, 20.0), (102, 4.0, 16.0), (103, 5.5, 10.0), (104, 7.9, 4.5), (105, 8.2, 3.8),
(201, 1.8, 24.0), (202, 3.0, 22.0), (203, 5.2, 12.0), (204, 8.7, 2.5), (205, 7.5, 5.0),
(301, 1.2, 24.0), (302, 2.5, 24.0), (303, 4.8, 18.0), (304, 6.9, 8.0), (305, 5.0, 15.0),
(401, 1.5, 24.0), (402, 2.8, 24.0), (403, 4.2, 20.0), (404, 7.5, 6.0), (405, 7.0, 8.0)
ON CONFLICT (ward_id) DO UPDATE SET 
  water_scarcity_index = EXCLUDED.water_scarcity_index,
  supply_hours_daily = EXCLUDED.supply_hours_daily;

-- 5. Seed Health Indicators
INSERT INTO health_indicators (ward_id, health_center_distance, beds_per_thousand) VALUES
(1, 0.8, 4.5), (2, 2.5, 2.1), (3, 3.2, 1.8), (4, 5.5, 0.8), (5, 4.0, 1.2),
(101, 1.1, 3.8), (102, 2.0, 2.5), (103, 3.1, 1.9), (104, 4.8, 1.1), (105, 5.6, 0.7),
(201, 0.9, 5.1), (202, 1.5, 3.6), (203, 2.4, 2.3), (204, 6.1, 0.6), (205, 4.9, 1.0),
(301, 0.6, 6.2), (302, 1.2, 4.5), (303, 2.2, 3.1), (304, 4.6, 1.4), (305, 3.2, 2.4),
(401, 0.7, 5.8), (402, 1.8, 4.0), (403, 2.8, 2.7), (404, 4.9, 1.3), (405, 4.2, 1.6)
ON CONFLICT (ward_id) DO UPDATE SET 
  health_center_distance = EXCLUDED.health_center_distance,
  beds_per_thousand = EXCLUDED.beds_per_thousand;

-- 6. Seed Demand Clusters
INSERT INTO demand_clusters (id, category, ward_id, title, summary, citizen_count, spam_count, status) VALUES
-- India
(1, 'water', 4, 'Ward 4 Clean Water Pipeline Upgrade', 'Consolidated demand for clean water supply network expansion in Kondhwa Khurd.', 42, 2, 'active'),
(2, 'roads', 5, 'Ward 5 Main Road Repair & Streetlighting', 'Multiple requests to resurface main junction road and install streetlights.', 31, 0, 'active'),
(3, 'education', 3, 'Ward 3 Public School Classroom Expansion', 'High demand to build a new wing of classrooms at Wanowrie Central School.', 26, 1, 'active'),
(4, 'health', 4, 'Ward 4 Community Health Sub-Center', 'Requests for a localized health dispensary.', 18, 0, 'active'),
(5, 'skill', 2, 'Ward 2 Youth Vocational Training Center', 'Skill center near Hadapsar industrial area.', 15, 1, 'active'),
-- Brazil
(101, 'water', 101, 'Mooca Tamanduateí Drainage & Flood Canal', 'Plea to dredge and expand the Tamanduateí canal to prevent flooding.', 45, 1, 'active'),
(102, 'sanitation', 104, 'Itaquera Sanitation & Drinking Water Extension', 'Citizen demand for underground sewage and potable drinking water mains.', 38, 2, 'active'),
(103, 'roads', 103, 'Penha Intermodal Bus Rapid Transit Corridor', 'Requests for protected bus lanes connecting Penha station.', 29, 0, 'active'),
(104, 'health', 105, 'São Mateus Family Health Clinic (UBS) Expansion', 'Maternal care and physician coverage in peripheral sector.', 34, 0, 'active'),
(105, 'skill', 102, 'Tatuapé Youth Digital Technology Hub', 'Convert vacant space into coding and creative economy incubator.', 22, 1, 'active'),
-- South Africa
(201, 'skill', 204, 'Alexandra Substation Resilience & Power Grid', 'Reinforce the 12th Avenue power substation with heavy-duty transformers.', 53, 2, 'active'),
(202, 'water', 205, 'Soweto Clean Potable Water Pipeline Replacement', 'Replacement of brittle pipes with high-density polyethylene mains.', 47, 1, 'active'),
(203, 'roads', 203, 'Braamfontein Solar Streetlighting & Safety Corridor', 'Solar LED lighting along student commuting routes.', 36, 0, 'active'),
(204, 'health', 204, 'Alexandra Maternal & Child Primary Health Clinic', '24-hour localized maternal and child health clinic.', 28, 0, 'active'),
(205, 'roads', 202, 'Rosebank Multi-Modal Commuter Terminal Repair', 'Resurface taxi ranks and pedestrian connections.', 24, 1, 'active'),
-- China
(301, 'roads', 304, 'Baiyun Northern Heavy Logistics Transit Corridor', 'Re-engineer freight corridor with reinforced concrete sub-base.', 49, 0, 'active'),
(302, 'water', 303, 'Haizhu Ecological Stormwater Drainage & Sponge Grid', 'Subterranean retention tanks and permeable ecological paving.', 39, 1, 'active'),
(303, 'skill', 301, 'Tianhe Artificial Intelligence Skills Incubator', 'Open digital training and robotic automation apprenticeships.', 33, 0, 'active'),
(304, 'health', 302, 'Yuexiu Heritage District Integrated Healthcare Clinic', 'Modernization of geriatric clinic in historic district.', 27, 0, 'active'),
(305, 'sanitation', 305, 'Huangpu Automated Waste Sorting & Sanitation Facility', 'Zero-emission smart solid waste transfer station.', 21, 1, 'active'),
-- Russia
(401, 'water', 404, 'Lefortovo District Thermal Grid & Heating Pipes Overhaul', 'Pre-insulated replacement of district heating conduits before winter freeze.', 46, 1, 'active'),
(402, 'roads', 403, 'Tagansky Transit Ring Tramway & Surface Modernization', 'Vibration-damping tram line reconstruction and polymer asphalt.', 37, 0, 'active'),
(403, 'education', 405, 'Danilovsky STEM Technical High School Wing', 'Expansion of engineering laboratories and robotic workshops.', 25, 0, 'active'),
(404, 'health', 402, 'Basmanny Comprehensive Outpatient Diagnostic Center', 'High-capacity diagnostic equipment to eliminate wait times.', 32, 1, 'active'),
(405, 'sanitation', 401, 'Tverskoy Storm Runoff & Snow Clearing Optimization', 'Thermal melt chambers to prevent winter ice hazard accumulation.', 19, 0, 'active')
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  citizen_count = EXCLUDED.citizen_count,
  summary = EXCLUDED.summary;

-- 7. Seed Projects derived from Clusters (Base Cost in INR)
INSERT INTO projects (id, cluster_id, title, category, ward_id, estimated_cost, status, citizen_rating) VALUES
-- India
(1, 1, 'Clean Water Pipeline Upgrade', 'water', 4, 350000, 'Approved', 4.8),
(2, 2, 'Main Road Repair & Streetlighting', 'roads', 5, 280000, 'Proposed', 4.2),
(3, 3, 'Public School Classroom Expansion', 'education', 3, 420000, 'Approved', 4.6),
(4, 4, 'Community Health Sub-Center', 'health', 4, 600000, 'Proposed', 4.5),
(5, 5, 'Youth Vocational Training Center', 'skill', 2, 450000, 'Tendering', 4.1),
-- Brazil
(101, 101, 'Mooca Tamanduateí Drainage Canal', 'water', 101, 520000, 'Approved', 4.9),
(102, 102, 'Itaquera Sanitation & Water Mains', 'sanitation', 104, 480000, 'Proposed', 4.7),
(103, 103, 'Penha Intermodal Bus Rapid Transit', 'roads', 103, 750000, 'Approved', 4.4),
(104, 104, 'São Mateus Family Health Clinic (UBS)', 'health', 105, 620000, 'Proposed', 4.6),
(105, 105, 'Tatuapé Youth Digital Tech Hub', 'skill', 102, 390000, 'Tendering', 4.3),
-- South Africa
(201, 201, 'Alexandra Substation Resilience Upgrade', 'skill', 204, 580000, 'Approved', 4.9),
(202, 202, 'Soweto Clean Potable Water Pipeline', 'water', 205, 490000, 'Approved', 4.8),
(203, 203, 'Braamfontein Solar Safety Corridor', 'roads', 203, 320000, 'Proposed', 4.2),
(204, 204, 'Alexandra Maternal & Child Clinic', 'health', 204, 710000, 'Proposed', 4.7),
(205, 205, 'Rosebank Commuter Interchange Repair', 'roads', 202, 840000, 'Construction', 4.5),
-- China
(301, 301, 'Baiyun Northern Freight Transit Corridor', 'roads', 304, 650000, 'Approved', 4.8),
(302, 302, 'Haizhu Ecological Sponge Drainage Network', 'water', 303, 540000, 'Approved', 4.6),
(303, 303, 'Tianhe Artificial Intelligence Incubator', 'skill', 301, 880000, 'Proposed', 4.5),
(304, 304, 'Yuexiu Heritage District Integrated Clinic', 'health', 302, 430000, 'Proposed', 4.4),
(305, 305, 'Huangpu Automated Sanitation Facility', 'sanitation', 305, 360000, 'Completed', 4.9),
-- Russia
(401, 401, 'Lefortovo District Thermal Pipeline Overhaul', 'water', 404, 680000, 'Approved', 4.9),
(402, 402, 'Tagansky Transit Ring Tramway Asphalt', 'roads', 403, 410000, 'Approved', 4.5),
(403, 403, 'Danilovsky STEM Technical High School Wing', 'education', 405, 510000, 'Proposed', 4.4),
(404, 404, 'Basmanny Comprehensive Diagnostic Center', 'health', 402, 640000, 'Proposed', 4.6),
(405, 405, 'Tverskoy Storm Runoff & Snow Clearing Grid', 'sanitation', 401, 350000, 'Tendering', 4.2)
ON CONFLICT (id) DO UPDATE SET 
  title = EXCLUDED.title,
  estimated_cost = EXCLUDED.estimated_cost,
  status = EXCLUDED.status;
