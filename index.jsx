/************************************************************************
 * ExtendScript para Adobe Premiere Pro
 * - Importa mídia do CSV
 * - Cria uma nova sequência
 * - Monta a timeline
 ************************************************************************/

var project = app.project;
if (!project) {
  alert("❌ ERRO: Nenhum projeto aberto!");
  return "ERRO: Nenhum projeto aberto!";
}

/* 🔹 IMPORTAR MÍDIA */
function importMedia() {
  try {
    var filePath = "C:/Users/Usuario/Videos/exemplo.mp4"; // Modifique para o caminho correto
    var file = new File(filePath);
    if (!file.exists) {
      return "❌ ERRO: Arquivo de mídia não encontrado.";
    }

    var imported = project.importFiles([filePath], false, false);
    if (!imported || imported.length === 0) {
      return "❌ ERRO: Falha na importação.";
    }

    return "✅ Mídia importada com sucesso!";
  } catch (e) {
    return "❌ ERRO IMPORTAÇÃO: " + e.message;
  }
}

/* 🔹 CRIAR SEQUÊNCIA */
function createSequence() {
  try {
    var rootItem = project.rootItem;
    if (!rootItem) return "❌ ERRO: Nenhum item raiz encontrado.";

    var numItems = rootItem.children.numItems;
    if (numItems === 0) return "❌ ERRO: Nenhum item encontrado no projeto.";

    for (var i = 0; i < numItems; i++) {
      var item = rootItem.children[i];
      if (item && item.type === ProjectItemType.CLIP) {
        var sequenceName = item.name;
        project.createNewSequenceFromClips(sequenceName, [item]);
        return "✅ Sequência criada com o clipe: " + sequenceName;
      }
    }

    return "❌ ERRO: Nenhum clipe válido encontrado para criar sequência.";
  } catch (e) {
    return "❌ ERRO SEQUÊNCIA: " + e.message;
  }
}

/* 🔹 MONTAR TIMELINE */
function arrangeTimeline() {
  try {
    var sequence = project.activeSequence;
    if (!sequence) return "❌ ERRO: Nenhuma sequência ativa.";

    var videoTrack = sequence.videoTracks[0];
    if (!videoTrack) return "❌ ERRO: Nenhuma trilha de vídeo encontrada.";

    var rootItem = project.rootItem;
    var numItems = rootItem.children.numItems;

    for (var i = 0; i < numItems; i++) {
      var clip = rootItem.children[i];
      if (clip && clip.type === ProjectItemType.CLIP) {
        videoTrack.insertClip(clip, 0);
        return "✅ Timeline montada com clipe: " + clip.name;
      }
    }

    return "❌ ERRO: Nenhum clipe válido encontrado na mídia importada.";
  } catch (e) {
    return "❌ ERRO TIMELINE: " + e.message;
  }
}
