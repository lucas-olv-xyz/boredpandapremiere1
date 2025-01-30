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
      "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/boredpanda/arquivos.txt";
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
    txtFile.close();

    if (filePaths.length === 0) {
      return "⚠️ O TXT está vazio ou não contém caminhos válidos.";
    }

    filePaths.reverse(); // 🔥 INVERTE A ORDEM PARA GARANTIR QUE SEJA LIDO DO TOPO PARA BAIXO 🔥

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
          videoTrack.insertClip(item, currentTime); // Adiciona o clipe à timeline na ordem certa
          currentTime += item.getOutPoint().seconds; // Move o cursor para depois do clipe
        } catch (e) {
          return "❌ Erro ao adicionar " + clipName + " à timeline.";
        }
      } else {
        return "❌ Arquivo não encontrado no projeto: " + clipName;
      }
    }

    return "✅ Arquivos adicionados à timeline na ordem correta.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}

// Função auxiliar para encontrar um arquivo pelo nome no projeto
function findItemInProject(name) {
  var rootItem = app.project.rootItem;
  var numItems = rootItem.children.numItems;
  var matchedItems = [];

  for (var i = 0; i < numItems; i++) {
    var item = rootItem.children[i];
    if (item && item.name === name) {
      matchedItems.push(item); // Armazena todos os itens com o mesmo nome
    }
  }

  if (matchedItems.length > 0) {
    return matchedItems[0]; // Retorna o primeiro encontrado (garantindo a ordem do txt)
  }

  return null;
}

function saveFilePathsToTXT(filePaths) {
  try {
    var txtPath =
      "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/boredpanda/arquivos.txt"; // Caminho fixo
    var txtFile = new File(txtPath);

    if (!txtFile.open("w")) {
      // Abre o arquivo no modo escrita
      return "❌ Erro ao abrir o arquivo TXT para escrita.";
    }

    txtFile.write(filePaths.replace(/\n/g, "\r")); // Escreve os caminhos no arquivo
    txtFile.close();

    return "✅ Caminhos salvos com sucesso!";
  } catch (e) {
    return "❌ Erro inesperado: " + e.toString();
  }
}

function addTransitionsAbove() {
  try {
    var sequence = app.project.activeSequence;
    if (!sequence) {
      return "❌ Nenhuma sequência ativa encontrada. Crie uma sequência primeiro.";
    }

    var videoTracks = sequence.videoTracks;
    var numTracks = videoTracks.numTracks;

    // Criar uma nova trilha de vídeo acima da principal, se necessário
    var transitionTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      transitionTrack = videoTracks[1]; // Segunda trilha (track 1, pois track 0 é a principal)
    } else {
      transitionTrack = videoTracks[1]; // Usar a trilha acima da principal
    }

    var primaryTrack = videoTracks[0]; // Primeira trilha onde estão os vídeos
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Não há clipes suficientes para adicionar transições.";
    }

    var transitionPath =
      "C:/Users/theel/Videos/premiere_test/transitions/A1.mov"; // Caminho da transição
    var transitionFile = new File(transitionPath);

    if (!transitionFile.exists) {
      return "❌ O arquivo de transição não foi encontrado: " + transitionPath;
    }

    // Importar a transição para o projeto (se ainda não estiver)
    var transitionItem = findItemInProject("A1.mov");
    if (!transitionItem) {
      app.project.importFiles(
        [transitionFile.fsName],
        true,
        app.project.rootItem,
        false
      );
      transitionItem = findItemInProject("A1.mov");
    }

    var currentTime = 0;

    // Adicionar transições entre os vídeos
    for (var i = 0; i < numClips - 1; i++) {
      var clip = primaryTrack.clips[i];
      var nextClip = primaryTrack.clips[i + 1];

      if (clip && nextClip) {
        var clipEnd = clip.end.seconds;
        var transitionDuration = transitionItem.getOutPoint().seconds;

        // Adiciona a transição na trilha acima, no meio entre os vídeos
        transitionTrack.insertClip(
          transitionItem,
          clipEnd - transitionDuration / 2
        );
      }
    }

    return "✅ Transições adicionadas entre os vídeos na trilha superior.";
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

