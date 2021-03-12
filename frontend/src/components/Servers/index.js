import React from 'react';
import socket from '../../socket';
import CryptoJS  from 'crypto-js'
import { ToastContainer, toast } from 'react-toastify';
import $ from 'jquery';
import Skeleton from 'react-loading-skeleton';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { Socket } from 'socket.io-client';

//Carrega imagem de erro
const imageError = require('../../imageErrorLoad')
const axios = require('axios');
//Carrega audio de menção
const mention = new Audio('../../mention.mp3');

const emojisDefault = [
  {
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 4
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 5
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 6
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 7
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 8
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 9
  },{
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 10
  },//Y = 1
  {
    'w': 45,
    'h': 45,
    'y': 0,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 1,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 1,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 1,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 1,
    'x': 4
  },{
    'w': 45,
    'h': 45,
    'y': 1,
    'x': 5
  },
  {
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 4
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 5
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 6
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 7
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 8
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 9
  },{
    'w': 45,
    'h': 45,
    'y': 2,
    'x': 10
  },//Y = 3,
  {
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 4
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 5
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 6
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 7
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 8
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 9
  },{
    'w': 45,
    'h': 45,
    'y': 3,
    'x': 10
  },//Y = 4,
  {
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 4
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 5
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 6
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 7
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 8
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 9
  },{
    'w': 45,
    'h': 45,
    'y': 4,
    'x': 10
  },//Y = 5,
  {
    'w': 45,
    'h': 45,
    'y': 5,
    'x': 0
  },
  {
    'w': 45,
    'h': 45,
    'y': 5,
    'x': 1
  },
  {
    'w': 45,
    'h': 45,
    'y': 5,
    'x': 2
  },
  {
    'w': 45,
    'h': 45,
    'y': 5,
    'x': 3
  },{
    'w': 45,
    'h': 45,
    'y': 5,
    'x': 4
  }
]

//Parte principal do servidor #412
class Servers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      serverList: []
    }
  }
  componentDidMount(){
    const href = window.location.href
    const array = href.split('/')
    const idServer = array[4]
    if(idServer != undefined){
      this.openServerFromId(idServer)
    }
    const react = this
    socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
    socket.emit('getChannel', {idServer: idServer, token: window.localStorage.getItem('token')})
    socket.on('serverList', (servers) => {
      react.setState({serverList: servers})
    })
  }
  openServerFromId(id){
    const react = this
    socket.emit('loadServer', {
      'token': window.localStorage.token,
      'idServer': id
    })
  }
  render(){
  return (
    <div className="Server">
      { 
      this.props.server != null && this.state.serverList.find(e => e.id == this.props.server.id) && 
      <Html server={this.props.server}/>
      }
      { this.props.server != null && 
      !this.state.serverList.find(e => e.id == this.props.server.id) && 
      <div className="header">
      <div className="headerBirl serverHeader"><h1> Selecione um servidor! 😄 </h1> </div>
      </div> }
    </div>
  );
}
}

