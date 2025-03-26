# 🎬 vert auto-seq

**Uma extensão para Adobe Premiere Pro que acelera seu fluxo de edição de vídeos verticais.**

## 📌 Visão Geral

O `vert auto-seq` é um painel personalizado para o Adobe Premiere Pro que automatiza várias etapas repetitivas na criação de vídeos verticais, como:

- Importação de arquivos via `.txt`
- Inserção dos clipes na timeline ativa
- Adição automática de transições entre vídeos
- Inserção de vídeo de encerramento ("outro")
- Inclusão de overlays de "Subscribe" e "Like"
- (Opcional) Adição de watermark

Tudo isso em poucos cliques, direto de um painel integrado ao Premiere.

---

## ⚡ Funcionalidades

| Botão                        | Ação                                                            |
| ---------------------------- | --------------------------------------------------------------- |
| `1. save TXT`                | Salva os caminhos dos vídeos para um arquivo `.txt`             |
| `2. Import videos`           | Importa os vídeos listados no `.txt` para o projeto do Premiere |
| `3. Add to Timeline`         | Insere os vídeos sequencialmente na timeline ativa              |
| `4. Add transitions + Outro` | Adiciona transições entre os vídeos e um "Outro" ao final       |
| `5. Add Subscribe & Like`    | Insere overlays de "Subscribe" e "Like" ao longo do vídeo       |

---

## 🚀 Como Usar

1. Copie os caminhos dos arquivos de vídeo (via software interno).
2. Cole no campo de texto do painel.
3. Clique em `1. save TXT` para salvar os caminhos.
4. Use os botões `2` a `5` para importar, posicionar e estilizar os vídeos na timeline automaticamente.

> **Dica:** os caminhos usados para os arquivos de transições e overlays são fixos. Verifique se os arquivos estão nos diretórios corretos.

---

## 🧩 Requisitos

- Adobe Premiere Pro (testado na versão XX)
- Windows
- Estrutura de arquivos esperada:
  C:/Users/SEU_USUARIO/Videos/premiere_test/transitions/A1.mov C:/Users/SEU_USUARIO/Videos/premiere_test/transitions/outro.mp4 C:/Users/SEU_USUARIO/Videos/premiere_test/like sub/Subscribe.mov C:/Users/SEU_USUARIO/Videos/premiere_test/like sub/Like.mov

---

## 📁 Estrutura do Projeto

vert-auto-seq/
├── index.html # Interface do painel
├── script.js # Lógica do painel e chamadas JSX
├── hostscript.jsx # Scripts que interagem com o Premiere
├── CSInterface.js # Biblioteca da Adobe para comunicação
└── arquivos.txt # Lista de caminhos dos arquivos de vídeo

---

## 💡 Possíveis Melhorias Futuras

- Compatibilidade com macOS
- Interface com seleção visual de arquivos
- Suporte a múltiplos idiomas
- Integração com media browser do Premiere
- Feedback visual sem `alert()`

---

## ✍️ Autor

Feito com 💻 e ☕ por Lucas Oliveira  
Quer contribuir, testar ou sugerir melhorias? Fique à vontade para abrir uma issue ou PR.

---
