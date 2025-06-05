import fs from 'fs';
import path from 'path';

// Read package.json
const packageJson = JSON.parse(fs.readFileSync('./package.json', 'utf8'));
const version = packageJson.version;

// Create or update .env file
const envContent = `VITE_APP_VERSION=${version}\n`;
fs.writeFileSync('.env', envContent, 'utf8');

console.log(`Version ${version} has been set in .env file`); 