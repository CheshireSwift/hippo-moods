export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  multiply(factor: number) {
    return new Vector(this.x * factor, this.y * factor);
  }

  toString() {
    return `${this.x} ${this.y}`;
  }
}

export default Vector;
