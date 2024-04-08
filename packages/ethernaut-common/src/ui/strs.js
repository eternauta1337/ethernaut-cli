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

  pushAll(fields) {
    for (const field of fields) {
      const value = this.obj[field]
      if (value !== undefined && value !== null) {
        this.push(`${field}: ${value}`)
      }
    }
  }

  print() {
    return this.arr.join('\n')
  }
}

module.exports = Strs
