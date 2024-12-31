const fs = require('fs');
const path = require('path');

// Caminho para o arquivo index.js no diretório build
const filePath = path.join(__dirname, 'build', 'index.js');

// Importação a ser adicionada
const importStatement = 'import "reflect-metadata";\n';

// Verifica se o arquivo existe
if (fs.existsSync(filePath)) {
  // Lê o conteúdo do arquivo existente
  const fileContent = fs.readFileSync(filePath, 'utf8');

  // Adiciona a importação no topo, caso ainda não esteja presente
  if (!fileContent.startsWith(importStatement)) {
    const updatedContent = importStatement + fileContent;

    // Sobrescreve o arquivo com o conteúdo atualizado
    fs.writeFileSync(filePath, updatedContent, 'utf8');
    console.log(`Adicionado 'import "reflect-metadata";' no topo de ${filePath}`);
  } else {
    console.log(`'import "reflect-metadata";' já existe no topo de ${filePath}`);
  }
} else {
  console.error(`Arquivo ${filePath} não encontrado.`);
}
