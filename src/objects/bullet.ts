import { IBulletConstructor } from "../interfaces/bullet.interface";

export class Bullet extends Phaser.GameObjects.Image {
  body: Phaser.Physics.Arcade.Body;

  private bulletSpeed: number;
  private effectBullet: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture);

    this.rotation = aParams.rotation;
    this.initImage();
    this.scene.add.existing(this);
  }

  private initImage(): void {
    this.effectForBlur();
    // variables
    this.bulletSpeed = 1000;

    // image
    this.setOrigin(0.5, 0.5);
    this.setDepth(2);

    // physics
    this.scene.physics.world.enable(this);
    this.scene.physics.velocityFromRotation(
      this.rotation - Math.PI / 2,
      this.bulletSpeed,
      this.body.velocity,
    );
  }
  private effectForBlur(): void {
    this.effectBullet = this.scene.add.particles(this.texture).createEmitter({
      lifespan: 50,
      blendMode: "ERAZE",
      alpha: { start: 0.3, end: 0 },
      rotate: {
        onEmit: () => {
          return this.angle;
        },
      },
    });
    this.effectBullet.startFollow(this);
  }
  destroyBullet(): void {
    this.destroy();
    this.effectBullet.remove();
  }

  update(): void {}
}
