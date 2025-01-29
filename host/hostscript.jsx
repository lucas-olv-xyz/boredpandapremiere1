function importFilesFromTXT() {
  try {
    var txtPath =
      "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/boredpanda/arquivos.txt"; // Caminho fixo do TXT
    var txtFile = new File(txtPath);

    if (!txtFile.exists) {
      return "❌ O arquivo TXT não foi encontrado: " + txtPath;
    }

    txtFile.open("r"); // Abre o arquivo no modo de leitura
    var filePaths = [];

    while (!txtFile.eof) {
      var line = txtFile.readln(); // Lê uma linha do TXT

      if (line && line.length > 0) {
        // Verifica se a linha não está vazia
        filePaths.push(line); // Adiciona ao array
      }
    }
    txtFile.close(); // Fecha o arquivo após a leitura

    if (filePaths.length === 0) {
      return "⚠️ O TXT está vazio ou não contém caminhos válidos.";
    }

    var project = app.project;
    var importBin = project.rootItem.createBin("Importação via TXT");
    var importedFiles = 0;

    for (var i = 0; i < filePaths.length; i++) {
      var file = new File(filePaths[i]);
      if (file.exists) {
        try {
          project.importFiles([file.fsName], true, importBin, false);
          importedFiles++;
        } catch (e) {
          return "Erro ao importar: " + file.fsName;
        }
      } else {
        return "❌ Arquivo não encontrado: " + filePaths[i];
      }
    }

    return importedFiles + " arquivos importados via TXT.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}