function addSubscribeAndLike() {
  try {
    var sequence = app.project.activeSequence;
    if (!sequence) {
      return "❌ Nenhuma sequência ativa encontrada. Crie uma sequência primeiro.";
    }

    var videoTracks = sequence.videoTracks;
    var numTracks = videoTracks.numTracks;

    // Criar uma nova trilha de vídeo acima da principal, se necessário
    var overlayTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      $.sleep(500); // 🔥 Pequeno delay para garantir que a trilha seja criada
      overlayTrack = sequence.videoTracks[1];
    } else {
      overlayTrack = videoTracks[1];
    }

    var primaryTrack = videoTracks[0];
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Não há clipes suficientes para adicionar overlays.";
    }

    var subscribePath = "C:/MeusArquivos/Overlays/Subscribe.mp4";
    var likePath = "C:/MeusArquivos/Overlays/Like.mp4";

    var subscribeFile = new File(subscribePath);
    var likeFile = new File(likePath);

    if (!subscribeFile.exists || !likeFile.exists) {
      return "❌ Arquivos de overlay não encontrados.";
    }

    // 🔥 Agora importamos primeiro e só depois tentamos usar os arquivos
    var subscribeItem = findOrImportFile("Subscribe.mp4", subscribeFile);
    var likeItem = findOrImportFile("Like.mp4", likeFile);

    if (!subscribeItem || !likeItem) {
      return "❌ Erro ao importar os arquivos de overlay.";
    }

    var overlayIndex = 0;

    // Alternar entre Subscribe e Like nos vídeos certos
    for (var i = 0; i < numClips; i += 2) {
      var clip = primaryTrack.clips[i];

      if (clip) {
        var clipMiddle = clip.start.seconds + clip.duration.seconds / 2;

        // Alternar entre Subscribe e Like
        var overlayItem = overlayIndex % 2 === 0 ? subscribeItem : likeItem;

        try {
          overlayTrack.insertClip(overlayItem, clipMiddle);
        } catch (e) {
          return "❌ Erro ao adicionar overlay na timeline.";
        }

        overlayIndex++;
      }
    }

    return "✅ Overlays 'Inscreva-se' e 'Like' adicionados na trilha superior.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}

function addSubscribeAndLike() {
  try {
    var sequence = app.project.activeSequence;
    if (!sequence) {
      return "❌ Nenhuma sequência ativa encontrada. Crie uma sequência primeiro.";
    }

    var videoTracks = sequence.videoTracks;
    var numTracks = videoTracks.numTracks;

    // Criar uma nova trilha de vídeo acima da principal, se necessário
    var overlayTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      $.sleep(500); // 🔥 Pequeno delay para garantir que a trilha seja criada
      overlayTrack = sequence.videoTracks[1];
    } else {
      overlayTrack = videoTracks[1];
    }

    var primaryTrack = videoTracks[0];
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Não há clipes suficientes para adicionar overlays.";
    }

    var subscribePath =
      "C:/Users/theel/Videos/premiere_test/like sub/Subscribe.mov";
    var likePath = "C:/Users/theel/Videos/premiere_test/like sub/Like.mov";

    var subscribeFile = new File(subscribePath);
    var likeFile = new File(likePath);

    if (!subscribeFile.exists || !likeFile.exists) {
      return "❌ Arquivos de overlay não encontrados.";
    }

    // 🔥 Agora importamos primeiro e só depois tentamos usar os arquivos
    var subscribeItem = findOrImportFile("Subscribe.mov", subscribeFile);
    var likeItem = findOrImportFile("Like.mov", likeFile);

    if (!subscribeItem || !likeItem) {
      return "❌ Erro ao importar os arquivos de overlay.";
    }

    var overlayIndex = 0;

    // Alternar entre Subscribe e Like nos vídeos certos
    for (var i = 0; i < numClips; i += 2) {
      var clip = primaryTrack.clips[i];

      if (clip) {
        var clipMiddle = clip.start.seconds + clip.duration.seconds * 0.75;

        // Alternar entre Subscribe e Like
        var overlayItem = overlayIndex % 2 === 0 ? subscribeItem : likeItem;

        try {
          overlayTrack.insertClip(overlayItem, clipMiddle);
        } catch (e) {
          return "❌ Erro ao adicionar overlay na timeline.";
        }

        overlayIndex++;
      }
    }

    return "✅ Overlays 'Inscreva-se' e 'Like' adicionados na trilha superior.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
}

// 🔥 Função melhorada para encontrar ou importar um arquivo corretamente
function findOrImportFile(fileName, fileObject) {
  var item = findItemInProject(fileName);
  if (!item) {
    app.project.importFiles(
      [fileObject.fsName],
      true,
      app.project.rootItem,
      false
    );
    $.sleep(500); // 🔥 Pequeno delay para garantir que a importação foi concluída
    item = findItemInProject(fileName);
  }
  return item;
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
