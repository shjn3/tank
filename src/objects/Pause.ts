import { IImageConstructor } from "../interfaces/image.interface";
import { Button } from "./Button";

export class Pause extends Button {
  constructor(aParam: IImageConstructor) {
    super(aParam);
    this.setScale(0.4);
    this.on("pointerdown", () => {
      this.alpha = 1;
      this.scene.scene.pause();
      this.scene.scene.launch("PauseScene");
    });
  }
  update(): void {}
}
