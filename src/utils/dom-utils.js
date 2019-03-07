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


export {
  getDomValue
}