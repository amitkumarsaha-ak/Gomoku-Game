# 🎮 Gomoku Game

> A browser-based implementation of the classic **Gomoku (Five in a Row)** board game built with HTML, CSS, and JavaScript.

## 📌 Overview

**Gomoku Game** is a lightweight web-based board game that recreates the classic Gomoku/Five-in-a-Row gameplay directly in the browser.

The game is implemented as a frontend-only project using:

* HTML
* CSS
* JavaScript
* Audio effects

The project repository is publicly available on GitHub and currently contains the core game files along with sound effects.

**Repository:**
https://github.com/amitkumarsaha-ak/Gomoku-Game

---

## ✨ Features

### 🎲 Gomoku Gameplay

The project implements the basic Gomoku board-game experience, where players place pieces on a board and attempt to create a sequence of five pieces in a row.

### 🔄 Restart Game

The game includes a restart mechanism that allows players to start a new game without refreshing the browser.

### 🔊 Sound Effects

The repository includes several audio files used for game interactions:

* `click.mp3`
* `restart.mp3`
* `start.mp3`
* `win.mp3`

These provide audio feedback during different game events.

### 🌐 Browser-Based

No backend server or database is required for the core game.

The game can be opened directly in a modern web browser.

---

## 🛠️ Technologies Used

### Frontend

* **HTML5** — game structure and board interface
* **CSS3** — board layout and visual styling
* **JavaScript** — game logic and player interaction
* **HTML Audio** — game sound effects

The repository currently consists of HTML, CSS, JavaScript, and MP3 assets.

---

## 🏗️ System Architecture

```text
                  ┌──────────────────────┐
                  │      Web Browser     │
                  └──────────┬───────────┘
                             │
                             ▼
                  ┌──────────────────────┐
                  │      index.html      │
                  │   Game Interface     │
                  └──────────┬───────────┘
                             │
                ┌────────────┴────────────┐
                │                         │
                ▼                         ▼
       ┌─────────────────┐       ┌─────────────────┐
       │    Style.css    │       │    script.js    │
       │  Visual Design  │       │   Game Logic    │
       └─────────────────┘       └────────┬────────┘
                                         │
                                         ▼
                                ┌─────────────────┐
                                │  Audio Effects  │
                                │ MP3 Sound Files │
                                └─────────────────┘
```

---

## 📁 Project Structure

The current repository contains the following files:

```text
Gomoku-Game/
│
├── index.html
├── Style.css
├── script.js
│
├── click.mp3
├── start.mp3
├── restart.mp3
└── win.mp3
```

### File Description

| File          | Description                   |
| ------------- | ----------------------------- |
| `index.html`  | Main game interface           |
| `Style.css`   | Game styling and layout       |
| `script.js`   | Game logic and interactions   |
| `click.mp3`   | Piece/click interaction sound |
| `start.mp3`   | Game-start sound              |
| `restart.mp3` | Restart-game sound            |
| `win.mp3`     | Winning-event sound           |

---

## 🎮 How to Play

### Objective

The objective of Gomoku is to create a continuous line of **five pieces** before the opponent does.

The winning line can generally be formed:

* Horizontally
* Vertically
* Diagonally

### Basic Gameplay

```text
Start Game
    ↓
Player places a piece
    ↓
Board updates
    ↓
Check winning condition
    ↓
 ┌───────────────┐
 │               │
 ▼               ▼
No Winner      Five in Row
 │               │
 ▼               ▼
Next Turn       Win
 │
 ▼
Continue Game
```

---

## 🚀 Running the Game

Because this is a frontend project, there is no dependency installation or backend setup required for basic usage.

### Option 1 — Open Directly

Clone the repository:

```bash
git clone https://github.com/amitkumarsaha-ak/Gomoku-Game.git
```

Navigate into the directory:

```bash
cd Gomoku-Game
```

Then open:

```text
index.html
```

in your browser.

---

### Option 2 — VS Code Live Server

For development, you can use the **Live Server** extension in Visual Studio Code.

1. Open the project in VS Code.
2. Install the Live Server extension.
3. Right-click `index.html`.
4. Select **Open with Live Server**.
5. The game will open in your browser.

