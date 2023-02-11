import block from "../block";

export default class lineblock extends block {
  getBrickPosition() {
    switch (this.spinPosition) {
      case 0:
      case 2:
        // XXXX
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY },
          { pX: this.pX + 2, pY: this.pY },
          { pX: this.pX + 3, pY: this.pY },
        ];
      case 1:
      case 3:
        // X
        // X
        // X
        // X
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX, pY: this.pY + 1 },
          { pX: this.pX, pY: this.pY + 2 },
          { pX: this.pX, pY: this.pY + 3 },
        ];
      default:
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY },
          { pX: this.pX + 2, pY: this.pY },
          { pX: this.pX + 3, pY: this.pY },
        ];
    }
  }
}
