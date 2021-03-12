class player{
    player = ""
    posX = Math.floor((Math.random() * 10) + 1)
    posY = Math.floor((Math.random() * 10) + 1)
    positionBoneco = 0
    constructor(player){
        this.player = player
    }
}

module.exports = player