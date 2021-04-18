import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

const app = new PIXI.Application({
  width: 1390,
  height: 640,
  backgroundColor: 0x000000,
  resolution: window.devicePixelRatio || 1,
  antialias: true,
  autoResize: true,
})
window.game.appendChild(app.view)

const container = new PIXI.Container()
app.stage.addChild(container)

const menuContainer = new PIXI.Container()
app.stage.addChild(menuContainer)
menuContainer.x = 840
menuContainer.y = 5
menuContainer.visible = false

const UIContainer = new PIXI.Container()
app.stage.addChild(UIContainer)

let currentStair
let oldStair
let disableClick = false
const sprites = {}

const loader = new PIXI.Loader()

loader.add('Austin', require('assets/Austin.png'))
loader.add('BtnOK', require('assets/btn_ico.png'))
loader.add('CtaBtn', require('assets/cta_btn.png'))
loader.add('DecorBookStand', require('assets/decor_book_stand.png'))
loader.add('DecorGlobe', require('assets/decor_globe.png'))
loader.add('DecorPaint1', require('assets/decor_paint1.png'))
loader.add('DecorPaint2', require('assets/decor_paint2.png'))
loader.add('DecorSofa', require('assets/decor_sofa.png'))
loader.add('DecorTable', require('assets/decor_table.png'))
loader.add('Final', require('assets/final.png'))
loader.add('IcoHammer', require('assets/icon_hammer.png'))
loader.add('Logo', require('assets/logo.png'))
loader.add('MenuCircle', require('assets/menu_circle.png'))
loader.add('MenuCircleChoosed', require('assets/menu_circle_choosed.png'))
loader.add('Room', require('assets/room.jpg'))
loader.add('SmallStairNew1', require('assets/small_stair_new_01.png'))
loader.add('SmallStairNew2', require('assets/small_stair_new_02.png'))
loader.add('SmallStairNew3', require('assets/small_stair_new_03.png'))
loader.add('StairNew1', require('assets/stair_new_01.png'))
loader.add('StairNew2', require('assets/stair_new_02.png'))
loader.add('StairNew3', require('assets/stair_new_03.png'))
loader.add('StairOld', require('assets/stair_old.png'))

loader.load((_loader, resources) => {
  sprites.Austin = new PIXI.Sprite(resources.Austin.texture)
  sprites.BtnOK = new PIXI.Sprite(resources.BtnOK.texture)
  sprites.CtaBtn = new PIXI.Sprite(resources.CtaBtn.texture)
  sprites.DecorBookStand = new PIXI.Sprite(resources.DecorBookStand.texture)
  sprites.DecorGlobe = new PIXI.Sprite(resources.DecorGlobe.texture)
  sprites.DecorPaint1 = new PIXI.Sprite(resources.DecorPaint1.texture)
  sprites.DecorPaint12 = new PIXI.Sprite(resources.DecorPaint1.texture)
  sprites.DecorPaint2 = new PIXI.Sprite(resources.DecorPaint2.texture)
  sprites.DecorSofa = new PIXI.Sprite(resources.DecorSofa.texture)
  sprites.DecorTable = new PIXI.Sprite(resources.DecorTable.texture)
  sprites.Final = new PIXI.Sprite(resources.Final.texture)
  sprites.IcoHammer = new PIXI.Sprite(resources.IcoHammer.texture)
  sprites.Logo = new PIXI.Sprite(resources.Logo.texture)
  sprites.MenuBtn1 = new PIXI.Sprite(resources.MenuCircle.texture)
  sprites.MenuBtn2 = new PIXI.Sprite(resources.MenuCircle.texture)
  sprites.MenuBtn3 = new PIXI.Sprite(resources.MenuCircle.texture)
  sprites.Room = new PIXI.Sprite(resources.Room.texture)
  sprites.SmallStairNew1 = new PIXI.Sprite(resources.SmallStairNew1.texture)
  sprites.SmallStairNew2 = new PIXI.Sprite(resources.SmallStairNew2.texture)
  sprites.SmallStairNew3 = new PIXI.Sprite(resources.SmallStairNew3.texture)
  sprites.StairNew1 = new PIXI.Sprite(resources.StairNew1.texture)
  sprites.StairNew2 = new PIXI.Sprite(resources.StairNew2.texture)
  sprites.StairNew3 = new PIXI.Sprite(resources.StairNew3.texture)
  sprites.StairOld = new PIXI.Sprite(resources.StairOld.texture)
})

function animate(time) {
  const id = requestAnimationFrame(animate)
  const result = TWEEN.update(time)
  if (!result) cancelAnimationFrame(id)
}

function clickOnCTA() {
  document.location.href = 'https://playrix.com'
}

