// app/api/seed/route.js
import { NextResponse } from 'next/server';
import { resetMockDB } from '@/lib/supabase';
import { INITIAL_MOCK_DATA } from '@/lib/brics_dataset';

export async function POST() {
  try {
    const db = resetMockDB();
    return NextResponse.json({
      success: true,
      message: 'Sovereign BRICS benchmark database re-seeded successfully.',
      counts: {
        wards: db.wards.length,
        projects: db.projects.length,
        submissions: db.submissions.length,
        demand_clusters: db.demand_clusters.length,
        extracted_issues: db.extracted_issues.length
      },
      data: INITIAL_MOCK_DATA
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET() {
  return POST();
}
