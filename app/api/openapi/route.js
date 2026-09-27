// app/api/openapi/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'CIVIS-BRICS Sovereign Digital Public Infrastructure (DPI) API',
      version: '2.1.0',
      description: 'Production OpenAPI 3.1 specification for CIVIS-BRICS: a multilingual, multimodal Digital Public Good aggregating citizen development demands across BRICS nations with Pareto-optimal capital allocation and W3C Verifiable Credentials.',
      termsOfService: 'https://digitalpublicgoods.net/standard/',
      contact: {
        name: 'CIVIS-BRICS Core Architecture Team',
        url: 'https://github.com/hnikhil-dev/civis-brics',
        email: 'dpg-initiative@brics-communities.org'
      },
      license: {
        name: 'Apache 2.0',
        url: 'https://www.apache.org/licenses/LICENSE-2.0.html'
      }
    },
    servers: [
      {
        url: '/',
        description: 'Active Sovereign Node'
      }
    ],
    tags: [
      { name: 'Citizen Intake', description: 'Multilingual and multimodal citizen grievance intake and W3C receipts' },
      { name: 'Capital Allocation', description: 'Multi-indicator Pareto frontier optimizer and sovereign sanction orders' },
      { name: 'Observability & Demographics', description: 'Sovereign administrative analytics and spatial heatmaps' },
      { name: 'Cryptographic Audit', description: 'Immutable decision ledger and tamper-evident signatures' }
    ],
    paths: {
      '/api/submissions': {
        post: {
          tags: ['Citizen Intake'],
          summary: 'Ingest citizen grievance or infrastructure suggestion',
          description: 'Accepts raw text, audio voice notes, or photo OCR uploads across BRICS languages, verifies evidence trust, detects coordinated astroturfing, and returns a W3C Verifiable Credential receipt.',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['user_name'],
                  properties: {
                    user_name: { type: 'string', example: 'Lucas Silva' },
                    raw_text: { type: 'string', example: 'Primary school requires urgent 4-classroom expansion.' },
                    audio_url: { type: 'string', format: 'uri', nullable: true },
                    image_url: { type: 'string', format: 'uri', nullable: true },
                    channel: { type: 'string', enum: ['Web Form', 'Voice Note', 'OCR Image', 'WhatsApp', 'Telegram'], default: 'Web Form' },
                    gps_lat: { type: 'number', format: 'float', example: -23.5505 },
                    gps_lng: { type: 'number', format: 'float', example: -46.6333 }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Submission processed, clustered, and receipt generated',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean', example: true },
                      submission_id: { type: 'string', example: 'sub-1727429182-k9a2f1' },
                      parsed: {
                        type: 'object',
                        properties: {
                          category: { type: 'string', example: 'education' },
                          ward_id: { type: 'integer', example: 3 },
                          trust_score: { type: 'number', example: 8.5 },
                          is_campaign: { type: 'boolean', example: false },
                          original_language: { type: 'string', example: 'pt' }
                        }
                      },
                      verifiable_credential: {
                        type: 'object',
                        description: 'W3C Verifiable Credential Data Model'
                      }
                    }
                  }
                }
              }
            },
            '429': { description: 'Rate limit exceeded (Max 20 req/min per IP)' }
          }
        },
        get: {
          tags: ['Citizen Intake'],
          summary: 'Track citizen submission lifecycle by Receipt ID',
          parameters: [
            {
              name: 'id',
              in: 'query',
              required: true,
              schema: { type: 'string' },
              description: 'Receipt tracking ID generated at intake'
            }
          ],
          responses: {
            '200': {
              description: 'Full lifecycle tracking state and verifiable credential',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      submission: {
                        type: 'object',
                        properties: {
                          id: { type: 'string' },
                          user_name: { type: 'string' },
                          category: { type: 'string' },
                          status: { type: 'string', enum: ['pending_review', 'verified'] },
                          project_status: { type: 'string', enum: ['Proposed', 'Approved', 'Tendering', 'Construction', 'Completed'] },
                          verifiable_credential: { type: 'object' }
                        }
                      }
                    }
                  }
                }
              }
            },
            '404': { description: 'Submission ID not found' }
          }
        }
      },
      '/api/projects': {
        get: {
          tags: ['Capital Allocation'],
          summary: 'Compute multi-objective Pareto-optimal project portfolio',
          description: 'Calculates dynamic Z-score normalized priority scores and solves bounded knapsack optimization with precedence DAG constraints.',
          parameters: [
            { name: 'budget', in: 'query', schema: { type: 'number', default: 2000000 }, description: 'Budget limit in base currency (INR)' },
            { name: 'weights', in: 'query', schema: { type: 'string' }, description: 'Comma-separated indicator weights (demand:0.35,equity:0.25,cost:0.20,urgency:0.20)' },
            { name: 'scenario', in: 'query', schema: { type: 'string', enum: ['standard', 'max_citizens', 'max_equity', 'max_urgency'], default: 'standard' } }
          ],
          responses: {
            '200': {
              description: 'All scored projects and optimal portfolio allocation',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      allProjects: { type: 'array', items: { type: 'object' } },
                      portfolio: {
                        type: 'object',
                        properties: {
                          selected: { type: 'array', items: { type: 'object' } },
                          deferred: { type: 'array', items: { type: 'object' } },
                          totalSpent: { type: 'number' },
                          remainingBudget: { type: 'number' },
                          totalCitizensImpacted: { type: 'integer' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        post: {
          tags: ['Capital Allocation'],
          summary: 'Transition project lifecycle status and sign cryptographic audit log',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['project_id', 'action', 'new_state'],
                  properties: {
                    project_id: { type: 'integer', example: 1 },
                    action: { type: 'string', example: 'Approved' },
                    actor: { type: 'string', example: 'MP Office' },
                    previous_state: { type: 'string', example: 'Proposed' },
                    new_state: { type: 'string', example: 'Approved' },
                    reason: { type: 'string', example: 'Sanctioned under FY26 Capital Priority' }
                  }
                }
              }
            }
          },
          responses: {
            '200': {
              description: 'Project status transitioned and cryptographically signed',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      message: { type: 'string' },
                      audit: {
                        type: 'object',
                        properties: {
                          payloadHash: { type: 'string' },
                          cryptographicSignature: { type: 'string' },
                          signerDid: { type: 'string' },
                          immutableLedgerStatus: { type: 'string' }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/stats': {
        get: {
          tags: ['Observability & Demographics'],
          summary: 'Aggregate sovereign KPIs, sector distributions, and ward equity scores',
          parameters: [
            { name: 'currency', in: 'query', schema: { type: 'string', default: 'INR' } },
            { name: 'budget', in: 'query', schema: { type: 'number' } }
          ],
          responses: {
            '200': {
              description: 'System-wide analytics and heatmaps',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      kpis: { type: 'object' },
                      categoryStats: { type: 'array', items: { type: 'object' } },
                      wardStats: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            }
          }
        }
      },
      '/api/audit': {
        get: {
          tags: ['Cryptographic Audit'],
          summary: 'Query immutable decision ledger with cryptographic verification',
          parameters: [
            { name: 'limit', in: 'query', schema: { type: 'integer', default: 50 } },
            { name: 'project_id', in: 'query', schema: { type: 'integer' } }
          ],
          responses: {
            '200': {
              description: 'List of verifiable audit logs with SHA-256 signatures',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      success: { type: 'boolean' },
                      standard: { type: 'string', example: 'UN-DPGA-Criterion-9' },
                      issuer: { type: 'string', example: 'did:dpg:civis-brics:sovereign-node' },
                      total_records: { type: 'integer' },
                      audit_ledger: { type: 'array', items: { type: 'object' } }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  };

  return NextResponse.json(openApiSpec, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