function clickOnOkBtn() {
  if (disableClick) return

  const {shadow, Final} = sprites
  shadow.visible = true
  shadow.alpha = 0
  Final.visible = true
  Final.alpha = 0

  new TWEEN.Tween(shadow)
    .to({alpha: 1}, 500)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start()
  new TWEEN.Tween(Final)
    .to({alpha: 1}, 500)
    .easing(TWEEN.Easing.Sinusoidal.Out)
    .start()

  disableClick = true
  sprites.MenuBtn1.interactive = false
  sprites.MenuBtn2.interactive = false
  sprites.MenuBtn3.interactive = false
  sprites.BtnOK.interactive = false
}

const currentTweenList = {}

function clickOnMenu(id) {
  const newStair = sprites[`StairNew${id}`]

  if (currentStair === newStair || disableClick) return

  sprites.MenuBtn1.texture = loader.resources.MenuCircle.texture
  sprites.MenuBtn2.texture = loader.resources.MenuCircle.texture
  sprites.MenuBtn3.texture = loader.resources.MenuCircle.texture
  const currentMenuBtn = sprites[`MenuBtn${id}`]
  currentMenuBtn.texture = loader.resources.MenuCircleChoosed.texture

  sprites.BtnOK.visible = true
  sprites.BtnOK.x = currentMenuBtn.x + currentMenuBtn.width * 0.5
  sprites.BtnOK.y = currentMenuBtn.y + currentMenuBtn.height + 15

  if (currentTweenList.newStairShowTw && currentTweenList.newStairShowTw.isPlaying()) {
    currentTweenList.newStairShowTw.stop()
    currentStair.alpha = 0
  }
  if (currentTweenList.currentStairHideTw && currentTweenList.currentStairHideTw.isPlaying()) {
    currentTweenList.currentStairHideTw.stop()
    oldStair.alpha = 0
  }
  if (currentTweenList.newStairDropTw && currentTweenList.newStairDropTw.isPlaying()) {
    currentTweenList.newStairDropTw.stop()
  }

  oldStair = currentStair
  const currentStairHideTw = new TWEEN.Tween(currentStair)
    .to({alpha: 0}, 250)
    .onComplete(() => {
      oldStair.visible = false
    })
  currentTweenList.currentStairHideTw = currentStairHideTw

  newStair.visible = true
  newStair.alpha = 0
  newStair.y = -400

  const newStairShowTw = new TWEEN.Tween(newStair)
    .to({alpha: 1}, 500)
    .easing(TWEEN.Easing.Cubic.In)
  currentTweenList.newStairShowTw = newStairShowTw

  const newStairDropTw = new TWEEN.Tween(newStair)
    .to({y: 0}, 500)
    .easing(TWEEN.Easing.Cubic.Out)
  currentTweenList.newStairDropTw = newStairDropTw

  currentStairHideTw.start()
  newStairShowTw.start()
  newStairDropTw.start()

  currentStair = newStair
}

const startGame = () => {
  sprites.IcoHammer.visible = true
  const tweenShowHammer = new TWEEN.Tween(sprites.IcoHammer)
    .to({alpha: 1}, 1000)
    .delay(1000)
    .onComplete(() => {
      sprites.IcoHammer.interactive = true
      sprites.IcoHammer.buttonMode = true
      sprites.IcoHammer.on('pointerdown', () => {
        menuContainer.visible = true
        menuContainer.alpha = 0

        const tweenShowMenu = new TWEEN.Tween(menuContainer)
          .to({alpha: 1}, 500)
          .easing(TWEEN.Easing.Circular.Out)
          .onComplete(() => {
            sprites.MenuBtn1.interactive = true
            sprites.MenuBtn1.buttonMode = true
            sprites.MenuBtn1.on('pointerdown', () => clickOnMenu(1))

            sprites.MenuBtn2.interactive = true
            sprites.MenuBtn2.buttonMode = true
            sprites.MenuBtn2.on('pointerdown', () => clickOnMenu(2))

            sprites.MenuBtn3.interactive = true
            sprites.MenuBtn3.buttonMode = true
            sprites.MenuBtn3.on('pointerdown', () => clickOnMenu(3))
          })
        tweenShowMenu.start()

        const tweenHideHammer = new TWEEN.Tween(sprites.IcoHammer)
          .to({alpha: 0}, 500)
          .easing(TWEEN.Easing.Cubic.Out)
          .onComplete(() => {
            sprites.IcoHammer.visible = false
          })
        tweenHideHammer.start()
      })
    })
  tweenShowHammer.start()

  const dropPos = sprites.IcoHammer.y
  sprites.IcoHammer.y -= 50
  const tweenDropHammer = new TWEEN.Tween(sprites.IcoHammer)
    .to({y: dropPos}, 1000)
    .easing(TWEEN.Easing.Bounce.Out)
    .delay(1000)
  tweenDropHammer.start()

  const tweenScaleCtaBtn = new TWEEN.Tween(sprites.CtaBtn.scale)
    .to({x: 1.1, y: 1.1}, 1500)
    .repeat(Infinity)
    .yoyo(true)
  tweenScaleCtaBtn.start()

  animate()
}

