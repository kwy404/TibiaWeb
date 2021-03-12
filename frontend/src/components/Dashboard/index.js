import React from 'react';
import HomeCss from './../../css/Home.css';
import $ from 'jquery';
import { ToastContainer, toast } from 'react-toastify';
import { SketchPicker } from 'react-color';
import Draggable from 'react-draggable';
import openSocket from 'socket.io-client'
import Header from '../Header';
import CryptoJS  from 'crypto-js'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import Messages from './../Messages';

import Explore from './../Explore';
import HomeMain from './../HomeMain';
import Profile from './../Profile';
import Servers from './../Servers';
import AbertoConfig from './../Servers'
import Friends from './../Friends';
import socket from '../../socket';
export let estouOnde = {}
export let customizeAtivo = false
export let serverEstou = null
export let PerfilSelecionado = null

const config = require('../../config')
const imageError = require('../../imageErrorLoad')

class Stories extends React.Component{
    constructor(props) {
      super(props);
      this.state = {
        file: null,
        textarea: '',
        stories: [],
        modalAberto: false,
        destaqueAberto: null,
        time: null,
        carregandoProximoStorie: 0,
        storieAtual: -1,
        fechouStories: true
      }
      this.onChangePhoto = this.onChangePhoto.bind(this)    
      this.changeText = this.changeText.bind(this);
    }
    componentDidMount(){
      const url = window.location.pathname
      if(!url.includes('friends') || !url.includes('profile')){
        socket.emit('loadStories', window.localStorage.getItem('token'))
      }
      const react = this
      socket.on('notification', function(data){
        if(data.acao == 'stories'){
          const found = react.state.stories.find(e => e.user.username == data.user.username)
          if(!found){
          const joined = react.state.stories.concat(data);
          react.setState({ stories: joined })
          setTimeout(() => {
            $(".stories").scrollLeft = $(".stories").scrollWidth
          }, 500);
          } else{
            const id = react.state.stories.indexOf(found)
            const foundStorie = react.state.stories[id].stories.find(e => e.id == data.storie.id)
            if(!foundStorie){
              const foundStorie2 = react.state.stories.find(e => e.storie.id == data.storie.id)
              if(!foundStorie2){
                  let storiesData = react.state.stories
                  storiesData[id].stories.push(data.storie)
                  react.setState({stories: storiesData})
              }
            }
            
          } 
        } else if(data.acao == 'errorStorie'){
          toast.error(data.message);
        }
      })
      socket.on('loadingStories', function(stories){
          const found = react.state.stories.find(e => e.storie.user == stories.storie.user)
          if(!found){
          const joined = react.state.stories.concat(stories);
          react.setState({ stories: joined })
          setTimeout(() => {
            $(".stories").scrollLeft = $(".stories").scrollWidth
          }, 500);
        } else{    
          const id = react.state.stories.indexOf(found)
          const foundStorie = react.state.stories[id].stories.find(e => e.id == stories.storie.id)
          if(!foundStorie){
          const foundStorie2 = react.state.stories.find(e => e.storie.id == stories.storie.id)
          if(!foundStorie2){
            let storiesData = react.state.stories
            storiesData[id].stories.push(stories.storie)
            react.setState({stories: storiesData})
          }
          }
        }
      })
    }
    getBase64Image(file) {
      const react = this
      try {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          react.setState({file: reader.result})
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      } catch (error) {
        
      }
    }
    onChangePhoto(e){
      this.setState({file:e.target.files[0]})
      this.getBase64Image(e.target.files[0])
    } 
    changeText(event){
      this.setState({textarea: event.target.value})
    }
    sendStorie(){
      const token = window.localStorage.getItem('token')
      const data = {
        'base64': this.state.file,
        'texto': this.state.textarea,
        'token': token
      }
      const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secretKey0001001244123NarutoBen10').toString();
      socket.emit('novoStorie', ciphertext)
      this.setState({modalAberto: false})
      this.setState({file: null})
      this.setState({textarea: ''})
    }
    closeDestaque(){
      clearInterval(this.state.time)
      this.setState({time: null})
      this.setState({storieAtual: -1})
      this.setState({carregandoProximoStorie: 0})
      this.setState({fechouStories: true})
    }
    destaqueFixar(item){
      this.setState({fechouStories: false})
      this.setState({destaqueAberto: item})
      this.setState({time: setInterval(() => {
        if(this.state.carregandoProximoStorie <= 90){
          this.setState({carregandoProximoStorie: this.state.carregandoProximoStorie + 10})
        } else{
          if(this.state.storieAtual < this.state.destaqueAberto.stories.length - 1){
            this.setState({storieAtual: this.state.storieAtual + 1})
            this.setState({carregandoProximoStorie: 0})
          } else{
            clearInterval(this.state.time)
            this.setState({time: null})
            this.setState({storieAtual: -1})
            this.setState({carregandoProximoStorie: 0})
            this.setState({fechouStories: true})
          }
        }
      }, 500)})
    }
    pularStorie(){
      if(this.state.storieAtual < this.state.destaqueAberto.stories.length - 1){
        this.setState({storieAtual: this.state.storieAtual + 1})
        this.setState({carregandoProximoStorie: 0})
      }
      else{
        clearInterval(this.state.time)
        this.setState({time: null})
        this.setState({storieAtual: -1})
        this.setState({carregandoProximoStorie: 0})
        this.setState({fechouStories: true})
      }
    }
    render(){
    return (
      <div className="stories">
        { !this.state.fechouStories && this.state.destaqueAberto != null &&
        <div className="vendoStorie">
          <div className="blur">
          { this.state.storieAtual == -1 && 
            <img src={this.state.destaqueAberto.storie.photo}/> }
            { this.state.storieAtual > -1 && 
            <img src={this.state.destaqueAberto.stories[this.state.storieAtual].photo}/> }
          </div>
          <div className="avatar">
            <img src={(this.state.destaqueAberto.user.avatar == '' ? '../defaultAvatar.png' : this.state.destaqueAberto.user.avatar)}/>
          </div>
          <h3>{ this.state.destaqueAberto.user.username }</h3>
          <div className="right">
            <button onClick={() => this.closeDestaque()}><i class="fas fa-times"></i></button>
          </div>
          { 
          this.state.destaqueAberto.stories.length == 0 &&
          <div className="progress" style={{width: '40%', left: '50%'}}>
          { this.state.storieAtual == -1 && <div className="subprogress" style={{width: this.state.carregandoProximoStorie + '%'}}/> }
          </div> }
          { this.state.destaqueAberto.stories.length > 0 && 
          <div className="progress" style={{width: 'calc('+ 20 / this.state.destaqueAberto.stories.length + '% - 10px)'}}>
          { this.state.storieAtual == -1 && <div className="subprogress" style={{width: this.state.carregandoProximoStorie + '%'}}/> }
          </div> }
          { this.state.destaqueAberto.stories.map((item, i) =>  
            <div key={i} className="progress" style={{width: 'calc('+ 20 / this.state.destaqueAberto.stories.length + '% - 10px)'}}>
              { this.state.storieAtual == i && <div className="subprogress" style={{width: this.state.carregandoProximoStorie + '%'}}/> }
            </div> 
          )}
          <div className="wrapper" onClick={() => this.pularStorie()}>
            { this.state.storieAtual == -1 && 
            <div className="bottom">
              <h3>{ this.state.destaqueAberto.storie.texto }</h3>
            </div> &&
            <img src={this.state.destaqueAberto.storie.photo}/> }
            { this.state.storieAtual > -1 && 
            <div className="bottom">
            <h3>{ this.state.destaqueAberto.stories[this.state.storieAtual].texto }</h3>
            </div> &&
            <img src={this.state.destaqueAberto.stories[this.state.storieAtual].photo}/> }
          </div>
        </div> }
        <h3>Stories</h3>
        <div className={`modal ${(this.state.modalAberto ? 'abertoModal' : '')}`}>
          <div className={`moreItemModal storiesModal ${(this.state.modalAberto ? 'abertoMoreItemModal' : '')}`}>
            <h1>Publicar Storie</h1>
            <p>Para publicar um Storie, você precisa pelo menos postar um texto!</p>
            <br></br>
            <br></br>
            <label className="button" for="imgMessage">
            { this.state.file != null &&
            <span>Foto selecionada </span> }
            { this.state.file == null && 
            <span>
              Selecione uma imagem <i class="far fa-image"></i>
            </span>
            }
            </label>
            <br></br>
            <br></br>
            <textarea 
            value={this.state.textarea}
            onChange={this.changeText}
            placeholder="No que você está pensando?">
            </textarea>
            <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onChangePhoto} name="imgMessage" id="imgMessage" />
            <div onClick={() => this.setState({modalAberto: !this.state.modalAberto})} className="button">
              Fechar
            </div>
            { 
            this.state.textarea.trim().length > 0 && this.state.file != null &&
            <div onClick={() => this.sendStorie()} className="button">
              Publicar
            </div> }
          </div>
        </div>
  
          <div onClick={() => this.setState({modalAberto: !this.state.modalAberto})} className="item-stories addPlus">
              <div className="storie-img addPlus">
              <div className="avatar">
                  <img
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={(JSON.parse(window.localStorage.getItem('myUser')).avatar == '' ? '../defaultAvatar.png' : JSON.parse(window.localStorage.getItem('myUser')).avatar)}/>
              </div>
              <div className="bottom">
                <i class="fas fa-plus-circle"></i>
                <h3>Criar uma história</h3>
              </div>
              </div>
            </div>
            { this.state.stories.map((item, i) => 
              <div key={i} onClick={() => this.destaqueFixar(item)} className="item-stories" data-lenght={item.stories.length}>
                <div className="avatar">
                  <img
                  onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                  src={(item.user.avatar == '' ? '../defaultAvatar.png' : item.user.avatar)}/>
                </div>
                <div className="storie-img">
                  <img onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}} src={item.storie.photo}/>
                </div>
              </div>
            )}
      </div>
    )
    }
  }

