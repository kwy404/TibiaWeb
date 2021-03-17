import React from 'react';
import smallTooltip from 'small-tooltip';
import 'small-tooltip/smallTooltip.css';
import socket from './../../socket';
import Carousel from 'react-elastic-carousel';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

//Carrega imagem de erro
const imageError = require('../../imageErrorLoad')

class Friends extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: true,
      myUser: null,
      meusAmigos: [],
      allPeoples: [],
      ondeEstou: 1,
      aceitos: [],
      pendentes: [],
      blocked: [],
      amigoAdd: '',
      adicionou: false,
      amigoAdded: "",
      loaded: false,
      fakeFriends: [1,2,3,4]
    }
    this.handleChangeInput = this.handleChangeInput.bind(this);
    this.adicionarAmigo = this.adicionarAmigo.bind(this)
  }
  componentWillMount(){
    const react = this
    socket.emit('sugestao', true)
    socket.on('sugestaoAmizade', function(data){
      const array = data
      const found = array.find(e => e.id == react.state.myUser.id)
      if(found){
        const id = array.indexOf(found)
        array.splice(id, 1)
      }
      react.setState({allPeoples: array})
  })
  }
  handleChangeInput(event) {
    this.setState({amigoAdd: event.target.value});
  }
  componentDidMount(){
    localStorage.setItem("see", '0')
    const react = this
    this.setState({myUser: JSON.parse(window.localStorage.getItem('myUser'))})
    socket.emit('friends', window.localStorage.getItem('token'))
    socket.on('myFriends', function(data){
      react.setState({loaded: true})
      const amigosAceitos = data.filter(function (e) {
        return e.aceito == 1;
      });
      const pendentes = data.filter(function (e) {
        return e.aceito == 0;
      });
      const blocked = data.filter(function (e) {
        return e.blocked == 1;
      });
      react.setState({aceitos: amigosAceitos})
      react.setState({pendentes: pendentes})
      react.setState({blocked: blocked})
      react.setState({meusAmigos: data})
    })
    socket.on('notification', function(data){
      if(data.acao == 'atualizarAmigos'){
        setTimeout(() => {
          socket.emit('friends', window.localStorage.getItem('token'))
        }, 600);
      }
    })
  }
  adicionarAmigo(event){
    if(this.state.amigoAdd.trim().length > 0){
      socket.emit('enviarPedidoDeAmizade', {
        'de': JSON.parse(window.localStorage.getItem('myUser')).username,
        'para': this.state.amigoAdd,
        'token': window.localStorage.getItem('token')
      })
      socket.emit('friends', window.localStorage.getItem('token'))
      this.setState({adicionou: true})
      this.setState({amigoAdded: this.state.amigoAdd})
      setTimeout(() => {
        this.setState({adicionou: false})
        this.setState({amigoAdd: ''})
      }, 4000);
    }
    event.preventDefault()
  }
  removerAmizadeSolitacao(user){
    socket.emit('removerAmizade', {
      'de': JSON.parse(window.localStorage.getItem('myUser')).username,
      'para': user.username,
      'token': window.localStorage.getItem('token')
    })
  }
  sendMessage(user){
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
  render(){
  return (
    <div className="Friends">
      <div className="headerBirl">
          <h1>Meus amigos</h1>
      </div>
      <div className="friends">
        <div className="buttonsList">
          {/* <button onClick={() => this.setState({ondeEstou: 0})}
          className={`button ${(this.state.ondeEstou == 0 ? 'ativo': '')}`}>
            Disponível
          </button> */}
          <button onClick={() => this.setState({ondeEstou: 1})}
          className={`button ${(this.state.ondeEstou == 1 ? 'ativo': '')}`}>
            Todos
          </button>
          <button onClick={() => this.setState({ondeEstou: 2})}
          className={`button ${(this.state.ondeEstou == 2 ? 'ativo': '')}`}>
            Pendente
          </button>
          <button onClick={() => this.setState({ondeEstou: 3})}
          className={`button ${(this.state.ondeEstou == 3 ? 'ativo': '')}`}>
            Bloqueado
          </button>
          <button onClick={() => this.setState({ondeEstou: 4})} 
          className={`button addFriend ${(this.state.ondeEstou == 4 ? 'ativoFriend': '')}`}>
            Adicionar amigo
          </button>
        </div>
        { !this.state.loaded &&
        <div className="amigos fakeListaAmigo">
          { this.state.ondeEstou != 4 && this.state.fakeFriends.map((item,i) =>
            <div key={i}>
              <li>
                <div className="avatar">
                <img src={'../defaultAvatar.png'}/>
                </div>
                <span className="fakeName"></span>
              </li>
          </div>
          ) }
        </div>
          
        }
        { this.state.ondeEstou == 1 && <div className="amigos todos">
        { this.state.loaded && this.state.aceitos.length == 0 && <h1>Que pena, você não tem nenhum amigo</h1>}
            {
              this.state.aceitos.map((item, i) =>
                <div
                key={i}
                >
                    { item.username != JSON.parse(window.localStorage.getItem('myUser')).username
                    &&
                    <div>
                    <div>
                    <li>
                    <Link to={`/profile/${item.username}`}>
                    <div className="left">
                      <div className="avatar">
                      <img 
                      onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                      src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
                      </div>
                      <span>{ item.username }</span>
                    </div>
                    </Link>
                    </li>
                  </div>
                    <div className="right">
                      <div className="button" onClick={() => this.sendMessage(item)}>
                        <i class="fas fa-comment-alt"></i>
                      </div>
                      <div className="button" onClick={() => this.removerAmizadeSolitacao(item)}>
                        <i class="fas fa-user-times"></i>
                      </div>
                    </div>
                    </div> }
                </div>
              )}
          </div>  }
          { this.state.ondeEstou == 2 && <div className="amigos pendentes">
          { this.state.loaded && this.state.pendentes.length == 0 && <h1>Nenhum solitação de amizade pendente :D</h1>}
            {
              this.state.pendentes.map((item, i) =>
                <div
                key={i}
                >
                    { item.username != JSON.parse(window.localStorage.getItem('myUser')).username &&
                    <Link to={`/profile/${item.username}`}>
                    <li>
                      <div className="avatar">
                      <img 
                      onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                      src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
                      </div>
                      <span>{ item.username }</span>
                    </li></Link> }
                </div>
              )}
          </div> }
          { this.state.ondeEstou == 3 && <div className="amigos blocked">
            { this.state.loaded && this.state.blocked.length == 0 && <h1>Nenhum amigo bloqueado, você é um cara legal! :D</h1>}
            {
              this.state.blocked.map((item, i) =>
                <div
                key={i}
                >
                    { item.username == JSON.parse(window.localStorage.getItem('myUser')).username &&
                    <Link to={`/profile/${item.username}`}>
                    <li>
                      <div className="avatar">
                      <img 
                      onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
                      src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}/>
                      </div>
                      <span>{ item.username }</span>
                    </li></Link> }
                </div>
              )}
          </div> }
          { this.state.ondeEstou == 4 &&
          <div className="amigos">
            { this.state.adicionou && <div className="enviadoPedido">
            <h1>Você enviou um pedido de amizade para {this.state.amigoAdded}!</h1>
            </div> }
            <h1>Adicionar amigo</h1>
            <p>Você pode adicionar amigos usando somente o nome de usuário dele!</p>
            <form onSubmit={this.adicionarAmigo}>
              <input value={this.state.amigoAdd} onChange={this.handleChangeInput} type="text" placeholder="Insira um nome de usuário"/>
              <button>Enviar pedido de amizade</button>
            </form>
          </div>
          }
          {/* { this.state.meusAmigos.length == 0 && <h1>Você não tem nenhum amigo, vamos adicionar? 😃</h1> }
          { this.state.meusAmigos.length > 1 && this.state.meusAmigos.length <= 5 && <h1>Você não tem muitos amigos, vamos adicionar? 😃</h1> }
          { this.state.meusAmigos.length > 5 && this.state.meusAmigos.length <= 100 && <h1>Você tem alguns amigos, que tal adicionar mais alguns? 😃</h1> } */}
          { this.state.meusAmigos.length <= 100 && 
          <div className="suggestion">
          <h1>Amigos sugeridos!</h1>
          <br></br>
          { this.state.allPeoples.length > 0 && 
          <Carousel itemsToShow={3} enableMouseSwipe={true}>
           {this.state.allPeoples.map((item, i) =>
           <Link to={`/profile/${item.username}`}><div key={i}>
           <Avatar key={item.id}
           username={item.username} 
           src={(item.avatar == '' ? '../defaultAvatar.png' : item.avatar)}
           level={item.level}/>
           </div></Link> 
           )}
          </Carousel>
          }
          </div>
          }
      </div>
    </div>
  );
}
}

class Avatar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          
        }
      }
      render(){
      return (
        <div data-tip={this.props.username} className="avatar">
            {/* <span data-tip="Level" className="level">{ this.props.level }</span> */}
            <img 
            onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
            src={this.props.src}/>
        </div>
      );
    }
}

export default Friends;