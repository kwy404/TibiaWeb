import React from 'react';
import '../Engine.css';
import { Socket } from 'socket.io-client';

const mapaOne = require("./VilaregoMapa.js")
const mapaOneMobs = require("./mapaVilaregoMobs.js")


const socket = require("../socket.io").default

var mobs = require("./Mobs")
mobs = mobs.default

const version = 0.1

// Tiles
// 0 = grass normal
// 1 = grass com planta
// 2 = grass com planta 2
// 3 = pedra
// -1 = agua

const agua = {x: 0, y: 0}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapa: mapaOne.default,
      posicaoBonecoX: 5,
      posicaoBonecoY: 5,
      positionBonecoX: 0,
      possoAndar: true,
      mobs: mapaOneMobs.default,
      mobsP: mobs,
      playersOnMap: [],
      myId: ""
    }
  }
  componentDidMount(){
    console.info(`Game engine v${version}`)
    console.info(`Criado por Alexandre Silva`)
    this.moverMeuPersonagem()
    //Cria conexão socket.io
    const react = this
    socket.emit("openConnect", true)
    socket.on('newUser', data => {
        var joined = this.state.playersOnMap.concat(data);
        react.setState({ playersOnMap: joined })
    })
    socket.on('myId', id => {
        react.setState({myId: id})
    })
    socket.on('loadUsers', data => {
        react.setState({playersOnMap: data})
    })
    socket.on('moveChar', data => {
        const found = react.state.playersOnMap.find(e => e.player == data.player)
        console.log(found)
        if(found){
            const id = react.state.playersOnMap.indexOf(found)
            var oldPlayersMap = react.state.playersOnMap
            oldPlayersMap[id] = data
            react.setState({playersOnMap: oldPlayersMap})
        }
    })
    socket.on('myPos', data => {
        react.setState({posicaoBonecoX: data.x})
        react.setState({posicaoBonecoY: data.y})
        react.removeMe()
    })
  }
  moveRandomMobs(){
      for(let i = 0; i < this.state.mobs.length; i++){
          this.state.mobs.intervalIA = setInterval(() => {
              
          }, 400);
      }
  }
  removeMe(){
    const found = this.state.playersOnMap.find(e => e.player == this.state.myId)
    if(found){
        const id = this.state.playersOnMap.indexOf(found)
        var oldP = this.state.playersOnMap
        oldP.splice(id, 1)
        this.setState({playersOnMap: oldP})
    }
  }
  movePersonagemEmit(){
      socket.emit('newPosition', {
        posicaoBonecoX: this.state.posicaoBonecoX,
        posicaoBonecoY: this.state.posicaoBonecoY,
        positionBonecoX: this.state.positionBonecoX
      })
  }
  moverMeuPersonagem(){
    const react = this
        setTimeout(() => {
            if(this.state.mapa != undefined && this.state.possoAndar){
                // this.animaPersonagem(x, y)
                document.getElementsByTagName("body")[0].addEventListener("keyup", (key) => {
                    this.setState({possoAndar: false})
                    if(key.key.toLowerCase() == 'w'){
                        this.setState({positionBonecoX: -325})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX - 1][react.state.posicaoBonecoY] != -1 &&
                            react.state.posicaoBonecoX - 1 > 0 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX - 1}/${react.state.posicaoBonecoY}`)) &&
                            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX - 1 && e.posY == react.state.posicaoBonecoY)
                            ){
                            this.setState({posicaoBonecoX: react.state.posicaoBonecoX -1})
                            this.movePersonagemEmit()
                        }
                    } else if(key.key.toLowerCase() == 's'){
                        this.setState({positionBonecoX: -198})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX + 1][react.state.posicaoBonecoY] != -1 &&
                            react.state.posicaoBonecoX + 1 < react.state.mapa.length -1 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX + 1}/${react.state.posicaoBonecoY}`)) &&
                            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX + 1 && e.posY == react.state.posicaoBonecoY)
                            ){
                            this.setState({posicaoBonecoX: react.state.posicaoBonecoX + 1})
                            this.movePersonagemEmit()
                        }
                    } else if(key.key.toLowerCase() == 'd'){
                        this.setState({positionBonecoX: 0})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY + 1] != -1 &&
                            react.state.posicaoBonecoY + 1 < react.state.mapa[react.state.posicaoBonecoX].length -1 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY + 1}`)) &&
                            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX && e.posY == react.state.posicaoBonecoY + 1)
                            ){
                            this.setState({posicaoBonecoY: react.state.posicaoBonecoY + 1})
                            this.movePersonagemEmit()
                        }
                    } else if(key.key.toLowerCase() == 'a'){
                        this.setState({positionBonecoX: -95})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY - 1] != -1 &&
                            react.state.posicaoBonecoY - 1 > 0 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY - 1}`)) &&
                            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX && e.posY == react.state.posicaoBonecoY - 1)
                            ){
                            this.setState({posicaoBonecoY: react.state.posicaoBonecoY - 1})
                            this.movePersonagemEmit()
                        }
                    }
                })
                setTimeout(() => {
                    this.setState({possoAndar: true})
                }, 2600);
            }
        }, 400);
  }
  attackMob(mob){
      if(mob.split("/")[0] == this.state.posicaoBonecoX 
      || mob.split("/")[0] == this.state.posicaoBonecoX &&
      mob.split("/")[1].split(":")[0] == this.state.posicaoBonecoX - 1
      || mob.split("/")[1].split(":")[0] == this.state.posicaoBonecoX + 1
      ){
        
      }
  }
  render(){
  return (
    <div className="gameEngine">
       <div 
       style={{transform: `translate(${((this.state.posicaoBonecoY * 40) * -1) + 255}px, ${((this.state.posicaoBonecoX * 40) * -1) + 305}px)`}}
       className="overflowEngine">
           { 
            this.state.mapa.map((item, x) => ( 
                <div>
                    {item.map((itemTwo, y) => (
                    <div className="tileY">
                        <div
                        data-tile-id={`${x}/${y}`}
                        style={{backgroundImage: "url(./sprites/tiles.png)"}}
                        className={`tile 
                        ${(itemTwo == -1 ? 'water' : '')}
                        ${(itemTwo == 0 ? 'grass' : '')}
                        ${(itemTwo == 1 ? 'grassPlantaOne' : '')}
                        ${(itemTwo == 2 ? 'grassPlantaTwo' : '')}
                        ${(itemTwo == 3 ? 'pedra' : '')}
                        `
                        }
                        >
                            { x == this.state.posicaoBonecoX && y == this.state.posicaoBonecoY && 
                            <div 
                            style={{
                                backgroundImage: "url(./sprites/char.png)",
                                backgroundPositionX: `${this.state.positionBonecoX}px`
                            }}
                            className="char">
                                <div className="life">

                                </div>
                                <span className="nameMob">
                                    {this.state.myId}
                                </span>
                            </div>
                            }
                            {/* Players on Map */}
                            { this.state.playersOnMap.map((player, i) => 
                            
                            <div>
                            {x == player.posX && y == player.posY &&
                                <div 
                                style={{
                                    backgroundImage: "url(./sprites/char.png)",
                                    backgroundPositionX: `${player.positionBoneco}px`
                                }}
                                className="char">
                                    <div className="life">
    
                                    </div>
                                    <span className="nameMob">
                                        {player.player}
                                    </span>
                                </div>
                                }
                            </div>
                            ) }
                            {/* Mobs */}
                            { 
                            this.state.mobs.map((item, i) => 
                            item.split("/")[0] == x && item.split("/")[1].split(":")[0] == y &&
                            <div
                            onClick={() => this.attackMob(item)}
                            style={{
                                backgroundImage: `url(./sprites/mob${item.split(":")[1]}.png)`
                            }}
                            className="char">
                                <div className="life">

                                </div>
                                <span className="nameMob">
                                    { this.state.mobsP.find(e => e.id == item.split(":")[1]).name  }
                                </span>
                            </div>
                            )
                            }
                        </div>    
                    </div>
                    ))}
                </div>
            )) 
           }
       </div>
    </div>
  );
}
}


export default Game;