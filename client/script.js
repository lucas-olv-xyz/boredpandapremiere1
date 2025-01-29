document.getElementById("importFiles").addEventListener("click", function () {
  var csInterface = new CSInterface();

  console.log("Executando importação automática...");

  csInterface.evalScript(
    "importFilesFromPredefinedFolder()",
    function (result) {
      console.log("Resultado do JSX:", result);
      alert(result); // Exibe o resultado da importação
    }
  );
});
