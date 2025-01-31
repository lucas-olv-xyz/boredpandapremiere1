document.getElementById("importTXT").addEventListener("click", function () {
  var csInterface = new CSInterface();

  console.log("Executando importação via TXT...");

  csInterface.evalScript("importFilesFromTXT()", function (result) {
    console.log("Resultado do JSX:", result);
    alert(result); // Exibe o resultado da importação
  });
});

document.getElementById("addToTimeline").addEventListener("click", function () {
  var csInterface = new CSInterface();

  console.log("Adicionando arquivos à timeline...");

  csInterface.evalScript("addFilesToTimeline()", function (result) {
    console.log("Resultado do JSX:", result);
    alert(result); // Exibe o resultado da importação
  });
});

document.getElementById("saveTXT").addEventListener("click", function () {
  var filePaths = document.getElementById("filePaths").value;

  if (!filePaths.trim()) {
    alert("⚠️ Nenhum caminho foi inserido.");
    return;
  }

  var csInterface = new CSInterface();
  csInterface.evalScript(
    "saveFilePathsToTXT(" + JSON.stringify(filePaths) + ")",
    function (result) {
      console.log("Resultado do JSX:", result);
      alert(result);
    }
  );
});

document
  .getElementById("addTransitions")
  .addEventListener("click", function () {
    var csInterface = new CSInterface();

    console.log("Adicionando transições e 'Outro'...");

    csInterface.evalScript("addTransitionsAbove()", function (result) {
      console.log("Resultado do JSX:", result);
      alert(result);
    });
  });

document
  .getElementById("addSubscribeLike")
  .addEventListener("click", function () {
    var csInterface = new CSInterface();

    console.log("Adicionando overlays de Subscribe e Like...");

    csInterface.evalScript("addSubscribeAndLike()", function (result) {
      console.log("Resultado do JSX:", result);
      alert(result); // Exibe o resultado da importação
    });
  });

// document.getElementById("addWatermark").addEventListener("click", function () {
//   var csInterface = new CSInterface();

//   console.log("Adicionando Watermark ao vídeo...");

//   csInterface.evalScript("addWatermark()", function (result) {
//     console.log("Resultado do JSX:", result);
//     alert(result); // Exibe o resultado da importação
//   });
// });
