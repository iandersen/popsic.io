/**
 * Created by Ian on 12/19/2017.
 */
const Storage = require('../storage/storage');
const Microcosm = require('./microcosm');
const Room = require('./room');
const Game = require('../gameState');
const game = new Game();

const MOVE_STATE = 0;
const BUILD_STATE = 1;
let id = 0;
const splinterCount = 10;
const increment = 10;

class Player {
    constructor(name, address, socket){
        this.name = name;
        this.address = address;
        this.microcosm = new Microcosm(Room.randomX(), Room.randomY(), 0);
        this.microcosm.player = this;
        this.centerX = -1;
        this.centerY = -1;
        this.mouseX = -1;
        this.mouseY = -1;
        this.splinters = 0;
        this.sticks = 1;
        this.state = MOVE_STATE;
        this.id = id++;
        this.socket = socket;
        this.sticksLeft = splinterCount;
    }

    static BUILD_STATE(){
        return BUILD_STATE;
    }

    static MOVE_STATE(){
        return MOVE_STATE;
    }

    setState(state){
        this.state = state;
    }

    subtractSplinters(num){
        this.splinters -= 30;
        if(this.splinters < 0)
            this.splinters = 0;
    }

    addSplinter(){
        this.splinters++;
        this.sticksLeft--;
        if(this.microcosm){
            if(this.sticksLeft === 0){
                this.microcosm.addStickToFirstAvailable();
                this.sticksLeft = splinterCount + increment * this.microcosm.numSticks;
            }
        }
    }

    destroy(){
        this.microcosm = null;
        game.players.forEach((c, i)=> {
            if (c.id === this.id) {
                console.log('Emitting deadness');
                c.socket.emit('dead', {});
            }
        });
    }
}

module.exports = Player;