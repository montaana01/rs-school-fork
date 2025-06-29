export class Sound {
  constructor() {
    this.sounds = {
      click: new Audio("./assets/sound/click.wav"),
      remove: new Audio("./assets/sound/remove.mp3"),
      cross: new Audio("./assets/sound/cross.mp3"),
      win: new Audio("./assets/sound/win.wav"),
    };

    this.enabled = localStorage.getItem("sound") !== "false";
    this.init();
  }

  init() {
    this.BUTTON = document.getElementById("sound");
    if (this.BUTTON) {
      this.BUTTON.textContent = `${this.enabled ? "🔊" : "🔇"}`;
    }
  }

  play(sound) {
    if (this.enabled && this.sounds[sound]) {
      this.sounds[sound].currentTime = 0;
      this.sounds[sound].volume = 0.11;
      this.sounds[sound].play();
    }
  }

  toggleSound() {
    this.enabled = !this.enabled;
    localStorage.setItem("sound", this.enabled);
    this.init();
  }
}
