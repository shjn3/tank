import { BootScene } from "./scenes/boot-scene";
import { GameScene } from "./scenes/game-scene";
import { GameOverScene } from "./scenes/gameOver-scene";
import { MenuScene } from "./scenes/menu-scene";
import { PauseScene } from "./scenes/pause-scene";

export const GameConfig: Phaser.Types.Core.GameConfig = {
  title: "Tank",
  url: "https://github.com/digitsensitive/phaser3-typescript",
  version: "2.0",
  width: 1600,
  height: 1200,
  zoom: 0.6,
  type: Phaser.AUTO,
  parent: "game",
  scene: [BootScene, MenuScene, GameScene, PauseScene, GameOverScene],
  input: {
    keyboard: true,
  },
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 0 },
      debug: false,
    },
  },
  backgroundColor: "#000000",
  render: { pixelArt: false, antialias: true },
};
