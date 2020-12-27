export default class Calculator {
  name: String = 'Name';

  constructor() {
    this.name = 'New Name';
  }

  sayName() {
    console.dir(this.name);
  }
}
