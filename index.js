// eslint-disable-next-line
function img (opts) {
  // ----

  const mode = Object.assign({
    random: false,
    hide: false,
    info: false
  }, opts, {
    fullscreen: false // auto fullscreen does not work
  })

  // ----

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

  const inc = (i, max) => (i + 1) % max
  const dec = (i, max) => (i - 1 + max) % max

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

  // ----

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

  function showInfo () {
    const id = document.getElementById('name')
    const text = (!mode.hide && mode.info) ? list[i] : ''
    id.innerText = text
  }

  function show (inc) {
    const id = document.getElementById('img')
    if (mode.hide) {
      id.innerHTML = null
      showInfo()
      return
    }
    if (mode.random && inc) {
      if (inc < 0) {
        i = stack.undo()
      } else {
        i = stack.redo()
        if (i === undefined) {
          i = random.next()
          stack.push(i)
        }
      }
    } else {
      i += inc
    }
    if (i < 0) { i = 0 }
    if (i > end) { i = end }
    window.scrollTo(0, 0)
    const src = list[i]
    if (src) {
      id.innerHTML = `<img src="${src}">`
      showInfo()
    }
  }

  // ----

  // eslint-disable-next-line no-undef
  const list = files.split(/[\n\r]/).filter(Boolean).map(file => file.trim()).sort()
  const end = list.length
  const random = new ShuffledArray(end)
  const stack = new UndoStack()
  let i = mode.random ? random.next() : 0

  if (window.location.hash === '#prev') {
    i = end
  } else if (/^#\d+$/.test(window.location.hash)) {
    i = Number(window.location.hash.substring(1))
  }

  show(0)

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
        if (!scrollDown()) show(ev.ctrlKey ? 10 : 1)
        break
      case 'ArrowLeft':
        if (!scrollUp()) show(ev.ctrlKey ? -10 : -1)
        break
      case 'q':
      case 'Escape':
        mode.hide = !mode.hide
        show(0)
        break
      case 'r':
        mode.random = !mode.random
        break
      case 'f':
        mode.fullscreen = !mode.fullscreen
        fullscreen(mode.fullscreen)
        break
      case 'i':
        mode.info = !mode.info
        showInfo()
        break
    }
  })
}
