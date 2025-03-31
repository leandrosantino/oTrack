const fs = require('fs');
const path = require('path');
const package = require('./package.json');

// Caminho para o arquivo index.js no diretório build
const targetDir = path.join(__dirname, 'build');
const scriptPath = path.join(targetDir, 'index.js');

// Importação a ser adicionada
const importStatement = 'import "reflect-metadata";\n';

// Verifica se o arquivo existe
if (fs.existsSync(scriptPath)) {
  // Lê o conteúdo do arquivo existente
  const fileContent = fs.readFileSync(scriptPath, 'utf8');

  // Adiciona a importação no topo, caso ainda não esteja presente
  if (!fileContent.startsWith(importStatement)) {
    const updatedContent = importStatement + fileContent;

    // Sobrescreve o arquivo com o conteúdo atualizado
    fs.writeFileSync(scriptPath, updatedContent, 'utf8');
    console.log(`Adicionado 'import "reflect-metadata";' no topo de ${scriptPath}`);
  } else {
    console.log(`'import "reflect-metadata";' já existe no topo de ${scriptPath}`);
  }
} else {
  console.error(`Arquivo ${scriptPath} não encontrado.`);
}

const packagePath = path.join(targetDir, 'package.json');

if(fs.existsSync(targetDir)){
  package.type = "module";
  package.scripts.start = "npm run db.push && npm run db.seed && node ./index.js";
  package.scripts['db.seed'] = "node ./seed.js";

  const content = JSON.stringify(package, null, 4);
  fs.writeFileSync(packagePath, content, 'utf8');


  const prismaSource = path.join(__dirname, 'prisma', 'schema.prisma');
  const prismaDestination = path.join(targetDir, 'prisma', 'schema.prisma');

  fs.mkdirSync(path.dirname(prismaDestination), { recursive: true });
  fs.copyFileSync(prismaSource, prismaDestination);
}

