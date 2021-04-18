export default class extends Phaser.State {
  init() {
    this.elements = {}
    this.game.stage.disableVisibilityChange = true
  }

  preload() {
    this.load.crossOrigin = 'Anonymous'

    const resources = [{
      key: 'Austin',
      url: require('assets/Austin.png'),
    }, {
      key: 'btn_ico',
      url: require('assets/btn_ico.png'),
    }, {
      key: 'cta_btn',
      url: require('assets/cta_btn.png'),
    }, {
      key: 'decor_book_stand',
      url: require('assets/decor_book_stand.png'),
    }, {
      key: 'decor_globe',
      url: require('assets/decor_globe.png'),
    }, {
      key: 'decor_paint1',
      url: require('assets/decor_paint1.png'),
    }, {
      key: 'decor_paint2',
      url: require('assets/decor_paint2.png'),
    }, {
      key: 'decor_sofa',
      url: require('assets/decor_sofa.png'),
    }, {
      key: 'decor_table',
      url: require('assets/decor_table.png'),
    }, {
      key: 'final',
      url: require('assets/final.png'),
    }, {
      key: 'icon_hammer',
      url: require('assets/icon_hammer.png'),
    }, {
      key: 'logo',
      url: require('assets/logo.png'),
    }, {
      key: 'menu_circle',
      url: require('assets/menu_circle.png'),
    }, {
      key: 'menu_circle_choosed',
      url: require('assets/menu_circle_choosed.png'),
    }, {
      key: 'room',
      url: require('assets/room.jpg'),
    }, {
      key: 'small_stair_new_01',
      url: require('assets/small_stair_new_01.png'),
    }, {
      key: 'small_stair_new_02',
      url: require('assets/small_stair_new_02.png'),
    }, {
      key: 'small_stair_new_03',
      url: require('assets/small_stair_new_03.png'),
    }, {
      key: 'stair_new_01',
      url: require('assets/stair_new_01.png'),
    }, {
      key: 'stair_new_02',
      url: require('assets/stair_new_02.png'),
    }, {
      key: 'stair_new_03',
      url: require('assets/stair_new_03.png'),
    }, {
      key: 'stair_old',
      url: require('assets/stair_old.png'),
    }]

    resources.forEach((resource) => {
      this.load.image(resource.key, resource.url)
    })
  }

  /**
   * @param {Phaser.Game} game - A reference to the currently running game.
   */
  // eslint-disable-next-line class-methods-use-this
  create(game) {
    game.add.image(0, 0, 'room')
    game.add.image(230, 210, 'decor_table')
    game.add.image(450, -35, 'decor_paint1')
    game.add.image(1135, 170, 'decor_paint1')
    game.add.image(110, 130, 'decor_globe')
    game.add.image(840, -30, 'decor_book_stand')
    game.add.image(150, 330, 'decor_sofa')
    game.add.sprite(700, 110, 'Austin')

    const stair = game.add.image(900, 0, 'stair_old')
    this.elements.stair = stair

    const stairNew01 = game.add.image(900, 0, 'stair_new_01')
    stairNew01.visible = false
    this.elements.stairNew01 = stairNew01

    const stairNew02 = game.add.image(900, 0, 'stair_new_02')
    stairNew02.visible = false
    this.elements.stairNew02 = stairNew02

    const stairNew03 = game.add.image(900, 0, 'stair_new_03')
    stairNew03.visible = false
    this.elements.stairNew03 = stairNew03

    this.elements.currentStair = stair

    game.add.image(1150, 430, 'decor_paint2')

    const menuGroup = game.make.group(game.world)
    this.elements.menuGroup = menuGroup

    menuGroup.x = 840
    menuGroup.y = 5
    menuGroup.visible = false

    const menuBtn1 = game.add.image(0, 0, 'menu_circle')
    menuBtn1.name = '01'
    this.elements.menuBtn1 = menuBtn1

    const menuBtn2 = game.add.image(130, 0, 'menu_circle')
    menuBtn2.name = '02'
    this.elements.menuBtn2 = menuBtn2

    const menuBtn3 = game.add.image(260, 0, 'menu_circle')
    menuBtn3.name = '03'
    this.elements.menuBtn3 = menuBtn3

    menuGroup.add(menuBtn1)
    menuGroup.add(menuBtn2)
    menuGroup.add(menuBtn3)

    menuBtn1.inputEnabled = true
    menuBtn1.events.onInputDown.add(this.clickOnMenu, this)

    menuBtn2.inputEnabled = true
    menuBtn2.events.onInputDown.add(this.clickOnMenu, this)

    menuBtn3.inputEnabled = true
    menuBtn3.events.onInputDown.add(this.clickOnMenu, this)

    const newStairSmall01 = game.add.image(menuBtn1.centerX, menuBtn1.centerY - 5, 'small_stair_new_01')
    newStairSmall01.anchor.setTo(0.5)
    menuGroup.add(newStairSmall01)

    const newStairSmall02 = game.add.image(menuBtn2.centerX, menuBtn2.centerY - 5, 'small_stair_new_02')
    newStairSmall02.anchor.setTo(0.5)
    menuGroup.add(newStairSmall02)

    const newStairSmall03 = game.add.image(menuBtn3.centerX, menuBtn3.centerY - 5, 'small_stair_new_03')
    newStairSmall03.anchor.setTo(0.5)
    menuGroup.add(newStairSmall03)

    const btnOK = game.add.image(0, 0, 'btn_ico')
    btnOK.anchor.setTo(0.5)
    btnOK.visible = false
    menuGroup.add(btnOK)
    this.elements.btnOK = btnOK

    btnOK.inputEnabled = true
    btnOK.events.onInputDown.addOnce(() => {
      this.clickOnOkBtn()
    })

    const icoHammer = game.add.image(1090, 245, 'icon_hammer')
    icoHammer.alpha = 0

    game.add.tween(icoHammer)
      .to({alpha: 1}, Phaser.Timer.SECOND, 'Linear', true, Phaser.Timer.SECOND)
      .onComplete.addOnce(() => {
        icoHammer.inputEnabled = true
        icoHammer.events.onInputDown.addOnce(() => {
          menuGroup.visible = true
          menuGroup.alpha = 0

          game.add.tween(menuGroup)
            .to({alpha: 1}, Phaser.Timer.HALF, Phaser.Easing.Circular.Out, true)
          game.add.tween(icoHammer)
            .to({alpha: 0}, Phaser.Timer.HALF, Phaser.Easing.Cubic.Out, true)
            .onComplete.addOnce(() => {
              icoHammer.visible = false
            })
        })
      })
    game.add.tween(icoHammer)
      .from({y: icoHammer.y - 50}, Phaser.Timer.SECOND, Phaser.Easing.Bounce.Out)
      .delay(Phaser.Timer.SECOND)
      .start()

    const shadow = game.add.graphics(0, 0)
    shadow.beginFill(0x000000, 0.75)
    shadow.drawRect(0, 0, game.width, game.height)
    shadow.visible = false
    this.elements.shadow = shadow

    game.add.image(25, 0, 'logo')
    const finalSprite = game.add.image(400, 70, 'final')
    finalSprite.visible = false
    this.elements.final = finalSprite

    const cta = game.add.image(702, 562, 'cta_btn')
    cta.anchor.set(0.5)
    cta.inputEnabled = true
    cta.events.onInputDown.add(this.clickOnCTA, this)

    game.add.tween(cta.scale)
      .to({x: 1.1, y: 1.1}, Phaser.Timer.SECOND)
      .repeat(-1)
      .yoyo(true)
      .start()
  }

  clickOnMenu(currentMenuSprite) {
    const {currentStair} = this.elements
    const stairNewName = `stairNew${currentMenuSprite.name}`
    const newStair = this.elements[stairNewName]

    if (currentStair === newStair || this.disableClick) return

    if (this.elements.newStairShowTw && this.elements.newStairShowTw.isRunning) {
      this.elements.newStairShowTw.stop()
    }
    if (this.elements.currentStairHideTw && this.elements.currentStairHideTw.isRunning) {
      this.elements.currentStairHideTw.stop()
    }

    this.elements.menuBtn1.loadTexture('menu_circle')
    this.elements.menuBtn2.loadTexture('menu_circle')
    this.elements.menuBtn3.loadTexture('menu_circle')
    currentMenuSprite.loadTexture('menu_circle_choosed')

    this.elements.currentStairHideTw = this.game.add.tween(currentStair)
      .to({alpha: 0}, Phaser.Timer.QUARTER, Phaser.Easing.Circular.Out, true)

    newStair.visible = true
    newStair.alpha = 0

    this.elements.newStairShowTw = this.game.add.tween(newStair)
      .to({alpha: 1}, Phaser.Timer.HALF, Phaser.Easing.Sinusoidal.Out, true)

    this.elements.newStairPosTw = this.game.add.tween(newStair)
      .from({y: newStair.y - 80}, Phaser.Timer.HALF, Phaser.Easing.Cubic.Out, true)

    this.elements.currentStair = newStair
    this.elements.currentStairShowTw = newStair

    this.elements.btnOK.visible = true
    this.elements.btnOK.centerX = currentMenuSprite.centerX
    this.elements.btnOK.y = currentMenuSprite.bottom + 15
  }

  clickOnOkBtn() {
    if (this.disableClick) return

    const {shadow, final} = this.elements
    shadow.visible = true
    shadow.alpha = 0
    final.visible = true
    final.alpha = 0
    this.game.add.tween(shadow)
      .to({alpha: 1}, Phaser.Timer.HALF, Phaser.Easing.Sinusoidal.Out, true)
    this.game.add.tween(final)
      .to({alpha: 1}, Phaser.Timer.HALF, Phaser.Easing.Sinusoidal.Out, true)

    this.disableClick = true
  }

  // eslint-disable-next-line class-methods-use-this
  clickOnCTA() {
    document.location.href = 'https://playrix.com'
  }
}
