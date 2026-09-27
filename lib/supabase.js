import { createClient } from '@supabase/supabase-js';
import { INITIAL_MOCK_DATA } from './brics_dataset.js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Check if keys are active and valid (ignores dummy/unreachable hosts)
const isConfigured = supabaseUrl && 
                     supabaseAnonKey && 
                     supabaseUrl !== 'https://placeholder-url.supabase.co' &&
                     !supabaseUrl.includes('jzgoesysrwioeiujdkdf') &&
                     supabaseUrl.startsWith('https://');

// Local storage key for sovereign offline/mock database
const MOCK_DB_KEY = 'civis_brics_storage_db';

// Local helper to load or initialize mock database state
export function getMockDB() {
  if (typeof window === 'undefined') {
    if (!globalThis.__CIVIS_BRICS_SERVER_DB__) {
      globalThis.__CIVIS_BRICS_SERVER_DB__ = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    }
    return globalThis.__CIVIS_BRICS_SERVER_DB__;
  }
  const existing = localStorage.getItem(MOCK_DB_KEY);
  if (existing) {
    try {
      const parsed = JSON.parse(existing);
      // Migration check: if wards length < 25 or projects length < 25, upgrade to full 5-nation BRICS dataset
      if (!parsed.wards || parsed.wards.length < 25 || !parsed.projects || parsed.projects.length < 25) {
        console.log("Upgrading mock database to 25-ward 5-nation BRICS dataset...");
        localStorage.setItem(MOCK_DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
        return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
      }
      return parsed;
    } catch (e) {
      // JSON corruption fallback
    }
  }
  localStorage.setItem(MOCK_DB_KEY, JSON.stringify(INITIAL_MOCK_DATA));
  return JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
}

export function saveMockDB(db) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(db));
  } else {
    globalThis.__CIVIS_BRICS_SERVER_DB__ = db;
  }
}

export function resetMockDB() {
  const freshData = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  if (typeof window !== 'undefined') {
    localStorage.setItem(MOCK_DB_KEY, JSON.stringify(freshData));
  }
  globalThis.__CIVIS_BRICS_SERVER_DB__ = freshData;
  return freshData;
}

// Fluent Mock Query Builder simulating Supabase JS API
class MockQueryBuilder {
  constructor(table) {
    this.table = table;
    this.filters = [];
    this.orderCol = null;
    this.orderAsc = true;
    this.limitVal = null;
  }

  select(fields = '*') {
    return this;
  }

  eq(column, value) {
    this.filters.push((item) => item[column] == value);
    return this;
  }

  in(column, values) {
    const valSet = new Set(values);
    this.filters.push((item) => valSet.has(item[column]));
    return this;
  }

  order(column, { ascending = true } = {}) {
    this.orderCol = column;
    this.orderAsc = ascending;
    return this;
  }

  limit(val) {
    this.limitVal = val;
    return this;
  }

  async insert(rows) {
    const db = getMockDB();
    const tableData = db[this.table] || [];
    const formattedRows = Array.isArray(rows) ? rows : [rows];
    
    formattedRows.forEach(row => {
      // Auto-increment IDs if numeric
      if (row.id === undefined) {
        const ids = tableData.map(r => r.id).filter(id => typeof id === 'number');
        row.id = ids.length ? Math.max(...ids) + 1 : 1;
      }
      if (row.created_at === undefined && this.table === 'submissions') {
        row.created_at = new Date().toISOString();
      }
      tableData.push(row);
    });

    db[this.table] = tableData;
    saveMockDB(db);
    return { data: formattedRows, error: null };
  }

  async upsert(rows, options = {}) {
    const db = getMockDB();
    const tableData = db[this.table] || [];
    const formattedRows = Array.isArray(rows) ? rows : [rows];
    const onConflict = options.onConflict || 'id';

    formattedRows.forEach(row => {
      const idx = tableData.findIndex(item => item[onConflict] === row[onConflict]);
      if (idx >= 0) {
        tableData[idx] = { ...tableData[idx], ...row };
      } else {
        if (row.id === undefined) {
          const ids = tableData.map(r => r.id).filter(id => typeof id === 'number');
          row.id = ids.length ? Math.max(...ids) + 1 : 1;
        }
        tableData.push(row);
      }
    });

    db[this.table] = tableData;
    saveMockDB(db);
    return { data: formattedRows, error: null };
  }

  async update(values) {
    const db = getMockDB();
    const tableData = db[this.table] || [];
    let updatedCount = 0;
    
    const updatedData = tableData.map(item => {
      // Check if item matches current filter chain
      if (this.filters.every(f => f(item))) {
        updatedCount++;
        return { ...item, ...values };
      }
      return item;
    });

    db[this.table] = updatedData;
    saveMockDB(db);
    return { data: updatedData.filter(item => this.filters.every(f => f(item))), error: null, count: updatedCount };
  }

  async delete() {
    const db = getMockDB();
    const tableData = db[this.table] || [];
    const keptData = tableData.filter(item => !this.filters.every(f => f(item)));
    db[this.table] = keptData;
    saveMockDB(db);
    return { data: null, error: null };
  }

  // standard promise resolver
  async then(resolve) {
    try {
      const db = getMockDB();
      const data = db[this.table] || [];
      let result = data.filter(item => this.filters.every(f => f(item)));
      
      if (this.orderCol) {
        result.sort((a, b) => {
          let valA = a[this.orderCol];
          let valB = b[this.orderCol];
          if (typeof valA === 'string') {
            return this.orderAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return this.orderAsc ? valA - valB : valB - valA;
        });
      }
      
      if (this.limitVal) {
        result = result.slice(0, this.limitVal);
      }

      resolve({ data: JSON.parse(JSON.stringify(result)), error: null });
    } catch (e) {
      resolve({ data: null, error: e.message });
    }
  }
}

// Unified client export (automatically uses Service Role Key on server for RLS bypass, and Anon Key on client)
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const activeKey = (typeof window === 'undefined' && serviceKey) ? serviceKey : supabaseAnonKey;

export const supabase = isConfigured
  ? createClient(supabaseUrl, activeKey)
  : {
      from: (table) => new MockQueryBuilder(table),
      storage: {
        from: (bucket) => ({
          upload: async (path, file) => {
            console.log(`Mock upload to ${bucket}/${path}`);
            return {
              data: { path },
              error: null
            };
          },
          getPublicUrl: (path) => ({
            data: {
              publicUrl: `/mock-assets/${path}`
            }
          })
        })
      },
      rpc: async (functionName, params) => {
        console.log(`Mock RPC call: ${functionName}`, params);
        if (functionName === 'match_submissions') {
          return { data: [], error: null };
        }
        return { data: null, error: 'Function not mocked' };
      }
    };

export const isLiveSupabase = isConfigured;
