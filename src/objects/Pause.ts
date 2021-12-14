import { IImageConstructor } from "../interfaces/image.interface";

export class Pause extends Phaser.GameObjects.Image {
  constructor(aParam: IImageConstructor) {
    super(aParam.scene, aParam.x, aParam.y, aParam.texture, aParam.frame);
    this.initImage();
    this.on("pointerover", () => {
      this.scene.add.tween({
        targets: this,
        props: {
          alpha: 0.5,
        },
        duration: 500,
        ease: "Power1",
      });
    });
    this.on("pointerout", () => {
      this.scene.add.tween({
        targets: this,
        props: {
          alpha: 1,
        },
        duration: 500,
        ease: "Power1",
      });
    });
    this.on("pointerdown", () => {});
    this.scene.add.existing(this);
  }
  private initImage(): void {
    this.setScale(0.4);
    this.setScrollFactor(0);
    this.setInteractive({
      cursor: "url(assets/input/cursors/per.cur), pointer",
    });
  }
  update(): void {}
}