//HTML do servidor #515
class Html extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amigosConvidar: [],
      ativoConvite: false,
      message: "",
      messages: [],
      loading: false,
      perfilSelecionadoId: -1,
      loadingMembers: false,
      members: [],
      showMembers: true,
      convidados: [],
      xModalMember: 0,
      yModalMember: 0,
      focusMember: false,
      focusMemberTwo: false,
      focusMembro: null,
      focusMembroTwo: null,
      cargosMembers: null,
      cargosTodos: null,
      membrosComCargos: [],
      totalDeAmigosParaConvidar: 0,
      serverProID: 0,
      openSubMenuServer: false,
      loadingBot: false,
      linkParaAbrir: null,
      todasPessoasC: null,
      channelList: null,
      estouChannel: -1,
      focusMemberFor: false,
      focusMembroFor: null,
      loadingBoo: [
        [0,0,0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0,0],
        [0,0,0],
        [0,0,0,0,0,0,0],
        [0,0],
        [0,0,0,0],
        [0,0],
        [0,0,0],
        [0,0,0]
      ],
      loadingMessagesBoo: false,
      cargosOpen: false,
      novoCanal: false,
      focusCanalFound: null,
      focusCanal: false,
      xModalCanal: 0,
      yModalCanal: 0,
      novoCanalTexto: "",
      vendoEmoji: false,
      serverEmoji: [],
      emojiBase64: "",
      createEmojiOpen: false,
      focusEmoji: null,
      emojiDefault: emojisDefault
    }
    this.sendMessageServer = this.sendMessageServer.bind(this)
    this.addNovoCanal = this.addNovoCanal.bind(this)
    this.handleChangeMsg = this.handleChangeMsg.bind(this)
    this.onChange = this.onChange.bind(this)
    this.handleChangeCanal = this.handleChangeCanal.bind(this)
    this.emojiImgAdd = this.emojiImgAdd.bind(this)
  }
  componentDidMount(){
    window.localStorage.setItem("see", "0")
    var url = window.location.pathname
    var array = url.split('/servers/')
    var serverID = url.split("/")[2]
    var channelID = url.split("/")[3]
    socket.emit('getChannel', {idServer: serverID, token: window.localStorage.getItem('token')})
    this.setState({serverProID: serverID})
    setInterval(() => {
      url = window.location.pathname
      array = url.split('/')
      serverID = url.split("/")[2]
      var url2 = window.location.pathname
      var channelID2 = url2.split("/")[3]
      if(serverID != this.state.serverProID){
        react.setState({messages: []})
        this.setState({membrosComCargos: []})
        this.setState({serverProID: serverID})
        this.setState({loadingMembers: false})
        react.setState({membrosComCargos: []})
        react.setState({loadingBot: false})
        react.setState({loadingMembers: false})
        react.setState({focusMember: null})
        react.setState({focusMember: null})
        react.setState({cargosMembers: null})
        react.setState({channelList: null})
        react.setState({estouChannel: -1})
        react.setState({members: []})
      }
      if(this.state.channelList != null){
        if(!this.state.channelList.find(e => e.id == this.state.estouChannel)){
          this.setState({estouChannel: channelID2})
        }
      }
      if(this.state.channelList == null){
          socket.emit('getChannel', {idServer: serverID, token: window.localStorage.getItem('token')})
      }
    }, 600);
    const react = this
    socket.on('emojiServer', data => {
      react.setState({serverEmoji: []})
      var emojiDefaultTwo = react.state.emojiDefault
      for(let i = 0; i < emojiDefaultTwo.length; i++){
        emojiDefaultTwo[i].id = `4${i + 9612}`
        emojiDefaultTwo[i].base64 = "../../default_emoji.png"
        emojiDefaultTwo[i].emojiDefault = true
        data.unshift(emojiDefaultTwo[i])
      }
      react.setState({serverEmoji: data})
    })
    socket.on('botMember', data => {
      react.setState({loadingBot: false})
      const bot = {
        id: data.id,
        username: data.nome,
        level: 1,
        avatar: data.photo,
        background: data.background,
        bot: 1,
        verificado: true,
        newMember: 0,
        pessoaStatus: 'online'
      }
      const timer = setInterval(() => {
        if(react.state.loadingMembers){
          var joined = react.state.members.concat(bot)
          react.setState({ members: joined })
          react.setState({loadingBot: true})
          clearInterval(timer)
        }
      }, 500);
    })
    socket.on('channelListServer', data => {
      react.setState({channelList: data})
      var url = window.location.pathname
      var array = url.split('/servers/')
      if(array[1].split("/") != undefined){
        var serverID = array[1].split("/")[0]
        var channelID = url.split("/")[3]
        if(data.length > 0){
          if(!data.find(e => e.id == channelID)){
            window.history.pushState("", "", `/servers/${serverID}/${data[0].id}`)
            react.setState({estouChannel: data[0].id})
          } else{
            react.setState({estouChannel: channelID})
          }
          if(data.find(e => e.id == channelID)){
            socket.emit('loadMessagesServidor', {
              'token': window.localStorage.getItem('token'),
              'idServer': serverID,
              'idChannel': channelID
            })
          } else{
            socket.emit('loadMessagesServidor', {
              'token': window.localStorage.getItem('token'),
              'idServer': serverID,
              'idChannel': data[0].id
            })
          }
      }
      }
    })
    socket.on('messagesFriends', data => {
      react.setState({amigosConvidar: data})
      var index = 0
      for(let i = 0; i < data.length; i++){
          if(!react.state.members.find(e => e.id == data[i].id && e.bot == undefined)){
            index++
          }
      }
      react.setState({totalDeAmigosParaConvidar: index})
    })
    socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
    socket.on('serverMembersCargos', data => {
      const timerCargo = setInterval(() => {
        if(react.state.loadingBot && react.state.members.length > 0){
          react.setState({todosOsCargos: []})
          react.setState({})
          var membersBoo = [...react.state.members]
          var todosOsCargos = []
          var todasPessoas = []
          const donoDoServer = membersBoo[0]
          todosOsCargos.push({
            'cargo': 'Dono',
            'color': 'rgb(67, 181, 129)',
            'users': [donoDoServer]
          })
          membersBoo[0].color = 'rgb(67, 181, 129)'
          todasPessoas.push(membersBoo[0])
          for(let i = 0; i < data.length; i++){
            const foundUser = membersBoo.find(e => e.id == data[i].idMember)
            if(foundUser){
              const id = membersBoo.indexOf(foundUser)
              if(!todosOsCargos.find(e => e.cargo == data[i].cargo.cargo)){
                var acheiMembro = true
                for(let b = 0; b < todosOsCargos.length; b++){
                  acheiMembro = todosOsCargos[b].users.find(e => e.id == membersBoo[id].id)
                }
                if(!acheiMembro){
                  if(membersBoo[id].id != react.props.server.owner){
                    todosOsCargos.push({
                      'cargo': data[i].cargo.cargo,
                      'color': data[i].cargo.color,
                      'users': [membersBoo[id]]
                    })
                    membersBoo[id].color = data[i].cargo.color
                    todasPessoas.push(membersBoo[id])
                  }
                }
              } else{
                const cargoFound = todosOsCargos.find(e => e.cargo == data[i].cargo.cargo)
                const idCargo = todosOsCargos.indexOf(cargoFound)
                const jaExiste = todosOsCargos[idCargo].users.find(e => e == membersBoo[id])
                if(!jaExiste){
                  if(membersBoo[id].id != react.props.server.owner){
                    todosOsCargos[idCargo].users.push(membersBoo[id])
                    membersBoo[id].color = data[i].cargo.color
                    todasPessoas.push(membersBoo[id])
                  }
                }
              }
            }
          }
          var membrosT = react.state.members
          for(let i = 0; i < membrosT.length; i++){
            if(membrosT[i].bot == 1){
              if(!todosOsCargos.find(e => e.cargo == 'Bot')){
                todosOsCargos.push({
                  'cargo': 'Bot',
                  'color': 'rgb(307, 181, 129)',
                  'users': [membrosT[i]]
                })
                membrosT[i].color = 'rgb(307, 181, 129)'
                todasPessoas.push(membrosT[i])
              }
            }
            if(!todasPessoas.find(e => e.id == membrosT[i].id && membrosT[i].bot == 0)){
              if(!todosOsCargos.find(e => e.cargo == 'Membro')){
                if(membrosT[i].id != react.props.server.owner && membrosT[i].bot == 0){
                  todosOsCargos.push({
                    'cargo': 'Membro',
                    'color': 'white',
                    'users': [membrosT[i]]
                  })
                  membrosT[i].color = 'white'
                  todasPessoas.push(membrosT[i])
                }
              } else{
                const cargoFound = todosOsCargos.find(e => e.cargo == 'Membro')
                const idCargo = todosOsCargos.indexOf(cargoFound)
                const jaExiste = todosOsCargos[idCargo].users.find(e => e == membrosT[i])
                if(!jaExiste){
                  if(membrosT[i].id != react.props.server.owner && membrosT[i].bot == 0){
                    todosOsCargos[idCargo].users.push(membrosT[i])
                    membrosT[i].color = 'white'
                    todasPessoas.push(membrosT[i])
                  }
                }
              }
            }
          }
          react.setState({membrosComCargos: todosOsCargos})
          react.setState({cargosMembers: data})
          react.setState({todasPessoasC: todasPessoas})
          react.setState({loading: true})
          if ( $(".msgListServer") != undefined && $(".msgListServer").length ){
            $('.msgListServer').scrollTop($('.msgListServer')[0].scrollHeight + 5000);
          }
          clearInterval(timerCargo)
        }
      }, 200);
    })
    socket.on('messageServer', async data => {
      if(data.type == 'message'){
        const intervalLoadingMessages = setInterval(async () => {
          if(react.state.loadingMessagesBoo){
            if(data.newMember == 1){
              setTimeout(() => {
                socket.emit('getChannel', {idServer: this.props.server.id, token: window.localStorage.getItem('token')})
              }, 500);
            }
            if ( $(".msgListServer") != undefined && $(".msgListServer").length ){
              const scrollHeight = $('.msgListServer')[0].scrollTop
              if(scrollHeight >= $('.msgListServer')[0].scrollHeight - 1017){
                setTimeout(() => {
                  $('.msgListServer').scrollTop($('.msgListServer')[0].scrollHeight + 5000);
                }, 100);
              }
              if(data.idServer == react.props.server.id && data.idChannel == react.state.estouChannel){
                const array = data.msg.split(" ")
                for(let i = 0; i < array.length; i++){
                  var linkUm = array[i].split("https://www.youtube.com/watch?v=")[1]
                  var linkDois = array[i].split("https://youtu.be/")[1]
                  var linkTres = array[i].split("http://youtu.be/")[1]
                  var linkQuatro = array[i].split("http://www.youtube.com/watch?v=")[1]
                  if(linkUm != undefined){
                    if(linkUm.split("&").length > 0){
                      linkUm = linkUm.split("&")[0]
                    }
                  }
                  if(linkDois != undefined){
                    if(linkDois.split("&").length > 0){
                      linkDois = linkDois.split("&")[0]
                    }
                  }
                  if(linkTres != undefined){
                    if(linkTres.split("&").length > 0){
                      linkTres = linkTres.split("&")[0]
                    }
                  }
                  if(linkQuatro != undefined){
                    if(linkQuatro.split("&").length > 0){
                      linkQuatro = linkQuatro.split("&")[0]
                    }
                  }
                  if(linkUm != undefined){
                    data.frameYT = linkUm
                    break
                  } else if(linkDois != undefined){
                    data.frameYT = linkDois
                    break
                  } else if(linkTres != undefined){
                    data.frameYT = linkTres
                    break
                  } else if(linkQuatro != undefined){
                    data.frameYT = linkQuatro
                    break
                  }
                  var mentions = array[i].split("@")
                  for(let c = 0; c < mentions.length; c++){
                    if(mentions[c] == 'everyone'){
                      data.mentionsMe = true
                      if(data.owner != JSON.parse(window.localStorage.getItem('myUser')).id){
                        mention.play()
                      }
                    }
                    if(mentions[c].toLowerCase() == JSON.parse(window.localStorage.getItem('myUser')).username.toLowerCase()){
                      data.mentionsMe = true
                      if(data.owner != JSON.parse(window.localStorage.getItem('myUser')).id){
                        mention.play()
                      }
                      break
                    }
                  }
                }
                if(data.frameYT != undefined){
                  const response = await axios(`https://www.googleapis.com/youtube/v3/videos?id=${data.frameYT}&key=AIzaSyDVt8v-MLo8Rvx4QgC-FWXuXudyRA-3Qe0&part=snippet`);
                  data.infoYT = response.data.items[0].snippet != undefined ? response.data.items[0].snippet : 'loading'
                }
              }
            }
            clearInterval(intervalLoadingMessages)
            setTimeout(() => {
              if(data.idChannel == react.state.estouChannel){
                var joined = react.state.messages.concat(data);
                react.setState({ messages: joined })
              }
              if(data.deleteAll != undefined){
                if(data.idChannel == react.state.estouChannel){
                  react.setState({messages: [data]})
                }
              }
            }, 250);
          }
        }, 1000);
      } else if(data.type == 'newEmoji'){
        var joined = react.state.serverEmoji.concat(data.emoji);
        react.setState({ serverEmoji: joined })
      }
      else if(data.type == 'kick'){
        if(data.idMember != undefined){
          if(data.idMember == JSON.parse(window.localStorage.getItem('myUser')).id){
            toast.error(`Que pena, você foi expulso de ${data.serverName} 😭😭`)
            socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
            socket.emit('reasons', this.props.server.id)
          }
          socket.emit('getChannel', {idServer: this.props.server.id, token: window.localStorage.getItem('token')})
        }
      } else if(data.type == 'novoCanal'){
        if(data.serverID == react.props.server.id){
          const timerCanal = setInterval(() => {
            if(react.state.channelList != null){
              const found = react.state.channelList.find(e => e.id == data.canal.id)
              if(found){
                const id = react.state.channelList.indexOf(found)
                var estouCanal = react.state.channelList[id].id
                if(react.state.estouChannel != estouCanal){
                  window.history.pushState("", "", `/servers/${serverID}/${estouCanal}`)
                  react.setState({ estouChannel: estouCanal })
                  react.setState({messages: []})
                  socket.emit('getChannel', {idServer: this.props.server.id, token: window.localStorage.getItem('token')})
                }
              } else{
                var joined = react.state.channelList.concat(data.canal);
                react.setState({ channelList: joined })
              }
              clearInterval(timerCanal)
            }
          }, 200);
        }
      } else if(data.type == 'deleteCanal'){
        if(data.serverID == react.props.server.id){
          const timerCanal = setInterval(() => {
            if(react.state.channelList != null){
              var canais = react.state.channelList
              var found = canais.find(e => e.id == data.canalID)
              if(found){
                var id = canais.indexOf(found)
                canais.splice(id, 1)
                if(react.state.estouChannel == data.canalID){
                  var estouCanal = react.state.channelList[0].id
                  react.setState({estouChannel: estouCanal})
                  window.history.pushState("", "", `/servers/${serverID}/${estouCanal}`)
                  react.setState({messages: []})
                  socket.emit('getChannel', {idServer: this.props.server.id, token: window.localStorage.getItem('token')})
                  clearInterval(timerCanal)
                }
                react.setState({ channelList: canais })
                clearInterval(timerCanal)
              }
              clearInterval(timerCanal)
            }
          }, 200);
        }
      }
      else if(data.type == 'updateServerList'){
        socket.emit('atualizarServer', window.localStorage.getItem('token'))
      } else if(data.type == 'offline'){
        var array = [...react.state.messages]
        var array2 = [...react.state.membrosComCargos]
        if(react.state.focusMembro != null &&  data.id == react.state.focusMembro.id){
          var focus = react.state.focusMembro
          focus.pessoaStatus = 'offline'
          react.setState({focusMembro: focus})
        }
        for(let i = 0; i < array2.length; i++){
          for(let b = 0; b < array2[i].users.length; b++){
            if(data.id == array2[i].users[b].id){
              array2[i].users[b].pessoaStatus = 'offline'
            }
          }
        }
        for(let i = 0; i < array.length; i++){
          if(data.id == array[i].id){
            array[i].pessoaStatus = 'offline'
          }
        }
        react.setState({messages: array})
        react.setState({membrosComCargos: array2})
      } else if(data.type == 'online'){
        var array = [...react.state.membrosComCargos]
        var array2 = [...react.state.messages]
        if(react.state.focusMembro != null && react.state.focusMembro.id == data.id){
          var focus = react.state.focusMembro
          focus.pessoaStatus = 'online'
          react.setState({focusMembro: focus})
        }
        for(let i = 0; i < array.length; i++){
          for(let b = 0; b < array[i].users.length; b++){
            if(data.id == array[i].users[b].id){
              array[i].users[b].pessoaStatus = 'online'
            }
          }
        }
        for(let i = 0; i < array2.length; i++){
          if(data.id == array2[i].id){
            array2[i].pessoaStatus = 'online'
          }
        }
        react.setState({membrosComCargos: array})
        react.setState({messages: array2})
      }
    })
    socket.on('loadMessagesServer', async data => {
      if(react.state.messages.length == 0){
        var newData = [...data]
        for(let b = 0; b < newData.length; b++){
          const array = newData[b].msg.split(" ")
          for(let i = 0; i < array.length; i++){
            var linkUm = array[i].split("https://www.youtube.com/watch?v=")[1]
            var linkDois = array[i].split("https://youtu.be/")[1]
            var linkTres = array[i].split("http://youtu.be/")[1]
            var linkQuatro = array[i].split("http://www.youtube.com/watch?v=")[1]
            if(linkUm != undefined){
              if(linkUm.split("&").length > 0){
                linkUm = linkUm.split("&")[0]
              }
            }
            if(linkDois != undefined){
              if(linkDois.split("&").length > 0){
                linkDois = linkDois.split("&")[0]
              }
            }
            if(linkTres != undefined){
              if(linkTres.split("&").length > 0){
                linkTres = linkTres.split("&")[0]
              }
            }
            if(linkQuatro != undefined){
              if(linkQuatro.split("&").length > 0){
                linkQuatro = linkQuatro.split("&")[0]
              }
            }
            if(linkUm != undefined){
              newData[b].frameYT = linkUm
              break
            } else if(linkDois != undefined){
              newData[b].frameYT = linkDois
              break
            } else if(linkTres != undefined){
              newData[b].frameYT = linkTres
              break
            } else if(linkQuatro != undefined){
              newData[b].frameYT = linkQuatro
              break
            }
            var mentions = array[i].split("@")
            for(let c = 0; c < mentions.length; c++){
              if(mentions[c].toLowerCase() == 'everyone'){
                newData[b].mentionsMe = true
              }
              if(mentions[c] == JSON.parse(window.localStorage.getItem('myUser')).username){
                newData[b].mentionsMe = true
                break
              }
            }
          }
          if(newData[b].frameYT != undefined){
            const response = await axios(`https://www.googleapis.com/youtube/v3/videos?id=${newData[b].frameYT}&key=AIzaSyDVt8v-MLo8Rvx4QgC-FWXuXudyRA-3Qe0&part=snippet`);
            newData[b].infoYT = response.data.items[0].snippet != undefined ? response.data.items[0].snippet : 'loading'
          }
        }
        react.setState({messages: newData})
        react.setState({loadingMessagesBoo: true})
        $("#focusInputMessage").focus()
        setTimeout(() => {
          if ( $(".msgListServer") != undefined && $(".msgListServer").length > 0 ){
            $('.msgListServer').scrollTop($('.msgListServer')[0].scrollHeight + 5000);
          }
        }, 2000);
        setTimeout(() => {
          socket.emit('loadServerMember', {
            'token': window.localStorage.getItem('token'),
            'idServer': react.props.server.id
          })
        }, 700);
      }
    })
    socket.on('serverMembers', data => {
      var membros = []
      for(let i = 0; i < data.length; i++){
        if(!membros.find(e => e.username == data[i].username)){
          membros.push(data[i])
        }
      }
      react.setState({members: []})
      react.setState({members: membros})
      react.setState({loadingMembers: true})
      socket.emit('myFriendsAmizade', window.localStorage.getItem('token'))
    })
    socket.on('donoServer', data => {
      var membrosA = react.state.members
      if(membrosA.find(e => e.id == data.id)){
        return
      } else{
        const time = setTimeout(() => {
          if(react.state.loadingMembers){
            setTimeout(() => {
              membrosA.splice(0,0, data)
              data.bot = 0
              react.setState({members: membrosA})
              socket.emit('getBotServer', react.props.server.id)
              clearInterval(time)
            }, 400);
          }
        }, 200);
      }
    })
  }
 
  inviteServer(serverId, userId, username){
    var joined = this.state.convidados.concat(username);
    if(!this.state.convidados.find(e => e == username)){
      this.setState({ convidados: joined })
      const token = window.localStorage.getItem('token')
      let me = window.localStorage.getItem('myUser')
      let meJson = JSON.parse(me)
      const data = {
        'de': meJson.username,
        'para': username,
        'msg': `Olá, eu gostaria de te convidar para o server '${this.props.server.name}', é bem legal, você vai gostar!`,
        'token': token,
        'chatAnonymo': false,
        'conviteServer': serverId,
        'userId': userId,
        'serverName': this.props.server.name
      }
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
      socket.emit('sendMsg', ciphertext)
      toast(`Convite do servidor enviado para ${username} 😎😇`)
    }
  }
  handleChangeMsg(event) {
    this.setState({message: event.target.value});
  }
  handleChangeCanal(event) {
    var textoCanal = event.target.value.replaceAll(" ", "_")
    this.setState({novoCanalTexto: textoCanal});
  }
  mentionApenasUmUsuario(){
    if(this.state.todasPessoasC != null){
      const people = this.state.todasPessoasC.find(e => e.username.toLowerCase() == this.state.message.split("@")[this.state.message.split("@").length - 1].toLowerCase())
      if(people != undefined){
        if(this.state.todasPessoasC.find(e => e.username.toLowerCase().includes(this.state.message.split("@")[this.state.message.split("@").length - 1].toLowerCase())) != undefined){
          var corrigido = this.state.message
          corrigido.replace(this.state.message.split("@")[this.state.message.split("@").length - 1], `${people.username} `)
          this.setState({message: corrigido})
        }
      }
    }
  }
  sendMessageServer(event){
    const token = window.localStorage.getItem('token')
    let me = window.localStorage.getItem('myUser')
    let meJson = JSON.parse(me)
    const data = {
      'msg': this.state.message,
      'idServer': this.props.server.id,
      'token': token,
      'idChannel': this.state.estouChannel
    }
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
    socket.emit('messageServidor', ciphertext)
    this.setState({message: ''})
    event.preventDefault()
  }
  selecionarPerfil(id){
    if(id == this.state.perfilSelecionadoId){
      this.setState({perfilSelecionadoId: -1})
    } else{
      this.setState({perfilSelecionadoId: id})
    }
  }
  getBase64(file) {
    const react = this
    try {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        const token = window.localStorage.getItem('token')
        let me = window.localStorage.getItem('myUser')
        let meJson = JSON.parse(me)
        const data = {
          'serverId': react.props.server.id,
          'base64': reader.result,
          'token': token,
        }
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'kaueehfodapakaraio404').toString();
        socket.emit('changePhotoServer', ciphertext)
      };
      reader.onerror = function (error) {
        //console.log('Error: ', error);
      };
    } catch (error) {
      
    }
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
    this.getBase64(e.target.files[0])
  }
  memberFix(member, dom){
    this.setState({focusEmoji: null})
    const area = {X: dom.clientX, Y: dom.clientY }
    if((window.innerHeight - dom.clientY) <= 317){
      this.setState({yModalMember: window.innerHeight - 300})
    } else{
      this.setState({yModalMember: area.Y})
    }
    this.setState({xModalMember: area.X})
    this.setState({focusMemberTwo: false})
    member.smallScreen = false
    member.classSmall = ""
    
    this.setState({focusMembro: member})
    if(this.focusMembro == null){
      this.setState({focusMember: !this.state.focusMember})
    } else{
      if(this.state.focusMembro.id != member.id){
        //
      } else{
        this.setState({focusMember: !this.state.focusMember})
      }
    }
    if(this.state.focusMember){
      this.setState({focusMembro: null})
    }
  }
  memberFixTwo(member, dom){
    this.setState({focusEmoji: null})
    const found = this.state.members.find(e => e.id == member.owner)
    if(found){
      this.setState({focusMember: false})
      const area = {X: dom.clientX, Y: dom.clientY } 
      member.smallScreen = false
      if(dom.clientY <= 320){
        member.smallScreen = true
        this.setState({yModalMember: area.Y - 30})
        this.setState({xModalMember: area.X + 70})
      } else{
        this.setState({yModalMember: area.Y - 220})
        this.setState({xModalMember: area.X + 40})
      }
      this.setState({focusMembroTwo: found})
      if(this.focusMembro == null){
        this.setState({focusMemberTwo: !this.state.focusMemberTwo})
      } else{
        if(this.state.focusMemberTwo.id != member.id){
          //
        } else{
          this.setState({focusMemberTwo: !this.state.focusMemberTwo})
        }
      }
      if(this.state.focusMember){
        this.setState({focusMembroTwo: null})
      }
    }
  }
  memberFixThree(member, dom){
    this.setState({focusEmoji: null})
    const found = this.state.members.find(e => e.id == member.id)
    if(found){
      this.setState({focusMember: false})
      const area = {X: dom.clientX, Y: dom.clientY } 
      member.smallScreen = false
      if(dom.clientY <= 320){
        member.smallScreen = true
        this.setState({yModalMember: area.Y - 30})
        this.setState({xModalMember: area.X + 70})
      } else{
        this.setState({yModalMember: area.Y - 220})
        this.setState({xModalMember: area.X + 40})
      }
      this.setState({focusMembroTwo: found})
      if(this.focusMembro == null){
        this.setState({focusMemberTwo: !this.state.focusMemberTwo})
      } else{
        if(this.state.focusMemberTwo.id != member.id){
          //
        } else{
          this.setState({focusMemberTwo: !this.state.focusMemberTwo})
        }
      }
      if(this.state.focusMember){
        this.setState({focusMembroTwo: null})
      }
    }
  }
  openMenuMember(member, dom){
    this.setState({focusEmoji: null})
    const btn = dom.type
    if(btn == 'auxclick'){
      if(document.addEventListener){
          const found = this.state.members.find(e => e.id == member.id)
          if(found){
            this.setState({focusMemberFor: false})
            const area = {X: dom.clientX, Y: dom.clientY } 
            member.smallScreen = false
            if((window.innerHeight - dom.clientY) <= 195){
              this.setState({yModalMember: area.Y - 50})
            } else{
              this.setState({yModalMember: area.Y + 110})
            }
            if((window.innerWidth - dom.clientX) <= 205){
              this.setState({xModalMember: area.X - 195})
            } else{
              this.setState({xModalMember: area.X + 0})
            }
            this.setState({focusMembroFor: found})
            this.setState({focusMember: false})
            this.setState({focusMemberTwo: false})
            if(this.focusMembro == null){
              this.setState({focusMemberFor: !this.state.focusMemberFor})
            }
          }
          else{
            this.setState({focusMemberFor: false})
          }
        document.addEventListener('contextmenu', e => {
          e.preventDefault()
        }, false)
      }
    }
  }
  openMenuMemberCanais(canal, dom){
    this.setState({focusEmoji: null})
    const btn = dom.type
    if(btn == 'auxclick'){
      if(document.addEventListener){
          const found = this.state.channelList.find(e => e.id == canal.id)
          if(found){
            this.setState({focusMemberFor: false})
            const area = {X: dom.clientX, Y: dom.clientY } 
            if((window.innerHeight - dom.clientY) <= 195){
              this.setState({yModalCanal: area.Y - 50})
            } else{
              this.setState({yModalCanal: area.Y + 15})
            }
            if((window.innerWidth - dom.clientX) <= 205){
              this.setState({xModalCanal: area.X - 195})
            } else{
              this.setState({xModalCanal: area.X + 0})
            }
            this.setState({focusCanalFound: found})
            this.setState({focusMember: false})
            this.setState({focusMemberTwo: false})
            this.setState({focusCanal: !this.state.focusMemberFor})
          }
          else{
            this.setState({focusCanal: false})
          }
        document.addEventListener('contextmenu', e => {
          e.preventDefault()
        }, false)
      }
    }
  }
  openMenuMemberTwo(member, dom){
    this.setState({focusEmoji: null})
    const btn = dom.type
    if(btn == 'auxclick'){
      if(document.addEventListener){
          const found = this.state.members.find(e => e.id == member.owner)
          if(found){
            this.setState({focusMemberFor: false})
            const area = {X: dom.clientX, Y: dom.clientY } 
            member.smallScreen = false
            if((window.innerHeight - dom.clientY) <= 195){
              this.setState({yModalMember: area.Y - 120})
            } else{
              this.setState({yModalMember: area.Y + 110})
            }
            if((window.innerWidth - dom.clientX) <= 205){
              this.setState({xModalMember: area.X - 195})
            } else{
              this.setState({xModalMember: area.X + 0})
            }
            this.setState({focusMembroFor: found})
            this.setState({focusMember: false})
            this.setState({focusMemberTwo: false})
            if(this.focusMembro == null){
              this.setState({focusMemberFor: !this.state.focusMemberFor})
            }
          }
          else{
            this.setState({focusMemberFor: false})
          }
        document.addEventListener('contextmenu', e => {
          e.preventDefault()
        }, false)
      }
    }
  }
  fecharMenu(){
    
  }
  openCloseFixadoConfig(){
    if(localStorage.getItem("see") == null){
      localStorage.setItem("see", '1')
    } else{
      if(localStorage.getItem('see') == '0'){
        localStorage.setItem("see", '1')
      } else{
        localStorage.setItem("see", '0')
      }
    }
  }
  openProfile(){

  }
  replaceMention(mention, userReal){
    this.setState({focusEmoji: null})
    var msg = this.state.message
    msg = msg.replace(mention, userReal)
    this.setState({message: `${msg} `})
    $("#focusInputMessage").focus()
  }
  openLink(link){
    this.setState({linkParaAbrir: link})
  }
  abrindoLink(){
    var wind = window.open(this.state.linkParaAbrir, '_blank')
    wind.focus()
    this.setState({linkParaAbrir: null})
  }
  playSomenteUmVideo(e){
    
  }
  mudarDeCanal(id){
    this.setState({focusEmoji: null})
    if(this.state.channelList.find(e => e.id == id)){
      var url = window.location.pathname
      var array = url.split('/servers/')
      var serverID = array[1].split("/")[0]
      var channelID = url.split("/")[3]
      if(channelID != id){
        this.setState({loadingMessagesBoo: false})
        this.setState({loading: false})
        this.setState({cargosMembers: null})
        this.setState({membrosComCargos: []})
        this.setState({todasPessoasC: null})
        this.setState({members: []})
        this.setState({messages: []})
        setTimeout(() => {
          window.history.pushState("", "", `/servers/${this.props.server.id}/${id}`)
          this.setState({estouChannel: id})
          setTimeout(() => {
            socket.emit('getChannel', {idServer: this.props.server.id, token: window.localStorage.getItem('token')})
          }, 200);
        }, 200);
      }
    }
  }
  expulsar(id){
    this.setState({focusEmoji: null})
    socket.emit('kikarDoServidor', 
    {
      'token': window.localStorage.getItem('token'),
      'idServer': this.props.server.id,
      'idMember': id
    })
    this.setState({focusMemberFor: false})
  }
  cargosOpen(){
    
  }
  deleteCanal(id){
    this.setState({focusEmoji: null})
    socket.emit("deleteCanal", {
      'idServer': this.props.server.id,
      'token': window.localStorage.getItem('token'),
      'idCanal': id
      }
    )
    this.setState({focusCanal: false})
  }
  addNovoCanal(){
    this.setState({focusEmoji: null})
    socket.emit("novoCanal", {
      'idServer': this.props.server.id,
      'token': window.localStorage.getItem('token'),
      'nome': this.state.novoCanalTexto
      }
      )
    this.setState({novoCanal: false})
    this.setState({novoCanalTexto: ""})
  }
  abrirNovoCanal(){
    this.setState({focusEmoji: null})
    this.setState({novoCanal: !this.state.novoCanal})
    setTimeout(() => {
      if($("#novoCanal").length > 0){
        $("#novoCanal").focus()
      }
    }, 200);
  }
  toDateTime(input){
    var epoch = new Date(0);
    epoch.setSeconds(parseInt(input));
    var date = epoch.toISOString();
    date = date.replace('T', ' ');
    return date.split('.')[0].split(' ')[0] + ' ' + epoch.toLocaleTimeString().split(' ')[0];
  };
  emojiImgAdd(file){
      file = file.target.files[0]
      const react = this
      try {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
        const token = window.localStorage.getItem('token')
        let me = window.localStorage.getItem('myUser')
        let meJson = JSON.parse(me)
        const data = {
            'de': meJson.username,
            'base64': reader.result,
            'token': token
        }
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
        react.setState({emojiBase64: reader.result})
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      } catch (error) {
        console.log(error)
      }
  }
  saveEmoji(){
    const token = window.localStorage.getItem('token')
    const data = {
      'base64': this.state.emojiBase64,
      'token': token,
      'idServer': this.props.server.id
    }
    if(this.state.emojiBase64.length > 0){
      socket.emit('createEmoji', data)
      this.setState({createEmojiOpen: false})
      this.setState({emojiBase64: ''})
    }
  }
  openEmojiContainer(emoji, dom, id){
      emoji.texto = `:emoji_${id}:`
      const area = {X: dom.clientX, Y: dom.clientY } 
      if(dom.clientY <= 320){
        emoji.smallScreen = true
        emoji.xx = area.X + 50
        emoji.yy = area.Y - 30
      } else{
        emoji.xx = area.X + 50
        emoji.yy = area.Y - 40
      }
      this.setState({focusEmoji: emoji})
  }
  render(){
  return (
    <div className="Home">
      { this.state.focusMemberFor && this.state.focusMembroFor != null && <div 
      style={{left: `${this.state.xModalMember}px`, top: `${this.state.yModalMember}px`}}
      className="menuUsuario">
        <div className="top">
          <div 
          style={{backgroundImage: `url(${this.state.focusMembroFor.background})`}}
          className="background"></div>
          <h1>{this.state.focusMembroFor.username}</h1>
        </div>
        <div className="avatar">
          <img 
          onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
          src={(this.state.focusMembroFor.avatar != '' ? this.state.focusMembroFor.avatar : '../../defaultAvatar.png')}/>
        </div>
        <li>
          Perfil
        </li>
        { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusMembroFor.id != JSON.parse(window.localStorage.getItem('myUser')).id &&
        <li
        onClick={() => this.expulsar(this.state.focusMembroFor.id)}
        >
          Expulsar
        </li>
        }
        {/* { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusMembroFor.id != JSON.parse(window.localStorage.getItem('myUser')).id &&
        <li>
          Banir
        </li>
        } */}
        <div 
        onClick={() => this.setState({focusMemberFor: false})}
        className="transparentMenu"></div>
      </div>}
      {/* FocusCanal */}
      { this.state.focusCanal && this.state.focusCanalFound != null && this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusCanalFound.id != JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusCanalFound.cantDelete == 0 && <div 
      style={{left: `${this.state.xModalCanal}px`, top: `${this.state.yModalCanal}px`}}
      className="menuUsuario">
        { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusCanalFound.id != JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusCanalFound.cantDelete == 0 &&
        <div>
        <span>OPÇÕES DE CANAL</span>
        <br></br><br></br>
        <li
        onClick={() => this.deleteCanal(this.state.focusCanalFound.id)}
        >
          Excluir
        </li>
        </div>
        
        }
        {/* { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id &&
        this.state.focusMembroFor.id != JSON.parse(window.localStorage.getItem('myUser')).id &&
        <li>
          Banir
        </li>
        } */}
        <div 
        onClick={() => this.setState({focusCanal: false})}
        className="transparentMenu"></div>
      </div>}
      { this.state.linkParaAbrir != null &&
        <div className="modalS">
        <div 
        onClick={() => this.setState({linkParaAbrir: null})}
        className="transparent"></div>
        <div className="subModalS">
          <h1>CALMA AI!</h1>
          <p>Esse link vai te levar a <strong>{ this.state.linkParaAbrir }</strong>. Tem certeza que quer ir?</p>
          <button 
          onClick={() => this.setState({linkParaAbrir: null})}
          className="nao">Cancelar</button>
          <button 
          onClick={() => this.abrindoLink()}
          className="sim">Sim</button>
        </div>
      </div>
      }
      {/* { window.localStorage.getItem("see") != null && window.localStorage.getItem("see") == 1 &&
      <div className="fixadoConfig">
        <div className="centerFix">
          <div className="left">
            <div className="lista_e">
              <h1>{ this.props.server.name }</h1>
              <li>
                Visão geral
              </li>
              <li>
                Cargos
              </li>
              <li>
                Emoji
              </li>
            </div>
          </div>
        </div>
      </div> } */}
      <div className="headerBirl serverHeader">
        <div 
        onClick={() => this.setState({openSubMenuServer: !this.state.openSubMenuServer})}
        className={`transparentBoot ${(this.state.openSubMenuServer ? 'ativoSubMenu' : '')}`}>
          <div className="rightBoo">
            <i className={`fas fa-chevron-down ${(this.state.openSubMenuServer ? 'openBo' : '')}`}></i>
            { this.state.openSubMenuServer && <i className={`fas fa-chevron-down closeBo`}></i> }
          </div>
        </div>
        <h1> { this.props.server != undefined &&
         this.props.server.name != null && this.props.server.name ||  this.props.server != undefined && this.props.server == null && 'Comunidades' } </h1>
        <div className="channelName">
          <h1><i className="fas fa-hashtag"></i> {
          this.state.channelList != null &&
          this.state.channelList.find(e => e.id == this.state.estouChannel) != undefined ? 
          this.state.channelList != null && this.state.estouChannel != -1
          && this.state.channelList.find(e => e.id == this.state.estouChannel).name.toLowerCase() : ''
        }</h1>
        </div>
        <div className="right">
          <i 
          data-tip='Lista de membros'
          onClick={() => this.setState({showMembers: !this.state.showMembers})}
          className={`fas fa-users ${(this.state.showMembers ? 'ativoIcon': 'naoAtivoIcon')}`}></i>
        </div>
      </div>
      { this.state.openSubMenuServer && <div className={`subMenuServer`}>
        <li onClick={() => this.cargosOpen()}>
          <span>
            Cargos
          </span>
          <i>
            <i class="fas fa-cog"></i>
          </i>
        </li>
        <li>
          <span>
            Sair do servidor
          </span>
          <i>
            <i class="fas fa-door-open"></i>
          </i>
        </li>
      </div> }
      <div className="channelList">
        <div className="info">
          
          <button
          onClick={() => this.setState({ativoConvite: !this.state.ativoConvite})}
          className={`button entrarServer btnOkl ${(this.state.ativoConvite ? 'ativoBtnConvite' : '')}`}>
            <i class="fas fa-user-plus"></i> Convidar um amigo
          </button>
          <div className="avatar">
            { this.props.server.photo.trim().length > 0
            && <img onError={(e)=>{e.target.onerror = null;this.props.server.photo = imageError.b; e.target.src=`${imageError.b}`}} src={this.props.server.photo}/>
             }
            { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id  &&
            <span className="changeIcon">
              <label for="iconServer"><p>Alterar icone</p></label>
              <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onChange} name="iconServer" id="iconServer" />
            </span>
            }
          </div>
          { this.state.ativoConvite && 
          <div className="createServerForm inviteFriend">
          <div className="listaFri auto-Ge5KZx">
          { this.state.amigosConvidar == undefined && 
          <div className="loading">
            <i className="fas fa-spinner"></i>
          </div> }
          { 
          this.state.amigosConvidar.map((item, i) => {
            if(this.state.members.find(e => e.username == item.username)){
                return false
            } else{
               return true
            }
          }).find(e => e == true) != true && 
          <h1 className="noHaveFriendsAlone">Não tens mais nenhum amigo para convidar! 😭😭</h1>
          }
          { this.state.amigosConvidar != undefined && this.state.amigosConvidar.map((user, i) =>
          !this.state.members.find(e => e.username == user.username) &&
            user.username != JSON.parse(window.localStorage.getItem('myUser')).username &&
            <div>
              <li 
              className={`wowBooKaue ${this.state.convidados.find(e => e == user.username) ? 'convidadoSucess': 'notConvidado'}`}
              onClick={() => this.inviteServer(this.props.server.id, user.id, user.username)}>
                <div className="avatar">
                  <img
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={(user.avatar == '' ? '../../defaultAvatar.png' : user.avatar)}/>
                </div>
                <span className="name">
                { user.username }
                </span>
                {this.state.convidados.find(e => e == user.username) &&
                <div className="convidadoSucessoBro">
                  <Check></Check>
                </div>
                }
              </li>
            </div> 
          )}
          </div>
          </div>
          }
        </div>
        <a 
            data-tip="Adicionar novo canal"
            className="addMoreCanal"
            onClick={() => this.abrirNovoCanal()}
            ><i className="fas fa-plus"></i> canal</a>
        {/* Inicio canais #bbb */}
        { this.state.novoCanal && <div className="moreCanalInput">
              <div 
              onClick={() => this.setState({novoCanal: false})}
              className="transparentCanal"></div>
                <div className="boo">
                <h1>Adicionando novo canal.</h1>
                <form onSubmit={this.addNovoCanal}>
                <input 
                id="novoCanal"
                autoComplete="off"
                value={this.state.novoCanalTexto}
                onChange={this.handleChangeCanal}
                type="text" placeholder="Nome do canal"></input>
                </form>
                <div className="nota">
                <span>Nota</span>
                <span><h1>'Pressione { '<Enter>' } para criar.'</h1></span>
              </div>
              </div>
            </div> }
        <div className="chatList auto-Ge5KZx">
          { this.state.channelList == null &&
          <div className="loadingChannel">
            { this.state.loadingBoo.map((item, i) => 
              <li>
                <i className="fas fa-hashtag"></i>
                <span>
                  <span style={{opacity: 0}}>
                    {item.map((itemTwo, i) => <span>*</span>)}
                    </span>
                </span>
                <div className="transparentC"></div>

                <p>
                {/* <i class="fas fa-user-plus"></i> */}
              </p>
            </li>
            ) }
          </div>
          }
          { this.state.channelList != null && this.state.channelList.map((item, i) => 
          <div>
            <li 
            onClick={() => this.mudarDeCanal(item.id)}
            onAuxClick={(e) => this.openMenuMemberCanais(item, e)}
            className={`${(this.state.estouChannel == item.id ? 'ativoChannel': '')}`}>
            <i className="fas fa-hashtag"></i>
            <span>
              { item.name }
            </span>
            {/* <p>
            <i class="fas fa-user-plus"></i>
            </p> */}
            </li>
          </div>
          ) }
        </div>
      </div>
      {/* Fim canais #bbb */}
      { this.state.focusMember && <div
          tabIndex="10"
          data-id={this.state.focusMembro.id}
          onClick={() => this.setState({focusMember: false})}
          className="transparentFocus"></div> }
      { this.state.showMembers && <div className="memberContainer auto-Ge5KZx auto-hideScroll">
        { this.state.focusMember && this.state.focusMembro != null && <div className={`floatMember`}
        style={{right: '282px', top: this.state.yModalMember - 50 + 'px'}}>
          <div className="header">
          <div className="background" style={{backgroundImage: `url(${(this.state.focusMembro.background == '' ? '/../../defaultCover.jpg': this.state.focusMembro.background)})`}}>
          </div>
          <div className="backgroundBlur" style={{backgroundImage: `url(${(this.state.focusMembro.background == '' ? '/../../defaultCover.jpg': this.state.focusMembro.background)})`}}/>
            <div className="avatar">
              { this.state.focusMembro.bot == 0 &&
              <a onClick={() => this.openProfile()}>
              <Link to={`/profile/${this.state.focusMembro.username}`}>
                <div className="hoverBoo">
                  <span>Ver perfil</span>
                </div>
              </Link>
              </a>
              }
              <div className={`statusPessoa ${this.state.focusMembro.pessoaStatus}`}/>
              <img
              onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}} 
              data-id={this.state.focusMembro.id}
              data-image-src={this.state.focusMembro.username} src={`${(this.state.focusMembro.avatar == '' ? '../../defaultAvatar.png' : this.state.focusMembro.avatar)}`}/>
            </div>
            <h1 className="name">
              {this.state.focusMembro.username}
            </h1>
          </div>
          <div data-aria-label="bottom" className="bottom">
              <div className="cargos auto-Ge5KZx">
                <h3>CARGOS</h3>
                { this.state.focusMembro.id == this.props.server.owner && 
                  <div className="cargo" style={{border: '1px solid rgb(67, 181, 129)'}}>
                  <div className="bolinha" style={{background: 'rgb(67, 181, 129)'}}/>
                  <p style={{color: 'rgb(67, 181, 129)'}}>Dono</p>
                </div> }
                { this.state.focusMembro.id != this.props.server.owner && 
                  <div className="cargo">
                  <div className="bolinha"/>
                  <p>Membro</p>
                </div> }
                { this.state.focusMembro.bot == 1 && 
                <div className="cargo" style={{border: '1px solid rgb(307, 181, 129)'}}>
                <div className="bolinha" style={{background: 'rgb(307, 181, 129)'}}/>
                <p style={{color: 'rgb(307, 181, 129)'}}>Bot</p>
              </div>
                }
                { this.state.cargosMembers != null && this.state.cargosMembers.map((item, i) =>
                item.idMember == this.state.focusMembro.id && item.idServer == this.props.server.id &&
                <div className="cargo" style={{border: `1px solid ${item.cargo.color}`}}>
                  <div className="bolinha" style={{background: `${item.cargo.color}`}}/>
                  <p>{ item.cargo.cargo }</p>
                </div>
                ) }
                { this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id && 
                <div className="cargo moreCargo">
                  <i class="fas fa-plus"></i>
                </div>
                }
              </div>
              <div className="nota">
              <h3>NOTA</h3>
                <p>Clique com o botão direito em um usuário para mais ações.</p>
              </div>
            </div>
        </div> }
         <div>
            <div>
            {/* Lista de membros a partir do cargo #000 */}
            { this.state.membrosComCargos.length == 0 && 
            <LoadingMember></LoadingMember>
            }
            { this.state.membrosComCargos.map((cargo, i) => 
              <div>
                <h4 
                style={{color: '#8e9297'}}
                className="cargoMember">
                { cargo.cargo }—{cargo.users.length}
                </h4>
                { cargo.users.map((item, i) => 
                <div>
                <li
                onAuxClick={(e) => this.openMenuMember(item, e)}
                className={`people_${item.pessoaStatus}`}
                onClick={(e) => this.memberFix(item, e)}
                >
                <div className="avatar">
                  { item.id != undefined && item.id != JSON.parse(window.localStorage.getItem('myUser')).id && <div className={`statusPeople ${item.pessoaStatus}`}></div> }
                  <img 
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={`${(item.avatar == '' ? '../../defaultAvatar.png' : item.avatar)}`}/>
                </div>
                <span style={{ color: cargo.color != undefined ? `${cargo.color}` : 'white', fontWeight: 'bold'}}>
                  { item.username } { item.id != undefined && item.id == this.props.server.owner && <i className="fas fa-crown ownerServer"></i> }
                    </span>
                </li>
              </div>
                ) }
              </div>
            ) }
          </div> 
        </div>
        {/* End lista de membros a partir do cargo #000*/}
        </div> }
      
      {/* Inicio da lista de chat  #515151 */}
      <div className={`chatContainer ${(this.state.showMembers ? 'membersShowContainerChat' : 'dontShowContainerChat')}`}>
      {/* FocusMember Msgs */}
      { this.state.focusMemberTwo && this.state.focusMembroTwo != null && 
      <div onClick={() => this.setState({focusMemberTwo: false})} className="transparentFixTwo"></div> }
      { this.state.focusMemberTwo && this.state.focusMembroTwo != null && <div className="floatMember floatMemberTwo" style={{left: this.state.xModalMember + 'px', top: this.state.yModalMember + 'px'}}>
          <div className="header">
          <div className="backgroundBlur" style={{backgroundImage: `url(${(this.state.focusMembroTwo.background == '' ? '/../../defaultCover.jpg': this.state.focusMembroTwo.background)})`}}/>
            <div className="avatar">
              { this.state.focusMembroTwo.bot == 0 && <a onClick={() => this.openProfile()}>
              <Link to={`/profile/${this.state.focusMembroTwo.username}`}>
                <div className="hoverBoo">
                  <span>Ver perfil</span>
                </div>
              </Link>
              </a>}
              <div className={`statusPessoa ${this.state.focusMembroTwo.pessoaStatus}`}/>
              <img
              onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}} 
              data-id={this.state.focusMembroTwo.id}
              data-image-src={this.state.focusMemberTwo.username} src={`${(this.state.focusMembroTwo.avatar == '' ? '../../defaultAvatar.png' : this.state.focusMembroTwo.avatar)}`}/>
            </div>
            <h1 className="name">
              {this.state.focusMembroTwo.username}
            </h1>
          </div>
          <div data-aria-label="bottom" className="bottom">
              <div className="cargos">
                <h3>CARGOS</h3>
                { this.state.focusMembroTwo.id == this.props.server.owner && 
                 <div className="cargo" style={{border: '1px solid rgb(67, 181, 129)'}}>
                 <div className="bolinha" style={{background: 'rgb(67, 181, 129)'}}/>
                 <p style={{color: 'rgb(67, 181, 129)'}}>Dono</p>
                </div> }
                { this.state.focusMembroTwo.id != this.props.server.owner && 
                  <div className="cargo">
                  <div className="bolinha"/>
                  <p>Membro</p>
                </div> }
                { this.state.focusMembroTwo.bot == 1 && <div className="cargo" style={{border: '1px solid rgb(307, 181, 129)'}}>
                <div className="bolinha" style={{background: 'rgb(307, 181, 129)'}}/>
                <p style={{color: 'rgb(307, 181, 129)'}}>Bot</p>
              </div> }
                { this.state.cargosMembers != null && this.state.cargosMembers.map((item, i) =>
                item.idMember == this.state.focusMembroTwo.id &&
                <div className="cargo" style={{border: `1px solid ${item.cargo.color}`}}>
                  <div className="bolinha" style={{background: `${item.cargo.color}`}}/>
                  <p>{ item.cargo.cargo }</p>
                </div>
                ) }
                { this.props.server.id == JSON.parse(window.localStorage.getItem('myUser')).id && 
                <div className="cargo moreCargo">
                  <i class="fas fa-plus"></i>
                </div>
                }
              </div>
              {/* <div className="nota">
              <h3>NOTA</h3>
                <p>Clique com o botão direito em um usuário para mais ações.</p>
              </div> */}
            </div>
        </div> }
        <div className="msgListServer auto-Ge5KZx" style={{overflow: 'hidden scroll'}}>
        { this.state.focusEmoji != null &&
        <div 
        style={{left: `${this.state.focusEmoji.xx}px`, top: `${this.state.focusEmoji.yy}px`}}
        className="whoEmoji">
          <div className="close" onClick={() => this.setState({focusEmoji: null})}></div>
          <div className="left">
            { this.state.focusEmoji.emojiDefault != undefined && 
            <div
            className={`${(this.state.focusEmoji.emojiDefault != undefined ? 'isDefaultEmoji' : 'emojiPersonalizado')}`} 
            style={{backgroundImage: `${(this.state.focusEmoji.emojiDefault != undefined ? 'url(../../default_emoji.png)' : '')}`,
                  backgroundPositionX: `${(this.state.focusEmoji.x * 44) * -1}px`,
                  backgroundPositionY: `${(this.state.focusEmoji.y * 44)}px`
           }}></div>
            }
            { this.state.focusEmoji.emojiDefault == undefined && 
            <img src={this.state.focusEmoji.base64}/> }
          </div>
          <div className="right">
            <h1>{this.state.focusEmoji.texto}</h1>
            <h3>
              { this.state.focusEmoji.emojiDefault != undefined ? 'Este emoji é padrão de todos os servidores.' : 'Este emoji é deste servidor.' }
            </h3>
          </div>
        </div>
        }
          {
            this.props.server.owner == JSON.parse(window.localStorage.getItem('myUser')).id
          && <div className="welcome">
          <h1>Bem-vindo a { this.props.server.name }.</h1>
          <p>Este é o seu servidor, novinho em folha. Aqui vão algumas dicas para ajudar você a começar!</p>
          <div className={`dica ${this.state.members.length >= 3 && this.state.loadingMembers != '' ? 'feitoDica' : 'naoFeitoDica'}`}>
            Convide seus amigos { this.state.members.length >= 3 && this.state.loadingMembers && <Check></Check> }
          </div>
          <div className={`dica ${this.props.server.photo != '' ? 'feitoDica' : 'naoFeitoDica'}`}>
            Personalize seu servidor com um ícone { this.props.server.photo != '' && <Check></Check> }
          </div>
          <div className={`dica ${this.state.loading && 
            this.state.messages.find(e => e.deleteAll == undefined && e.id == JSON.parse(window.localStorage.getItem('myUser')).id)
            || this.state.messages.find(e => e.deleteAll == undefined && e.owner == JSON.parse(window.localStorage.getItem('myUser')).id)
            ? 'feitoDica' : 'naoFeitoDica'}`}>
            Envie sua primeira mensagem { this.state.loading && this.state.messages.find(e => e.deleteAll == undefined && e.owner == JSON.parse(window.localStorage.getItem('myUser')).id) && <Check></Check> }
          </div>
        </div>
          }
          {
            this.props.server.owner != JSON.parse(window.localStorage.getItem('myUser')).id
          && <div className="welcome">
          <h1>Bem-vindo(a) ao { this.props.server.name }.</h1>
          <p>Aqui é o começo de tudo, aproveite e faça novas amizades!</p>
        </div>
          }
          { !this.state.loading &&
          <div className="msgCool picarFake msgFakes">
          <LoadingMessages></LoadingMessages>
        </div>
          }
          {this.state.messages.length > 0 && this.state.messages.map((item, i) => 
          <div className={`msgCool ${(item.mentionsMe != undefined ? 'markDown': '')}`}>
          { item.newMember == 0 &&
          <li>
            { item.bot != undefined &&
            <div className="bot">
              <span>BOT</span>
            </div>
            }
            <div 
            className="avatar">
              <img
                onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                onAuxClick={(e) => this.openMenuMemberTwo(item, e)}
                onClick={(e) => this.memberFixTwo(item, e)}
                className="avatar" src={`${(item.avatar == '' ? '../../defaultAvatar.png' : item.avatar)}`}/>
              <div className={`onlineStatus ${(item.pessoaStatus == 'online'? 'onlineStatusO' : 'offlineStatusO')}`}>
              </div> 
              </div>
              <div className={`msg ${(item.msg.trim().split(" ").length == 1 ? 'emojiBig' : 'normalSize')}`}>
                { this.state.todasPessoasC != null &&
                <span
                className="userNameMsg"
                onClick={(e) => this.memberFixTwo(item, e)}
                onAuxClick={(e) => this.openMenuMemberTwo(item, e)}
                style={{ color: 
                  (this.state.todasPessoasC.indexOf(this.state.todasPessoasC.find(e => e.id == item.owner)) != -1 ?
                  this.state.todasPessoasC[this.state.todasPessoasC.indexOf(this.state.todasPessoasC.find(e => e.id == item.owner))].color: 'white')
                  }}
                >{ item.username }</span>
                }
                <span className="hoursCountBoo">
                  { new Date(item.date).getDay() < 10 ? '0' : '' }
                  {
                  new Date(item.date).getDay()
                  }
                  /
                  { new Date(item.date).getMonth() < 10 ? '0' : '' }
                  { 
                  new Date(item.date).getMonth() + 1
                  }
                  /
                  { 
                  new Date(item.date).getFullYear()
                  }
                </span>
                <p className={`msg`}>{ item.msg.split(" ").map((msg, i) => 
                this.state.loading &&
                <div>
                  {/* Verifica se é um link */}
                  { msg.split("http")[1] != undefined ?
                  <a class="linkMsg"
                  aria-label="url"
                  aria-href={msg.split("http")[1]}
                  title="Link"
                  target="_blank"
                  onClick={() => this.openLink(`http${msg.split("http")[1]}`)}>
                    http{ msg.split("http")[1]}
                  </a> : 
                    msg.split("@")[1] == undefined || this.state.members.lenght > 0 && !this.state.members.find(e => e.username.toLowerCase() == msg.split("@")[1].toLowerCase()) 
                    && msg.split("@")[1] != 'everyone' 
                    ?
                   msg == '' ? <span style={{opacity: 0}}>*</span> : 
                   msg.split("#")[1] == undefined &&
                   msg.split(":")[1] != null && msg.split(":")[2] != null && 
                   this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]) ? '' :  msg.split("#")[1] == undefined || !this.state.channelList.find(e => e.name.toLowerCase() == msg.split("#")[1].toLowerCase()) ? msg : '' : 
                   '' }
                  {/* Verifica se é um emoji */}
                  { msg.split(":")[1] != null && msg.split(":")[2] != null &&
                  this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]) &&
                  <div 
                  onClick={(e) => this.openEmojiContainer(this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))], e, msg.split(":")[1].split("_")[1])}
                  data-id={msg.split(":")[1].split("_")[1]}
                  className="emojiMsgBoo"
                  >
                    { this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].emojiDefault != undefined &&
                    <div
                    className={`${(this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].emojiDefault != undefined ? 'isDefaultEmoji' : 'emojiPersonalizado')}`} 
                    style={{backgroundImage: `${(this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].emojiDefault != undefined ? 'url(../../default_emoji.png)' : '')}`,
                          backgroundPositionX: `${(this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].x * 44) * -1}px`,
                          backgroundPositionY: `${(this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].y * 44)}px`
                  }}/>
                    }
                    { this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].emojiDefault == undefined &&
                    <img src={this.state.serverEmoji[this.state.serverEmoji.indexOf(this.state.serverEmoji.find(e => e.id == msg.split(":")[1].split("_")[1]))].base64}/> }
                  </div>
                  }
                  {/* Final verifica se é um emoji */}
                  {/* Termina de verificar se é um link */}
                  {/* Verifica se é uma pessoa */}
                  { this.state.cargosMembers != null && msg.split("@")[1] != undefined && 
                  this.state.members.find(e => e.username.toLowerCase() == msg.split("@")[1].toLowerCase())
                  &&
                  <span
                  className="pessoaClickable"
                  onClick={(e) => this.memberFixThree(this.state.members.find(e => e.username.toLowerCase() == msg.split("@")[1].toLowerCase()), e)}
                  onAuxClick={(e) => this.openMenuMember(this.state.members.find(e => e.username.toLowerCase() == msg.split("@")[1].toLowerCase()), e)}
                  >
                    @{ msg.split("@")[1] }
                  </span>
                  }
                  { this.state.cargosMembers != null && msg.split("@")[1] != undefined && 
                  msg.split("@")[1] == 'everyone'
                  &&
                  <span
                  className="pessoaClickable"
                  >
                    @{ msg.split("@")[1] }
                  </span>
                  }
                  {/* Verifica se é um channel */}
                  { this.state.channelList != null && msg.split("#")[1] != undefined
                  && this.state.channelList.find(e => e.name.toLowerCase() == msg.split("#")[1].toLowerCase()) &&
                  <span
                  data-tip="Canais de Texto"
                  onClick={() => this.mudarDeCanal(this.state.channelList.find(e => e.name.toLowerCase() == msg.split("#")[1].toLowerCase()).id)}
                  className={`${(this.state.channelList.find(e => e.name.toLowerCase() == msg.split("#")[1].toLowerCase()) ? 'pessoaClickable' : '')}`}>
                    #{ msg.split("#")[1] }
                  </span>
                  }
                </div>
                ) }</p>
                { item.infoYT != undefined && item.frameYT != undefined &&
                this.state.todasPessoasC != null &&
                this.state.todasPessoasC.indexOf(this.state.todasPessoasC.find(e => e.id == item.owner)) != -1 &&
                <div
                aria-label={item.infoYT.title}
                data-info={item.infoYT.title}
                className="iframe">
                <div
                  className="frame"
                  aria-hidden="false"
                  style={{ borderLeft: `4px solid rgb(255,0,0)` }}>
                  <p className="infoFrame">YouTube</p>
                  <p className="infoUserBo">{ item.infoYT.channelTitle }</p>
                  <h1 className="titleVideo">{ item.infoYT.title }</h1>
                  <iframe 
                  className="youtubeFrame" height="315" src={`https://www.youtube.com/embed/${item.frameYT}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
                  </div>
                </div>
                }
              </div>
          </li>
          }
          { item.newMember == 1 && 
          <li className="newMemberApareceu">
              <i className="fas fa-arrow-right arrowBro"></i>
              <div className="msg">
                <p className="msg"> <strong
                onClick={(e) => this.memberFixTwo(item, e)}
                onAuxClick={(e) => this.openMenuMemberTwo(item, e)}
                style={{cursor: 'pointer'}}>
                  {item.username}
                  </strong> - { item.msg }</p>
              </div>
          </li>
          }
        </div>
          ) }
        </div>
        <div className="bottomTwo">
          <div className="bottom">
            { this.state.todasPessoasC != null && this.state.message.split("@")[this.state.message.split("@").length - 1] != undefined && 
            this.state.message.split("@").length > 1 && 
            this.state.todasPessoasC.find(e => e.username.toLowerCase().includes(this.state.message.split("@")[this.state.message.split("@").length - 1].toLowerCase())) != undefined &&
            <div className="fixedMentionSearch fixedPeople auto-Ge5KZx">
            <h2>MEMBROS</h2> 
            { this.state.message.split("@")[this.state.message.split("@").length - 1].length == 0 && <h1>Digite alguma coisa</h1> }
            { this.state.todasPessoasC != null && this.state.todasPessoasC.map((item, i) => this.state.message.split("@")[this.state.message.split("@").length - 1] != null &&   
            this.state.message.split("@")[this.state.message.split("@").length - 1].length > 0 &&
            item.username.toLowerCase().includes(this.state.message.split("@")[this.state.message.split("@").length - 1].toLowerCase()) &&
              <li
              onClick={() => this.replaceMention(`@${this.state.message.split("@")[this.state.message.split("@").length - 1]}`, `@${item.username}`)}
              >
              <div className="avatar">
                <img 
                onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                src={`${(item.avatar == '' ? '../../defaultAvatar.png' : item.avatar)}`}/>
              </div>
              <span>{item.username}</span>
              </li>
            )}
            </div>
            }
        </div>
          {/* Channel */}
          { this.state.channelList != null && this.state.message.split("#")[this.state.message.split("#").length - 1] != undefined && 
          this.state.message.split("#").length > 1 && 
          this.state.channelList.find(e => e.name.toLowerCase().includes(this.state.message.split("#")[this.state.message.split("#").length - 1].toLowerCase())) != undefined &&
          <div className="fixedMentionSearch auto-Ge5KZx geralBoo">
          { this.state.message.split("#")[this.state.message.split("#").length - 1].length > 0 
          &&  <h2>RESULTADOS DE CANAIS DE TEXTO PARA #{ this.state.message.split("#")[this.state.message.split("#").length - 1] }</h2> 
          }
          { this.state.message.split("#")[this.state.message.split("#").length - 1].length > 0 
          &&  <h2></h2> 
          }
          { this.state.message.split("#")[this.state.message.split("#").length - 1].length == 0 && <h1>Digite alguma coisa</h1> }
          {this.state.message.split("#")[this.state.message.split("#").length - 1].length > 0 && this.state.channelList != null && this.state.channelList.map((item, i) => this.state.message.split("#")[this.state.message.split("#").length - 1] != null && 
          item.name.toLowerCase().includes(this.state.message.split("#")[this.state.message.split("#").length - 1].toLowerCase()) &&
            <li
            onClick={() => this.replaceMention(`#${this.state.message.split("#")[this.state.message.split("#").length - 1]}`, `#${item.name}`)}
            >
            <span><i className="fas fa-hashtag"></i> {item.name.toLowerCase()}</span>
            </li>
          )}
        </div>
          }
          { this.state.vendoEmoji && 
          <div 
          onBlur={() => this.setState({vendoEmoji: false})}
          className="emojisContainer auto-Ge5KZx">
            <span>EMOJIS</span>
            { this.state.createEmojiOpen && 
            <div className="createEmoji">
              <h1>Criando um emoji para seu servidor!</h1>
              <label for="emojiImg"><h2><i class="far fa-image"></i> Selecione uma imagem</h2></label>
              <div className="previewEmoji">
                {this.state.emojiBase64 != "" && <img src={this.state.emojiBase64}/>}
              </div>
              <button
              onClick={() => this.saveEmoji()}
              className="createEmojiBtn">Criar</button>
              <input type="file" 
                name="emojiImg"
                id="emojiImg"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={this.emojiImgAdd} 
                ></input>
            </div>}
           
            { JSON.parse(window.localStorage.getItem('myUser')).id == this.props.server.owner && 
            <div 
            onClick={() => this.setState({createEmojiOpen: !this.state.createEmojiOpen})}
            className="create">
              <h1><i class="fas fa-plus"></i> Criar um emoji</h1>
            </div>
            }
            { this.state.serverEmoji.length == 0 && 
            <div>
              <br></br><span>No momento esse servidor não tem nenhum emoji.</span>
            </div>
            }
            <br></br>
            { this.state.serverEmoji.map((item, i) => (
              <div
              onClick={() => this.setState({message: `${this.state.message} :emoji_${item.id}: `})}
              class="emoji"
              >
                { item.emojiDefault == undefined && <img src={item.base64}/> }
                { item.emojiDefault != undefined && 
                <div
                data-x={item.x}
                data-y={item.y}
                className={`${(item.emojiDefault != undefined ? 'isDefaultEmoji' : 'emojiPersonalizado')}`} 
                style={{backgroundImage: `${(item.emojiDefault != undefined ? 'url(../../default_emoji.png)' : '')}`,
                      backgroundPositionX: `${(item.x * 44) * -1}px`,
                      backgroundPositionY: `${(item.y * 44)}px`
              }}/>
                }
              </div>
            )) }
          </div>
          }
          <form onSubmit={this.sendMessageServer}>
            <input 
            autoComplete="off"
            id="focusInputMessage" 
            maxLength={890}
            value={this.state.message}
            onChange={this.handleChangeMsg}
            type="text"
            placeholder={`Envie uma mensagem para ${this.props.server.name}`}/>
            <div
            className={(this.state.vendoEmoji ? 'ativoEmoji' : '')}
            onClickCapture={() => this.setState({createEmojiOpen: false})}
            onClick={() => this.setState({vendoEmoji: !this.state.vendoEmoji})}>
              <EmojiMessage ativo={this.state.vendoEmoji}></EmojiMessage>
            </div>
          </form>
        </div>
      </div>
      {/* Fim da lista de chat  #515151 */}
      <ToastContainer pauseOnHover />
    </div>
  );
}
}

