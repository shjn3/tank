import { Player } from "../objects/player";
import { Enemy } from "../objects/enemy";
import { Obstacle } from "../objects/obstacles/obstacle";
import { Bullet } from "../objects/bullet";
import { Pause } from "../objects/Pause";

export class GameScene extends Phaser.Scene {
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;

  private player: Player;
  private enemies: Phaser.GameObjects.Group;
  private obstacles: Phaser.GameObjects.Group;
  private pause: Pause;
  private target: Phaser.Math.Vector2;

  constructor() {
    super({
      key: "GameScene",
    });
  }

  init(): void {}

  create(): void {
    this.tweenOpening();
    this.createPauseUi();

    // create tilemap from tiled JSON
    this.map = this.make.tilemap({ key: "levelMap" });

    this.tileset = this.map.addTilesetImage("tiles");
    this.layer = this.map.createLayer("tileLayer", this.tileset, 0, 0);
    this.layer.setCollisionByProperty({ collide: true });

    this.obstacles = this.add.group({
      /*classType: Obstacle,*/
      runChildUpdate: true,
    });

    this.enemies = this.add.group({
      /*classType: Enemy*/
    });
    this.convertObjects();

    // collider layer and obstacles
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.obstacles);

    // collider for bullets
    this.physics.add.collider(
      this.player.getBullets(),
      this.layer,
      this.bulletHitLayer,
      null,
      this,
    );

    this.physics.add.collider(
      this.player.getBullets(),
      this.obstacles,
      this.bulletHitObstacles,
      null,
      this,
    );

    this.enemies.children.each((enemy: Enemy) => {
      this.physics.add.overlap(
        this.player.getBullets(),
        enemy,
        this.playerBulletHitEnemy,
        null,
        this,
      );
      this.physics.add.overlap(
        enemy.getBullets(),
        this.player,
        this.enemyBulletHitPlayer,
        null,
      );

      this.physics.add.collider(
        enemy.getBullets(),
        this.obstacles,
        this.bulletHitObstacles,
        null,
      );
      this.physics.add.collider(
        enemy.getBullets(),
        this.layer,
        this.bulletHitLayer,
        null,
      );
    }, this);
    // this.createPauseScreen();
    this.cameras.main.startFollow(this.player);
  }
  createPauseUi(): void {
    this.pause = new Pause({
      scene: this,
      x: 60,
      y: 60,
      texture: "pause",
    }).setDepth(2);
  }
  createPauseScreen(): void {
    let veil = this.add.graphics({ x: 0, y: 0 });
    veil.fillStyle(0, 0.3);
    veil.fillRect(
      0,
      0,
      this.sys.game.canvas.width,
      this.sys.game.canvas.height,
    );
    veil.setDepth(5).setScrollFactor(0);

    let bgPopup = this.add
      .image(0, 0, "bgPausePopup")
      .setDepth(5)
      .setScrollFactor(0);
    let newGame = this.add
      .image(0, 0, "newGameBtn")
      .setDepth(6)
      .setScrollFactor(0);
    let resume = this.add
      .image(0, 0, "resumeBtn")
      .setDepth(6)
      .setScrollFactor(0);
    Phaser.Display.Align.In.TopLeft(
      bgPopup,
      this.add.zone(
        this.sys.game.canvas.width / 2 - 350,
        this.sys.game.canvas.height / 2 - 350,
        0,
        0,
      ),
    );
    Phaser.Display.Align.In.Center(newGame, bgPopup);
    Phaser.Display.Align.In.TopCenter(resume, bgPopup);
  }
  tweenOpening(): void {
    let blocks = this.add.group();
    blocks.createMultiple({
      key: "block",
      quantity: 768,
    });
    Phaser.Actions.GridAlign(blocks.getChildren(), {
      width: 32,
      height: 24,
      cellWidth: 50,
      cellHeight: 50,
      x: -455,
      y: -335,
    });
    blocks.setDepth(3);
    let i = 0;
    blocks.children.iterate((child) => {
      this.tweens.add({
        targets: child,
        props: {
          scale: 0,
        },
        ease: "Sine.easeInOut",
        delay: i * 50,
        duration: 1000,
        repeat: 0,
        yoyo: false,
        onComplete: () => {
          child.destroy();
        },
      });
      i++;
      if (i % 32 === 0) i = 0;
    });
  }
  update(): void {
    this.player.update();

    this.enemies.children.each((enemy: Enemy) => {
      enemy.update();
      if (this.player.active && enemy.active) {
        var angle = Phaser.Math.Angle.Between(
          enemy.body.x,
          enemy.body.y,
          this.player.body.x,
          this.player.body.y,
        );

        enemy.getBarrel().angle =
          (angle + Math.PI / 2) * Phaser.Math.RAD_TO_DEG;
      }
    }, this);
  }

  private convertObjects(): void {
    // find the object layer in the tilemap named 'objects'
    const objects = this.map.getObjectLayer("objects").objects as any[];

    objects.forEach((object) => {
      if (object.type === "player") {
        this.player = new Player({
          scene: this,
          x: object.x,
          y: object.y,
          texture: "tankBlue",
        });
      } else if (object.type === "enemy") {
        let enemy = new Enemy({
          scene: this,
          x: object.x,
          y: object.y,
          texture: "tankRed",
        });

        this.enemies.add(enemy);
      } else {
        let obstacle = new Obstacle({
          scene: this,
          x: object.x,
          y: object.y - 40,
          texture: object.type,
        });

        this.obstacles.add(obstacle);
      }
    });
  }

  private bulletHitLayer(bullet: Bullet): void {
    bullet.destroyBullet();
  }

  private bulletHitObstacles(bullet: Bullet, obstacle: Obstacle): void {
    bullet.destroyBullet();
  }

  private enemyBulletHitPlayer(bullet: Bullet, player: Player): void {
    bullet.destroyBullet();
    player.updateHealth();
  }

  private playerBulletHitEnemy(bullet: Bullet, enemy: Enemy): void {
    bullet.destroyBullet();
    enemy.updateHealth();
  }
}
