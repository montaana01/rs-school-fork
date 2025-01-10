const GAME_NAME = "Simon says";

let round = 0;
let isGameStarted = false;

/*
* FOR LOCK ELEMENTS WHILE TYPING SEQUENCE
*/
let isElementsLocked = false;

function lockElement(element, lock = true) {
  isElementsLocked = lock;
  element.style.cursor = lock ? 'not-allowed' : 'pointer';
}

/*
* Creating html markup for page
* Sections like header main and footer
*/
const BODY = document.body;

const HEADER = BODY.appendChild(document.createElement("header"));
const MAIN = BODY.appendChild(document.createElement("main"));
const FOOTER = BODY.appendChild(document.createElement("footer"));
const SCRIPT = document.querySelector("script");
if (SCRIPT) {
  BODY.appendChild(SCRIPT);
}
/*
* Fill up header section
*/
const headerContainer = HEADER.appendChild(document.createElement("div"));
headerContainer.classList.add("container");
const headerWrapper = headerContainer.appendChild(document.createElement("div"));
headerWrapper.classList.add("header__wrapper");

// header wrapper
const headerLogo = headerWrapper.appendChild(document.createElement("div"));
const headerTitle = headerWrapper.appendChild(document.createElement("div"));
const headerSwitcher = headerWrapper.appendChild(document.createElement("div"));

headerWrapper.childNodes.forEach((item) => {
  item.classList.add("header__wrapper-item")
})

// logo part
let logoImage = document.createElement("img");
logoImage.onclick = function () {
  window.location = "./";
}
Object.assign(logoImage, {
  className: "header__wrapper-item__logo link",
  src: "./../../assets/images/simon-says-logo.png",
  alt: GAME_NAME,
})

headerLogo.appendChild(logoImage);

// central part
let centralHeader = document.createElement("div");
centralHeader.classList.add("header__wrapper-item__central");
centralHeader.appendChild(document.createElement("h3"));
centralHeader.querySelector('h3').textContent = "round";
centralHeader.appendChild(document.createElement("h4"));
centralHeader.querySelector('h4').textContent = "1\n2\n3\n4\n5";

function getRoundTable(isGameStarted) {
  return isGameStarted ? centralHeader.classList.toggle("pos-start") : centralHeader.classList.toggle("pos-start");
}

function updateRoundTable(round) {
  centralHeader.querySelector('h4').className = '';
  centralHeader.querySelector('h4').classList.add(`num${round}`)
}

headerTitle.appendChild(centralHeader);

// difficult switcher
let difficult = "easy";

let switcher = document.createElement("div");
switcher.className = "header__wrapper-item__switcher";

let switcherArea = document.createElement("div");
switcherArea.className = "header__wrapper-item__switcher__area";
let switcherPoint = document.createElement("div");
switcherPoint.className = "header__wrapper-item__switcher__point";
switcherArea.appendChild(switcherPoint);
let switcherText = document.createElement("div");
switcherText.className = "header__wrapper-item__switcher__text";

switcher.appendChild(switcherArea);
switcher.appendChild(switcherText);

const levels = ['easy', 'medium', 'hard'];
let currentLevel = 0;

function updateSwitcher() {
  switcherPoint.classList.remove(`pos${currentLevel + 2}`);
  switcherPoint.classList.remove(`pos${currentLevel + 1}`);
  switcherPoint.classList.remove(`pos${currentLevel - 1}`);
  switcherPoint.classList.add(`pos${currentLevel}`);
  difficult = levels[currentLevel];
  switcherText.textContent = difficult;
}

switcherPoint.addEventListener('click', () => {
  if (isElementsLocked) return;
  currentLevel = (currentLevel + 1) % levels.length;
  updateSwitcher();
});

updateSwitcher();

headerSwitcher.appendChild(switcher);

/*
* Fill up main section
*/
const mainSection = MAIN.appendChild(document.createElement("section"));
mainSection.classList.add("main");
const mainContainer = mainSection.appendChild(document.createElement("div"));
mainContainer.classList.add("container");
const mainWrapper = mainContainer.appendChild(document.createElement("div"));
mainWrapper.classList.add("main__wrapper");

let mainTitle = mainWrapper.appendChild(document.createElement("h2"));
mainTitle.textContent = "The Game...";

/*
* Fill up footer section
*/
const footerContainer = FOOTER.appendChild(document.createElement("div"));
footerContainer.classList.add("container");
const footerWrapper = footerContainer.appendChild(document.createElement("div"));
footerWrapper.classList.add("footer__wrapper");

let footerGitLogo = document.createElement("img");
footerGitLogo.onclick = function () {
  window.open("https://github.com/montaana01", "_blank");
}
Object.assign(footerGitLogo, {
  className: "footer__wrapper-item link",
  src: "./../../assets/icons/github.svg",
  alt: "Github icon",
})

let footerCopyright = document.createElement("p");
footerCopyright.className = "footer__wrapper-item";
footerCopyright.textContent = `YakovlevDev © ${new Date().getFullYear()}`;

let footerRSSchool = document.createElement("img");
footerRSSchool.onclick = function () {
  window.open("https://rs.school", "_blank");
}
Object.assign(footerRSSchool, {
  className: "footer__wrapper-item link",
  src: "./../../assets/icons/rss-logo.svg",
  alt: "Made in Rolling Scopes School",
})

