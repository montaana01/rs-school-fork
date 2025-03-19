import StorageManager from './storageManager';

export default class SoundManager {
  private static instance: SoundManager;
  private storageManager: StorageManager;
  private isMuted: boolean;
  private soundButton!: HTMLElement;

  private constructor() {
    this.storageManager = StorageManager.getInstance();
    this.isMuted = !!this.storageManager.load('mute');
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

  private updateButton(): void {
    this.soundButton.textContent = this.isMuted ? '🔇' : '🔊';
  }
}
