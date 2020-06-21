(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
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

},{"./ShuffledArray.js":2,"./UndoStack.js":3,"./utils.js":5}],2:[function(require,module,exports){
class ShuffledArray {
  constructor (length) {
    this.length = length
    this._reset()
  }

  _reset () {
    this._values = new Array(this.length).fill()
      .map((_, i) => ({ r: Math.random(), i }))
      .sort((a, b) => a.r - b.r)
      .map(({ i }) => i)
  }

  next () {
    const v = this._values.pop()
    if (this._values.length === 0) this._reset()
    return v
  }
}

module.exports = ShuffledArray

},{}],3:[function(require,module,exports){
const inc = (i, max) => (i + 1) % max
const dec = (i, max) => (i - 1 + max) % max

class UndoStack {
  constructor ({ max = 100, stack = [] } = {}) {
    this.max = max
    this.stack = stack
    this.low = 0
    this.pos = this.high = stack.length - 1
  }

  push (item) {
    this.pos += 1
    if (this.pos < this.max && this.stack.length < this.max) {
      this.stack.push(item)
    } else {
      this.pos %= this.max
      this.stack[this.pos] = item
      if (this.pos === this.low) {
        this.low = inc(this.low, this.max)
      }
    }
    this.high = this.pos
    return this
  }

  last () {
    return this.stack[this.pos]
  }

  undo () {
    if (this.pos === this.low) return
    this.pos = dec(this.pos, this.max)
    return this.last()
  }

  redo () {
    if (this.pos === this.high) return
    this.pos = inc(this.pos, this.max)
    return this.last()
  }
}

module.exports = UndoStack

},{}],4:[function(require,module,exports){
const Show = require('./Show.js')
const {
  scrollDown,
  scrollUp
} = require('./utils.js')

// eslint-disable-next-line
function img (opts) {
  // ----

  // eslint-disable-next-line no-undef
  const list = files.split(/[\n\r]/).filter(Boolean).map(file => file.trim()).sort()
  const show = new Show (list, opts)

  if (window.location.hash === '#prev') {
    show.i = list.length
  } else if (/^#\d+$/.test(window.location.hash)) {
    show.i = Number(window.location.hash.substring(1))
  }

  show.init()

  window.addEventListener('keydown', (ev) => {
    // console.log(ev)
    let key
    switch (ev.key) {
      case ' ': {
        key = ev.shiftKey ? 'ArrowLeft' : 'ArrowRight'
      }
    }
    switch (key || ev.key) {
      case 'ArrowRight':
        if (!scrollDown()) show.update(ev.ctrlKey ? 10 : 1)
        break
      case 'ArrowLeft':
        if (!scrollUp()) show.update(ev.ctrlKey ? -10 : -1)
        break
      case 'q':
      case 'Escape':
        show.toggle('hide')
        show.update(0)
        break
      case 'c':
        show.toggle('cursor')
        break
      case 'r':
        show.toggle('random')
        break
      case 'f':
        show.toggle('fullscreen')
        break
      case 'i':
        show.toggle('info')
        break
    }
  })
}

window.img = img

},{"./Show.js":1,"./utils.js":5}],5:[function(require,module,exports){
const atPageTop = () => (window.scrollY === 0)
const atPageBottom = () => ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)

const scrollDown = () => {
  if (!atPageBottom()) {
    window.scrollTo(0, window.scrollY + window.innerHeight)
    return true
  }
}

const scrollUp = () => {
  if (!atPageTop()) {
    window.scrollTo(0, window.scrollY - window.innerHeight)
    return true
  }
}

const fullscreen = (mode) => mode
  ? document.body.requestFullscreen()
  : document.exitFullscreen()

module.exports = {
  atPageTop,
  atPageBottom,
  scrollDown,
  scrollUp,
  fullscreen
}

},{}]},{},[4]);
