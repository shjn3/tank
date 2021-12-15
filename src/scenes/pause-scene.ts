import { Button } from "../objects/Button";
export class PauseScene extends Phaser.Scene {
  private backgroundPopupPause: Phaser.GameObjects.Image;
  private newGameButton: Button;
  private resumeButton: Button;
  private volumeButton: Button;
  private containerPopup: Phaser.GameObjects.Container;
  constructor() {
    super({ key: "PauseScene" });
  }
  init(): void {}
  create(): void {
    let veil = this.add.graphics();
    veil.fillStyle(0x000000, 0.3);
    veil.fillRect(
      0,
      0,
      this.sys.game.canvas.width,
      this.sys.game.canvas.height,
    );
    this.backgroundPopupPause = this.add
      .image(0, 0, "bgPausePopup")
      .setInteractive();
    this.newGameButton = new Button({
      scene: this,
      x: 0,
      y: 0,
      texture: "newGameButton",
    });
    this.resumeButton = new Button({
      scene: this,
      x: 0,
      y: 0,
      texture: "resumeButton",
    });
    if (this.registry.get("volume"))
      this.volumeButton = new Button({
        scene: this,
        x: 0,
        y: 0,
        texture: "volumeButton",
        frame: 1,
      });
    else
      this.volumeButton = new Button({
        scene: this,
        x: 0,
        y: 0,
        texture: "volumeButton",
        frame: 0,
      });
    let zoneForButton = this.add.zone(0, 0, 700, 250);
    Phaser.Display.Align.In.Center(zoneForButton, this.backgroundPopupPause);
    Phaser.Display.Align.In.TopLeft(this.newGameButton, zoneForButton);
    Phaser.Display.Align.In.TopRight(this.resumeButton, zoneForButton);
    Phaser.Display.Align.In.BottomCenter(this.volumeButton, zoneForButton);

    this.containerPopup = this.add.container(
      -1000,
      this.sys.game.canvas.height / 2,
      [
        this.backgroundPopupPause,
        zoneForButton,
        this.newGameButton,
        this.resumeButton,
        this.volumeButton,
      ],
    );

    this.add.tween({
      targets: this.containerPopup,
      props: {
        x: this.sys.game.canvas.width / 2,
        y: this.sys.game.canvas.height / 2,
      },
      ease: "Power1",
      duration: 1000,
    });
    this.handleButton();
  }
  handleButton(): void {
    this.newGameButton.on("pointerdown", () => {
      this.scene.stop("GameScene");
      this.scene.stop("PauseScene");
      this.scene.start("MenuScene");
    });
    this.resumeButton.on("pointerdown", () => {
      this.add.tween({
        targets: this.containerPopup,
        props: {
          x: -1000,
          y: this.sys.game.canvas.height / 2,
        },
        ease: "Power1",
        duration: 1000,
        onComplete: () => {
          this.scene.stop();
          this.scene.resume("GameScene");
        },
      });
    });
    this.volumeButton.on("pointerdown", () => {
      if (this.registry.get("volume")) {
        this.registry.set("volume", false);
        this.sound.pauseAll();
        this.volumeButton.setFrame(0);
      } else {
        this.registry.set("volume", true);
        this.game.sound.resumeAll();
        this.volumeButton.setFrame(1);
      }
    });
  }
  update(time: number, delta: number): void {}
}
