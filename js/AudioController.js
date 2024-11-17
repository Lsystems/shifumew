import blaw from '/public/sounds/blaw.mp3'
import purr from '/public/sounds/purr.mp3'
import rock from '/public/sounds/rock.mp3'
import paper from '/public/sounds/paper.mp3'
import scissors from '/public/sounds/scissors.mp3'
import victory from '/public/sounds/victory.mp3'
import loose from '/public/sounds/loose.mp3'
import equality from '/public/sounds/equality.mp3'


class AudioController{
    constructor(){
        this.fxLib={
            purr:{
                url:purr,
                volume:1
            },
            blaw:{
                url:blaw,
                volume:1
            },
            rock:{
                url:rock,
                volume:1
            },
            paper:{
                url:paper,
                volume:1
            },
            scissors:{
                url:scissors,
                volume:1
            },
            win:{
                url:victory,
                volume:0.5
            },
            loose:{
                url:loose,
                volume:1
            },
            equality:{
                url:equality,
                volume:1
            },
        }
    }
    stopPlayer(){
        this.currentFxPlayer.pause();
        this.currentFxPlayer.currentTime = 0;
    }

    init(){
        let players=[]
        for(let fx in this.fxLib){
            let player=this.createAFXPlayer(this.fxLib[fx])
            this.fxLib[fx].player=player.player
            players.push(player.promise)
        }
        return Promise.all(players)
    }

    createAFXPlayer(fx){
        let fxPlayer = new Audio(fx.url);
        
        let promise=new Promise(res=>{
            fxPlayer.addEventListener('loadeddata',()=>{
                res()
            })
        })
        return {
            player:fxPlayer,
            promise:promise
        }
    }

    playFx(fx){
        if(this.currentFxPlayer)
            this.stopPlayer()

        this.currentFxPlayer=this.fxLib[fx].player
        this.currentFxPlayer.play()
    }
    
}

export default new AudioController()