class Recorder {
  args
  constructor(...args) {
    this.args = args
  }
  toString() {
    return this.args.reduce((previous, current) => previous + current, "")
  }
  toHtml() {
    let div = document.createElement("div")
    div.setAttribute("id", "divElement")
    this.args.forEach(item => {
      let p = document.createElement("p")
      p.setAttribute("id", "pElement-" + item)
      div.appendChild(p)
    })
    document.body.appendChild(div)
  }
}
module.exports = {
  Recorder
}
