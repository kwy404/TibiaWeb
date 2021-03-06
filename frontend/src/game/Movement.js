const socket = require("../socket.io").default

const movePersonagemEmit = (x, y, posX) => {
    setTimeout(() => {
        socket.emit('newPosition', {
            posicaoBonecoX: x,
            posicaoBonecoY: y,
            positionBonecoX: posX
        })
    }, 200);
}

const acceptMoves = (react, emit) => {
    return {
        'w': () => {
            react.setState({positionBonecoX: -325})
            if(
            react.state.mapa[react.state.posicaoBonecoX - 1][react.state.posicaoBonecoY] != -1 &&
            react.state.posicaoBonecoX - 1 > 0 &&
            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX - 1}/${react.state.posicaoBonecoY}`)) &&
            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX - 1 && e.posY == react.state.posicaoBonecoY)
            ){
                react.setState({posicaoBonecoX: react.state.posicaoBonecoX -1})
                emit(react.state.posicaoBonecoX, react.state.posicaoBonecoY, react.state.positionBonecoX)
            }
        },
        's': () => {
            react.setState({positionBonecoX: -198})
            if(
            react.state.mapa[react.state.posicaoBonecoX + 1][react.state.posicaoBonecoY] != -1 &&
            react.state.posicaoBonecoX + 1 < react.state.mapa.length -1 &&
            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX + 1}/${react.state.posicaoBonecoY}`)) &&
            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX + 1 && e.posY == react.state.posicaoBonecoY)
            ){
                emit(react.state.posicaoBonecoX, react.state.posicaoBonecoY, react.state.positionBonecoX)
                react.setState({posicaoBonecoX: react.state.posicaoBonecoX + 1})
            }
        },
        'd': () => {
            react.setState({positionBonecoX: 0})
            if(
            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY + 1] != -1 &&
            react.state.posicaoBonecoY + 1 < react.state.mapa[react.state.posicaoBonecoX].length -1 &&
            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY + 1}`)) &&
            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX && e.posY == react.state.posicaoBonecoY + 1)
            ){
                react.setState({posicaoBonecoY: react.state.posicaoBonecoY + 1})
                emit(react.state.posicaoBonecoX, react.state.posicaoBonecoY, react.state.positionBonecoX)
            }
        },
        'a': () => {
            react.setState({positionBonecoX: -95})
            if(
            react.state.mapa[react.state.posicaoBonecoX][react.state.posicaoBonecoY - 1] != -1 &&
            react.state.posicaoBonecoY - 1 > 0 &&
            !react.state.mobs.find(e => e.includes(`${react.state.posicaoBonecoX}/${react.state.posicaoBonecoY - 1}`)) &&
            !react.state.playersOnMap.find(e => e.posX == react.state.posicaoBonecoX && e.posY == react.state.posicaoBonecoY - 1)
            ){
                react.setState({posicaoBonecoY: react.state.posicaoBonecoY - 1})
                emit(react.state.posicaoBonecoX, react.state.posicaoBonecoY, react.state.positionBonecoX)
            }
        }
    }
}

const moverMeuPersonagem = (react, emit) => {
        setTimeout(() => {
            if(react.state.mapa != undefined && react.state.possoAndar){
                // this.animaPersonagem(x, y)
                document.getElementsByTagName("body")[0].addEventListener("keydown", (key) => {
                    const movement = acceptMoves(react, emit)[key.key.toLowerCase()]
                    movement ? acceptMoves(react, emit)[key.key.toLowerCase()]() : console.warn('[ ERROR ] Do not possible move')
                })
                setTimeout(() => {
                    react.setState({possoAndar: true})
                }, 2600);
            }
        }, 400);
  }

export default { movePersonagemEmit, moverMeuPersonagem }