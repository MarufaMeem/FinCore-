/**
 * Reads Cypress's mochawesome JSON report(s) and files one JIRA bug per failed test.
 *
 * Required environment variables:
 *   JIRA_BASE_URL    e.g. https://yourcompany.atlassian.net
 *   JIRA_EMAIL       the email tied to the API token
 *   JIRA_API_TOKEN   generate at https://id.atlassian.com/manage-profile/security/api-tokens
 *   JIRA_PROJECT_KEY e.g. SENT
 *
 * Usage:
 *   node scripts/report-to-jira.js cypress/results
 */

const fs = require('fs');
const path = require('path');

const RESULTS_DIR = process.argv[2] || 'cypress/results';

const { JIRA_BASE_URL, JIRA_EMAIL, JIRA_API_TOKEN, JIRA_PROJECT_KEY } = process.env;

function assertEnv() {
  const missing = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN', 'JIRA_PROJECT_KEY']
    .filter((key) => !process.env[key]);
  if (missing.length) {
    console.error(`Missing required env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
}

function loadFailedTests() {
  if (!fs.existsSync(RESULTS_DIR)) {
    console.log(`No results directory found at ${RESULTS_DIR}, nothing to report.`);
    return [];
  }

  const files = fs.readdirSync(RESULTS_DIR).filter((f) => f.endsWith('.json'));
  const failures = [];

  for (const file of files) {
    const report = JSON.parse(fs.readFileSync(path.join(RESULTS_DIR, file), 'utf8'));
    for (const result of report.results || []) {
      collectFailures(result, failures);
    }
  }

  return failures;
}

function collectFailures(suite, failures) {
  for (const test of suite.tests || []) {
    if (test.state === 'failed' || test.fail) {
      failures.push({
        title: test.fullTitle || test.title,
        error: test.err?.message || 'No error message captured',
        file: suite.file || 'unknown spec'
      });
    }
  }
  for (const child of suite.suites || []) {
    collectFailures(child, failures);
  }
}

async function createJiraBug(failure) {
  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64');

  const body = {
    fields: {
      project: { key: JIRA_PROJECT_KEY },
      summary: `[Automated] Cypress failure: ${failure.title}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: `Spec file: ${failure.file}\n\nError:\n${failure.error}` }
            ]
          }
        ]
      },
      issuetype: { name: 'Bug' },
      labels: ['automated', 'cypress']
    }
  };

  const response = await fetch(`${JIRA_BASE_URL}/rest/api/3/issue`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(`Failed to create JIRA issue for "${failure.title}": ${response.status} ${text}`);
    return;
  }

  const created = await response.json();
  console.log(`Created ${created.key} for failed test: ${failure.title}`);
}

async function main() {
  assertEnv();
  const failures = loadFailedTests();

  if (failures.length === 0) {
    console.log('No failed tests found. Nothing to report to JIRA.');
    return;
  }

  console.log(`Found ${failures.length} failed test(s). Filing JIRA bugs...`);
  for (const failure of failures) {
    await createJiraBug(failure);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
