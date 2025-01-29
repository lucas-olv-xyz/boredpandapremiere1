document.getElementById("showMessage").addEventListener("click", function () {
  alert("Botão clicado! 🎬");
});

document.getElementById("importFiles").addEventListener("click", function () {
  var csInterface = new CSInterface();

  // Verifica se está rodando corretamente no Premiere
  console.log("Tentando executar o script JSX...");

  csInterface.evalScript("importFilesFromFolder()", function (result) {
    console.log("Resultado do JSX:", result);
  });
});
