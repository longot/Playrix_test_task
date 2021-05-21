/* eslint-disable no-prototype-builtins */
import * as PIXI from 'pixi.js'
import TWEEN from '@tweenjs/tween.js'

export default class Game {
  constructor(config) {
    this.config = config
    this.app = window.GameApplication
    this.gameElements = {}
    this.currentTweenList = {}

    const container = new PIXI.Container()
    this.app.stage.addChild(container)
    this.gameElements.container = container

    const menuContainer = new PIXI.Container()
    this.app.stage.addChild(menuContainer)
    this.gameElements.menuContainer = menuContainer
    menuContainer.x = 840
    menuContainer.y = 5
    menuContainer.visible = false

    const UIContainer = new PIXI.Container()
    this.app.stage.addChild(UIContainer)
    this.gameElements.UIContainer = UIContainer

    this.currentStair = null
    this.oldStair = null
    this.disableClick = false
  }

  makeScene() {
    const textures = PIXI.utils.TextureCache

    const {gameElements, config} = this
    const {container, UIContainer, menuContainer} = gameElements

    config.elements.forEach((element) => {
      if (element.disabled) return
      if (element.hasOwnProperty('key')) {
        const textureName = element.texture ? element.texture : element.key
        const sprite = new PIXI.Sprite(textures[textureName])
        if (element.hasOwnProperty('container')) {
          if (element.container === 'UI') {
            UIContainer.addChild(sprite)
          }
          if (element.container === 'menu') {
            menuContainer.addChild(sprite)
          }
        } else {
          container.addChild(sprite)
        }
        gameElements[element.key] = sprite
        sprite.x = element.x
        sprite.y = element.y

        if (element.hasOwnProperty('visible')) {
          sprite.visible = element.visible
        }
        if (element.hasOwnProperty('alpha')) {
          sprite.alpha = element.alpha
        }
        if (element.hasOwnProperty('anchor')) {
          sprite.anchor.set(element.anchor)
        }
      }
      if (element.hasOwnProperty('shadow')) {
        const shadow = new PIXI.Graphics()
        shadow.beginFill(0x000000, 0.75)
        shadow.drawRect(0, 0, this.app.stage.width, this.app.stage.height)
        shadow.endFill()
        shadow.visible = false
        UIContainer.addChild(shadow)
        gameElements.shadow = shadow
      }
    })

    this.currentStair = gameElements.StairOld

    gameElements.CtaBtn.interactive = true
    gameElements.CtaBtn.buttonMode = true
    gameElements.CtaBtn.on('pointerdown', this.clickOnCTA, this)

    gameElements.SmallStairNew1.x = gameElements.MenuBtn1.x + gameElements.MenuBtn1.width * 0.5
    gameElements.SmallStairNew1.y = gameElements.MenuBtn1.y + gameElements.MenuBtn1.height * 0.5 - 5

    gameElements.SmallStairNew2.x = gameElements.MenuBtn2.x + gameElements.MenuBtn2.width * 0.5
    gameElements.SmallStairNew2.y = gameElements.MenuBtn2.y + gameElements.MenuBtn2.height * 0.5 - 5

    gameElements.SmallStairNew3.x = gameElements.MenuBtn3.x + gameElements.MenuBtn3.width * 0.5
    gameElements.SmallStairNew3.y = gameElements.MenuBtn3.y + gameElements.MenuBtn3.height * 0.5 - 5

    gameElements.BtnOK.interactive = true
    gameElements.BtnOK.buttonMode = true
    gameElements.BtnOK.on('pointerdown', this.clickOnOkBtn, this)
  }

  startGame() {
    const {gameElements} = this
    const {IcoHammer, CtaBtn} = gameElements

    IcoHammer.visible = true
    const tweenShowHammer = new TWEEN.Tween(IcoHammer)
      .to({
        alpha: 1,
      }, 1000)
      .delay(1000)
      .onComplete(() => {
        IcoHammer.interactive = true
        IcoHammer.buttonMode = true
        IcoHammer.on('pointerdown', this.clickOnHammer, this)
      })
    tweenShowHammer.start()

    const dropPos = IcoHammer.y
    IcoHammer.y -= 50
    const tweenDropHammer = new TWEEN.Tween(IcoHammer)
      .to({
        y: dropPos,
      }, 1000)
      .easing(TWEEN.Easing.Bounce.Out)
      .delay(1000)
    tweenDropHammer.start()

    const tweenScaleCtaBtn = new TWEEN.Tween(CtaBtn.scale)
      .to({
        x: 1.1,
        y: 1.1,
      }, 1500)
      .repeat(Infinity)
      .yoyo(true)
    tweenScaleCtaBtn.start()
    this.animate()
  }