---

## 🔄 Game Flow

```text
                ┌──────────────┐
                │  Start Game  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Player Turn  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Place Piece  │
                └──────┬───────┘
                       │
                       ▼
                ┌──────────────┐
                │ Check Winner │
                └──────┬───────┘
                       │
                 ┌─────┴─────┐
                 │           │
              No Win       Win
                 │           │
                 ▼           ▼
            Next Turn    Win Sound
                 │           │
                 └─────┐     ▼
                       │   Game End
                       ▼
                    Continue
```

---

## 🔊 Audio System

The project includes four MP3 sound effects:

```text
click.mp3
start.mp3
restart.mp3
win.mp3
```

These sounds can be used to provide feedback for:

* Player interactions
* Game start
* Game restart
* Winning state

The audio assets are included directly in the repository.

---

## 🎨 User Interface

The interface is implemented using custom HTML and CSS rather than a frontend framework.

The visual layer is separated into:

```text
HTML
 ↓
Structure
 ↓
CSS
 ↓
Board + Controls + Visual Styling
 ↓
JavaScript
 ↓
Game Interaction
```

This keeps the project lightweight and easy to understand for beginners learning browser-based game development.

---

## 🧩 Project Architecture

The project follows a simple separation of concerns:

### `index.html`

Responsible for:

* Page structure
* Game interface
* Game elements
* Audio references

### `Style.css`

Responsible for:

* Layout
* Board styling
* Game appearance
* Buttons and interface styling

### `script.js`

Responsible for:

* Game interaction
* Player turns
* Board updates
* Winning-condition logic
* Restart functionality
* Sound-event handling

---

## ⚡ Performance

The game is a lightweight client-side application.

Since the core gameplay runs directly inside the browser:

* No server requests are required during gameplay.
* No database is required.
* No external game engine is required.
* Game interaction is handled locally with JavaScript.

This makes the project suitable for running on a wide range of modern browsers.

---

## ⚠️ Current Project Scope

The current GitHub repository is a compact frontend project with the following core files:

```text
index.html
Style.css
script.js
```

along with four audio assets.

The repository does not currently provide a project description, website URL, or topic metadata on its GitHub About section.

---

## 🔮 Future Improvements

Potential improvements for the project include:

* Add single-player mode against AI.
* Add multiple AI difficulty levels.
* Add Minimax-based AI.
* Add Alpha-Beta pruning for stronger AI performance.
* Add player-name input.
* Add score tracking.
* Add game history.
* Add undo functionality.
* Add draw detection.
* Add configurable board sizes.
* Add responsive mobile controls.
* Add game statistics.
* Add dark/light themes.
* Add animations for winning combinations.
* Add online multiplayer.
* Add WebSocket-based real-time gameplay.
* Add an AI move recommendation system.

For AI-based Gomoku implementations, Minimax and Alpha-Beta pruning are commonly used approaches for game-playing agents.

---

## 🤝 Contributing

Contributions and improvements are welcome.

### Development Workflow

1. Fork the repository.
2. Clone your fork:

```bash
git clone https://github.com/YOUR_USERNAME/Gomoku-Game.git
```

3. Create a feature branch:

```bash
git checkout -b feature/your-feature
```

4. Make your changes.
5. Test the game in a modern browser.
6. Commit your changes:

```bash
git commit -m "Add: your feature"
```

7. Push the branch:

```bash
git push origin feature/your-feature
```

8. Open a Pull Request.

---

## 📄 License

No specific open-source license is currently indicated in the repository information.

If you intend to distribute the project as open source, add an appropriate `LICENSE` file and update this section.

---

## 👨‍💻 Author

**Amit Kumar Saha**

GitHub:
https://github.com/amitkumarsaha-ak

Project Repository:
https://github.com/amitkumarsaha-ak/Gomoku-Game

---

## ⭐ Support

If you find this project useful for learning or experimentation, consider giving the repository a ⭐ on GitHub.

---

## 📌 Disclaimer

This project is intended for **educational and entertainment purposes**. It is a browser-based implementation of the Gomoku board game and does not provide any external service or backend functionality.
