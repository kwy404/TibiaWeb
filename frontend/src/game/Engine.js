import React from 'react';
import '../Engine.css';

const mapaOne = require("./VilaregoMapa.js")
const mapaOneMobs = require("./mapaVilaregoMobs.js")
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
      mobsP: mobs
    }
  }
  componentDidMount(){
    console.info(`Game engine v${version}`)
    console.info(`Criado por Alexandre Silva`)
    this.moverMeuPersonagem()
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
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX - 1}/${react.state.posicaoBonecoY}`))
                            ){
                            this.setState({posicaoBonecoX: react.state.posicaoBonecoX -1})
                        }
                    } else if(key.key.toLowerCase() == 's'){
                        this.setState({positionBonecoX: -198})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX + 1][react.state.posicaoBonecoY] != -1 &&
                            react.state.posicaoBonecoX + 1 < react.state.mapa.length -1 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX + 1}/${react.state.posicaoBonecoY}`))
                            ){
                            this.setState({posicaoBonecoX: react.state.posicaoBonecoX + 1})
                        }
                    } else if(key.key.toLowerCase() == 'd'){
                        this.setState({positionBonecoX: 0})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY + 1] != -1 &&
                            react.state.posicaoBonecoY + 1 < react.state.mapa[react.state.posicaoBonecoX].length -1 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY + 1}`))
                            ){
                            this.setState({posicaoBonecoY: react.state.posicaoBonecoY + 1})
                        }
                    } else if(key.key.toLowerCase() == 'a'){
                        this.setState({positionBonecoX: -95})
                        if(
                            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY - 1] != -1 &&
                            react.state.posicaoBonecoY - 1 > 0 &&
                            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY - 1}`))
                            ){
                            this.setState({posicaoBonecoY: react.state.posicaoBonecoY - 1})
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
                                    kaway404
                                </span>
                            </div>
                            }
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
