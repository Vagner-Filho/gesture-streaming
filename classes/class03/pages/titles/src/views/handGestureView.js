export default class HandGestureVeiw {
  #canvasHands = document.getElementById('hands')
  #canvasHandsCtx = this.#canvasHands.getContext('2d')
  #fingerLookupIndexes
  constructor({ fingerLookupIndexes }) {
    this.#canvasHands.width = globalThis.screen.availWidth
    this.#canvasHands.height = globalThis.screen.availHeight
    this.#fingerLookupIndexes = fingerLookupIndexes
  }

  clearCanvas() {
    this.#canvasHandsCtx.clearRect(0, 0, this.#canvasHands.width, this.#canvasHands.height)
  }

  clickOnElement(x, y) {
    const el = document.elementFromPoint(x, y)
    if (!el) return;

    const clientRect = el.getBoundingClientRect();
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
      clientX: clientRect.left + x,
      clientY: clientRect.top + y
    })

    el.dispatchEvent(event)
  }

  drawResults(hands) {
    for (const { keypoints, handedness } of hands) {
      if (!keypoints) continue

      this.#canvasHandsCtx.fillStyle = handedness === "Left" ? "yellow" : "pink"
      this.#canvasHandsCtx.strokeStyle = "white"
      this.#canvasHandsCtx.lineWidth = 8
      this.#canvasHandsCtx.lineJoin = "round"

      this.#drawJoints(keypoints)
      this.#drawFingersAndHoverElements(keypoints)
    }
  }

  #drawJoints(keypoints) {
    for (const { x, y } of keypoints) {
      this.#canvasHandsCtx.beginPath()
      const smallerX = x - 2
      const smallerY = y - 2
      const radius = 3
      const startAngle = 0
      const endAngle = 2 * Math.PI

      this.#canvasHandsCtx.arc(smallerX, smallerY, radius, startAngle, endAngle)
      this.#canvasHandsCtx.fill()
    }
  }

  #drawFingersAndHoverElements(keypoints) {
    const fingers = Object.keys(this.#fingerLookupIndexes)

    for (const finger of fingers) {
      const points = this.#fingerLookupIndexes[finger].map(index => keypoints[index])
      const region = new Path2D()
      const [{ x, y }] = points
      region.moveTo(x, y)
      for (const point of points) {
        region.lineTo(point.x, point.y)
      }
      this.#canvasHandsCtx.stroke(region)
    }
  }
  
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