import fs from 'node:fs';
const html = fs.readFileSync('index.html', 'utf8');
const api = fs.readFileSync('api/generate-report.js', 'utf8');
const mustContain = [
  'id="copyReport"',
  'id="downloadJson"',
  'id="printReport"',
  'id="resetForm"',
  'id="leadPreview"',
  'id="aiReport"',
  'id="companyName"',
  'id="budget"',
  'id="appointment"',
  'function plainReport',
  'function automationLists',
  'function saveLocalLead',
  'function copyReport',
  'async function enrichWithAI',
  'let lastAssessment',
  'id="conversionPanel"',
  'id="leadCaptureForm"',
  'id="submitLead"',
  'id="leadSuccess"',
  'id="copyLeadBrief"',
  'function renderConversionPanel',
  'function submitLeadCapture',
  'function leadBriefText',
  'bizflow_submissions'
];
for (const token of mustContain) {
  if (!html.includes(token)) throw new Error(`missing token: ${token}`);
}
const apiMustContain = [
  'process.env.OPENAI_API_KEY',
  'response_format',
  'fallback',
  '不可建議自動私訊'
];
for (const token of apiMustContain) {
  if (!api.includes(token)) throw new Error(`missing api token: ${token}`);
}
const script = html.match(/<script>([\s\S]*)<\/script>/)[1];
new Function(script);
console.log('smoke expectations passed');
