-- ============================================================================
-- CIVIS-BRICS: Production Multi-Country PostGIS & pgvector Spatial Schema
-- Track 1: AI for Digital Public Infrastructure & Governance (BRICS Innovation)
-- ============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 2. Hierarchical Administrative Units (Nation -> Province -> District -> Sector/Ward)
CREATE TABLE IF NOT EXISTS administrative_units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_code VARCHAR(3) NOT NULL, -- IND, BRA, RUS, CHN, ZAF
    level VARCHAR(20) NOT NULL,       -- National, Province, District, Ward
    name VARCHAR(255) NOT NULL,
    parent_id UUID REFERENCES administrative_units(id) ON DELETE CASCADE,
    boundary GEOMETRY(MultiPolygon, 4326),
    population INTEGER NOT NULL,
    equity_deficit_score DOUBLE PRECISION NOT NULL CHECK (equity_deficit_score BETWEEN 0 AND 10),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Dynamic Sector Indicators (Census & Real-Time Municipal Telemetry)
CREATE TABLE IF NOT EXISTS sector_indicators (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES administrative_units(id) ON DELETE CASCADE,
    sector VARCHAR(50) NOT NULL, -- water, roads, education, health, sanitation, skill
    metric_key VARCHAR(100) NOT NULL,
    metric_value DOUBLE PRECISION NOT NULL,
    recorded_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(unit_id, sector, metric_key)
);

-- 4. Multimodal Citizen Submissions (Raw Intake & Evidence Attestation)
CREATE TABLE IF NOT EXISTS citizen_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tracking_code VARCHAR(64) UNIQUE NOT NULL,
    unit_id UUID REFERENCES administrative_units(id),
    channel VARCHAR(30) NOT NULL, -- Web Form, Voice Note, OCR Image, WhatsApp, Telegram
    language VARCHAR(20) NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    raw_content TEXT,
    audio_storage_uri TEXT,
    image_storage_uri TEXT,
    coordinates GEOMETRY(Point, 4326),
    embedding vector(768),
    trust_score DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. AI Extracted & Verified Issues
CREATE TABLE IF NOT EXISTS extracted_issues (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    submission_id UUID REFERENCES citizen_submissions(id) ON DELETE CASCADE,
    category VARCHAR(50) NOT NULL,
    issue_details TEXT NOT NULL,
    ward_id INTEGER,
    confidence_score DOUBLE PRECISION NOT NULL,
    trust_score DOUBLE PRECISION NOT NULL,
    status VARCHAR(30) DEFAULT 'pending_review', -- pending_review, verified
    is_campaign BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Spatial-Semantic Demand Clusters
CREATE TABLE IF NOT EXISTS demand_clusters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES administrative_units(id),
    category VARCHAR(50) NOT NULL,
    ward_id INTEGER,
    title VARCHAR(255) NOT NULL,
    summary TEXT,
    centroid GEOMETRY(Point, 4326),
    centroid_embedding vector(768),
    citizen_count INTEGER DEFAULT 1,
    raw_submission_count INTEGER DEFAULT 1,
    coordination_index DOUBLE PRECISION DEFAULT 0.0,
    status VARCHAR(30) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Cluster Submission Mappings
CREATE TABLE IF NOT EXISTS cluster_submission_mappings (
    submission_id UUID REFERENCES citizen_submissions(id) ON DELETE CASCADE,
    cluster_id UUID REFERENCES demand_clusters(id) ON DELETE CASCADE,
    PRIMARY KEY(submission_id, cluster_id)
);

-- 8. Infrastructure Projects (Capital Portfolio)
CREATE TABLE IF NOT EXISTS infrastructure_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cluster_id UUID UNIQUE REFERENCES demand_clusters(id),
    unit_id UUID REFERENCES administrative_units(id),
    project_code VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    sector VARCHAR(50) NOT NULL,
    estimated_cost_base BIGINT NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    lifecycle_status VARCHAR(50) DEFAULT 'Proposed', -- Proposed, Approved, Tendering, Construction, Completed
    depends_on_project_id UUID REFERENCES infrastructure_projects(id),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. Immutable Sovereign Decision Audit Trail
CREATE TABLE IF NOT EXISTS decision_audit_trail (
    id BIGSERIAL PRIMARY KEY,
    project_id UUID REFERENCES infrastructure_projects(id) ON DELETE CASCADE,
    actor_id VARCHAR(100) NOT NULL,
    actor_role VARCHAR(50) NOT NULL, -- National_Minister, MP, DPC_Director, Auditor
    action VARCHAR(100) NOT NULL,
    previous_state VARCHAR(50),
    new_state VARCHAR(50),
    budget_cost BIGINT,
    currency VARCHAR(3),
    reason TEXT NOT NULL,
    cryptographic_signature TEXT NOT NULL,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- 10. Spatial & HNSW Vector Indexes
CREATE INDEX IF NOT EXISTS idx_demand_clusters_embedding ON demand_clusters 
USING hnsw (centroid_embedding vector_cosine_ops)
WITH (m = 16, ef_construction = 64);

CREATE INDEX IF NOT EXISTS idx_citizen_coords ON citizen_submissions USING GIST(coordinates);
CREATE INDEX IF NOT EXISTS idx_cluster_centroid ON demand_clusters USING GIST(centroid);
CREATE INDEX IF NOT EXISTS idx_admin_boundary ON administrative_units USING GIST(boundary);
