// app/api/audit/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { computeSha256, DPG_ISSUER_DID } from '@/lib/dpg';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const projectId = searchParams.get('project_id');

    let query = supabase
      .from('decision_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (projectId) {
      query = query.eq('project_id', projectId);
    }

    const { data: logs, error } = await query;

    if (error) {
      console.error("Error querying audit logs:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Process logs and compute cryptographic verification status
    const verifiedLogs = (logs || []).map(entry => {
      const hasSignature = typeof entry.reason === 'string' && entry.reason.includes('[SIG:');
      const hashMatch = entry.reason ? entry.reason.match(/\[SIG:([a-f0-9]+)\|HASH:([a-f0-9]+)\]/) : null;

      const recordDigest = computeSha256({
        id: entry.id,
        projectId: entry.project_id,
        action: entry.action,
        actor: entry.actor,
        previousState: entry.previous_state,
        newState: entry.new_state,
        timestamp: entry.timestamp
      });

      return {
        id: entry.id,
        timestamp: entry.timestamp,
        project_id: entry.project_id,
        action: entry.action,
        actor: entry.actor,
        previous_state: entry.previous_state,
        new_state: entry.new_state,
        raw_reason: entry.reason,
        verification: {
          status: hasSignature ? 'VERIFIED' : 'LEGACY_UNVERIFIED',
          issuer_did: DPG_ISSUER_DID,
          signature_snippet: hashMatch ? hashMatch[1] : null,
          hash_snippet: hashMatch ? hashMatch[2] : null,
          record_digest: `sha256:${recordDigest}`
        }
      };
    });

    return NextResponse.json({
      success: true,
      standard: 'UN-DPGA-Criterion-9',
      issuer: DPG_ISSUER_DID,
      total_records: verifiedLogs.length,
      audit_ledger: verifiedLogs
    });

  } catch (error) {
    console.error("GET Audit ledger error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