class Post extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        
      }
    }
    render(){
    return (
      <div className="post">
        <div className="header">
            <div className="avatar">
                
            </div>
        </div>
      </div>
    );
  }
  }
  

class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      componentRender: HomeMain,
      fontSizeMax: [1,2,3,4,5],
      fontSizeIndex: 3,
      abertoTheme: false,
      colorCustomizadaFundo:  window.localStorage.getItem('customBody') ? window.localStorage.getItem('customBody') : "#000",
      colorCustomizadaButton: window.localStorage.getItem('customColor') ? window.localStorage.getItem('customColor') : "#794bc4",
      colors: [
          'blue', 'yellow', 'red', 'purple', 'orange', 'green', 'custom'
      ],
      body: [
          'default', 'dim', 'lights'
      ],
      novoAmigo: null,
      tuturial: true
    }
  }
  componentDidMount(){
      this.receiveFriends()
      this.changeComponent()
      const fontSize = window.localStorage.getItem('fontSize')
      if(fontSize){
          this.setState({fontSizeIndex: fontSize})
      }
      PerfilSelecionado = window.localStorage.getItem('myUser')
  }
  whenDownConnect(){
    const react = this
    socket.on('error', function() {
        toast.error(`Sua conexão caiu, ou alguma coisa de errado não está certo, tentando uma nova conexão em 3 segundos.`)
        try {
            socket = openSocket(config.configSite.urlApi);
        }
        catch(e) {
            toast.error(`Sua conexão caiu, ou alguma coisa de errado não está certo, tentando uma nova conexão em 3 segundos.`)
        }
    });
  }
  receiveFriends(){
      const react = this
      socket.on('receiveNewFriendSolicitacao', function(data){
        react.setState({novoAmigo: data})
        setTimeout(() => {
            react.setState({novoAmigo: null})
        }, 4200);
      })
  }
  changeComponent(){
    setInterval(() => {
        const url = window.location.pathname
        if(url == "/" || url == "/home"){
            this.setState({componentRender: HomeMain})
        } else if(url == "/explore"){
            this.setState({componentRender: Explore})
        } else if(url == "/profile"){
            this.setState({componentRender: Profile})
        } else if(url.includes('/profile/')){
            this.setState({componentRender: Profile})
        } else if(url.includes('/servers')){
            this.setState({componentRender: Servers})
        } else if(url.includes('/friends')){
            this.setState({componentRender: Friends})
        } else if(url.includes('/index.html')){
            this.setState({componentRender: HomeMain})
        } 
        this.setState({abertoTheme: customizeAtivo})
    }, 200);
  }
  fontSizeChange(i){
      this.setState({fontSizeIndex: i})
      window.localStorage.setItem('fontSize', i)
  }
  changeColor(color){
    window.localStorage.setItem("color", color)
  }
  changeBody(body){
    window.localStorage.setItem("body", body)
    window.localStorage.setItem('customBody', "#000")
  }
  closeModalPhotoSelect(){
      $(".modalPhotoSelect").removeClass("abertoModalTwo")
  }
  changeStateForce(user){
    setTimeout(() => {
      socket.emit('profileInfo', {"de": user, "para": JSON.parse(window.localStorage.getItem('myUser')).username})
      }, 500);
  }
  saveColor = (color, event) => {
    this.setState({ colorCustomizadaButton: color.rgb })
    window.localStorage.setItem('customColor', `${color.rgb['r']},${color.rgb['g']},${color.rgb['b']}`)
  }
  saveColorFundo = (color, event) => {
    this.setState({ colorCustomizadaFundo: color.hex })
    window.localStorage.setItem('customBody', color.hex)
  }
  finishTuturial(){
    this.setState({tuturial: false})
  }
  render(){
  return (
    <div className="Dashboard" >
      <Header></Header>
      <Left_Bar/>
      <div className={`modal modalPhotoSelect`}>
          <div onClick={() => this.closeModalPhotoSelect()} class="transparent">
            <img src="https://limonada.oficinareserva.com/wp-content/uploads/2016/05/placeholder.png"/>
          </div>
        <img src="https://limonada.oficinareserva.com/wp-content/uploads/2016/05/placeholder.png"/>
      </div>
      <div className="center" style={{ width: `${(serverEstou !== null ? 'calc(100% - 323px)' : '')}`, overflow: `${(serverEstou !== null ? 'hidden' : '')}` }}>
        <div class={`fixedTop ${(this.state.novoAmigo != null ? 'fixedTopNew' : '')}`}>
            { this.state.novoAmigo != null && 
            <Link to={`/profile/${this.state.novoAmigo.username}`}>
            <div onClick={() => this.changeStateForce(this.state.novoAmigo.username)}>
            <li>
            <div className="avatar">
                <img src={(this.state.novoAmigo.avatar == '' ? '../defaultAvatar.png' : this.state.novoAmigo.avatar)}/>
            </div>
            <span className="destaque">{this.state.novoAmigo.username}</span> <span>Lhe enviou um pedido de amizade</span>
            </li></div> </Link> }
        </div>  
        { <this.state.componentRender server={serverEstou} profile={PerfilSelecionado}/> }
      </div>
        <div className={`modal ${(this.state.abertoTheme ? 'abertoModal': 'close')}`}>
            <div className={`moreItemModal ${(this.state.abertoTheme ? 'abertoMoreItemModal': 'close')}`} >
                <h1>Customizar sua tela</h1>
                {/* <p>
                Display settings affect all of your Twitter accounts on this browser. These settings are only visible to you.
                </p>
                <div className="config">
                    <span>
                        Font size
                    </span>
                    <div className="line">
                        {this.state.fontSizeMax.map((item, i) => 
                        <div className="bol" key={item} onClick={() => this.fontSizeChange(item)}>

                        </div> ) }
                        <div className="stretch" style={{width: this.state.fontSizeIndex * 13 + '%'}}></div>
                    </div>
                </div> */}
                <br></br>
                <div className="config">
                    <span>
                        Cores
                    </span>
                    <br/><br/>
                    {this.state.colors.map((item, i) => 
                        <div 
                        key={i}
                        onClick={() => this.changeColor(item)} class={`colors ${item} ${(window.localStorage.getItem('color') == item ? 'select' : 'dontSelect')}`}>
                            {
                                window.localStorage.getItem('color') == item &&
                                 <div key={item} className='select'>
                                     <i className="fas fa-check"></i>
                                 </div>
                            }
                        </div>
                    ) }
                </div>
                <div className="config bodyList">
                    <span>
                        Background
                    </span>
                    <br/><br/><br/><br/>
                    {this.state.body.map((item, i) => 
                        <div 
                        key={i}
                        onClick={() => this.changeBody(item)} class={`body ${item} ${(window.localStorage.getItem('body') == item ? 'select' : 'dontSelect')}`}>
                            {
                                window.localStorage.getItem('body') == item &&
                                 <div key={item} className='select'>
                                     <i className="fas fa-check"></i>
                                 </div>
                            }

                        </div>
                    ) }
                </div>
                <div className="config">
                { window.localStorage.getItem("color") == 'custom' &&
                <div className="colorCustom">
                     <SketchPicker 
                    color={ this.state.colorCustomizadaButton }
                    onChange={ this.saveColor }
                    />
                </div>
                }
                { window.localStorage.getItem("body") == 'custom' &&
                <div className="bodyCustom">
                    <SketchPicker 
                    color={ this.state.colorCustomizadaFundo }
                    onChange={ this.saveColorFundo }
                    />
                </div>
                }
                </div>
                <div onClick={() => customizeAtivo = false} className="button">
                    <span>Feito</span>
                </div>
            </div>
        </div>
       {/* { window.location.pathname == '/' &&
       <Stories/>
       }
       { window.location.pathname == '/home' &&
       <Stories/>
       } */}
       { !window.location.pathname.includes("/servers") && <Messages/> }
    </div>
  );
}
}

