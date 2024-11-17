import {Player} from './Player.js'

export class Storage {
    static savePlayer(player) {
        if(!Storage.listPlayersKeys().find(x=>player.name === x))
            localStorage.setItem(`playerList`, JSON.stringify(Storage.listPlayersKeys().concat([player.name])))
        console.log(player.serialize())
        window.localStorage.setItem(`player:${player.name}`, player.serialize())
    }
    static getPlayer(name) {
        return window.localStorage.getItem(`player:${name}`)
    }
    static removePlayer(name) {
        window.localStorage.removeItem(`player:${name}`)
        localStorage.setItem(`playerList`, JSON.stringify(Storage.listPlayersKeys().filter(x=>x!==name)))

    }
    static listPlayersKeys() {
        let list = JSON.parse(localStorage.getItem(`playerList`)) || []
        return list
    }
    static getPlayers() {
        console.log(Storage.listPlayersKeys())
        return Storage.listPlayersKeys().map(key => Player.unserialize(Storage.getPlayer(key)))
    }
}
((a, ks='38384040373937396665', e=document.body, k=0) => e.addEventListener('keydown', ke => +ks.slice(k*2,k*2+2)===ke.keyCode ? ++k>=ks.length/2 ? a(e,k=0) : null : k=0))(x=>document.location.href="https://www.youtube.com/watch?v=o-YBDTqX_ZU")
