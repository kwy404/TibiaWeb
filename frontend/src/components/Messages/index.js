import React, {useCallback} from 'react';
import socket from '../../socket';
import smallTooltip from 'small-tooltip';
import 'small-tooltip/smallTooltip.css';
import 'emoji-mart/css/emoji-mart.css'
import { Picker } from 'emoji-mart'
import {useDropzone} from 'react-dropzone'
import CryptoJS  from 'crypto-js'
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
const imageError = require('../../imageErrorLoad')
const defaultAvatar = require('../../defaultAvatar')
const news = new Audio('../sound.mp3');

class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ativo: true,
      openMessages: [],
      destaqueMessage: JSON.parse(window.localStorage.getItem('openMessages')) ? JSON.parse(window.localStorage.getItem('openMessages'))[0] : null,
      myFriendsMessage: [],
      loadingMessage: false,
      searchAtivo: false,
      searchText: "",
      fullScreen: false,
      hoverFriend: null,
      yModalMember: 0,
      xModalMember: 0,
      hoverFriendCond: false
    }
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  showMessage(){
      this.setState({ativo: !this.state.ativo})
  }
  myFriendsMessage(){
    socket.emit('myFriendsAmizade', window.localStorage.getItem('token'))
    const react = this
    socket.on('messagesFriends', data => {
      react.setState({loadingMessage: true})
      react.setState({myFriendsMessage: data})
    })
  }
  componentDidMount(){
    this.showMessagesOpened()
    const react = this
    socket.on('profileAmizadeLog', function(data){
      react.myFriendsMessage()
    })
    socket.on('notification', function(data){
      if(data.acao == 'atualizarPerfil'){
         react.myFriendsMessage()
      } else if(data.type == 'onlineAgora'){
        if(react.state.hoverFriend != null && data.id == react.state.hoverFriend.id){
          var focus = react.state.hoverFriend
          focus.pessoaStatus = 'online'
          react.setState({hoverFriend: focus})
        }
        var array = [...react.state.myFriendsMessage]
        for(let i = 0; i < array.length; i++){
          if(data.user[0] != undefined){
            if(data.user[0].username == array[i].username){
              array[i].pessoaStatus = 'online'
            }
          }
        }
        react.setState({myFriendsMessage: array})
      } else if(data.type == 'offline'){
        var array = [...react.state.myFriendsMessage]
        if(react.state.hoverFriend != null && data.id == react.state.hoverFriend.id){
          var focus = react.state.hoverFriend
          focus.pessoaStatus = 'offline'
          react.setState({hoverFriend: focus})
        }
        for(let i = 0; i < array.length; i++){
          if(data.user.username == array[i].username){
            array[i].pessoaStatus = 'offline'
          }
        }
        react.setState({myFriendsMessage: array})
      }
    })
    this.receiveMessage()
    socket.on('focarPessoa', function(data){
      react.setState({destaqueMessage: data})
    })
    socket.on('receiveMsgPrivate', function(data){
      socket.emit('quemMeEnviouMensagem', {'de': data.de})
    })
    document.addEventListener("keydown", (e) => {
      if(e.key == 'Escape'){
        const quemEstouVendo = react.state.destaqueMessage
        var openMessages = react.state.openMessages
        const found = openMessages.find(e => e == quemEstouVendo)
        const id = openMessages.indexOf(found)
        openMessages.splice(id, 1)
        window.localStorage.setItem('openMessages', JSON.stringify(openMessages))
        this.setState({openMessages: openMessages})
        if(this.state.openMessages.length > 0){
          this.setState({destaqueMessage: this.state.openMessages[this.state.openMessages.length - 1]})
          socket.emit('quemMeEnviouMensagem', {'de': this.state.openMessages[this.state.openMessages.length - 1].username})
          socket.emit('loadMessages', {'de': JSON.parse(window.localStorage.getItem('myUser')).username, 'para': this.state.openMessages[this.state.openMessages.length - 1].username})
        }
      }
    })
    this.myFriendsMessage()
  } 
  receiveMessage(){
    const who = this
    socket.on('pessoaMessage', function(data){
      if(data.username != JSON.parse(window.localStorage.getItem('myUser')).username){
        who.setState({destaqueMessage: data})
        const jsonAtual = JSON.parse(window.localStorage.getItem('openMessages'))
        const found = jsonAtual.find(e => e.username == data.username)
        if(!found){
          let userT = data
          jsonAtual.push(userT)
          window.localStorage.setItem('openMessages', JSON.stringify(jsonAtual))
          socket.emit('loadMessages', {'de': JSON.parse(window.localStorage.getItem('myUser')).username, 'para': data.username})
          news.play()
        }
      }
    })
  }
  showMessagesOpened(){
    setInterval(() => {
      const openMessages = window.localStorage.getItem('openMessages')
      if(openMessages){
        let json = JSON.parse(openMessages)
        this.setState({openMessages: json})
      }
    }, 200);
  }
  openDestaqueMessage(item, data){
    this.setState({destaqueMessage: item})
    socket.emit('loadMessages', {'de': JSON.parse(window.localStorage.getItem('myUser')).username, 'para': data.username})
  }
  sendMessage(user){
    this.setState({hoverFriend: null})
    const react = this
    const openMessages = window.localStorage.getItem('openMessages')
    if(openMessages){
      let json = JSON.parse(openMessages)
      const foundPeople = json.find(e => e.id == user.id)
      if(!foundPeople){
        let userT = user
        json.push(userT)
      }
      window.localStorage.setItem('openMessages', JSON.stringify(json))
    } else{
      let json = []
      let userT = user
      json.push(userT)
      window.localStorage.setItem('openMessages', JSON.stringify(json))
    }
    socket.emit('focarMensagemPessoa', user)
  }
  renderMessage(){
    socket.emit('myFriendsAmizade', window.localStorage.getItem('token'))
  }
  handleKeyUp(event){
    this.setState({searchText: event.target.value})
  }
  memberFix(member, dom){
    const area = {X: dom.clientX, Y: dom.clientY }
    this.setState({xModalMember: area.X})
    if((window.innerHeight - dom.clientY) <= 255){
      this.setState({yModalMember: window.innerHeight - 315})
    } else{
      this.setState({yModalMember: area.Y - 55})
    }
    this.setState({hoverFriend: member})
    this.setState({hoverFriendCond: true})
  }
  render(){
  return (
    <div>
      <ToastContainer pauseOnHover />
      <div className={`Messages MessagesContainer OpenContainerOp messagesFixedRight ${(this.state.ativo ? '': '')} ${(this.state.fullScreen && this.state.ativo ? 'fullScreenMessage': '')}`}>
        { this.state.hoverFriend != null && this.state.hoverFriendCond && <div 
        className={`hoverUser_Boo`}
        style={{right: '355px', top: this.state.yModalMember + 'px'}}
        >
          <div className="background" style={{backgroundImage: `url(${(this.state.hoverFriend.background == '' ? '../defaultCover.jpg': this.state.hoverFriend.background)})`}}>
          </div>
          <div style={{width: '45px', height: '45px'}} className="avatar">
            <img
            onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
            src={(this.state.hoverFriend.avatar == '' ? '../defaultAvatar.png' : this.state.hoverFriend.avatar)}/>
          </div>
          <h1>
            { this.state.hoverFriend.username }
          <br>
          </br>
          <span style={{fontSize: '11px'}}>
            { this.state.hoverFriend.pessoaStatus == 'online' ? 'Está online agora.' : 'Está offline.' }
            </span>
          </h1>
        </div> }
        <div className="header">
          <div className="transparentHeader">
          </div>
            <h1><i class="fas fa-comment scale"></i> Mensagens</h1>
            <div className="right">
              <button
              data-tip="Pesquisar pessoas"
              className={`${(this.state.searchAtivo ? 'ativoBtn' : '')}`}
              onClick={() => this.setState({searchAtivo: !this.state.searchAtivo})}>
                <i className="fas fa-search"></i>
              </button>
              <button
               onClick={() => this.renderMessage}
               data-tip="Atualizar mensagens">
                <i class="fas fa-sync-alt"></i>
              </button>
              {/* <button
              className={`${(this.state.fullScreen ? 'ativoBtn' : '')}`}
               onClick={() => this.setState({fullScreen: !this.state.fullScreen})}
               data-tip="Aumentar">
                { !this.state.fullScreen && 
                  <i className="fas fa-compress"></i>
                }
                { this.state.fullScreen && 
                  <i className="fas fa-compress-arrows-alt"></i>
                }
              </button> */}
            </div>
        </div>
        {
        this.state.ativo &&
        <div className={`inputSearch ${(this.state.searchAtivo ? 'inputSearch_ativo' : '')}`}>
          <input 
          onKeyUp={this.handleKeyUp}
          placeholder="Busque amigos"></input>
        </div>
        }
        {
        this.state.ativo && !this.state.loadingMessage &&
        <div className="loading_chat">
          <span>
            <i className="fas fa-spinner"></i>
            <br></br>
          </span>
        </div>
        }
        {this.state.loadingMessage && this.state.ativo &&
        <div className="scrollBar auto-Ge5KZx">
          { this.state.myFriendsMessage.length == 0 && this.state.loadingMessage && 
            <div className="pena">
              <p>
                Que pena você não tem nenhum amigo para conversar.
                <br></br>
                <img src="../cry.png"></img>
              </p>
            </div>  
          }
          { this.state.searchAtivo && this.state.searchText != '' &&
          <div>
          <p className="resultados">Resultados para { this.state.searchText }</p>
          { this.state.myFriendsMessage.map((item, i) =>
            <div>
            {
            item.username !=  JSON.parse(window.localStorage.getItem('myUser')).username && 
            item.aceito == 1 && item.username.toLowerCase().includes(this.state.searchText.toLowerCase()) &&
              <div>
                <li
                onMouseEnter={(e) => this.memberFix(item, e)}
                onMouseLeave={() => this.setState({hoverFriendCond: false})}
                className={`${((JSON.parse(window.localStorage.getItem('openMessages')).length > 0 && 
                JSON.parse(window.localStorage.getItem('openMessages')).find(e => e.id == item.id) ? 'chatAtivoIn' : ''))}`} 
                onClick={() => this.sendMessage(item)}>
                <div className="avatar">
                  <img
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
                </div>
                <p>{ item.username }</p> 
              </li>
            </div>
          }
          </div>
          )}
          </div> }
          { !this.state.searchAtivo &&
          <div>
          { this.state.myFriendsMessage.map((item, i) =>
            <div>
            {
            item.username !=  JSON.parse(window.localStorage.getItem('myUser')).username && 
            item.aceito == 1 &&
              <div className={`${((JSON.parse(window.localStorage.getItem('openMessages')).length > 0 && 
              JSON.parse(window.localStorage.getItem('openMessages')).find(e => e.id == item.id) ? 'chatAtivoIn' : ''))}`}>
                <li 
                onMouseEnter={(e) => this.memberFix(item, e)}
                onMouseLeave={() => this.setState({hoverFriendCond: false})}
                onClick={() => this.sendMessage(item)}>
                <div className="avatar">
                  <div className={`onlineStatusFriends HolaStatus ${(item.pessoaStatus == 'online'? 'onlineStatusO' : 'offlineStatusO')}`}>
                  </div> 
                  <img 
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
                </div>
                <p>{ item.username }</p> 
              </li>
            </div>
          }
          </div>
          )}</div> }
        </div>
       }
      </div>
      <div className="fixadoConversa">
      { this.state.destaqueMessage !== null && this.state.openMessages.length > 0 && this.state.openMessages.map((item, i) => 
        <div 
        key={i}
        onClick={() => this.openDestaqueMessage(item, item)}
        className={`avatar ${( this.state.destaqueMessage != null && this.state.destaqueMessage != undefined && this.state.destaqueMessage.username == item.username ? 'destaque' : '')}`}
        data-tip={item.username}>
          <img
          onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
          src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
        </div>
        )}
      </div>
      { this.state.destaqueMessage !== null && this.state.destaqueMessage != undefined && this.state.openMessages 
      && this.state.openMessages.map((item, i) => 
        <MessagePeople user={item}
        destaque={this.state.destaqueMessage !== null && this.state.destaqueMessage != undefined && this.state.destaqueMessage.username == item.username}/>
      )}
    </div>
  );
}
}

