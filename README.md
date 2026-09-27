# 🌐 CIVIS-BRICS: Citizens’ Voice & Infrastructure Synthesis
### An Open Digital Public Good (DPG) for AI-Driven Digital Public Infrastructure & National Governance Planning

[![Digital Public Good](https://img.shields.io/badge/DPG%20Standard-Aligned-008080?style=for-the-badge)](https://digitalpublicgoods.net/)
[![BRICS Theme](https://img.shields.io/badge/BRICS%20Theme-Innovation-FF6F00?style=for-the-badge)](https://brics2026.org/)
[![Track 1](https://img.shields.io/badge/Challenge-Code%20for%20Communities%202-0052CC?style=for-the-badge)](#)
[![Next.js 16](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL + pgvector](https://img.shields.io/badge/PostgreSQL-pgvector-336791?style=for-the-badge&logo=postgresql)](https://supabase.com/)

---

## 🏛️ Executive Overview

**CIVIS-BRICS** is an international **Digital Public Good (DPG)** designed according to the UN DPG Standard. It solves a fundamental governance challenge across BRICS nations (Brazil, Russia, India, China, South Africa, and expanded member states):

> **Governments struggle to consolidate fragmented citizen requests and align them with national Digital Public Infrastructure (DPI) priorities. CIVIS-BRICS bridges this gap by aggregating cross-lingual citizen feedback across voice, text, and messaging, synthesizing them into verified demand hotspots, and mathematically optimizing capital allocation under strict fiscal constraints.**

---

## 🚀 Key Architectural Pillars

### 1. Omni-Channel Multilingual Intake (Cross-BRICS Dialects)
* **Local Audio Ingestion:** Ingests raw voice notes directly via HTML5 `MediaRecorder`, bypassing cloud speech socket blocks while safeguarding citizen privacy.
* **Multimodal AI Transcription:** Uses **Gemini 2.5 Flash** for native dialect speech-to-text, translation, and structured JSON parsing across BRICS languages (English, Hindi, Portuguese, Russian, Mandarin).
* **Multi-Format Evidence:** Ingests geo-tagged photos of structural deficits (roads, water pipelines, electrical grids) with GPS coordinate attestation.

### 2. Hybrid Spatial-Semantic Clustering & Anti-Astroturfing
* **Dense Vector & Cosine Matching:** Employs 768-dimensional vector embeddings with cosine similarity to identify semantic equivalents across languages.
* **Character Subword N-Gram Tokenizer:** Resolves spelling errors and morphological variations across regional dialects.
* **Haversine Geospatial Blending:** Integrates physical distance with exponential decay:
  $$\text{CompositeMatch} = 0.70 \times \text{SemanticSimilarity} + 0.30 \times \text{SpatialProximity}$$
* **Dynamic Bot / Campaign Mitigation:** Computes coordination factor $\mathcal{C}$ to identify astroturfing and dampens duplicate campaign influence via quadratic decay $(1 - \mathcal{C})^2$.

### 3. Dynamic Multi-Criteria Decision Engine (Zero Hardcoding)
* **Statistical Normalization:** All population, demographic, and cost distributions are normalized dynamically using empirical min-max and quantile distributions based on the active administrative level.
* **Context-Aware Urgency Matrix:** Replaces static priority tables with real-time telemetry modifiers (water scarcity spikes, hospital bed deficits, overcrowding ratios, and road safety indices).
* **Empirical Feasibility:** Projects are scored dynamically against the active portfolio cost distribution, supporting multi-currency scales (INR, BRL, RUB, CNY, ZAR, USD).

### 4. Adaptive Budget & Capital Allocation Optimizer
* **Adaptive Scaling Knapsack Solver:** Automatically computes dynamic integer scaling factors ($500 - 1500$ state slots), executing mathematical optimization in **sub-millisecond latency ($< 1\text{ ms}$)** regardless of budget magnitude.
* **DAG Precedence Dependencies:** Validates Directed Acyclic Graph constraints (`depends_on_project_id`), preventing capital allocation to dependent tasks unless prerequisite infrastructure is funded.
* **Four Policy Optimization Scenarios:**
  * **Standard Balanced:** Maximizes composite 8D priority score $\times$ cost efficiency.
  * **Max Beneficiaries:** Maximizes unique verified citizen beneficiaries per unit spent.
  * **Max Equity:** Prioritizes underserved and high-deficit zones with guaranteed equity floors.
  * **Max Urgency:** Focuses immediate funding on public health, water, and emergency hazards.

### 5. DPG Governance & Closed-Loop Accountability
* **Immutable Audit Trail:** Write-only decision logs record every administrative sanction order with timestamp, actor identity, and justification.
* **Citizen Receipt Tracking:** Citizens receive unique tracking codes (e.g. `BRICS-IND-2026-X892`) to observe the end-to-end lifecycle of their proposal.
* **DPI Interoperability:** Open APIs enable seamless synchronization with national Digital Public Infrastructure stacks (MOSIP, India Stack, Gov.br).

---

## 🛠️ Technology Stack

| Domain | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend & API** | Next.js 16 (App Router), React 19, Tailwind CSS | High-performance responsive web application |
| **Database & Vector** | Supabase (PostgreSQL 15), `pgvector`, PostGIS | Relational data, spatial indexing & vector embeddings |
| **Cognitive AI** | Gemini 2.5 Flash API | Multilingual multimodal speech-to-text & translation |
| **GIS Mapping** | Leaflet.js / React-Leaflet | Dynamic demand hotspot visualization |
| **Mathematical Solver** | Dynamic Programming Knapsack with DAG constraints | $O(N \cdot W)$ mathematically optimal budget allocation |
| **Security Layer** | In-Memory Token Bucket, OWASP XSS Sanitizer | Rate limiting (20 burst cap) & input injection prevention |

---

## 📂 Project Structure

```
├── app/
│   ├── api/
│   │   ├── projects/          # Priority scoring & adaptive budget optimization
│   │   ├── stats/             # Regional indicators & census analytics
│   │   └── submissions/       # Multilingual intake & lifecycle tracking
│   ├── mp/                    # Inter-Ministerial / Policy Dashboard
│   ├── layout.js              # Global application layout
│   └── page.js                # Public Citizen Multimodal Portal
├── components/
│   └── HotspotMap.js          # Interactive GIS Hotspot Visualization
├── db/
│   └── schema.sql             # PostgreSQL relational tables & vector schemas
├── lib/
│   ├── clustering.js          # Spatial-semantic clustering & anti-astroturfing
│   ├── optimizer.js           # Adaptive Knapsack & DAG dependency solver
│   ├── parser.js              # Gemini multimodal parser & dialect translation
│   ├── scoring.js             # Dynamic Multi-Criteria Decision Analysis (MCDA)
│   ├── security.js            # Token-bucket rate limiter & XSS sanitizer
│   └── supabase.js            # Database client & high-speed caching
├── scratch/
│   └── stress-test.js         # Automated load, rate limit, & algorithmic test suite
└── system_flowchart.md        # Complete system architecture specification
```

---

## ⚙️ Quickstart & Local Verification

### 1. Prerequisites
* Node.js $\ge 18$
* Supabase PostgreSQL instance with `pgvector` enabled

### 2. Environment Configuration
Create a `.env.local` file in the root directory:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GEMINI_API_KEY=your-gemini-api-key
```

### 3. Install & Build
```bash
npm install
npm run build
```

### 4. Execute Algorithmic Verification Tests
Run the automated test suite verifying Jaccard similarities, Knapsack DP accuracy, concurrency throughput, and rate limiting:
```bash
node scratch/stress-test.js
```

### 5. Launch Development Server
```bash
npm run dev
```
* **Citizen Portal:** `http://localhost:3000`
* **Policy & Planning Workspace:** `http://localhost:3000/mp`

---

## 📜 Digital Public Good (DPG) License
CIVIS-BRICS is released under the **MIT Open Source License**. Designed in adherence with the UN Digital Public Goods Standard for international public sector innovation.
