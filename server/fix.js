const fs = require('fs');

// Fix root .env
let rootEnv = fs.readFileSync('../.env', 'utf8');
if (rootEnv.startsWith('explain the app structure')) {
    rootEnv = rootEnv.replace(/^explain the app structure[^\n]*\n/, '');
    fs.writeFileSync('../.env', rootEnv);
}

// Fix server/index.js to point to root .env
let serverIndex = fs.readFileSync('index.js', 'utf8');
if (serverIndex.includes('dotenv.config();')) {
    serverIndex = serverIndex.replace(
        'dotenv.config();',
        "import path from 'path';\nimport { fileURLToPath } from 'url';\nconst __dirname = path.dirname(fileURLToPath(import.meta.url));\ndotenv.config({ path: path.join(__dirname, '../.env') });"
    );
    fs.writeFileSync('index.js', serverIndex);
}

// Backup and remove server/.env
if (fs.existsSync('.env')) {
    fs.renameSync('.env', '.env.backup');
}
console.log('Fixed env paths.');
