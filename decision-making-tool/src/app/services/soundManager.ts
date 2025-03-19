import StorageManager from './storageManager';

export default class SoundManager {
  private static instance: SoundManager;
  public isMuted: boolean;
  private audio: HTMLAudioElement;
  private storageManager: StorageManager;
  private soundButton!: HTMLElement;

  private constructor() {
    this.storageManager = StorageManager.getInstance();
    this.isMuted = !!this.storageManager.load('mute');
    this.audio = new Audio('/sound/win.wav');
  }

  public static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  public initializeSound(button: HTMLElement): void {
    this.soundButton = button;
    this.updateButton();
    this.soundButton.addEventListener('click', () => this.toggleSound());
  }

  public toggleSound(): void {
    this.isMuted = !this.isMuted;
    this.storageManager.save('mute', this.isMuted);
    this.updateButton();
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  public play(): void {
    this.audio.currentTime = 0;
    this.audio.volume = 0.11;
    this.audio.play();
  }

  private updateButton(): void {
    this.soundButton.textContent = this.isMuted ? '🔇' : '🔊';
  }
}
