function importFilesFromTXT() {
  try {
    var txtPath =
      "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/boredpanda/arquivos.txt";
    var txtFile = new File(txtPath);

    if (!txtFile.exists) {
      return "❌ Error: TXT file not found: " + txtPath;
    }

    txtFile.open("r");
    var filePaths = [];

    while (!txtFile.eof) {
      var line = txtFile.readln();
      if (line && line.length > 0) {
        filePaths.push(line);
      }
    }
    txtFile.close();

    if (filePaths.length === 0) {
      return "⚠️ Warning: The TXT file is empty or contains no valid paths.";
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
          return "❌ Error importing: " + file.fsName;
        }
      } else {
        return "❌ Error: File not found: " + filePaths[i];
      }
    }

    if (importedFiles === 0) {
      return "⚠️ Warning: No files were imported.";
    }

    return "Success: " + importedFiles + " files imported.";
  } catch (e) {
    return "❌ Unexpected error: " + e.toString();
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

    txtFile.open("r");
    var filePaths = [];

    while (!txtFile.eof) {
      var line = txtFile.readln();
      if (line && line.length > 0) {
        filePaths.push(line);
      }
    }
    txtFile.close();

    if (filePaths.length === 0) {
      return "⚠️ O TXT está vazio ou não contém caminhos válidos.";
    }

    filePaths.reverse();

    var project = app.project;
    var sequence = project.activeSequence;

    if (!sequence) {
      return "❌ Nenhuma sequência ativa encontrada. Crie uma sequência primeiro.";
    }

    var videoTrack = sequence.videoTracks[0];
    if (!videoTrack) {
      return "❌ Nenhuma trilha de vídeo disponível.";
    }

    var currentTime = sequence.getPlayerPosition();

    // 🔥 Apenas adiciona os vídeos sem mexer em layout
    for (var i = 0; i < filePaths.length; i++) {
      var clipName = filePaths[i].split("/").pop().split("\\").pop();
      var item = findItemInProject(clipName);

      if (item) {
        try {
          videoTrack.insertClip(item, currentTime);
          currentTime += item.getOutPoint().seconds;
        } catch (e) {
          return "❌ Erro ao adicionar " + clipName + " à timeline.";
        }
      } else {
        return "❌ Arquivo não encontrado no projeto: " + clipName;
      }
    }

    return "✅ Arquivos adicionados à timeline sem modificar layout.";
  } catch (e) {
    return "Erro inesperado: " + e.toString();
  }
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

    // Criar uma trilha de vídeo acima da principal, se necessário
    var transitionTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      $.sleep(500); // 🔥 Delay para garantir que a trilha seja criada
      transitionTrack = sequence.videoTracks[1];
    } else {
      transitionTrack = videoTracks[1];
    }

    var primaryTrack = videoTracks[0]; // Primeira trilha onde estão os vídeos
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Não há clipes suficientes para adicionar transições.";
    }

    var transitionPath =
      "C:/Users/theel/Videos/premiere_test/transitions/A1.mov";
    var outroPath = "C:/Users/theel/Videos/premiere_test/transitions/outro.mp4";

    var transitionFile = new File(transitionPath);
    var outroFile = new File(outroPath);

    if (!transitionFile.exists) {
      return "❌ O arquivo de transição não foi encontrado: " + transitionPath;
    }
    if (!outroFile.exists) {
      return "❌ O arquivo 'Outro' não foi encontrado: " + outroPath;
    }

    // Importar os arquivos, se necessário
    var transitionItem = findOrImportFile("A1.mov", transitionFile);
    var outroItem = findOrImportFile("outro.mp4", outroFile);

    if (!transitionItem || !outroItem) {
      return "❌ Erro ao importar os arquivos.";
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

    // 🔥 Agora adicionamos o "Outro" depois do último vídeo
    var lastClip = primaryTrack.clips[numClips - 1];
    if (lastClip) {
      var outroPosition = lastClip.end.seconds;
      transitionTrack.insertClip(outroItem, outroPosition);
    }

    return "✅ Transições adicionadas e 'Outro' colocado no final.";
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

// function addWatermark() {
//   try {
//     var sequence = app.project.activeSequence;
//     if (!sequence) return "❌ Nenhuma sequência ativa.";

//     var videoTracks = sequence.videoTracks;
//     var numTracks = videoTracks.numTracks;

//     // 🔥 Usar a Track 3 se existir, caso contrário, usar a última disponível
//     var watermarkTrack;
//     if (numTracks >= 3) {
//       watermarkTrack = videoTracks[2]; // Track 3 (índice 2)
//     } else {
//       watermarkTrack = videoTracks[numTracks - 1]; // Última trilha disponível
//     }

//     var primaryTrack = videoTracks[0]; // Primeira trilha onde estão os vídeos
//     var numClips = primaryTrack.clips.numItems;

//     if (numClips < 1) {
//       return "⚠️ Não há clipes suficientes para adicionar a Watermark.";
//     }

//     var watermarkPath =
//       "C:/Users/theel/Videos/premiere_test/watermark/watermark.png";
//     var watermarkFile = new File(watermarkPath);

//     if (!watermarkFile.exists) {
//       return "❌ Arquivo da Watermark não encontrado.";
//     }

//     // 🔥 Importar a Watermark se ainda não estiver no projeto
//     var watermarkItem = findOrImportFile("watermark.png", watermarkFile);

//     if (!watermarkItem) {
//       return "❌ Erro ao importar a Watermark.";
//     }

//     // 🔥 Encontrar o primeiro e o último clipe da timeline
//     var firstClip = primaryTrack.clips[0]; // Primeiro clipe
//     var lastClip = primaryTrack.clips[numClips - 1]; // Último clipe (provavelmente o "Outro")

//     if (!firstClip || !lastClip) {
//       return "❌ Erro ao identificar início ou fim da Watermark.";
//     }

//     var startPosition = firstClip.start.seconds; // Começo do primeiro vídeo
//     var endPosition = lastClip.end.seconds; // 🔥 Pegamos o fim EXATO do último clipe

//     // 🔥 Inserir a Watermark na trilha 3 ou na última trilha disponível
//     var watermarkClip = watermarkTrack.insertClip(watermarkItem, startPosition);
//     if (!watermarkClip) {
//       return "❌ Erro ao inserir a Watermark na timeline.";
//     }

//     // 🔥 Ajustar a duração da Watermark manualmente
//     watermarkClip.end = endPosition; // 🔥 Ajusta para cobrir todo o vídeo

//     return "✅ Watermark adicionada na Track 3, cobrindo todo o vídeo!";
//   } catch (e) {
//     return "Erro inesperado: " + e.toString();
//   }
// }

// 🔥 Função para encontrar ou importar um arquivo corretamente
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

// 🔥 Função auxiliar para encontrar um arquivo no projeto
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
