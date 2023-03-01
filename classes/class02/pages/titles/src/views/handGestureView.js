export default class HandGestureVeiw {
  loop(fn) {
    requestAnimationFrame(fn)
  }

  scrollPage(top) {
    scroll({
      top,
      behavior: 'smooth'
    })
  }
}