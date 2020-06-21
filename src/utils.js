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
