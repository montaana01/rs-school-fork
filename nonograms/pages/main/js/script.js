import { Nonograms } from "./components/Nonograms.js";

const GAME = new Nonograms();
GAME.initUi();

fetch("./json/solutions.json")
  .then((response) => response.json())
  .then((data) => {
    GAME.initSolutions(data);
    //todo: when app load show user message for 5 sec about game
    //game.currentGame.showStartMessage(300);
  })
  // eslint-disable-next-line no-console
  .catch((error) => console.log(`Something went wrong: ${error}`));

// eslint-disable-next-line no-console
console.log(
  "Maximum score for the task: 250 points\n" +
    "\n" +
    "Basic scope +80 points\n" +
    " layout, design, responsive UI: +20\n" +
    " at the beginning state of the game, the frame has size 5x5. The sequence of numbers is logically arranged and help the player solve the nonogram: +20\n" +
    " cells and clues are divided by dividers as described in Basic block: +5\n" +
    " when user clicks on cells using mouse left-click - it should be mark as dark. When user click on dark cell - it should be mark as empty (white) cell: +15\n" +
    " the game should end when the player reveals all black cells correctly and related message is displayed at the end of the game: +20\n" +
    "Advanced scope +90 points\n" +
    " the game should have at least 5 templates for easy level (5x5) and the player is able to choose what picture he/she wants to solve. +15\n" +
    " a player is able to fill in a cell in the grid changing the color of the grid to crossed-cell(X) using right mouse-click. Context menu doesn't appear: +20\n" +
    " the game can be restarted without reloading the page: +15\n" +
    " game duration is displayed, stop-watch will start after first click on field (not on clues) and related message is displayed at the end of the game: +10\n" +
    " sound accompaniment (on/off) for every events (see Advanced block): +15\n" +
    ' implemented saving the state of the latest game and "Continue last game" button: +15\n' +
    "Hacker scope +80 points\n" +
    " option to choose different themes for the game board (dark/light themes): +15\n" +
    " ability to change the size (5x5, 10x10, 15x15) is implemented and there are least 5 templates for each level: +20\n" +
    " implemented saving the latest 5 win results with sorting: +15\n" +
    ' "random game" button is implemented. When player clicks on button - the random template appears (both template and level must be chosen randomly by algorithm): +15\n' +
    ' "Solution" button is implemented. When player clicks on button - the field is filled in cells with right solution. Such games is not recorded into winning table: +15\n'
);
