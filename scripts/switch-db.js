const fs = require('fs');
const path = require('path');

const target = process.argv[2];
const schemaPath = path.join(__dirname, '..', 'prisma', 'schema.prisma');

if (!target || !['sqlite', 'postgres', 'postgresql'].includes(target.toLowerCase())) {
  console.log('Usage: node scripts/switch-db.js [sqlite|postgres]');
  process.exit(1);
}

const provider = target.toLowerCase() === 'sqlite' ? 'sqlite' : 'postgresql';
let content = fs.readFileSync(schemaPath, 'utf8');

content = content.replace(
  /datasource db \{\s*provider\s*=\s*"[^"]*"/,
  `datasource db {\n  provider = "${provider}"`
);

fs.writeFileSync(schemaPath, content, 'utf8');
console.log(`Updated prisma/schema.prisma datasource provider to: ${provider}`);
