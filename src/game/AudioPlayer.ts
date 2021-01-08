import sounds from '../data/audio.json';

require.context('../assets/audio', true, /\.mp3$/);

export class AudioPlayer {
  public static playSound(name: string) {
    const audio = new Audio();
    audio.src = AudioPlayer.getSrc(sounds, name);
    audio.play();
  }

  private static getSrc(soundsList: {[k: string]: string}, name: string) {
    return soundsList[name];
  }
}
