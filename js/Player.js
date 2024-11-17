import ShifumewEngine from "./ShifumewEngine.js"
import {Storage} from './Storage.js'

export class Player {
    name
    enemyName
    engine
    creationDate

    constructor(name, enemyName, options = {}) {
        this.name = name
        this.enemyName = enemyName
        this.creationDate = Date.now()
        if (options.forceNewEngine === true ) {
            this.engine = new ShifumewEngine(options.seed)
        } else {
            this.load(options.seed)
        }
        this.save()
    }

    updateName(name) {
        const oldname = this.name
        this.name = name
        this.save()
        Storage.removePlayer(oldname)
    }

    serialize () {
        return JSON.stringify(this)
    }
    save() {
        Storage.savePlayer(this)
    }
    load(seed) {
        const data = Storage.getPlayer(this.name)
        // if does not exist in storage initialize new engine
        console.log("data",data)
        if(data === null) {
            this.engine = new ShifumewEngine(seed)
            return
        }
        const object = JSON.parse(data)
        this.name = object.name
        this.enemyName = object.enemyName
        this.engine = ShifumewEngine.unserializeObject(object.engine)
    }
    static unserialize(json) {
        console.log("unserialize",json)
        const object = JSON.parse(json)
        const player = new Player(object.name, object.enemyName)
        player.engine = ShifumewEngine.unserializeObject(object.engine)
        return player
    }
}