class LoadingMember extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qt: [50, 40, 40, 60, 50,50, 40, 40, 60, 50, 40, 20, 60, 40, 30, 50, 20, 15, 40, 50]
    }
  }
  render(){
  return (
    <div>
      { this.state.qt.map((item, i) =>
      <div className="user userSqueleton piscandoEsqueleto">
        { i % 5 == 0 && <br></br> && <div className="name squeletonName cargoSqueleton" style={{width: `${item - 10}%` }}/>}
        <div className="avatar squeletonAvatar"/>
        <div className="name squeletonName" style={{width: `${item}%` }}/>
      </div>
      ) }
    </div>
  );
}
}

class LoadingMessages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      qt: [
          10, 20, 40, 60, 20, 10, 15, 30,
          10, 20, 40, 60, 20, 10, 15, 30
          ]
    }
  }
  render(){
  return (
    <div>
      { this.state.qt.map((item, i) =>
      <div className="user userSqueleton piscandoEsqueleto">
        <div className="avatar squeletonAvatar"/>
        <div className="name squeletonName" style={{width: `100px` }}/>
        <div className="name squeletonName" style={{width: `${item} - 40%` }}/>
      </div>
      ) }
    </div>
  );
}
}

class Check extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render(){
  return (
    <div className="check">
        <i class="fas fa-check"></i>
    </div>
  );
}
}

