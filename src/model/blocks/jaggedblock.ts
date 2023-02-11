import block from "../block";

export default class jaggedblock extends block {
  getBrickPosition() {
    switch (this.spinPosition) {
      case 0:
      case 2:
        // X
        //  X
        //   X
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY + 1 },
          { pX: this.pX + 2, pY: this.pY + 2 },
        ];
      case 1:
      case 3:
        //   X
        //  X
        // X
        return [
          { pX: this.pX + 2, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY + 1 },
          { pX: this.pX, pY: this.pY + 2 },
        ];
      default:
        return [
          { pX: this.pX, pY: this.pY },
          { pX: this.pX + 1, pY: this.pY + 1 },
          { pX: this.pX + 2, pY: this.pY + 2 },
        ];
    }
  }
}
