import { BASE_SERVER_URL } from '../constats';
import { Game, User } from '../types';

export class DataLoader {
  static async signUp(user: User) {
    const url = `${BASE_SERVER_URL}/auth/signup`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  static async login(user: User) {
    const url = `${BASE_SERVER_URL}/auth/login`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors' as RequestMode,
        cache: 'no-cache' as RequestCache,
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(user),
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  static async getMyGames(token: string) {
    const url = `${BASE_SERVER_URL}/games/mine`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  static async getAllGames() {
    const url = `${BASE_SERVER_URL}/games`;
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  }

  static async postGame(token: string, game: Game) {
    const url = `${BASE_SERVER_URL}/games`;
    try {
      const response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        redirect: 'follow',
        referrerPolicy: 'no-referrer',
        body: JSON.stringify(game),
      });
      return await response.json();
    } catch (error) {
      return error;
    }
  }
}
