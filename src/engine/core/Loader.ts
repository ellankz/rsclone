const context = require.context('../../assets/', true, /\.(png|jpg|mp3)$/);

export default class Loader {
  fileContextPath: string;

  files: {
    [dynamic: string]: HTMLImageElement|HTMLAudioElement
  };

  filesLoadedCount: number;

  loadedCallback: () => void;

  filesList: string[];

  constructor(loadedCallback: () => void) {
    this.filesLoadedCount = 0;
    this.loadedCallback = loadedCallback;
    this.createFilesList();
  }

  createFilesList() {
    const keys = context.keys();
    this.filesList = keys.map((key) => key.replace('./', 'assets/'));
  }

  load() {
    this.createFilesList();
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
    }
  }
}
