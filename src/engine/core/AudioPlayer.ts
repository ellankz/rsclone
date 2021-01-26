import Loader from './Loader';

export default class AudioPlayer {
  elements: {[dynamic: string]: HTMLAudioElement};

  sounds: { [dynamic: string]: string; };

  loader: Loader;

  private volumeInner: number;

  constructor(list: {[dynamic: string]: string}, loader: Loader) {
    this.sounds = list;
    this.loader = loader;
    this.volumeInner = 1;
  }

  public init() {
    this.elements = Object.entries(this.sounds).reduce((acc, sound, index) => {
      const [name, path] = sound;
      return { ...acc, [name]: this.loader.files[path] };
    }, {});
  }

  public getSound(name: string) {
    return this.elements[name];
  }

  public playSound(name: string, loop?: boolean) {
    if (loop !== undefined && this.elements[name].loop !== loop) {
      this.elements[name].loop = loop;
    }
    if (this.elements[name].currentTime !== 0) {
      this.elements[name].currentTime = 0;
    }
    this.elements[name].play();
  }

  public stopAll() {
    Object.values(this.elements).forEach((currentSound) => {
      const sound = currentSound;
      sound.pause();
      sound.currentTime = 0;
    });
  }

  public playSoundRand(names: Array<string>) {
    const randomInteger = (min: number = 0, max: number = names.length - 1) => Math
      .floor(min + Math.random() * (max + 1 - min));

    const index: number = randomInteger();
    this.playSound(names[index]);
  }

  public pauseSound(name: string) {
    this.elements[name].pause();
  }

  public playContinue(name: string) {
    this.elements[name].play();
  }

  public stopSound(name: string) {
    this.elements[name].pause();
    this.elements[name].currentTime = 0;
  }

  public setVolume(volume: number) {
    this.volumeInner = volume;
    Object.values(this.elements).forEach((elem) => {
      const element = elem;
      element.volume = this.volumeInner;
    });
  }

  public get volume() {
    return this.volumeInner;
  }
}
