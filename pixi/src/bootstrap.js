import * as PIXI from 'pixi.js'

let gameStarted = false

export default function bootstrap(config) {
  if (gameStarted) {
    return
  }
  gameStarted = true

  const options = {
    width: 1390,
    height: 640,
    backgroundColor: 0x000000,
    resolution: 1,
    antialias: true,
    autoResize: true,
  }
  const application = new PIXI.Application(options)
  window.game.appendChild(application.view)
  window.GameApplication = application

  const loader = PIXI.Loader.shared

  config.elements.forEach((element) => {
    // eslint-disable-next-line no-prototype-builtins
    if (element.hasOwnProperty('key') && element.hasOwnProperty('url')) {
      loader.add(element.key, element.url)
    }
  })
}