footerWrapper.appendChild(footerGitLogo);
footerWrapper.appendChild(footerCopyright);
footerWrapper.appendChild(footerRSSchool)

console.log("CrossCheck Criteria (150 points)\n" +
  "It is recommended to print the right answer for each round in the browser's console to facilitate the cross-check process.\n" +
  "\n" +
  " The game includes 5 rounds, and the rounds counter accurately displays the current round number and updates it after each successful round completion: +5\n" +
  " The initial game screen is implemented correctly (presents the \"Start\" button, the possibility to choose the level of difficulty and a virtual keyboard) and the virtual keyboard updates accordingly when the difficulty is changed: +10\n" +
  " Clicking the “Start” button initiates the first round with a sequence of 2 symbols and disables the ability to change the difficulty after starting the game: +5\n" +
  " When the first rounds starts, there is an indicator of the current level of difficulty and a rounds counter, an input that reflects the sequence typed by the user, as well as the \"Repeat the sequence\" and \"New game\" buttons. The \"Start\" button disappears: +5\n" +
  " Each sequence is shown by simulating the typing of the corresponding symbols on the virtual keyboard. Each symbol in the sequence is accurately simulated by highlighting its corresponding key on the virtual keyboard for at least 0.3 seconds: +5\n" +
  " The “Repeat the sequence” button is always enabled at the beginning of each new round, can be clicked only once per round and becomes disabled after a single use: +5\n" +
  " The “Repeat the sequence” button reproduces the current sequence when clicked, the feedback message, if any, is removed, and the input with previously inserted sequence (if it's not empty) is cleared so that the user can start typing the sequence again from the beginning: +10\n" +
  " While the sequence is being displayed through the typing simulation, no user input (clicking or pressing keys) is possible, and all buttons are disabled. After the typing simulation completes, all buttons are re-enabled and user input is permitted. However, if the user has previously clicked the “Repeat the sequence” button during the current round, that button stays disabled: +5\n" +
  " The user can play the game by using the virtual keyboard, and the corresponding keys are highlighted upon clicking: +20\n" +
  " The user can play the game by using the physical keyboard, and the corresponding virtual keys are briefly highlighted upon pressing: +20\n" +
  " Each symbol entered by the user is immediately displayed in a dedicated, non-editable input field. The input reflects all the symbols inserted by the user, in the order they were entered: +5\n" +
  " Only one incorrect attempt per round is allowed, and after a second incorrect attempt, the “Repeat the sequence” button becomes disabled (if it's not already): +5\n" +
  " The \"New game\" button is always accessible (except during the typing simulation), allowing the user to restart the game from the initial game screen at any moment: +5\n" +
  " A correct answer is automatically recognized after the user presses the last key in the sequence, while an incorrect one is immediately detected upon the first wrong key press in the sequence: +10\n" +
  " There is clear feedback after each answer, whether correct or incorrect. Feedback for an incorrect answer appears immediately after the first incorrectly clicked or pressed key, while feedback for a correct answer is displayed after the entire sequence has been repeated correctly.: +5\n" +
  " Upon a correct answer, the “Repeat the Sequence” button is replaced with a “Next” button to proceed to the following round: +5\n" +
  " Clicking the “Next” button starts the next round with a new, randomly generated sequence that is two symbols longer than the previous one. The \"Next\" button is replaced by the \"Repeat the sequence\" button: +5\n" +
  " After successfully completing the 5th round, there is final feedback indicating the game is over and the “Repeat the sequence” button, if still enabled, becomes disabled: +5\n" +
  " The user’s last chosen difficulty level is saved and preselected by default when the user starts a new game: +5\n" +
  " The app is supported at the requested width (desktop 1440px <= width, tablet 768px <= width < 1440px and mobile 360px <= width < 768px) (e.g., no DOM elements overlap, disappear, etc.):: +10\n" +
  "Penalties\n" +
  "Unexpected errors in the console caused by the application(the deduction is only allowed once for each distinct kind of error): -10 per error\n" +
  "Feedback messages displayed in page do not disappear when the user clicks the “Repeat the sequence” (if still present and enabled)/\"Next\" or \"New game\" buttons: -10\n" +
  "Feedback messages displayed as separate popups/dialogs do not have a closing button, or the interaction with the page is not disabled when the message is displayed: -10\n" +
  "More than one key at a time is highlighted when guessing the sequence or more than one key is processed at a time: -10\n" +
  "The symbols that are not part of the current difficulty level are not ignored: -20\n" +
  "Upper and lower case letters are not treated as the same symbol: -20\n" +
  "Once the answer is detected as correct or incorrect, the application still handles new user input on virtual or physical keyboards: -20\n" +
  "Hiding and displaying additional elements cause the main elements to shift or move: -20\n" +
  "The sequence is not randomly generated for each new round and/or the two new symbols are simply added to the previous sequence: -50\n" +
  "window.location.reload is used to restart the game when it's over: -50\n" +
  "The application is not done in English: -150\n" +
  "Anything mentioned as not allowed in the 'Technical requirements' section is used: -150\n" +
  "body in the index.html is not empty (can contain only script tag). This requirement can be checked by pressing Ctrl+U (Windows) or Option(⌥)+Command(⌘)+U (Mac): -150\n" +
  "Not all elements are generated using createElement() function or JS code is minified, not allowing to check this requirement: -150\n" +
  "Using alert, prompt, confirm: -150");