  clickOnHammer() {
    const {gameElements} = this
    const {
      IcoHammer, menuContainer, MenuBtn1, MenuBtn2, MenuBtn3,
    } = gameElements

    menuContainer.visible = true
    menuContainer.alpha = 0

    const tweenShowMenu = new TWEEN.Tween(menuContainer)
      .to({
        alpha: 1,
      }, 500)
      .easing(TWEEN.Easing.Circular.Out)
      .onComplete(() => {
        MenuBtn1.interactive = true
        MenuBtn1.buttonMode = true
        MenuBtn1.on('pointerdown', () => this.clickOnMenu(1), this)

        MenuBtn2.interactive = true
        MenuBtn2.buttonMode = true
        MenuBtn2.on('pointerdown', () => this.clickOnMenu(2), this)

        MenuBtn3.interactive = true
        MenuBtn3.buttonMode = true
        MenuBtn3.on('pointerdown', () => this.clickOnMenu(3), this)
      })
    tweenShowMenu.start()

    const tweenHideHammer = new TWEEN.Tween(IcoHammer)
      .to({
        alpha: 0,
      }, 500)
      .easing(TWEEN.Easing.Cubic.Out)
      .onComplete(() => {
        IcoHammer.visible = false
      })
    tweenHideHammer.start()
  }

  clickOnMenu(id) {
    const {gameElements, currentStair} = this
    const {
      MenuBtn1, MenuBtn2, MenuBtn3, BtnOK,
    } = gameElements
    const textures = PIXI.utils.TextureCache

    const newStair = gameElements[`StairNew${id}`]

    if (currentStair === newStair || this.disableClick) return

    MenuBtn1.texture = textures.MenuCircle
    MenuBtn2.texture = textures.MenuCircle
    MenuBtn3.texture = textures.MenuCircle
    const currentMenuBtn = gameElements[`MenuBtn${id}`]
    currentMenuBtn.texture = textures.MenuCircleChoosed

    BtnOK.visible = true
    BtnOK.x = currentMenuBtn.x + currentMenuBtn.width * 0.5
    BtnOK.y = currentMenuBtn.y + currentMenuBtn.height + 15

    if (this.currentTweenList.newStairShowTw && this.currentTweenList.newStairShowTw.isPlaying()) {
      this.currentTweenList.newStairShowTw.stop()
      currentStair.alpha = 0
    }
    if (this.currentTweenList.currentStairHideTw && this.currentTweenList.currentStairHideTw.isPlaying()) {
      this.currentTweenList.currentStairHideTw.stop()
      this.oldStair.alpha = 0
    }
    if (this.currentTweenList.newStairDropTw && this.currentTweenList.newStairDropTw.isPlaying()) {
      this.currentTweenList.newStairDropTw.stop()
    }

    this.oldStair = currentStair
    const currentStairHideTw = new TWEEN.Tween(currentStair)
      .to({
        alpha: 0,
      }, 250)
      .onComplete(() => {
        this.oldStair.visible = false
      })
    this.currentTweenList.currentStairHideTw = currentStairHideTw

    newStair.visible = true
    newStair.alpha = 0
    newStair.y = -400

    const newStairShowTw = new TWEEN.Tween(newStair)
      .to({
        alpha: 1,
      }, 500)
      .easing(TWEEN.Easing.Cubic.In)
    this.currentTweenList.newStairShowTw = newStairShowTw

    const newStairDropTw = new TWEEN.Tween(newStair)
      .to({
        y: 0,
      }, 500)
      .easing(TWEEN.Easing.Cubic.Out)
    this.currentTweenList.newStairDropTw = newStairDropTw

    currentStairHideTw.start()
    newStairShowTw.start()
    newStairDropTw.start()

    this.currentStair = newStair
  }

  clickOnOkBtn() {
    if (this.disableClick) return

    const {gameElements} = this
    const {
      shadow, Final, MenuBtn1, MenuBtn2, MenuBtn3, BtnOK,
    } = gameElements

    shadow.visible = true
    shadow.alpha = 0
    Final.visible = true
    Final.alpha = 0

    new TWEEN.Tween(shadow)
      .to({
        alpha: 1,
      }, 500)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()
    new TWEEN.Tween(Final)
      .to({
        alpha: 1,
      }, 500)
      .easing(TWEEN.Easing.Sinusoidal.Out)
      .start()

    this.disableClick = true
    MenuBtn1.interactive = false
    MenuBtn2.interactive = false
    MenuBtn3.interactive = false
    BtnOK.interactive = false
  }

  clickOnCTA() {
    document.location.href = this.config.location
  }

  animate(time) {
    const id = requestAnimationFrame(() => this.animate(time))
    const result = TWEEN.update(time)
    if (!result) cancelAnimationFrame(id)
  }
}