class Button extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          
        }
      }
      render(){
      return (
        <div className={`button ${(this.props.ativo ? 'buttonAtivo' : 'buttonNotAtivo')}`}>
        {
            this.props.news > 0 &&
        <div className={`newsCount`}>
            { 
            this.props.news < 99 && <span> {this.props.news} </span> ||
            this.props.news > 99 && <span> +99 </span>
            }
        </div>
        }
        { this.props.profile && 
        <div className="avatar leftBarAvatar">
            <img 
            onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
            src={(JSON.parse(window.localStorage.getItem('myUser')).avatar == '' ? '../defaultAvatar.png' : JSON.parse(window.localStorage.getItem('myUser')).avatar)}/>
        <span>
            <i className={`icon ${this.props.icon} hiddenIcon`}></i>
            <span className="title leftBarTitle">{ this.props.title }</span>
        </span>
        </div>
        }
        { !this.props.profile && 
             <span>
             <i className={`icon ${this.props.icon}`}></i>
             <span className="title">{ this.props.title }</span>
            </span>
        }
        </div>
      );
    }
}

class Left_Bar extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        logo: 'fab fa-freebsd',
        moreItem: false,
        nameServer: "",
        links: [
            {
                'title': 'Ínicio',
                'link': '/home',
                'icon': 'fas fa-home',
                'news': 0,
                'accesible': true,
                'profile': false
            },
            {
                'title': JSON.parse(window.localStorage.getItem('myUser')).username,
                'link': `/profile/${JSON.parse(window.localStorage.getItem('myUser')).username}`,
                'icon': 'fas fa-user',
                'news': 0,
                'accesible': true,
                'profile': true
            },
            {
                'title': 'Servidores',
                'link': '/servers',
                'icon': 'fas fa-server',
                'news': 0,
                'accesible': true,
                'profile': false
            },
            {
                'title': 'Explorar',
                'link': '/explore',
                'icon': 'fab fa-wpexplorer',
                'news': 0,
                'accesible': true,
                'profile': false
            },
            {
                'title': 'Amigos',
                'link': '/friends',
                'icon': 'fas fa-address-book',
                'news': 0,
                'accesible': true,
                'profile': false
            }
        ],
        linkAtual: {},
        ServerList: [],
        serverAtual: {},
        abriuServidor: false
      }
      this.criarServer = this.criarServer.bind(this);
      this.handleChangeServerName = this.handleChangeServerName.bind(this);
    }
    moreInfo(){
        this.setState({moreItem: !this.state.moreItem})
    }
    styleOpen(){
        customizeAtivo = !customizeAtivo
    }
    loadServers(){
        socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
    }
    componentDidMount(){
        const url = window.location.pathname
        const found = this.state.links.find(e => e.link == url)
        if(found){
            const id = this.state.links.indexOf(found)
            document.title = `${ (this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                + this.state.links[4].news > 0 ? this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                + this.state.links[4].news:  "" ) } ${this.state.links[id].title} / Social Network 
            
            `
            this.setState({linkAtual: this.state.links[id]})
            estouOnde = this.state.links[id]
        } else{
            if(url.includes("/servers/")){
                this.setState({linkAtual: this.state.links[2]})
                estouOnde = this.state.links[2]
            }
            else if(url == "/"){
                document.title = `${ (this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                    + this.state.links[4].news > 0 ? + this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                    + this.state.links[4].news:  "" ) } ${this.state.links[0].title} / Social Network
                `
            this.setState({linkAtual: this.state.links[0]})
            estouOnde = this.state.links[0]
            } else if(url == "/index.html"){
                document.title = `${ (this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                    + this.state.links[4].news> 0 ? + this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                    + this.state.links[4].news:  "" ) } ${this.state.links[0].title} / Social Network
                 
                `
            this.setState({linkAtual: this.state.links[0]})
            estouOnde = this.state.links[0]
            }
        }
        this.loadServers() 
        const react = this
        socket.on('serverList', (servers) => {
            react.setState({ServerList: servers})
            const url = window.location.pathname
            const serverFound = servers.find(e => e.id == url.split("/")[2])
            if(serverFound){
                const id = servers.indexOf(serverFound)
                react.setState({serverAtual: servers[id]})
                serverEstou = servers[id]
                document.title = `${servers[id].name} - Social Network`
            }
        })
        socket.on('messageServer', data => {
            const found = react.state.ServerList.find(e => e.idServer == data.idServer)
            if(found){
                const id = react.state.ServerList.indexOf(found)
                var serversBoo = [...react.state.ServerList]
                if(serversBoo[id].news == undefined){
                    serversBoo[id].news = 1
                } else{
                    serversBoo[id].news++
                }
                react.setState({ServerList: serversBoo})
            }
        })
        socket.on('entreiNoServidor', (data) => {
            react.setState({linkAtual: react.state.links[2]})
            react.setState({serverAtual: data.server})
            setTimeout(() => {
                react.loadServers()
            }, 400);
        })
        socket.on('atualizarServidores', data => {
          // socket.emit('atualizandoServidores', window.localStorage.getItem('token'))
        })
    }
    acessButton(object){
        if(object){
            if(object.icon == 'fas fa-user'){
                setTimeout(() => {
                    socket.emit('profileInfo', {"de": JSON.parse(window.localStorage.getItem('myUser')).username, "para": JSON.parse(window.localStorage.getItem('myUser')).username})
                }, 500);
            }
            serverEstou = null
            this.setState({serverAtual: {}})
            document.title = `${ (this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                + this.state.links[4].news> 0 ? this.state.links[0].news + this.state.links[1].news + this.state.links[2].news + this.state.links[3].news
                + this.state.links[4].news:  "" ) } ${object.title} / Social Network`
            this.setState({linkAtual: object})
            estouOnde = object
        }
    }
    blurMoreItem(){
        this.setState({moreInfo: false})
    }
    acessServer(object){
        this.setState({serverAtual: object})
        document.title = `${object.name}`
        this.acessButton(this.state.links[2])
        serverEstou = object
        // socket.emit('loadMessagesServidor', {
        //     'token': window.localStorage.getItem('token'),
        //     'idServer': object.id
        // })
        const stateObj = { foo: 'bar' };
        window.history.pushState("", "", `/servers/400004/0`)
        setTimeout(() => {
          window.history.pushState("", "", `/servers/${object.id}/0`)
          socket.emit('getChannel', {idServer: object.id, token: window.localStorage.getItem('token')})
        }, 500);
    }
    logout(){
        window.localStorage.setItem("token", 0)
        window.localStorage.setItem("myUser", {})
        window.location.pathname = "/"
    }
    criarServer(event){
        if(this.state.nameServer.trim().length > 0){
            socket.emit('criarServidor', {
                'name': this.state.nameServer,
                'token':  window.localStorage.getItem("token")
            })
            this.setState({nameServer: ''})
            this.setState({abriuServidor: false})
            this.loadServers() 
        }
        event.preventDefault()
    }
    handleChangeServerName(event){
        this.setState({nameServer: event.target.value});
    }
    abrirCriarServidor(){
        this.setState({abriuServidor: !this.state.abriuServidor})
        setTimeout(() => {
          $("#abrirCriarServidor").focus()
        }, 200);
    }
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }
    render(){
    return (
    <Draggable
    handle=".dragLeft"
    defaultPosition={{x: 0, y: 0}}
    onStart={this.handleStartDrag}
    grid={[25, 25]}
    position={{x: 0, y: 0}}
    >
      <div className={`left_bar`}>
    {/* <div className="draggableArea">
      <button 
      class="button dragLeft"
      data-tip="Clique aqui para mover a área de Links rápido"
      >
        <i class="fas fa-mouse"></i>
      </button>
    </div> */}
    <Link to='/home'><h1 className={`logo ${(this.state.linkAtual.link == this.state.links[0].link ? 'logoAtivo': '')}`} 
      onClick={() => this.acessButton(this.state.links[0])}> <i className={this.state.logo}></i>  </h1></Link>
    {this.state.linkAtual.link == '/servers' && <div onClick={() => this.acessButton(this.state.links[0])}>
    <Link to='/home'><Button title="Voltar" icon="fas fa-chevron-left" /></Link>
    </div> }
    { this.state.linkAtual.link == '/servers' && <Servers/> && 
        <div className="ServerList">
        <div className={`${(this.state.abriuServidor ? 'abertoInviteBro': '')}`} onClick={() => this.abrirCriarServidor()}>
        <Button
        title="Criar um server"
        icon="fas fa-plus"/>
        </div>
        { this.state.abriuServidor &&
        <form onSubmit={this.criarServer} className="createServerForm">
            <input
            className="createServerInput"
            id="abrirCriarServidor"
            type="text" 
            placeholder="Nome do servidor"
            onChange={this.handleChangeServerName}
            />
        </form>
        }
        <p className="serverSPAN">Servers</p>
        { estouOnde.link.includes('/servers') &&
        this.state.ServerList.map((item, i) =>
            <div 
            key={i}
            onClick={() => this.acessServer(item)}>
                <Link to={`/servers/${item.id}`}>
                <Server 
                title={item.name}
                img={item.photo}    
                ativo={
                    serverEstou != null &&
                    serverEstou.id == item.id}
                news={0}
                key={i}/></Link>
            </div>
            ) }
        </div>
        }
        { this.state.linkAtual.link != '/servers' && this.state.links.map((item, i) => item.title != "Explorar" &&
        <Link to={item.link}>
        <div key={i} onClick={() => this.acessButton(item)}>
          
            <Button 
            title={item.title}
            icon={item.icon}
            ativo={this.state.linkAtual.link == item.link}
            news={item.news}
            key={i}
            profile={item.profile}/>
        </div> </Link>
        ) }
        <div onClick={() => this.moreInfo()}>
            <Button 
            title={"Mais"}
            icon={"fas fa-ellipsis-h"}/>
        </div>
        {
        this.state.moreItem && 
        <div className="moreItem"
        onFocus={() => this.blurMoreItem()}>
            <li onClick={() => this.styleOpen()}>
                <span className="icon">
                    <i className="fas fa-palette"></i>
                </span>
                <span className="title">Tela</span>
            </li>
            {/* <li onClick={() => this.openConfig()}>
                <span className="icon">
                    <i className="fas fa-cog"></i>
                </span>
                <span className="title">Configurações</span>
            </li> */}
            <li onClick={() => this.logout()}>
                <span className="icon">
                    <i className="fas fa-fas fa-sign-out-alt"></i>
                </span>
                <span className="title">Sair</span>
            </li>
        </div>
        }
      </div>
      </Draggable>
    );
  }
  }

  class Server extends React.Component{
      constructor(props) {
          super(props);
          this.state = {
            
          }
        }
        componentDidMount(){
            
        }
        render(){
        return (
          <div className={`server button ${(this.props.ativo ? 'buttonAtivo' : 'buttonNotAtivo')}`}>
          {
              this.props.news > 0 &&
          <div className={`newsCount`}>
              { 
              this.props.news < 99 && <span> {this.props.news} </span> ||
              this.props.news > 99 && <span> +99 </span>
              }
          </div>
          }
            { this.props.img.trim().length > 0 && 
            <img 
            onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
            src={this.props.img}/> }
            { 
            this.props.img.trim().length == 0 &&
            <h1 className="logoServer">
                <i className="fas fa-server serverIconList"></i>
            </h1>
            }
            <span className="title">{ this.props.title }</span>
          </div>
        );
      }
  }

export default Dashboard;