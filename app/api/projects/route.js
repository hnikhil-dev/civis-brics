// app/api/projects/route.js
import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { calculateProjectScores } from '@/lib/scoring';
import { optimizePortfolio } from '@/lib/optimizer';
import { getJurisdiction } from '@/lib/jurisdictions';

// GET Handler: Calculates real-time scores and runs portfolio optimizer for sovereign BRICS jurisdictions
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse country filter (IND, BRA, ZAF, CHN, RUS, or ALL)
    const country = searchParams.get('country');

    // Parse custom weights (format: weights=demand:0.2,population:0.15...)
    const customWeights = {};
    const weightsParam = searchParams.get('weights');
    if (weightsParam) {
      weightsParam.split(',').forEach(part => {
        const [key, val] = part.split(':');
        if (key && val) {
          customWeights[key] = parseFloat(val);
        }
      });
    }

    // Parse budget and scenario optimizer parameters
    const budgetLimit = parseInt(searchParams.get('budget') || '2500000', 10);
    const scenario = searchParams.get('scenario') || 'max_benefit';

    // 1. Calculate Priority Scores for all active projects
    let allProjectsScored = await calculateProjectScores(customWeights);

    // 2. Filter projects by country jurisdiction if specified
    if (country && country !== 'ALL') {
      const jur = getJurisdiction(country);
      const allowedWardIds = new Set(
        jur?.provinces[0]?.districts[0]?.sectors?.map(s => s.id) || []
      );
      allProjectsScored = allProjectsScored.filter(
        p => p.country_code === country || allowedWardIds.has(p.ward_id)
      );
    }

    // 3. Solve Portfolio Allocation with MILP / Greedy Knapsack
    const portfolio = optimizePortfolio(allProjectsScored, budgetLimit, scenario);

    return NextResponse.json({
      success: true,
      allProjects: allProjectsScored,
      portfolio: {
        selected: portfolio.selected,
        deferred: portfolio.deferred,
        totalSpent: portfolio.totalSpent,
        remainingBudget: portfolio.remainingBudget,
        optimizedValue: portfolio.optimizedValue
      },
      weightsUsed: customWeights,
      scenarioUsed: scenario,
      budgetLimit,
      country: country || 'ALL'
    });

  } catch (error) {
    console.error("GET Projects scoring error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST Handler: Handles MP approvals, status changes, and logs cryptographically signed audit decision
export async function POST(request) {
  try {
    const { generateAuditRecord } = await import('@/lib/dpg');
    const body = await request.json();
    const { project_id, action, actor, previous_state, new_state, reason, budget_cost, currency } = body;

    if (!project_id || !action || !new_state) {
      return NextResponse.json(
        { error: "Missing required properties: project_id, action, and new_state." },
        { status: 400 }
      );
    }

    // 1. Update project status in Supabase
    const { error: projErr } = await supabase
      .from('projects')
      .update({ status: new_state })
      .eq('id', project_id);

    if (projErr) {
      console.error("Error updating project status:", projErr);
      return NextResponse.json({ error: projErr.message }, { status: 500 });
    }

    // 2. Generate cryptographic audit record with SHA-256 signature
    const auditRecord = generateAuditRecord({
      projectId: project_id,
      action,
      actor: actor || 'Policymaker Office',
      previousState: previous_state || 'Proposed',
      newState: new_state,
      reason: reason || 'Approved through Pareto optimization workspace',
      budgetCost: budget_cost,
      currency: currency || 'INR'
    });

    // 3. Insert transaction into audit decision logs
    const { error: logErr } = await supabase
      .from('decision_logs')
      .insert({
        project_id,
        action,
        actor: actor || 'Policymaker Office',
        previous_state: previous_state || 'Proposed',
        new_state,
        reason: auditRecord.reason
      });

    if (logErr) {
      console.error("Error writing audit decision log:", logErr);
    }

    return NextResponse.json({
      success: true,
      message: `Project ${project_id} transitioned from ${previous_state} to ${new_state} successfully.`,
      audit: auditRecord.auditMetadata,
      logged: !logErr
    });

  } catch (error) {
    console.error("POST Projects decision log error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
