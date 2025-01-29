// Criando apenas uma instância de CSInterface
var csInterface = new CSInterface();

/* Adiciona logs no painel */
function addLog(message, isError = false) {
  var logDiv = document.getElementById("log");
  var p = document.createElement("p");
  p.style.color = isError ? "red" : "white";
  p.textContent = message;
  logDiv.appendChild(p);
  logDiv.scrollTop = logDiv.scrollHeight;
}

/* Função para executar comandos no Premiere */
function executeExtendScript(scriptName) {
  csInterface.evalScript(scriptName, function (response) {
    console.log(`🔄 Executando: ${scriptName}`);
    if (!response) {
      addLog("⚠ Nenhuma resposta do Premiere.", true);
    } else if (response.includes("ERRO")) {
      addLog("❌ " + response, true);
    } else {
      addLog("✅ " + response);
    }
  });
}

/* IMPORTAR MÍDIA */
document.getElementById("import-media").addEventListener("click", function () {
  executeExtendScript("importMedia()");
});

/* CRIAR SEQUÊNCIA */
document
  .getElementById("create-sequence")
  .addEventListener("click", function () {
    executeExtendScript("createSequence()");
  });

/* MONTAR TIMELINE */
document
  .getElementById("arrange-timeline")
  .addEventListener("click", function () {
    executeExtendScript("arrangeTimeline()");
  });
