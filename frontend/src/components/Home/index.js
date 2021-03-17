import React from 'react';
import  './../../css/Login.css';
import socket from './../../socket'
import CryptoJS  from 'crypto-js'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

export let logged = false

const translate = require('../Languages/index')

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
     username: "",
     password: "",
     usernameRegister: "",
     passwordRegister: "",
     error: null,
     path: '',
     register: false,
     inviteRegister: '',
     invite: ''
    }
    this.handleChangeUser = this.handleChangeUser.bind(this);
    this.handleChangePassword = this.handleChangePassword.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChangeUserRegister = this.handleChangeUserRegister.bind(this);
    this.handleChangePasswordRegister = this.handleChangePasswordRegister.bind(this);
    this.handleSubmitRegister = this.handleSubmitRegister.bind(this)
    this.handleChangeInviteRegister = this.handleChangeInviteRegister.bind(this);
  }
  componentDidMount(){
    localStorage.setItem("see", '0')
    console.warn(`Version 0.0.1\nCreated by kaue`)
     if(window.localStorage.getItem('openMessages')){
       if(Array.isArray(JSON.parse(window.localStorage.getItem('openMessages')).isArray)){
         window.localStorage.setItem('openMessages', '[]')
       }
     } else{
       window.localStorage.setItem('openMessages', '[]')
     }
     window.localStorage.setItem('openMessages', '[]')
    setInterval(() => {
      const url = window.location.pathname
      this.setState({path: url})
      if(url == '/register'){
        this.setState({register: true})
      } else if(url.includes('invite/', '')){
        var invite = url.replace('/invite', '')
        invite = invite.replace('/', '')
        this.setState({register: true})
        this.setState({invite: invite})
      } else{
        this.setState({register: false})
      }
    }, 200);
    const react = this
    document.title = "Home / Social Network"
    socket.on('logLogin', function(data){
      if(data.status == 'ok' && data.token){
        window.localStorage.setItem('token', data.token)
        socket.emit('verificarToken', window.localStorage.getItem('token'))
      } else{
        react.errorRender(data.status)
      }
    });
    socket.on('myUser', function(user){
      if(user.username){
        socket.emit('online', {'token': window.localStorage.getItem('token')})
        react.subscribePrivateChat(user.username)
        window.localStorage.setItem('myUser', JSON.stringify(user))
        // window.history.pushState('Loading', 'Loading', `/profile/${user.username}`);
        console.info(`Logged with ${user.username}`)
        console.info("Agradecimentos especiais\nKaue,Zedd,Ratinho,Johny")
        socket.emit('connectFrom', {token: window.localStorage.getItem('token'), user: user.username})
        logged = true
      }
    })
    this.estoulogado()
  }
  subscribePrivateChat(username){
    const encryptUsernameNotifica = CryptoJS.AES.encrypt(`notification_${username}`, 'monarquia').toString();
    const encryptUsernamePrivate = CryptoJS.AES.encrypt(`private_${username}`, 'monarquia').toString();
    socket.emit('onlineBoo', {'room': `${encryptUsernamePrivate}`})
    socket.emit('onlineBoo', {'room': `${encryptUsernameNotifica}`})
  }
  estoulogado(){
    if(window.localStorage.getItem('token')){
      socket.emit('verificarToken', window.localStorage.getItem('token'))
    }
  }
  handleChangeUser(event) {
    this.setState({username: event.target.value});
  }
  handleChangeInviteRegister
  handleChangePassword(event) {
    this.setState({password: event.target.value});
  }
  handleChangeInviteRegister(event) {
    this.setState({inviteRegister: event.target.value});
  }
  handleChangeUserRegister(event) {
    var username = event.target.value.replace(" ", "")
    this.setState({usernameRegister: username});
  }
  handleChangePasswordRegister(event) {
    this.setState({passwordRegister: event.target.value});
  }
  handleSubmit (event){
    if(this.state.username.trim().length > 0 && this.state.password.trim().length > 0){
      socket.emit('login',{
        'username': this.state.username,
        'password': this.state.password
      })
    } else{
      this.errorRender('Preencha os campos')
    }
    event.preventDefault()
  }
  handleSubmitRegister (event){
    if(this.state.usernameRegister.trim().length > 0 && this.state.passwordRegister.trim().length > 0){
      socket.emit('register',{
        'username': this.state.usernameRegister,
        'password': this.state.passwordRegister,
        'invite': this.state.invite
      })
    } else{
      this.errorRender('Preencha os campos')
    }
    event.preventDefault()
  }
  errorRender(error){
    this.setState({error: error})
      setTimeout(() => {
        this.setState({error: null})
      }, 4000);
  }
  render(){
  return (
    <div className="Home">
      {/* <img className="backgroundHome backgroundTop" src="./background/6.gif"/>
      <img className="backgroundHome backgroundLeft" src="./background/2.jpg"/> */}
      {/* <img className="backgroundHome" src="./background/1.gif "/> */}
      <div className="transparenteBack"></div>
      { !this.state.register && <div id="container">
      <div id="inviteContainer">
        {/* <div class="logoContainer"><img class="logo" src="./logo.png"/>
        </div> */}
        <div class="acceptContainer">
        <div className={`error ${(this.state.error != null ? '' : 'slideOut')}`}>
        <span>{ this.state.error }</span>
        </div>
        <form onSubmit={this.handleSubmit}>
            <h1>
              { translate.idiomas[0].welcome_form_login }
              BEM VINDO NOVAMENTE!
            </h1>
            <div class="formContainer">
              <div class="formDiv">
                <p>USUÁRIO</p>
                <input value={this.state.username} onChange={this.handleChangeUser} type="text" id="username" autocomplete="off" type="username" required=""/>
              </div>
              <div class="formDiv">
                <p>SENHA</p>
                <input value={this.state.password} onChange={this.handleChangePassword} type="password" id="password" type="password" required=""/>
              </div>
              <div class="formDiv">
                <button class="acceptBtn" type="submit">Logar</button><span class="register">Precisa de uma conta?
                <Link to='/register'><a>Registrar</a></Link></span>
              </div>
              <a class="forgotPas" href="#">ESQUECEU A SENHA?</a>
            </div>
          </form>
        </div>
      </div>
    </div> }
    { this.state.register && <div id="container">
      <div id="inviteContainer">
        {/* <div class="logoContainer"><img class="logo" src="./logo.png"/>
        </div> */}
        <div class="acceptContainer">
        <div className={`error ${(this.state.error != null ? '' : 'slideOut')}`}>
        <span>{ this.state.error }</span>
        </div>

        <form onSubmit={this.handleSubmitRegister}>
            <h1>Registrar</h1>
            <div class="formContainer">
              <div class="formDiv">
                <p>USUÁRIO</p>
                <input value={this.state.usernameRegister} onChange={this.handleChangeUserRegister} type="text" id="username" autocomplete="off" type="username" required=""/>
              </div>
              <div class="formDiv">
                <p>SENHA</p>
                <input value={this.state.passwordRegister} onChange={this.handleChangePasswordRegister} type="password" id="password" type="password" required=""/>
              </div>
              <div class="formDiv">
                <p>CONVITE</p>
                <input value={this.state.invite} type="text" id="username" type="username" required=""/>
              </div>
              <div class="formDiv">
                <button class="acceptBtn" type="submit">Registrar</button><span class="register">Já tem uma conta?
                <Link to='/'><a>Login</a></Link></span>
              </div>
              <a class="forgotPas" href="#">ESQUECEU A SENHA?</a>
            </div>
          </form>
        </div>
      </div>
    </div> }
    </div>
  );
}
}

export default Home;