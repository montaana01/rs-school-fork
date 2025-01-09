const GAME_NAME = "Simon says";

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
  className: "header__wrapper-item__logo",
  src: "./../../assets/images/simon-says-logo.png",
  alt: GAME_NAME,
})

headerLogo.appendChild(logoImage);

// central part
headerTitle.appendChild(document.createElement("h1"));
headerTitle.childNodes[0].textContent = GAME_NAME;


// difficult switcher
let switcher = document.createElement("div");
switcher.className = "header__wrapper-item__switcher";

let switcherArea = document.createElement("div");
switcherArea.className = "header__wrapper-item__switcher__area";
let switcherText = document.createElement("div");
switcherText.className = "header__wrapper-item__switcher__text";
switcherText.textContent = "easy"; // future - variable with level of difficult

switcher.appendChild(switcherArea);
switcher.appendChild(switcherText);

headerSwitcher.appendChild(switcher);

/*
* Fill up main section
*/
const mainSection = MAIN.appendChild(document.createElement("section"));
mainSection.classList.add("main");
const mainContainer = mainSection.appendChild(document.createElement("div"));
headerContainer.classList.add("container");
const mainWrapper = mainContainer.appendChild(document.createElement("div"));
mainWrapper.classList.add("main__wrapper");

mainWrapper.innerHTML = `<h2>The Game...</h2>`;

/*
* Fill up footer section
*/
const footerContainer = FOOTER.appendChild(document.createElement("div"));
footerContainer.classList.add("container");
const footerWrapper = footerContainer.appendChild(document.createElement("div"));
footerWrapper.classList.add("footer__wrapper");

footerWrapper.innerHTML = `
  <a href="https://github.com/montaana01" class="footer__social__wrapper-item">
      <span>&nbsp;</span>
      <svg height="40" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="40" data-view-component="true">
        <path
          d="M12.5.75C6.146.75 1 5.896 1 12.25c0 5.089 3.292 9.387 7.863 10.91.575.101.79-.244.79-.546 0-.273-.014-1.178-.014-2.142-2.889.532-3.636-.704-3.866-1.35-.13-.331-.69-1.352-1.18-1.625-.402-.216-.977-.748-.014-.762.906-.014 1.553.834 1.769 1.179 1.035 1.74 2.688 1.25 3.349.948.1-.747.402-1.25.733-1.538-2.559-.287-5.232-1.279-5.232-5.678 0-1.25.445-2.285 1.178-3.09-.115-.288-.517-1.467.115-3.048 0 0 .963-.302 3.163 1.179.92-.259 1.897-.388 2.875-.388.977 0 1.955.13 2.875.388 2.2-1.495 3.162-1.179 3.162-1.179.633 1.581.23 2.76.115 3.048.733.805 1.179 1.825 1.179 3.09 0 4.413-2.688 5.39-5.247 5.678.417.36.776 1.05.776 2.128 0 1.538-.014 2.774-.014 3.162 0 .302.216.662.79.547C20.709 21.637 24 17.324 24 12.25 24 5.896 18.854.75 12.5.75Z"></path>
      </svg>
    </a>
    <a href="https://rs.school" target="_blank" class="subtitle">Made in Rolling Scopes School</a>
`;


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
