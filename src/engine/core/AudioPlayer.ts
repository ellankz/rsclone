import Loader from './Loader';

export default class AudioPlayer {
  elements: {[dynamic: string]: HTMLAudioElement};

  sounds: { [dynamic: string]: string; };

  loader: Loader;

  constructor(list: {[dynamic: string]: string}, loader: Loader) {
    this.sounds = list;
    this.loader = loader;
  }

  init() {
    this.elements = Object.entries(this.sounds).reduce((acc, sound, index) => {
      const [name, path] = sound;
      return { ...acc, [name]: this.loader.files[path] };
    }, {});
  }

  playSound(name: string) {
    this.elements[name].currentTime = 0;
    this.elements[name].play();
  }

  playContinue(name: string) {
    this.elements[name].play();
  }

  stopSound(name: string) {
    this.elements[name].pause();
    this.elements[name].currentTime = 0;
  }
}
