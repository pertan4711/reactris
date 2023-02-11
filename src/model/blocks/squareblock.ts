import block from "../block";

export default class squareblock extends block {
  getBrickPosition() {
    return [
      { pX: this.pX, pY: this.pY },
      { pX: this.pX + 1, pY: this.pY },
      { pX: this.pX, pY: this.pY + 1 },
      { pX: this.pX + 1, pY: this.pY + 1 },
    ];
  }
}
