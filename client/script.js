document.getElementById("importTXT").addEventListener("click", function () {
  var csInterface = new CSInterface();

  console.log("Executando importação via TXT...");

  csInterface.evalScript("importFilesFromTXT()", function (result) {
    console.log("Resultado do JSX:", result);
    alert(result); // Exibe o resultado da importação
  });
});
