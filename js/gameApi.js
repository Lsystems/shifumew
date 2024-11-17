import {Player} from './Player.js'
import {Storage} from './Storage.js'
import {ShifumewEngine} from './ShifumewEngine.js'
import state from './ShifumewState.js'
import {names} from './names.js'


function getName() {
    return names[Math.ceil(Math.random()*(names.length-1))]
    // return fetch("https://names.ironarachne.com/race/elf/female/1000")
    //     .then(r=>r.json())
    //     .then(r=>r.names[0])
}


export async function onPlayBtn(seed) {
    const name = getName()
    const enemyName = getName()
    state.player = new Player(name, enemyName, {seed, forceNewEngine:true})
//Switch to page game
}

export function onLoadPlayer(name) {
    state.player = new Player(name)
//Switch to page game
}

export function loadPlayers() {
    state.players = Storage.getPlayers()
// update list of load games
}

export function clearPlayers() {
    state.players = Storage.listPlayersKeys().forEach(key => {
        Storage.removePlayer(key)
    });
// update list of load games
}

/**
 * @param {"rock"|"paper"|"scissors"} move
 * @return {{result: ("loose"|"equality"|"win"), enemyMove:("rock"|"paper"|"scissors")}}
 */
export function onChooseMove(move) {
    const res = state.player.engine.play(ShifumewEngine.optionFromString(move))
    state.player.save()
    return {
        result: ShifumewEngine.resultToString(res.result),
        enemyMove: ShifumewEngine.optionToString(res.enemyMove)
    }
// update UI with score change and history of the game
}