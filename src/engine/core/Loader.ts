require.context('../../assets/', true, /\.(png|jpg|mp3)$/);

export default class Loader {
  listToLoad: string[];

  fileContextPath: string;

  files: {
    [dynamic: string]: HTMLImageElement|HTMLAudioElement
  };

  filesLoadedCount: number;

  loadedCallback: () => void;

  constructor(listToLoad: string[], loadedCallback: () => void) {
    this.listToLoad = listToLoad;
    this.filesLoadedCount = 0;
    this.loadedCallback = loadedCallback;
  }

  load() {
    const files = this.listToLoad.map((path) => {
      const ext = path.slice(-3);
      if (ext === 'png' || ext === 'jpg') {
        const image = new Image();
        image.src = path;
        image.addEventListener('load', () => this.fileLoaded());
        return [path, image];
      }
      if (ext === 'mp3') {
        const audio = new Audio();
        audio.src = path;
        audio.addEventListener('load', () => this.fileLoaded());
        return [path, audio];
      }
      return [path, undefined];
    });
    this.files = Object.fromEntries(files);
  }

  fileLoaded() {
    this.filesLoadedCount += 1;
    if (this.filesLoadedCount >= this.listToLoad.length) {
      this.loadedCallback();
    }
  }
}
