# 🎬 vert auto-seq

**An extension for Adobe Premiere Pro that speeds up your vertical video editing workflow.**

## 📌 Overview

`vert auto-seq` is a custom panel for Adobe Premiere Pro that automates several repetitive steps in the creation of vertical videos, such as:

- Importing files via `.txt`
- Inserting clips into the active timeline
- Automatically adding transitions between clips
- Adding an outro video
- Including "Subscribe" and "Like" overlays
- (Optional) Adding a watermark

All of this in just a few clicks, directly from a panel integrated into Premiere.

---

## ⚡ Features

| Button                       | Action                                                           |
| --------------------------- | ---------------------------------------------------------------- |
| `1. save TXT`               | Saves the video file paths into a `.txt` file                    |
| `2. Import videos`          | Imports the videos listed in the `.txt` into the Premiere project|
| `3. Add to Timeline`        | Sequentially inserts the videos into the active timeline         |
| `4. Add transitions + Outro`| Adds transitions between the clips and an outro at the end       |
| `5. Add Subscribe & Like`   | Inserts "Subscribe" and "Like" overlays throughout the video     |

---

## 🚀 How to Use

1. Copy the paths of the video files (using internal software).
2. Paste them into the panel's text field.
3. Click `1. save TXT` to save the paths.
4. Use buttons `2` to `5` to import, arrange, and style the videos on the timeline automatically.

> **Tip:** The file paths for transitions and overlays are fixed. Make sure the files are in the correct directories.

---

## 🧩 Requirements

- Adobe Premiere Pro (tested on version XX)
- Windows
- Expected file structure:
  ```
  C:/Users/YOUR_USERNAME/Videos/premiere_test/transitions/A1.mov  
  C:/Users/YOUR_USERNAME/Videos/premiere_test/transitions/outro.mp4  
  C:/Users/YOUR_USERNAME/Videos/premiere_test/like sub/Subscribe.mov  
  C:/Users/YOUR_USERNAME/Videos/premiere_test/like sub/Like.mov  
  ```

---

## 📁 Project Structure

```
vert-auto-seq/
├── index.html         # Panel interface
├── script.js          # Panel logic and JSX calls
├── hostscript.jsx     # Scripts that interact with Premiere
├── CSInterface.js     # Adobe library for communication
└── arquivos.txt       # List of video file paths
```

---

## 💡 Possible Future Improvements

- macOS compatibility  
- Visual file selection interface  
- Multi-language support  
- Integration with Premiere’s Media Browser  
- Visual feedback without using `alert()`

---

## ✍️ Author

Made with 💻 and ☕ by Lucas Oliveira  
Want to contribute, test, or suggest improvements? Feel free to open an issue or PR.

---
