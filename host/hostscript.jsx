function importFilesFromPredefinedFolder() {
  try {
    var folderPath = "C:/Users/theel/Videos/premiere_test"; // Defina seu caminho fixo aqui
    var folder = new Folder(folderPath);

    if (!folder.exists) {
      return "A pasta especificada não existe: " + folderPath;
    }

    var files = folder.getFiles();
    var project = app.project;

    if (!files.length) {
      return "Nenhum arquivo encontrado na pasta.";
    }

    var importBin = project.rootItem.createBin("Importação Automática");

    var importedFiles = 0;

    for (var i = 0; i < files.length; i++) {
      if (files[i] instanceof File) {
        try {
          project.importFiles([files[i].fsName], true, importBin, false);
          importedFiles++;
        } catch (e) {
          return "Erro ao importar: " + files[i].fsName;
        }
      }
    }

    return importedFiles + " arquivos importados de " + folderPath;
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}
