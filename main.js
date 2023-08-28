const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this.field = field;
    this.currentPosition = this.getRandomStartPosition();
    this.field[this.currentPosition[0]][this.currentPosition[1]] = pathCharacter;
  }

  print() {
    for (const row of this.field) {
      console.log(row.join(''));
    }
  }

  isOutOfBounds(row, column) {
    return row < 0 || column < 0 || row >= this.field.length || column >= this.field[0].length;
  }

  isHole(row, column) {
    return this.field[row][column] === hole;
  }

  isHat(row, column) {
    return this.field[row][column] === hat;
  }

  move(direction) {
    const newRow = this.currentPosition[0] + direction[0];
    const newColumn = this.currentPosition[1] + direction[1];

    if (this.isOutOfBounds(newRow, newColumn)) {
      console.log('Out of game! Try again.');
    } else if (this.isHole(newRow, newColumn)) {
      console.log('Ohoo nooo! You fell into a hole. Game over.');
      process.exit();
    } else if (this.isHat(newRow, newColumn)) {
      console.log('Congratulations! You found the hat. You win!');
      process.exit();
    } else {
      this.field[this.currentPosition[0]][this.currentPosition[1]] = fieldCharacter;
      this.currentPosition = [newRow, newColumn];
      this.field[newRow][newColumn] = pathCharacter;
    }
  }

  getRandomStartPosition() {
    const row = Math.floor(Math.random() * this.field.length);
    const column = Math.floor(Math.random() * this.field[0].length);
    return [row, column];
  }

  static generateField(height, width, holePercentage) {
    const totalTiles = height * width;
    const numHoles = Math.floor(totalTiles * (holePercentage / 100));
    const field = new Array(height).fill(null).map(() => new Array(width).fill(fieldCharacter));

    let hatRow, hatColumn;

    do {
      hatRow = Math.floor(Math.random() * height);
      hatColumn = Math.floor(Math.random() * width);
    } while (hatRow === 0 && hatColumn === 0);

    field[hatRow][hatColumn] = hat;

    for (let i = 0; i < numHoles; i++) {
      let holeRow, holeColumn;

      do {
        holeRow = Math.floor(Math.random() * height);
        holeColumn = Math.floor(Math.random() * width);
      } while (field[holeRow][holeColumn] !== fieldCharacter);

      field[holeRow][holeColumn] = hole;
    }

    return field;
  }

  play() {
    while (true) {
      this.print();
      const direction = prompt('Which way? (u/d/r/l): ').toLowerCase();
      let moveVector;

      switch (direction) {
        case 'u':
          moveVector = [-1, 0];
          break;
        case 'd':
          moveVector = [1, 0];
          break;
        case 'l':
          moveVector = [0, -1];
          break;
        case 'r':
          moveVector = [0, 1];
          break;
        default:
          console.log('Invalid direction. Use "up", "down", "left", or "right".');
          continue;
      }

      this.move(moveVector);
    }
  }
}

const generatedField = Field.generateField(6, 8, 20); // Adjust the dimensions and holePercentage as needed
const myField = new Field(generatedField);

myField.play();