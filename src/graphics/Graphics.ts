export class Point {
  x: number
  y: number

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }
}

export class Rect {
  left: number
  top: number
  right: number
  bottom: number

  constructor(left = 0, top = 0, right = 0, bottom = 0) {
    this.left = left
    this.top = top
    this.right = right
    this.bottom = bottom
  }

  fromPoints(start: Point, end: Point) {
    this.left = start.x <= end.x ? start.x : end.x
    this.top = start.y <= end.y ? start.y : end.y
    this.right = start.x >= end.x ? start.x : end.x
    this.bottom = start.y >= end.y ? start.y : end.y
  }
}
