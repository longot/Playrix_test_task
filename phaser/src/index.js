import 'p2'
import 'pixi'
import 'phaser'

import PlayableState from './state_playable'

const game = new Phaser.Game({
  width: 1390,
  height: 640,
  renderer: Phaser.AUTO,
  alignH: true,
  alignV: true,
  enableDebug: true,
  antialias: true,
  parent: 'game',
})

game.state.add('playable', new PlayableState(), true)
