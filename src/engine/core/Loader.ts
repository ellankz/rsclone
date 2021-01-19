const context = require.context('../../assets/', true, /\.(png|jpg|mp3|ttf)$/);

export default class Loader {
  fileContextPath: string;

  files: {
    [dynamic: string]: HTMLImageElement | HTMLAudioElement;
  };

  filesLoadedCount: number;

  beforeLoadCallback: () => Promise<void>;

  loadedOneCallback: (percent: number) => void;

  filesList: string[];

  loadedAllCallback: () => void;

  loadingFinished: boolean = false;

  constructor(
    beforeLoadCallback: () => Promise<void>,
    loadedOneCallback: (percent: number) => void,
    loadedAllCallback: () => void,
  ) {
    this.beforeLoadCallback = beforeLoadCallback;
    this.loadedOneCallback = loadedOneCallback;
    this.loadedAllCallback = loadedAllCallback;
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
        image.addEventListener('load', () => this.fileLoaded());
        image.addEventListener('error', () => this.retryLoadFile(ext, path));
        image.src = path;
        return [path, image];
      }
      if (ext === 'mp3') {
        const audio = new Audio();
        audio.addEventListener('canplaythrough', () => this.fileLoaded());
        audio.addEventListener('error', () => this.retryLoadFile(ext, path));
        audio.src = path;
        return [path, audio];
      }
      if (ext === 'ttf' || ext === 'woff' || ext === 'woff2') {
        if (!('fonts' in document)) {
          this.fileLoaded();
        } else {
          const name = path.slice(path.lastIndexOf('/') + 1, -4);

          (document as any).fonts
            .load(`1em ${name}`)
            .then(() => this.fileLoaded())
            .catch(() => this.retryLoadFile(ext, path));
        }
      }

      return [path, undefined];
    });

    this.files = Object.fromEntries(files);
  }

  fileLoaded() {
    if (!this.loadingFinished) {
      this.filesLoadedCount += 1;
      this.loadedOneCallback(this.filesLoadedCount / this.filesList.length);
      if (this.filesLoadedCount >= this.filesList.length) {
        this.loadedAllCallback();
        this.loadingFinished = true;
      }
    }
  }

  retryLoadFile(ext: string, path: string) {
    if (ext === 'png' || ext === 'jpg') {
      const image = new Image();
      image.addEventListener('load', () => this.fileLoaded());
      image.addEventListener('error', () => this.fileLoaded());
      image.src = path;
      this.files[path] = image;
    }
    if (ext === 'mp3') {
      const audio = new Audio();
      audio.addEventListener('canplaythrough', () => this.fileLoaded());
      audio.addEventListener('error', () => this.fileLoaded());
      audio.src = path;
      this.files[path] = audio;
    }
    if (ext === 'ttf' || ext === 'woff' || ext === 'woff2') {
      const name = path.slice(path.lastIndexOf('/') + 1, -4);
      (document as any).fonts.load(`1em ${name}`).finally(() => this.fileLoaded());
    }
  }
}