class MessagePeople extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      ativo: true,
      msg: '',
      openMessages: [],
      quemMensagem: {},
      file: null,
      config: false,
      fundoNaoCarregou: false,
      msgs: [],
      base64Image: null,
      newsMsg: false,
      strangerDigitando: false,
      loading: true,
      enterMessage: null,
      online: false,
      chatAnonymo: false
    }
    this.handleChangeMsg = this.handleChangeMsg.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.onChangePhoto = this.onChangePhoto.bind(this)
  }
  componentDidMount(){
    const react = this
    socket.emit('loadMessages', {'de': JSON.parse(window.localStorage.getItem('myUser')).username, 'para': this.props.user.username})
    socket.on('msgsLoaded', function(data){
      setTimeout(() => {
        if ( $(".chat").length ){
        $('.chat').scrollTop($('.chat')[0].scrollHeight);
        } else{
          react.setState({newsMsg: false})
        }
      }, 200);
      react.setState({msgs: data})
      react.setState({loading: false})
      // document.querySelectorAll(".Messages input")[3].focus()
    })
    socket.on('atualizarServidores', () => {
      socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
    })
    socket.on('receiveMsgPrivate', function(data){
        if(!react.state.loading){
          if(react.props.user.username == data.de || react.props.user.username == data.para){
            var joined = react.state.msgs.concat(data);
            react.setState({ msgs: joined })
            react.setState({enterMessage: null})
          }
          if ( $(".chat").length ){
            const scrollHeight = $('.chat')[0].scrollTop
            if(scrollHeight + 390 >= $('.chat')[0].scrollHeight - 50){
              $('.chat').scrollTop($('.chat')[0].scrollHeight);
            }
            if(data.para == JSON.parse(window.localStorage.getItem('myUser')).username){
              news.play()
              react.setState({newsMsg: true})
              react.receiveNewMessage(data.de)
            }
          }
          react.setState({enterMessage: null})
        }
    })
    socket.on('notification', function(data){
      if(data.type == 'digitando'){
        if(react.props.user.username == data.user.username || react.props.user.username == data.user.username){
          react.setState({strangerDigitando: true})
        }
      } else{
        if(data.type == 'naoDigitando'){
          if(react.props.user.username == data.user.username || react.props.user.username == data.user.username){
            react.setState({strangerDigitando: false})
          }
        }
      }
    })
  }
  showMessage(){
      this.setState({ativo: !this.state.ativo})
  }
  qualServidorEntrei(){

  }
  closeMessage(){
    const openMessages = window.localStorage.getItem('openMessages')
    if(openMessages){
      let json = JSON.parse(openMessages)
      const foundPeople = json.find(e => e.id == this.props.user.id)
      if(foundPeople){
        const id = json.indexOf(foundPeople)
        json.splice(id, 1)
      }
      window.localStorage.setItem('openMessages', JSON.stringify(json))
      if(openMessages.length > 0){
        this.setState({destaqueMessage: openMessages[openMessages.length - 1]})
        socket.emit('quemMeEnviouMensagem', {'de': openMessages[openMessages.length - 1].username})
        socket.emit('loadMessages', {'de': JSON.parse(window.localStorage.getItem('myUser')).username, 'para': openMessages[openMessages.length - 1].username})
      }
    }
    const react = this
    const token = window.localStorage.getItem('token')
    let me = window.localStorage.getItem('myUser')
    let meJson = JSON.parse(me)
    socket.emit('naoDigitando', {
      'de': meJson.username,
      'para': react.props.user.username,
      'token': token
    })
  }
  handleChangeMsg(event) {
    this.setState({msg: event.target.value});
  }
  handleSubmit (event){
    const token = window.localStorage.getItem('token')
    let me = window.localStorage.getItem('myUser')
    let meJson = JSON.parse(me)
    const data = {
      'de': meJson.username,
      'para': this.props.user.username,
      'msg': this.state.msg,
      'token': token,
      'chatAnonymo': this.state.chatAnonymo
    }
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
    
    if(this.state.msg.trim().length > 0 && token && meJson.username){
      socket.emit('sendMsg', ciphertext)
      this.setState({msg: ''})
    }
    event.preventDefault()
  }
  sendLike (){
    const token = window.localStorage.getItem('token')
    let me = window.localStorage.getItem('myUser')
    let meJson = JSON.parse(me)
    const data = {
      'de': meJson.username,
      'para': this.props.user.username,
      'msg': '(y)',
      'token': token,
      'chatAnonymo': this.state.chatAnonymo
    }
    const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
    socket.emit('sendMsg', ciphertext)
  }
  getBase64(file) {
    try {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        window.localStorage.setItem("fundoChat", reader.result)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } catch (error) {
      
    }
  }
  getBase64Image(file) {
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
          'para': react.props.user.username,
          'base64': reader.result,
          'token': token,
          'chatAnonymo': react.state.chatAnonymo
        }
        const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
        socket.emit('sendMsg', ciphertext)
      };
      reader.onerror = function (error) {
        console.log('Error: ', error);
      };
    } catch (error) {
      
    }
  }
  onChange(e) {
    this.setState({file:e.target.files[0]})
    this.getBase64(e.target.files[0])
  }
  onChangePhoto(e){
    this.setState({file:e.target.files[0]})
    this.getBase64Image(e.target.files[0])
  } 
  configSet(){
    this.setState({config: !this.state.config})
  }
  errorCarregarFundo(){
    this.setState({fundoNaoCarregou: true})
  }
  openPhotoModal(photo){
    $(".modalPhotoSelect").addClass("abertoModalTwo")
    $(".modalPhotoSelect img").attr('src', photo)
  }
  digitando(){
    const react = this
    const token = window.localStorage.getItem('token')
    let me = window.localStorage.getItem('myUser')
    let meJson = JSON.parse(me)
    if(this.state.msg.trim().length > 0){
      socket.emit('digitando', {
        'de': meJson.username,
        'para': react.props.user.username,
        'token': token
      })
    } else{
      socket.emit('naoDigitando', {
        'de': meJson.username,
        'para': react.props.user.username,
        'token': token
      })
    }
  }
  OnMouseEnter(id){
    this.setState({enterMessage: id})
  }
  onMouseFora(){
    this.setState({enterMessage: null})
  }
  changeStateForce(user){
    setTimeout(() => {
      socket.emit('profileInfo', {"de": user, "para": JSON.parse(window.localStorage.getItem('myUser')).username})
    }, 500);
  }
  entrarServidor(serverId){
    setTimeout(() => {
      socket.emit('entrarServidor', {
        'token': window.localStorage.getItem('token'),
        'serverId': serverId
      })
      setTimeout(() => {
        window.location.pathname = `/servers/${serverId}`
      }, 200);
    }, 500);
  }
  receiveNewMessage(name){
    const titleAtual = document.title
    var loopsI = 0
    const loop = setInterval(() => {
      document.title = `Nova mensagem de ${name}`
      setTimeout(() => {
        document.title = titleAtual
        loopsI++
      }, 900);
      if(loopsI >= 15){
        clearInterval(loop)
      }
    }, 800);
  }
  render(){
  return (
    <div>
      <div className={`Messages MessagesRelative ${(this.state.ativo ? 'ativoMessagePeople': '')} ${(this.props.destaque ? 'destaque' : 'naoDestaque')} `}>
        {
         window.localStorage.getItem('fundoChat') && !this.state.fundoNaoCarregou && !this.state.loading
         &&
         <div className="background">
           <img onError={this.errorCarregarFundo} src={window.localStorage.getItem('fundoChat')}/>
         </div>
        }
        <div className="header">
        <div onClick={() => this.showMessage()} className="transparentHeader">

        </div>
        <Link to={`/profile/${this.props.user.username}`}>
        <span onClick={() => this.changeStateForce(this.props.user.username)}>
        <div className="avatar">
          <span className={`situacaoPessoa ${this.props.user.pessoaStatus}`}></span>
          <img 
          onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
          src={(this.props.user.avatar == '' ? '../defaultAvatar.png' : this.props.user.avatar)}/>
        </div>
        <h1 className={`${(this.state.strangerDigitando ? 'digitandoBro' : '')}`}>{ this.props.user.username }</h1>
        {this.state.strangerDigitando && 
        <span className="digitandoOps">
          Digitando...
        </span>
        }
        </span>
        </Link>
          <div className="right">
            <button 
            data-tip="Fechar janela"
            onClick={() => this.closeMessage()}><i className="fas fa-times"></i></button>   
          </div>
          <div className="right anonymo">
          <button 
            className={`${(this.state.chatAnonymo ? 'chatAnonymoAtivo': '')}`}
            data-tip="Conversa anonyma"
            onClick={() => this.setState({chatAnonymo: !this.state.chatAnonymo})}><i className="fas fa-ghost"></i></button>
          </div>
        </div>
        {
        this.state.ativo && this.state.loading &&
        <div className="loading_chat">
          <span>
            <i className="fas fa-spinner"></i>
            <br></br>
            Carregando conversa...
          </span>
        </div>
        }
        { this.state.ativo && <div className="chat">
        {/* { 
        this.state.newsMsg &&
        <p className="newsMessage">Você tem novas mensagens</p>
        } */}
        <div className="comeceConversa">
        { this.state.msgs != undefined && this.state.msgs.length > 0 && <h1>Aqui é o começo da conversa com { this.props.user.username }! </h1> }
        { this.state.msgs != undefined && this.state.msgs.length == 0 && <h1>
          Começe uma conversa com { this.props.user.username }! </h1>
          }
        <h1 className="autoDeleteMsgInfo">As mensagens são automaticamentes apagadas depois de 1 semana.</h1>
        </div>
        { this.state.msgs != undefined && this.state.msgs.length > 0 && this.state.msgs.map((item, i) =>
          <div key={i}>
          { item.de == this.props.user.username || item.para == this.props.user.username &&
          <li 
          // onMouseEnter={() => this.OnMouseEnter(item)}
          // onMouseLeave={() => this.onMouseFora()}
          className={`myMessage ${(item.base64 ? 'isImage' : '')} ${(item.error ? 'errorMessage': 'normalMessage')}`}>
          { this.state.enterMessage != null && this.state.enterMessage == item && item.chatAnonymo != undefined && !item.chatAnonymo &&
          <div className="moreOptionsChatTwo">
            <button>
              <i class="far fa-smile-beam"></i>
            </button>
            <button>
              <i class="fas fa-pencil-alt"></i>
            </button>
            <button>
              <i class="far fa-trash-alt"></i>
            </button>
          </div>
          }
          { item.error && <span className="errorMensagem"
          data-tip="Ocorreu um erro, talvez você não seja amigo dessa pessoa, ou essa pessoa te bloqueio."
          >Falha ao enviar mensagem.</span> }
          { item.chatAnonymo != undefined && item.chatAnonymo && 
          <i className="fas fa-ghost"></i>
          }
          { item.msg == '(y)' && 
          <svg viewBox="0 0 36 36"><mask id="js_1u0"><rect height="100%" width="100%" fill="transparent" x="0" y="0"></rect><path d="M10,30 L7.75,30 C6.625,30 6,27.7515306 6,23.3673469 C6,18.9831633 6.625,16.7346939 7.75,16.7346939 L10,16.7346939 C10.552,16.7346939 11,17.1918367 11,17.755102 L11,28.9795918 C11,29.5428571 10.552,30 10,30 M17,6.02040816 C17,5.44540816 17.4195,5.00255102 18,5 C19.2035,5 22,5.79081633 22,10.6122449 C22,12.2443878 21.8015,13.130102 21.7195,13.7163265 C21.719,13.7183673 21.719,13.7204082 21.7185,13.722449 C21.6865,13.9566327 21.872,14.1647959 22.113,14.1647959 C26.908,14.1647959 29.469,15.4336735 29.469,16.7290816 C29.469,17.3612245 29.211,17.9321429 28.7975,18.3535714 C29.513,18.7591837 30,19.5091837 30,20.3780612 C30,21.3642857 29.4255,22.2045918 28.5475,22.5515306 C28.821,22.9326531 28.9845,23.3954082 28.9845,23.8969388 C28.9845,24.9704082 28.3395,25.8653061 27.3365,26.1438776 C27.4285,26.377551 27.4845,26.6290816 27.4845,26.8943878 C27.4845,28.0459184 25.5485,28.9795918 21,28.9795918 C17.675,28.9795918 15.3815,28.3857143 14.5,27.9591837 C13.851,27.6454082 13,27.0770408 13,25.4081633 L13,18.7755102 C13,15.0403061 17.25,13.7760204 17.25,10.1020408 C17.25,7.78826531 17,6.81326531 17,6.02040816"></path></mask><rect class="_8rsr" height="100%" width="100%" fill="white" mask="url(#js_1u0)"></rect></svg> }
          { item.msg != '(y)' && <p>{ item.msg } 
          </p> }
          { item.base64 && <div>
            {<img onClick={() => this.openPhotoModal(item.base64)} id={`image${item.id}`} onError={(e)=>{e.target.onerror = null; item.base64 = imageError.b; e.target.src=`${imageError.b}`}} src={item.base64}/>}
          </div> }
          
          </li>
          }
          { item.de == JSON.parse(window.localStorage.getItem('myUser')).username 
          || item.para == JSON.parse(window.localStorage.getItem('myUser')).username  &&
          <div>
          <br/>
          {/* data-tip={`Enviado ${item.date.split("-")[2].split("T")[0]}/${item.date.split("-")[1]}/${item.date.split("-")[0]}`} */}
          <li className={`${(item.base64 ? 'isImage' : '')}`}>
          { item.chatAnonymo != undefined && item.chatAnonymo && 
          <i className="fas fa-ghost"></i>
          }
          { item.msg == '(y)' && 
          <svg viewBox="0 0 36 36"><mask id="js_1u0"><rect height="100%" width="100%" fill="transparent" x="0" y="0"></rect><path d="M10,30 L7.75,30 C6.625,30 6,27.7515306 6,23.3673469 C6,18.9831633 6.625,16.7346939 7.75,16.7346939 L10,16.7346939 C10.552,16.7346939 11,17.1918367 11,17.755102 L11,28.9795918 C11,29.5428571 10.552,30 10,30 M17,6.02040816 C17,5.44540816 17.4195,5.00255102 18,5 C19.2035,5 22,5.79081633 22,10.6122449 C22,12.2443878 21.8015,13.130102 21.7195,13.7163265 C21.719,13.7183673 21.719,13.7204082 21.7185,13.722449 C21.6865,13.9566327 21.872,14.1647959 22.113,14.1647959 C26.908,14.1647959 29.469,15.4336735 29.469,16.7290816 C29.469,17.3612245 29.211,17.9321429 28.7975,18.3535714 C29.513,18.7591837 30,19.5091837 30,20.3780612 C30,21.3642857 29.4255,22.2045918 28.5475,22.5515306 C28.821,22.9326531 28.9845,23.3954082 28.9845,23.8969388 C28.9845,24.9704082 28.3395,25.8653061 27.3365,26.1438776 C27.4285,26.377551 27.4845,26.6290816 27.4845,26.8943878 C27.4845,28.0459184 25.5485,28.9795918 21,28.9795918 C17.675,28.9795918 15.3815,28.3857143 14.5,27.9591837 C13.851,27.6454082 13,27.0770408 13,25.4081633 L13,18.7755102 C13,15.0403061 17.25,13.7760204 17.25,10.1020408 C17.25,7.78826531 17,6.81326531 17,6.02040816"></path></mask><rect class="_8rsr" height="100%" width="100%" fill="white" mask="url(#js_1u0)"></rect></svg> }
          { item.msg != '(y)' && <p>
            { item.msg } 
            { item.conviteServer > -1 &&
            <Link to={`/servers`}>
            <button 
            onClick={() => this.entrarServidor(item.conviteServer)}
            className="button entrarServer">Entrar</button></Link>
            }
            { item.base64 && <div>
            { <img onClick={() => this.openPhotoModal(item.base64)} id={`image${item.id}`} onError={(e)=>{e.target.onerror = null;item.base64 = imageError.b; e.target.src=`${imageError.b}`}} src={item.base64}/>}
          </div> }
            </p> }
          </li>
          </div>
          }
          </div>
          
        ) }
        </div> }
        {/* { this.state.strangerDigitando && <div class="typing-indicator">
          <span></span>
          <span></span>
          <span></span>
        </div> } */}
        { this.state.ativo && <div className="bottom">
         <div 
         className={`imagemFundo ${(this.state.msg.length > 0 ? 'digitandoFundo': '')} ${this.state.config ? 'scaling' : ''}`}>
          <label className="button" for="imgFundo">
          <i class="far fa-image"></i></label>
          <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onChange} name="imgFundo" id="imgFundo" />
        </div>
        <form onSubmit={this.handleSubmit}>
         { this.state.msg.length == 0 && 
          <div>
           <button className={`${(this.state.config ? 'ativoButton': '')}`} onClick={() => this.configSet()}>
              <i class="fas fa-sliders-h"></i>
            </button>
            <button>
              <i class="far fa-sticky-note"></i>
            </button> 
            {/* <label className="button buttonMessage" for="imgMessage">
            <i class="far fa-image"></i></label>
            <input type="file" accept="image/x-png,image/gif,image/jpeg" 
            onChange={this.onChangePhoto} name="imgMessage" id="imgMessage" /> */}
          </div>
          }
          <input
          onKeyUp={() => this.digitando()}
          autoComplete="off"
          maxLength={890}
          class={`${(this.state.msg.length > 0 ? 'digitando': '')}`}
          value={this.state.msg} onChange={this.handleChangeMsg}
          type="text" placeholder={`Aa`}/>
         </form>
        { this.state.msg.length == 0 && <button 
          onClick={() => this.sendLike()}
          className="like noColors">
          <i class="far fa-thumbs-up"></i>
        </button> }
        </div> }
      </div>
    </div>
  );
}
}

export default Messages;