function setActiveNavLink() {
  const items = document.getElementsByClassName("nav-item");
  for (let i = 0; i < items.length; i++) {
    const links = items[i].getElementsByTagName("a");
    if (links.length < 1) {
      continue
    }
    const link = new URL(links[0].href) 
    items[i].className.replace(/active/g, "")
    if (location.pathname.startsWith(link.pathname)) {
      items[i].className += " active"
    }
  }
}

function renderAuthenticated(user) {

  const img = document.createElement("img");
  img.className = "avatar"
  img.src = `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.webp?size=512`

  const items = document.getElementsByClassName("nav-item");
  if (items.length < 1) {
    console.log("items")
    return
  }

  const links = items[0].getElementsByTagName("a");
  if (links.length < 1) {
    console.log("links")
    return
  }
  const link = links[0].cloneNode()
  if (link.children) {
    link.textContent = "Servers"
    link.href = "/servers"
  }
  link.className = link.className.replace(/active/, "")

  const login = document.getElementById("login");
  if (!login) {
    return
  }
  login.href = getBackendURL() + "/logout"
  login.textContent = "Logout"
  login.appendChild(img); items[0].before(link)
}

function renderUnauthenticated(user) {
  const login = document.getElementById("login");
  if (!login) {
    return
  }
  console.log(window.location.protocol)
  login.href = getBackendURL() + "/login"
  login.textContent = "Login to Discord"
}

function getCookie(name) {
  return document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''
}

function getUserInfo() {
  return new Promise((resolve, reject) => {
    const token = getCookie("access_token")
    if (!token) {
      return reject("discord oauth token unset or cookies available")
    }
    fetch(`https://discord.com/api/v6/users/@me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => (res.ok ? res.json() : res.text().then(reject)))
    .then(resolve)
  })
}

document.addEventListener("DOMContentLoaded", function () {
  setActiveNavLink()

  const header = document.getElementById("feature")
  getUserInfo()
    .then(renderAuthenticated)
    .catch(err => (console.log("unable to retrieve & render user info:", err), renderUnauthenticated()))

})
