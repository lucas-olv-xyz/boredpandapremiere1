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
    var importedFiles = 0;

    for (var i = 0; i < filePaths.length; i++) {
      var file = new File(filePaths[i]);
      if (file.exists) {
        try {
          project.importFiles([file.fsName], true, project.rootItem, false);
          importedFiles++;
        } catch (e) {
          return "Erro ao importar: " + file.fsName;
        }
      } else {
        return "❌ Arquivo não encontrado: " + filePaths[i];
      }
    }

    return importedFiles + " arquivos importados diretamente para o projeto.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}

function addFilesToTimeline() {
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
      var line = txtFile.readln();
      if (line && line.length > 0) {
        filePaths.push(line); // Adiciona os caminhos ao array
      }
    }
    txtFile.close(); // Fecha o arquivo

    if (filePaths.length === 0) {
      return "⚠️ O TXT está vazio ou não contém caminhos válidos.";
    }

    var project = app.project;
    var sequence = project.activeSequence;

    if (!sequence) {
      return "❌ Nenhuma sequência ativa encontrada. Crie uma sequência primeiro.";
    }

    var videoTrack = sequence.videoTracks[0]; // Obtém a trilha de vídeo
    if (!videoTrack) {
      return "❌ Nenhuma trilha de vídeo disponível.";
    }

    var currentTime = sequence.getPlayerPosition(); // Obtém a posição atual na timeline

    for (var i = 0; i < filePaths.length; i++) {
      var clipName = filePaths[i].split("/").pop().split("\\").pop(); // Obtém apenas o nome do arquivo
      var item = findItemInProject(clipName);

      if (item) {
        try {
          videoTrack.insertClip(item, currentTime); // Adiciona o clipe à timeline
          currentTime += item.getOutPoint().seconds; // Move o cursor para depois do clipe
        } catch (e) {
          return "❌ Erro ao adicionar " + clipName + " à timeline.";
        }
      } else {
        return "❌ Arquivo não encontrado no projeto: " + clipName;
      }
    }

    return "✅ Arquivos adicionados à timeline na ordem especificada.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}

// Função auxiliar para encontrar um arquivo pelo nome no projeto
function findItemInProject(name) {
  var rootItem = app.project.rootItem;
  var numItems = rootItem.children.numItems;

  for (var i = 0; i < numItems; i++) {
    var item = rootItem.children[i];
    if (item && item.name === name) {
      return item;
    }
  }
  return null;
}
