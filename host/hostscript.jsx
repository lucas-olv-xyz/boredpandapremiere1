function importFilesFromFolder() {
  try {
    var folder = Folder.selectDialog(
      "Selecione a pasta com os arquivos para importar"
    );

    if (!folder) {
      return "Nenhuma pasta selecionada.";
    }

    var files = folder.getFiles();
    var project = app.project;

    if (!files.length) {
      return "Nenhum arquivo encontrado.";
    }

    var importBin = project.rootItem.createBin("Arquivos Importados");

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

    return importedFiles + " arquivos importados!";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}
