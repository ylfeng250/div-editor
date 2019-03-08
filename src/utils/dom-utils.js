function getDomValue (elem) {
  var res = ''
  Array.from(elem.childNodes).forEach((child) => {
    if (child.nodeName === '#text') {
      res += child.nodeValue
    } else if (child.nodeName === 'BR') {
      res += '\n'
    } else if (child.nodeName === 'BUTTON') {
      res += getDomValue(child)
    } else if (child.nodeName === 'IMG') {
      res += child.alt
    } else if (child.nodeName === 'DIV') {
      res += '\n' + getDomValue(child)
    }
  })
  return res
}

function insertHtmlAtCaret (html) {
  var sel, range, frag
  if (window.getSelection) {
    sel = window.getSelection()
    if (sel.getRangeAt && sel.rangeCount) {
      range = sel.getRangeAt(0)
      range.deleteContents()
      var el = document.createElement('div')
      el.innerHTML = html
      frag = document.createDocumentFragment()
      var node
      var lastNode
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node)
      }
      range.insertNode(frag)
      if (lastNode) {
        range = range.cloneRange()
        range.setStartAfter(lastNode)
        range.collapse(true)
        sel.removeAllRanges()
        sel.addRange(range)
      }
    }
  }
}
export {
  getDomValue,
  insertHtmlAtCaret
}