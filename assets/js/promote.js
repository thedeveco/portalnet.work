const input = document.getElementById("tags")
const form = document.getElementById("form")
const container = document.getElementById("tags-container")
const spans = {}
const MAX = 5

form.action = getBackendURL() + "/promote"

function size(obj) {
  let i = 0
  for (k in obj) {
    i++
  }
  return i
}

function removeSpan(text) {
  if (text in spans) {
    this.removeChild(spans[text])
    delete spans[text]
  }
  input.disabled = false
}

input.onbeforeinput = function(e) {
  switch (e.data) {
  case null:
    if (input.value !== "") {
      return
    }
    let key, i = 0
    for (key in spans) {
      i++
    }
    if (i === 0) {
      return
    }
    removeSpan.bind(container)(key)
    input.value = key
    e.preventDefault()
    return
  case "Enter":
   e.preventDefault()
   break
  case " ":
  case "-":
    if (input.value.length === 0 || input.value[input.value.length-1] === '-') {
      e.preventDefault()
      return
    } else if (e.data === " "){
      input.value += '-'
      e.preventDefault()
      return
    } else {
      return
    }
  default:
    if (e.data.length === 1 && !(/[a-z0-9]/.test(e.data))) {
      e.preventDefault()
      return
    }
    return
  }

  if (size(spans) >= 4) {
    return
  }
} 

input.onkeydown = function(e) {
  if (e.key != "Enter") {
    return
  }
  e.preventDefault()
  const v = input.value.trim()
  let i = size(spans) 
  if (v != "" && v[v.length-1] != '-' && i < MAX && !(v in spans)) {
    const span = document.createElement("input")
    span.value = v
    span.name = "tag-" + (i+1)
    span.type = "search"
    span.style.cursor = "pointer"
    span.readOnly = true
    span.innerText = v
    span.className = "form-control"
    span.style.marginBottom = "5px"
    span.onclick = removeSpan.bind(container, v)
    container.insertBefore(span, input)
    spans[v] = span
    input.value = ""
  }
}
