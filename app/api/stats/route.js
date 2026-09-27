// app/api/stats/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BRICS_CURRENCIES } from '@/lib/currency';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'INR';
    const customBudgetParam = searchParams.get('budget');

    // Fetch all records for aggregation
    const { data: submissions } = await supabase.from('submissions').select('*');
    const { data: issues } = await supabase.from('extracted_issues').select('*');
    const { data: clusters } = await supabase.from('demand_clusters').select('*');
    const { data: projects } = await supabase.from('projects').select('*');
    const { data: wards } = await supabase.from('wards').select('*');
    const { data: logs } = await supabase.from('decision_logs').select('*');

    const totalSubmissions = submissions?.length || 0;
    
    // Ingestion pipeline review queues
    const pendingReviewCount = issues?.filter(i => i.status === 'pending_review').length || 0;
    const verifiedCount = issues?.filter(i => i.status === 'verified').length || 0;

    // Budget utilization stats
    const totalProjects = projects?.length || 0;
    const approvedProjects = projects?.filter(p => p.status !== 'Proposed' && p.status !== 'Rejected') || [];
    const totalAllocatedBudget = approvedProjects.reduce((sum, p) => sum + (p.estimated_cost || 0), 0);

    const defaultCurrencyBudget = BRICS_CURRENCIES[currency]?.budgetSlider?.default || 2000000;
    const budgetLimit = customBudgetParam ? parseFloat(customBudgetParam) : defaultCurrencyBudget;

    // Dynamic Category Distributions
    const categoryCounts = {};
    issues?.forEach(iss => {
      const cat = iss.category || 'general';
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    });

    const categoryStats = Object.entries(categoryCounts).map(([name, value]) => ({
      name: name.toUpperCase(),
      value
    }));

    // Ward-wise demand distribution for maps and charts
    const wardDemands = {};
    wards?.forEach(w => {
      wardDemands[w.id] = {
        ward_id: w.id,
        ward_name: w.name,
        population: w.population,
        equity_score: w.equity_score,
        citizen_count: 0,
        cluster_count: 0
      };
    });

    clusters?.forEach(c => {
      if (wardDemands[c.ward_id]) {
        wardDemands[c.ward_id].citizen_count += (c.citizen_count || 0);
        wardDemands[c.ward_id].cluster_count += 1;
      }
    });

    const wardStats = Object.values(wardDemands);

    // Audit logs of recent decisions
    const sortedLogs = logs
      ? [...logs].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 10)
      : [];

    return NextResponse.json({
      success: true,
      kpis: {
        totalSubmissions,
        verifiedCount,
        pendingReviewCount,
        totalProjects,
        approvedCount: approvedProjects.length,
        totalAllocatedBudget,
        budgetLimit
      },
      categoryStats,
      wardStats,
      submissions: submissions || [],
      recentDecisions: sortedLogs
    });

  } catch (error) {
    console.error("GET Stats endpoint crash:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
