const context = require.context('../../assets/', true, /\.(png|jpg|mp3)$/);

export default class Loader {
  fileContextPath: string;

  files: {
    [dynamic: string]: HTMLImageElement|HTMLAudioElement
  };

  filesLoadedCount: number;

  loadedCallback: () => void;

  beforeLoadCallback: () => Promise<void>;

  loadedOneCallback: () => void;

  filesList: string[];

  constructor(
    beforeLoadCallback: () => Promise<void>,
    loadedOneCallback: () => void,
    loadedCallback: () => void,
  ) {
    this.beforeLoadCallback = beforeLoadCallback;
    this.loadedOneCallback = loadedOneCallback;
    this.loadedCallback = loadedCallback;
    this.filesLoadedCount = 0;
  }

  createFilesList() {
    const keys = context.keys();
    this.filesList = keys.map((key) => key.replace('./', 'assets/'));
  }

  init() {
    this.beforeLoadCallback().then(() => {
      this.createFilesList();
      this.load();
    });
  }

  load() {
    const files = this.filesList.map((path) => {
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
        audio.addEventListener('canplaythrough', () => this.fileLoaded());
        return [path, audio];
      }
      return [path, undefined];
    });
    this.files = Object.fromEntries(files);
  }

  fileLoaded() {
    this.filesLoadedCount += 1;
    if (this.filesLoadedCount >= this.filesList.length) {
      this.loadedCallback();
    } else {
      this.loadedOneCallback();
    }
  }
}
