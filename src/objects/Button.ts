import { IImageConstructor } from "../interfaces/image.interface";
export class Button extends Phaser.GameObjects.Sprite {
  constructor(aParam: IImageConstructor) {
    super(aParam.scene, aParam.x, aParam.y, aParam.texture, aParam.frame);
    this.on("pointerover", () => {
      this.scene.add.tween({
        targets: this,
        props: {
          alpha: 0.7,
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
    this.initImage();
    this.scene.add.existing(this);
  }
  initImage() {
    this.setScrollFactor(0);
    this.setInteractive({
      cursor: "url(assets/input/cursors/per.cur), pointer",
    });
  }
}
