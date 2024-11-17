import * as gameApi from './gameApi.js'
import state from './ShifumewState.js'
import {ShifumewEngine} from './ShifumewEngine.js'
import AudioController from './AudioController.js'

export default class Shifumew{
    constructor(){
        this.AudioController=AudioController
        this.AudioController.init()
        .then(()=>{
            this.init()

            console.log(this)
        })

    }

    init() {
        
        this.UI()
        this.records()
        this.gameOn()
    }

    UI(){

        this.seedInput=document.querySelector(".ss_inp")
        this.recordsList=document.querySelector(".records_list")
        this.recordClear=document.querySelector("#clear")
        this.historyList=document.querySelector(".history_list")
        this.menu=document.querySelector("menu")
        this.background=document.querySelector("#background")
        this.game=document.querySelector("#game")
        this.endgameModal=document.querySelector(".endgame")
        this.player=document.querySelector(".playername.me")
        this.opponent=document.querySelector(".playername.opponent")
        this.playerPattoune=document.querySelector(".pattoun.bottom img")
        this.enemyPattoune=document.querySelector(".pattoun.top img")


        document.querySelector("#play").addEventListener("click", () => {
            this.AudioController.playFx('blaw')
            gameApi.onPlayBtn(parseInt(this.seedInput.value) || undefined)
            this.updateHistory()
            
            this.background.classList.add("ingame") 
            this.menu.classList.add("hidden")
            this.game.classList.add("load")
            
            this.player.querySelector(".name").innerHTML = state.player.name
            this.opponent.querySelector(".name").innerHTML = state.player.enemyName

            setTimeout(() => {
                this.menu.classList.add("closed")
            }, 500)

        })

        this.recordClear.addEventListener("click", () => {
            this.recordsList.innerHTML = ""
            gameApi.clearPlayers()
        })

        document.querySelector(".v_checkbox").addEventListener("click", e=> {
            e.target.classList.toggle('checked')
            this.seedInput.classList.toggle('show')
        })

        this.seedInput.addEventListener('input', function (e) {
            this.value = this.value.replace(/[^0-9]/g, '');
        });

        this.endgameModal.querySelector(".button.nextgame").addEventListener("click", () => {
            this.game.classList.remove('set')
            this.hideEndGame()
        })

        this.endgameModal.querySelector(".button.backmenu").addEventListener("click", () => {
            this.records()
            this.game.classList.remove('set')
            this.game.classList.remove('load')
            this.background.classList.remove("ingame") 
            this.menu.classList.remove("hidden")
            this.menu.classList.remove("closed")
            this.hideEndGame()

        })
    }

    gameOn(){
        document.querySelectorAll(".move").forEach(move => {
            move.addEventListener("click",()=>{
                let myMove=move.classList[1]
                this.AudioController.playFx(myMove)
                const result = gameApi.onChooseMove(myMove)
                this.updateHistory()
                this.play({...result,myMove:myMove})
            })
        })
    }

    play({result,enemyMove,myMove}){
        this.playerPattoune.src=`img/${myMove}.png`
        this.enemyPattoune.src=`img/${enemyMove}.png`
        this.game.classList.add('set')
        setTimeout(() => {
            this.showEndGame(result)
            this.AudioController.playFx(result)
        }, 750);
    }

    records(){
        gameApi.loadPlayers()
        document.querySelector(".records_list").innerHTML = ""
        state.players.forEach(game => {
            const record = document.createElement('div')
            record.innerHTML = `<div class="btn record">
                <div class="user name">${game.name}</div>
                <div class="user score">${game.engine.scores[0]}</div>
                <div>-</div>
                <div class="enemy score">${game.engine.scores[1]}</div>
                <div class="enemy name">${game.enemyName}</div>
            </div>`
            this.recordsList.insertAdjacentElement('afterbegin', record)
        });
    }

    updateHistory() {
        this.historyList.innerHTML=""
        state.player.engine.history.forEach(history => {
            const historyElem = document.createElement('div')
            historyElem.innerHTML = `<div class="history_elem">
                <div class="user action"><img src="img/${ShifumewEngine.optionToString(history.options[0])}.png"></div>
                <div class="res">${ShifumewEngine.resultToString(history.results[0])}</div>
                <div class="enemy action"><img src="img/${ShifumewEngine.optionToString(history.options[1])}.png"></div>
            </div>`
            this.historyList.insertAdjacentElement('afterbegin',historyElem)
        });
    }

    showEndGame(result){
        const resultText = {
            win: "Wictoire !",
            equality: "Egwalité",
            loose: "Perwdu"
        }
        this.endgameModal.querySelector(".gamestatus").innerHTML = resultText[result]
        this.endgameModal.classList.add("show")
        setTimeout(() => {
            this.endgameModal.classList.add("visible")
        },0);
        this.player.querySelector(".score").innerHTML = state.player.engine.scores[0]
        this.opponent.querySelector(".score").innerHTML = state.player.engine.scores[1]
    }
    
    hideEndGame(){
        this.endgameModal.classList.remove("visible")
        setTimeout(() => {
            this.endgameModal.classList.remove("show")
        },500);
    }
}
export const shifumew = new Shifumew()
