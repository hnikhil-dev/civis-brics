// scratch/test-dpg.mjs
import { 
  canonicalize, 
  computeSha256, 
  signPayload, 
  verifySignature, 
  generateSubmissionCredential, 
  generateAuditRecord,
  DPG_ISSUER_DID 
} from '../lib/dpg.js';

console.log('--- Running Digital Public Good (DPG) Cryptographic Tests ---');
let passed = 0;
let failed = 0;

const assert = (name, condition) => {
  if (condition) {
    console.log(`  [PASS] ${name}`);
    passed++;
  } else {
    console.error(`  [FAIL] ${name}`);
    failed++;
  }
};

// 1. Canonicalization
const obj1 = { z: 10, a: "test", m: [3, 2, 1], nested: { b: 2, a: 1 } };
const obj2 = { nested: { a: 1, b: 2 }, m: [3, 2, 1], a: "test", z: 10 };
assert("Canonicalization: Key order invariance", canonicalize(obj1) === canonicalize(obj2));

// 2. Deterministic SHA-256
const hash1 = computeSha256(obj1);
const hash2 = computeSha256(obj2);
assert("SHA-256: Identical digest across key orderings", hash1 === hash2 && hash1.length === 64);

// 3. Digital Signature & Verification
const testPayload = { projectId: 42, action: 'Approved', actor: 'Minister' };
const signature = signPayload(testPayload);
assert("HMAC-SHA256: Generates valid signature", typeof signature === 'string' && signature.length === 64);
assert("HMAC-SHA256: Verifies valid signature", verifySignature(testPayload, signature) === true);

const tamperedPayload = { projectId: 42, action: 'Approved', actor: 'Attacker' };
assert("HMAC-SHA256: Rejects tampered payload", verifySignature(tamperedPayload, signature) === false);

// 4. W3C Verifiable Credential
const mockSubmission = {
  id: 'sub-2026-brics-1',
  user_name: 'Lucas Silva',
  raw_text: 'Need new primary school classrooms in district 3.',
  channel: 'Web Form',
  gps_lat: -23.5505,
  gps_lng: -46.6333
};
const vc = generateSubmissionCredential(mockSubmission, {
  category: 'education',
  ward_id: 3,
  trust_score: 9.0,
  is_campaign: false
});

assert("W3C VC: Standard @context presence", Array.isArray(vc['@context']) && vc['@context'].includes('https://www.w3.org/2018/credentials/v1'));
assert("W3C VC: VerifiableCredential type", vc.type.includes('VerifiableCredential'));
assert("W3C VC: Issuer DID format", vc.issuer.id === DPG_ISSUER_DID);
assert("W3C VC: Proof structure and JWS signature", vc.proof && vc.proof.type === 'JsonWebSignature2020' && typeof vc.proof.jws === 'string');

// 5. Decision Audit Record
const auditRecord = generateAuditRecord({
  projectId: 101,
  projectTitle: 'Solar Microgrid Hadapsar',
  action: 'Approved',
  actor: 'MP Office',
  previousState: 'Proposed',
  newState: 'Approved',
  reason: 'High equity impact'
});

assert("Audit Record: Embedded signature and payload hash in reason", auditRecord.reason.includes('[SIG:') && auditRecord.reason.includes('|HASH:'));
assert("Audit Record: UN DPGA Criterion-9 compliance metadata", auditRecord.auditMetadata.dpgCompliance === 'UN-DPGA-Criterion-9');
assert("Audit Record: Status VERIFIED", auditRecord.auditMetadata.immutableLedgerStatus === 'VERIFIED');

console.log(`\nDPG Cryptographic Tests Summary: ${passed} Passed, ${failed} Failed`);
if (failed > 0) process.exit(1);