function makeScene() {
  container.addChild(sprites.Room)

  sprites.DecorTable.x = 230
  sprites.DecorTable.y = 210
  container.addChild(sprites.DecorTable)

  sprites.DecorPaint1.x = 450
  sprites.DecorPaint1.y = -35
  container.addChild(sprites.DecorPaint1)

  sprites.DecorPaint12.x = 1135
  sprites.DecorPaint12.y = 170
  container.addChild(sprites.DecorPaint12)

  sprites.DecorGlobe.x = 110
  sprites.DecorGlobe.y = 130
  container.addChild(sprites.DecorGlobe)

  sprites.DecorBookStand.x = 840
  sprites.DecorBookStand.y = -30
  container.addChild(sprites.DecorBookStand)

  sprites.DecorSofa.x = 150
  sprites.DecorSofa.y = 330
  container.addChild(sprites.DecorSofa)

  sprites.Austin.x = 700
  sprites.Austin.y = 110
  container.addChild(sprites.Austin)

  sprites.StairOld.x = 900
  sprites.StairOld.y = 0
  container.addChild(sprites.StairOld)

  sprites.StairNew1.x = 900
  sprites.StairNew1.y = 0
  sprites.StairNew1.visible = false
  container.addChild(sprites.StairNew1)

  sprites.StairNew2.x = 900
  sprites.StairNew2.y = 0
  sprites.StairNew2.visible = false
  container.addChild(sprites.StairNew2)

  sprites.StairNew3.x = 900
  sprites.StairNew3.y = 0
  sprites.StairNew3.visible = false
  container.addChild(sprites.StairNew3)

  currentStair = sprites.StairOld

  sprites.DecorPaint2.x = 1150
  sprites.DecorPaint2.y = 430
  container.addChild(sprites.DecorPaint2)

  menuContainer.addChild(sprites.MenuBtn1)

  sprites.MenuBtn2.x = 130
  menuContainer.addChild(sprites.MenuBtn2)

  sprites.MenuBtn3.x = 260
  menuContainer.addChild(sprites.MenuBtn3)

  menuContainer.addChild(sprites.SmallStairNew1)
  sprites.SmallStairNew1.anchor.set(0.5)
  sprites.SmallStairNew1.x = sprites.MenuBtn1.x + sprites.MenuBtn1.width * 0.5
  sprites.SmallStairNew1.y = sprites.MenuBtn1.y + sprites.MenuBtn1.height * 0.5 - 5

  menuContainer.addChild(sprites.SmallStairNew2)
  sprites.SmallStairNew2.anchor.set(0.5)
  sprites.SmallStairNew2.x = sprites.MenuBtn2.x + sprites.MenuBtn2.width * 0.5
  sprites.SmallStairNew2.y = sprites.MenuBtn2.y + sprites.MenuBtn2.height * 0.5 - 5

  menuContainer.addChild(sprites.SmallStairNew3)
  sprites.SmallStairNew3.anchor.set(0.5)
  sprites.SmallStairNew3.x = sprites.MenuBtn3.x + sprites.MenuBtn3.width * 0.5
  sprites.SmallStairNew3.y = sprites.MenuBtn3.y + sprites.MenuBtn3.height * 0.5 - 5

  sprites.BtnOK.anchor.set(0.5)
  sprites.BtnOK.visible = false
  menuContainer.addChild(sprites.BtnOK)
  sprites.BtnOK.interactive = true
  sprites.BtnOK.buttonMode = true
  sprites.BtnOK.on('pointerdown', clickOnOkBtn)

  sprites.IcoHammer.x = 1090
  sprites.IcoHammer.y = 245
  sprites.IcoHammer.visible = false
  sprites.IcoHammer.alpha = 0
  container.addChild(sprites.IcoHammer)

  const shadow = new PIXI.Graphics()
  shadow.beginFill(0x000000, 0.75)
  shadow.drawRect(0, 0, app.stage.width, app.stage.height)
  shadow.endFill()
  shadow.visible = false
  UIContainer.addChild(shadow)
  sprites.shadow = shadow

  sprites.Final.x = 400
  sprites.Final.y = 70
  sprites.Final.visible = false
  UIContainer.addChild(sprites.Final)

  sprites.Logo.x = 23
  UIContainer.addChild(sprites.Logo)

  sprites.CtaBtn.x = 702
  sprites.CtaBtn.y = 562
  sprites.CtaBtn.anchor.set(0.5)
  UIContainer.addChild(sprites.CtaBtn)
  sprites.CtaBtn.interactive = true
  sprites.CtaBtn.buttonMode = true
  sprites.CtaBtn.on('pointerdown', clickOnCTA)

  startGame()
}

loader.onComplete.add(() => {
  makeScene()
})
