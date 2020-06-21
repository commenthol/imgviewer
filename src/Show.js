const UndoStack = require('./UndoStack.js')
const ShuffledArray = require('./ShuffledArray.js')
const {fullscreen} = require('./utils.js')

class Show {
  constructor (list, opts) {
    this.mode = Object.assign({
      random: false,
      hide: false,
      info: false,
      cursor: false,
    }, opts, {
      fullscreen: false // auto fullscreen does not work
    })

    this.list = list
    this.end = list.length
    this.random = new ShuffledArray(this.end)
    this.stack = new UndoStack()
    this.i = this.mode.random ? this.random.next() : 0

    this.img = document.createElement('img')
    // preload next image
    this.nextimg = document.createElement('img')

    this.imgId = document.getElementById('img')
    this.imgId.appendChild(this.img)
  }

  init () {
    this.cursor()
    this.info()
    this.update(0)
  }

  info () {
    const { mode, list } = this
    const id = document.getElementById('name')
    const text = (!mode.hide && mode.info) ? list[this.i] : ''
    const status = mode.random ? '(random)' : ''
    id.innerText = [status, text].join(' ')
  }

  cursor () {
    document.body.style.cursor = this.mode.cursor
      ? 'auto'
      : 'none'
  }

  hide () {
    if (this.mode.hide) {
      this.imgId.style.visibility = 'hidden'
      this.info()
      return true
    } else {
      this.imgId.style.visibility = 'unset'
    }
  }

  update (inc) {
    const { mode, list, stack, random, end } = this

    if (this.hide()) return

    if (mode.random && inc) {
      if (inc < 0) {
        this.i = stack.undo()
      } else {
        this.i = stack.redo()
        if (this.i === undefined) {
          this.i = random.next()
          stack.push(this.i)
        }
      }
    } else {
      this.i += inc
    }
    if (this.i < 0) {
      this.i = 0
    }
    if (this.i > end) {
      this.i = end
    }
    window.scrollTo(0, 0)
    const src = list[this.i]
    if (src) {
      this.img.src = src
      this.info()
    }
    const nextSrc = list[this.i + 1]
    if (nextSrc) {
      this.nextimg = nextSrc
    }
  }

  toggle (key) {
    this.mode[key] = !this.mode[key]

    switch (key) {
      case 'fullscreen':
        fullscreen(this.mode.fullscreen)
        break
      case 'random':
      case 'info':
        this.info()
        break
      case 'cursor':
        this.cursor()
        break
    }
  }
}

module.exports = Show
