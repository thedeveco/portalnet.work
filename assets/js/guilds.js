function newQuestionMark(width, height) {
  const text = document.createElement('span');
  text.innerHTML = "?"
  text.style.fill = "#2B2A29"
  text.style.fontSize = "108px"
  text.style.textAlign = "center"
  text.style.backgroundColor = "black"
  return text
}


function getUserGuilds() {
  return new Promise((resolve, reject) => {
    if (!document.cookie) {
      return reject("discord oauth token unset or cookies available")
    }

    const pair = document.cookie.split("=")
    if (pair.length < 2) {
      return reject("session token malformed")
    }

    const token = pair[1]
    fetch(`https://discord.com/api/v6/users/@me/guilds`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => (res.ok ? res.json() : res.text().then(reject)))
    .then(resolve)
  })
}

function getNetworkIntersection() {
  return new Promise((resolve, reject) => {
    if (!document.cookie) {
      return reject("discord oauth token unset or cookies available")
    }

    const pair = document.cookie.split("=")
    if (pair.length < 2) {
      return reject("session token malformed")
    }

    const token = pair[1]
    fetch(getBackendURL() + "/intersection", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then(res => (res.ok ? res.json().then(resolve) : res.text().then(e => "got error:", reject)))
    .catch(reject)
  })
}

function install(guild_id) {
  console.log("installing on", guild_id)
  location.href = getBackendURL() + `/install?&guild_id=${encodeURI(guild_id)}`
}

function newGuildCard({id, banner, inNetwork, hasPortalBot, name, permissions, ...rest}) {
  let img
  if (name === "Freedomain server") {
    return null
  }
  if (banner) {
    img = document.createElement(`img`)
    img.src = `https://cdn.discordapp.com/banners/${id}/${banner}.png?size=512`
  } else {
    img = newQuestionMark(512, 512)
  }

  const owns = (permissions & 8)
  if (owns) {
    name += " 👑"
  }


  img.className = "card-img-top"

  const div = document.createElement(`div`)
  div.className = "m-2 card bg-dark text-white"
  div.style = "width: 18rem"
  console.log(rest)

  div.innerHTML =
  `
   <div class="card-body">
     <h5 class="card-title text-truncate">${name}</h5>
     <div class="d-flex flex-row justify-content-start">
       <button id="promote" >Promote</button>
       <button id="invite">Invite</button>
     </div>
   </div>`

   const btns = {
     promote: div.querySelector("#promote"),
     invite: div.querySelector("#invite"),
   }

  if (owns && !inNetwork) {
    btns.promote.className = 'btn-primary'
    btns.promote.disabled = false
    btns.promote.onclick = () => location.href = "/servers/promote?guild_id=" + id
  } else if (owns && inNetwork) {
    btns.promote.className = 'btn-primary'
    btns.promote.disabled = true
  } else if (!owns)  {
    btns.promote.className = 'btn-secondary'
    btns.promote.disabled = true
  }

  if (owns && !hasPortalBot) {
    btns.invite.className = 'btn-success'
    btns.invite.disabled = false
    btns.invite.onclick = (() => install(id))
  } else if (owns && hasPortalBot) {
    btns.invite.className = 'btn-success'
    btns.invite.disabled = true
  } else if (!owns)  {
    btns.invite.className = 'btn-secondary'
    btns.invite.disabled = true
  }
  
  btns.invite.className  += ' btn col-sm ml-2 mr-2 mt-2'
  btns.promote.className += ' btn col-sm ml-2 mr-2 mt-2'

  div.prepend(img)

   return div
}

document.addEventListener("DOMContentLoaded", function () {
  const tag = document.getElementById("guilds")

  console.log("getting intersection")
  getNetworkIntersection()
    .then((guilds) => {
      console.log(guilds)
      guilds
        .map(newGuildCard)
        .filter(r => r !== null)
        .forEach((card) => {  console.log(card); tag.appendChild(card) })
    })
    .catch(i => console.log("FAILED", i))
    /*
    .catch(() => {
      location.href = getBackendURL() + "/login"
    })
    */
})
