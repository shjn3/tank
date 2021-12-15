import { Button } from "../objects/Button";
export class GameOverScene extends Phaser.Scene {
  private newGameButton: Button;
  private containerPopup: Phaser.GameObjects.Container;
  private textScore: Phaser.GameObjects.Text;
  private textHighScore: Phaser.GameObjects.Text;
  constructor() {
    super({
      key: "GameOverScene",
    });
  }
  init(): void {}
  create(): void {
    let veil = this.add.graphics();
    veil.fillStyle(0x000000, 0.7);
    veil.fillRect(
      0,
      0,
      this.sys.game.canvas.width,
      this.sys.game.canvas.height,
    );
    let bittext = this.add.bitmapText(0, 0, "font", "Game Over", 60);
    this.newGameButton = new Button({
      scene: this,
      x: 0,
      y: 0,
      texture: "newGameButton",
    });
    this.textScore = this.add
      .text(0, 0, `${this.registry.get("score")}`, {
        fontSize: "50px",
        color: "white",
      })
      .setDepth(10);
    this.textHighScore = this.add.text(
      0,
      0,
      `Best Score: ${localStorage.getItem("highScore")}`,
      {
        fontSize: "50px",
        color: "white",
      },
    );
    let zoneForPopupGameOver = this.add.zone(0, 0, 700, 350);
    let zoneForScoreText = this.add.zone(0, 0, 700, 100);
    Phaser.Display.Align.In.TopCenter(bittext, zoneForPopupGameOver);
    Phaser.Display.Align.To.BottomCenter(
      this.newGameButton,
      zoneForPopupGameOver,
    );
    Phaser.Display.Align.In.Center(zoneForScoreText, zoneForPopupGameOver);
    Phaser.Display.Align.In.TopCenter(this.textScore, zoneForScoreText);
    Phaser.Display.Align.In.BottomCenter(this.textHighScore, zoneForScoreText);
    this.containerPopup = this.add.container(
      -1000,
      this.sys.canvas.height / 2 - 100,
      [
        bittext,
        zoneForPopupGameOver,
        zoneForScoreText,
        this.newGameButton,
        this.textScore,
        this.textHighScore,
      ],
    );
    this.add.tween({
      targets: this.containerPopup,
      props: {
        x: this.sys.canvas.width / 2,
        y: this.sys.canvas.height / 2 - 100,
      },
      ease: "Power1",
      duration: 300,
    });
    this.handleButton();
  }
  handleButton(): void {
    this.newGameButton.on("pointerdown", () => {
      this.add.tween({
        targets: this.containerPopup,
        props: {
          x: -1000,
          y: this.sys.canvas.height / 2 - 100,
        },
        ease: "Power1",
        duration: 300,
        onComplete: () => {
          this.scene.stop("GameScene");
          this.scene.stop("GaneOverScene");
          this.scene.start("MenuScene");
        },
      });
    });
  }
  update(): void {}
}
