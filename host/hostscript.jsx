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

    filePaths.reverse();

    var project = app.project;
    var sequence = project.activeSequence;

    if (!sequence) {
      return "❌ Error: No active sequence found. Please create a sequence first.";
    }

    var videoTrack = sequence.videoTracks[0];
    if (!videoTrack) {
      return "❌ Error: No available video track.";
    }

    var currentTime = sequence.getPlayerPosition();
    var addedClips = 0;

    // 🔥 Add videos to timeline without modifying layout
    for (var i = 0; i < filePaths.length; i++) {
      var clipName = filePaths[i].split("/").pop().split("\\").pop();
      var item = findItemInProject(clipName);

      if (item) {
        try {
          videoTrack.insertClip(item, currentTime);
          currentTime += item.getOutPoint().seconds;
          addedClips++;
        } catch (e) {
          return "❌ Error: Failed to add " + clipName + " to the timeline.";
        }
      } else {
        return "❌ Error: File not found in the project: " + clipName;
      }
    }

    if (addedClips === 0) {
      return "⚠️ Warning: No clips were added to the timeline.";
    }

    return "Success: " + addedClips + " clips added to the timeline.";
  } catch (e) {
    return "❌ Unexpected error: " + e.toString();
  }
}

function saveFilePathsToTXT(filePaths) {
  try {
    var txtPath =
      "C:/Program Files (x86)/Common Files/Adobe/CEP/extensions/boredpanda/arquivos.txt"; // Fixed path
    var txtFile = new File(txtPath);

    if (!txtFile.open("w")) {
      // Open the file in write mode
      return "❌ Error: Failed to open the TXT file for writing.";
    }

    txtFile.write(filePaths.replace(/\n/g, "\r")); // Write the file paths to the TXT
    txtFile.close();

    return "Success: File paths saved successfully!";
  } catch (e) {
    return "❌ Unexpected error: " + e.toString();
  }
}

function addTransitionsAbove() {
  try {
    var sequence = app.project.activeSequence;
    if (!sequence) {
      return "❌ Error: No active sequence found. Please create a sequence first.";
    }

    var videoTracks = sequence.videoTracks;
    var numTracks = videoTracks.numTracks;

    // Create a video track above the main one if needed
    var transitionTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      $.sleep(500); // 🔥 Delay to ensure the track is created
      transitionTrack = sequence.videoTracks[1];
    } else {
      transitionTrack = videoTracks[1];
    }

    var primaryTrack = videoTracks[0]; // First track where videos are located
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Warning: Not enough clips to add transitions.";
    }

    var transitionPath =
      "//192.168.1.245/storage_kauno.g/SHARED ASSETS/01_Channel Branding/1 GENERIC ZOOM TRANSITIONS/CENTER IN.mov";
    var outroPath = "//192.168.1.245/storage_kauno.g/SHARED ASSETS/01_Channel Branding/1 GENERIC ZOOM TRANSITIONS/Universal Outro.mp4";

    var transitionFile = new File(transitionPath);
    var outroFile = new File(outroPath);

    if (!transitionFile.exists) {
      return "❌ Error: Transition file not found: " + transitionPath;
    }
    if (!outroFile.exists) {
      return "❌ Error: 'Outro' file not found: " + outroPath;
    }

    // Import files if necessary
    var transitionItem = findOrImportFile("CENTER IN.mov", transitionFile);
    var outroItem = findOrImportFile("Universal Outro.mp4", outroFile);

    if (!transitionItem || !outroItem) {
      return "❌ Error importing transition or outro files.";
    }

    var currentTime = 0;

    // Add transitions between clips
    for (var i = 0; i < numClips - 1; i++) {
      var clip = primaryTrack.clips[i];
      var nextClip = primaryTrack.clips[i + 1];

      if (clip && nextClip) {
        var clipEnd = clip.end.seconds;
        var transitionDuration = transitionItem.getOutPoint().seconds;

        // Place the transition above, between the clips
        transitionTrack.insertClip(
          transitionItem,
          clipEnd - transitionDuration / 2
        );
      }
    }

    // 🔥 Add the "Outro" after the last video
    var lastClip = primaryTrack.clips[numClips - 1];
    if (lastClip) {
      var outroPosition = lastClip.end.seconds;
      transitionTrack.insertClip(outroItem, outroPosition);
    }

    return "✅ Success: Transitions added and 'Outro' placed at the end.";
  } catch (e) {
    return "❌ Unexpected error: " + e.toString();
  }
}

function addSubscribeAndLike() {
  try {
    var sequence = app.project.activeSequence;
    if (!sequence) {
      return "❌ Error: No active sequence found. Please create a sequence first.";
    }

    var videoTracks = sequence.videoTracks;
    var numTracks = videoTracks.numTracks;

    // Create a new video track above the main one if needed
    var overlayTrack;
    if (numTracks < 2) {
      sequence.addVideoTrack();
      $.sleep(500); // 🔥 Small delay to ensure the track is created
      overlayTrack = sequence.videoTracks[1];
    } else {
      overlayTrack = videoTracks[1];
    }

    var primaryTrack = videoTracks[0];
    var numClips = primaryTrack.clips.numItems;

    if (numClips < 2) {
      return "⚠️ Warning: Not enough clips to add overlays.";
    }

    var subscribePath =
      "Y:/SHARED ASSETS/Like Subscribe Graphics/subscribe.mov";
    var likePath = "Y:/SHARED ASSETS/Like Subscribe Graphics/like.mov";

    var subscribeFile = new File(subscribePath);
    var likeFile = new File(likePath);

    if (!subscribeFile.exists || !likeFile.exists) {
      return "❌ Error: Overlay files not found.";
    }

    // 🔥 Import first, then use the files
    var subscribeItem = findOrImportFile("subscribe.mov", subscribeFile);
    var likeItem = findOrImportFile("like.mov", likeFile);

    if (!subscribeItem || !likeItem) {
      return "❌ Error importing overlay files.";
    }

    var overlayIndex = 0;

    // Alternate between Subscribe and Like overlays
    for (var i = 0; i < numClips; i += 2) {
      var clip = primaryTrack.clips[i];

      if (clip) {
        var clipMiddle = clip.start.seconds + clip.duration.seconds * 0.75;

        // Alternate between Subscribe and Like
        var overlayItem = overlayIndex % 2 === 0 ? subscribeItem : likeItem;

        try {
          overlayTrack.insertClip(overlayItem, clipMiddle);
        } catch (e) {
          return "❌ Error adding overlay to the timeline.";
        }

        overlayIndex++;
      }
    }

    return "✅ Success: 'Subscribe' and 'Like' overlays added to the upper track.";
  } catch (e) {
    return "❌ Unexpected error: " + e.toString();
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
    try {
      app.project.importFiles(
        [fileObject.fsName],
        true,
        app.project.rootItem,
        false
      );
      $.sleep(500); // 🔥 Small delay to ensure the import is complete
      item = findItemInProject(fileName);
    } catch (e) {
      return "❌ Error: Failed to import " + fileName;
    }
  }

  if (!item) {
    return "❌ Error: " + fileName + " could not be found after import.";
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

  return null; // 🔥 Returns null if the item is not found
}
