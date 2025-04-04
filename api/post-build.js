const fs = require('fs');
const path = require('path');
const package = require('./package.json');

const targetDir = path.join(__dirname, 'build');
const scriptPath = path.join(targetDir, 'index.js');

const importStatement = 'import "reflect-metadata";\n';

if(!fs.existsSync(targetDir)){
  console.error(`Diretório ${targetDir} não encontrado.`);
  return
}
if (!fs.existsSync(scriptPath)) {
  console.error(`Arquivo ${scriptPath} não encontrado.`);
  return
}

const fileContent = fs.readFileSync(scriptPath, 'utf8');

if (fileContent.startsWith(importStatement)) {
  console.log(`'import "reflect-metadata";' já existe no topo de ${scriptPath}`);
  return
}

const updatedContent = importStatement + fileContent;

fs.writeFileSync(scriptPath, updatedContent, 'utf8');

console.log(`Adicionado 'import "reflect-metadata";' no topo de ${scriptPath}`);
const packagePath = path.join(targetDir, 'package.json');

package.type = "module";
package.scripts.start = "npm run db.push && npm run db.seed && node ./index.js";
package.scripts['db.seed'] = "node ./seed.js";

const content = JSON.stringify(package, null, 4);
fs.writeFileSync(packagePath, content, 'utf8');

const prismaSource = path.join(__dirname, 'prisma', 'schema.prisma');
const prismaDestination = path.join(targetDir, 'prisma', 'schema.prisma');

fs.mkdirSync(path.dirname(prismaDestination), { recursive: true });
fs.copyFileSync(prismaSource, prismaDestination);

fs.copyFileSync(
  path.join(__dirname, 'prisma', 'seed.js'),
  path.join(targetDir, 'seed.js')
);

fs.copyFileSync(
  path.join(__dirname, 'prod.env'),
  path.join(targetDir, '.env')
);