class Gif extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render(){
  return (
    <div className="emojiMsg gifMsg">
      <i className=""/>
    </div>
  );
}
}

class EmojiMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      emojiArray: [
        'fas fa-smile-beam',
        'fas fa-tired',
        'fas fa-surprise',
        'fas fa-smile-wink',
        'fas fa-smile-beam',
        'fas fa-sad-tear',
        'fas fa-sad-cry',
        'fas fa-meh-blank',
        'fas fa-laugh-wink',
        'fas fa-laugh-squint',
        'fas fa-laugh-beam',
        'fas fa-laugh',
        'fas fa-kiss-wink-heart',
        'fas fa-kiss-beam',
        'fas fa-kiss',
        'fas fa-grin-wink',
        'fas fa-grin-tongue-wink',
        'fas fa-grin-tongue-squint',
        'fas fa-grin-tongue',
        'fas fa-grin-tears',
        'fas fa-grin-stars',
        'fas fa-grin-squint-tears',
        'fas fa-grin'
      ],
      emojiRandom: 'fas fa-smile-beam'
    }
  }
  setarEmoji(){
    var newEmoji = this.state.emojiArray[Math.floor(Math.random() * this.state.emojiArray.length)]
    while(newEmoji == this.state.emojiRandom){
      newEmoji = this.state.emojiArray[Math.floor(Math.random() * this.state.emojiArray.length)]
    }
    if(!this.props.ativo){
      this.setState({emojiRandom: this.state.emojiArray[Math.floor(Math.random() * this.state.emojiArray.length)]})
    }
  }
  render(){
  return (
    <div className="emojiMsg" onMouseEnter={() => this.setarEmoji()}>
      <i className={this.state.emojiRandom}/>
    </div>
  );
}
}

export default Servers;