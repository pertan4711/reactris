import block from "../block";

export default class minorlineblock extends block {
  getBrickPosition() {
    switch (this.spinPosition) {
      case 0:
      case 2:
        // XXX
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY },
          { pX: this.pX + 2, pY: this.pY },
        ];
      case 1:
      case 3:
        // X
        // X
        // X
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX, pY: this.pY + 1 },
          { pX: this.pX, pY: this.pY + 2 },
        ];
      default:
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY },
          { pX: this.pX + 2, pY: this.pY },
        ];
    }
  }
}
