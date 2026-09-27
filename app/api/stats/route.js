// app/api/stats/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { BRICS_CURRENCIES } from '@/lib/currency';
import { getJurisdiction } from '@/lib/jurisdictions';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const currency = searchParams.get('currency') || 'INR';
    const country = searchParams.get('country');
    const customBudgetParam = searchParams.get('budget');

    // Fetch all records from sovereign database
    let { data: submissions } = await supabase.from('submissions').select('*');
    let { data: issues } = await supabase.from('extracted_issues').select('*');
    let { data: clusters } = await supabase.from('demand_clusters').select('*');
    let { data: projects } = await supabase.from('projects').select('*');
    let { data: wards } = await supabase.from('wards').select('*');
    let { data: logs } = await supabase.from('decision_logs').select('*');

    // Multi-country jurisdiction filtering
    if (country && country !== 'ALL') {
      const jur = getJurisdiction(country);
      const allowedWardIds = new Set(
        jur?.provinces[0]?.districts[0]?.sectors?.map(s => s.id) || []
      );

      if (wards) wards = wards.filter(w => w.country_code === country || allowedWardIds.has(w.id));
      if (submissions) submissions = submissions.filter(s => s.country_code === country);
      if (issues) issues = issues.filter(i => allowedWardIds.has(i.ward_id));
      if (clusters) clusters = clusters.filter(c => c.country_code === country || allowedWardIds.has(c.ward_id));
      if (projects) projects = projects.filter(p => p.country_code === country || allowedWardIds.has(p.ward_id));
    }

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
      country: country || 'ALL',
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
