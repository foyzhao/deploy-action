const fs = require('fs');
const childProcess = require('child_process');

const server = process.env.INPUT_SERVER;
const account = process.env.INPUT_ACCOUNT || 'Administrator';
const password = process.env.INPUT_PASSWORD;
const artifact = process.env.INPUT_ARTIFACT || '.\\dist';
const path = process.env.INPUT_PATH;

if (!server) {
  throw new Error('Input required and not supplied: server');
}
if (!password) {
  throw new Error('Input required and not supplied: password');
}
if (!path) {
  throw new Error('Input required and not supplied: path');
}
if (!fs.existsSync(artifact)) {
  throw new Error('Artifact not exist');
}

const child = childProcess.spawn('PowerShell.exe', [
  '-NoProfile',
  '-File',
  'deploy.ps1',
  server,
  account,
  password,
  artifact,
  path
]);
child.stdout.on("data", (data) => {
  console.log(`${data}`.trim());
});
child.stderr.on('data', (data) => {
  throw new Error(data);
});
child.stdin.end();
