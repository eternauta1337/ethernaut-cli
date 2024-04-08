class Strs {
  constructor(obj) {
    this.arr = []
    this.obj = obj
  }

  push(str) {
    const containsUndefined = str.includes('undefined')
    const containsNull = str.includes('null')
    if (!containsUndefined && !containsNull) {
      this.arr.push(str)
    }
  }

  print() {
    return this.arr.join('\n')
  }
}

module.exports = Strs
