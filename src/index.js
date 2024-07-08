const Show = require('./Show.js')
const { scrollDown, scrollUp } = require('./utils.js')

// eslint-disable-next-line
function img(opts) {
  // ----

  // eslint-disable-next-line no-undef
  const list = files
    .split(/[\n\r]/)
    .filter(Boolean)
    .map((file) => file.trim())
    .sort()
  const show = new Show(list, opts)

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
        scrollDown()
        show.update(ev.ctrlKey ? 10 : 1)
        break
      case 'ArrowLeft':
        scrollUp()
        show.update(ev.ctrlKey ? -10 : -1)
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
