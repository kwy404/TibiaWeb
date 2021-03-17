import React from 'react';
import '../Engine.css';
import { Socket } from 'socket.io-client';

const mapaOne = require("./VilaregoMapa.js")
const mapaOneMobs = require("./mapaVilaregoMobs.js")
let Movement = require("./Movement")
Movement = Movement.default

const socket = require("../socket.io").default

let mobs = require("./Mobs")
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
    Movement.moverMeuPersonagem(this, Movement.movePersonagemEmit)
    //Cria conexão socket.io
    const react = this
    socket.emit("openConnect", true)
    socket.on('newUser', data => {
        if(!react.state.playersOnMap.find(e => e.player == data.player)){
            var joined = this.state.playersOnMap.concat(data);
            react.setState({ playersOnMap: joined })
            react.removeMe()
        }
    })
    socket.on('myId', id => {
        react.setState({myId: id})
    })
    socket.on('loadUsers', data => {
        react.setState({playersOnMap: data})
        react.removeMe()
    })
    socket.on('moveChar', data => {
        const found = react.state.playersOnMap.find(e => e.player == data.player)
        if(found){
            const id = react.state.playersOnMap.indexOf(found)
            var oldPlayersMap = react.state.playersOnMap
            oldPlayersMap[id] = data
            react.setState({playersOnMap: oldPlayersMap})
            react.setState({})
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
                    x <= this.state.posicaoBonecoX + 6 && y < this.state.posicaoBonecoY + 50 &&
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
                                {/* <span className="nameMob message">
                                    <span>Falando => </span> Aloo
                                </span> */}
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