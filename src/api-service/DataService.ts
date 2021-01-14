import { LS_TITLE } from '../constats';
import { User, Game } from '../types';
import { DataLoader } from './DataLoader';

export class DataService {
  token: null | string;

  constructor() {
    this.token = null;
  }

  async signup(user: User) {
    try {
      const signupResult = await DataLoader.signUp(user);
      if (signupResult.status === 'error') {
        throw new Error(signupResult.message);
      } else {
        const res = await DataLoader.login(user);
        if (res.status === 'error') {
          throw new Error(res.message);
        } else {
          this.token = res.token;
          return user.login;
        }
      }
    } catch (error) {
      console.error('Error during signup', error);
      return undefined;
    }
  }

  async login(user: User) {
    try {
      const res = await DataLoader.login(user);
      if (res.status === 'error') {
        throw new Error(res.message);
      } else {
        this.token = res.token;
        return user.login;
      }
    } catch (error) {
      console.error('Error during login', error);
      return undefined;
    }
  }

  async saveGame(savedGame: Game) {
    if (this.token) {
      DataLoader.postGame(this.token, savedGame);
    } else {
      let games = [];
      const gamesLS = localStorage.getItem(LS_TITLE);
      if (gamesLS) {
        games = JSON.parse(gamesLS);
      }
      games.push(savedGame);
      localStorage.setItem(LS_TITLE, JSON.stringify(games));
    }
  }

  postGame(game: Game) {
    if (!this.token) return;
    DataLoader.postGame(this.token, game);
  }

  async getGames() {
    let all;
    let mine;
    try {
      all = await DataLoader.getAllGames();
      if (this.token) {
        mine = await DataLoader.getMyGames(this.token);
      } else {
        const mineLS = localStorage.getItem(LS_TITLE);
        if (mineLS) {
          mine = JSON.parse(mineLS);
        }
      }
    } catch (error) {
      console.error('Error during loading stats', error);
    }
    return { all, mine };
  }

  async getStats() {
    const games = await this.getGames();

    function generateStats(gameList: Game[]) {
      const gamesPlayed = gameList.length;
      const highestLevel = gameList.reduce((acc, game) => (acc > game.level ? acc : game.level), 0);
      const gamesWon = gameList.reduce((acc, game) => (game.win ? acc + 1 : acc), 0);
      const gamesLost = gameList.reduce((acc, game) => (game.win ? acc : acc + 1), 0);
      const percentWon = Math.round((gamesWon / gameList.length) * 100);
      const killedZombies = gameList.reduce((acc, game) => (acc + game.zombiesKilled), 0);
      const plantedPlants = gameList.reduce((acc, game) => (acc + game.plantsPlanted), 0);
      return {
        gamesPlayed,
        highestLevel,
        gamesWon,
        gamesLost,
        percentWon,
        killedZombies,
        plantedPlants,
      };
    }

    let myResult;
    if (!games.mine) {
      myResult = undefined;
    } else {
      myResult = generateStats(games.mine);
    }
    const totalResult = generateStats(games.all);

    return {
      mine: myResult,
      all: totalResult,
    };
  }
}
