import React from 'react';
import smallTooltip from 'small-tooltip';
import 'small-tooltip/smallTooltip.css';
import socket from './../../socket';
import ImageUploader from 'react-images-upload';
import { ToastContainer, toast } from 'react-toastify';
import CryptoJS  from 'crypto-js'
import $ from 'jquery';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
const config = require('../../config')
const axios = require('axios');
const imageError = require('../../imageErrorLoad')


class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logged: true,
      myUser: {},
    }
  }
  componentDidUpdate() {
    // const url = window.location.pathname
    // const array = url.split('/')
    // const user = array[2]
    // // Uso típico, (não esqueça de comparar as props):
    // if (this.state.myUser.username != user) {
    //   this.loadUser()
    //   const react = this
    //   socket.on('profileAmizadeLog', function(data){
    //     react.loadUser()
    //   })
    //   socket.on('notification', function(data){
    //     if(data.acao == 'atualizarPerfil'){
    //       react.loadUser()
    //     }
    //   })
    // }
  }
  componentDidCatch(){
    this.loadUser()
    const react = this
    socket.on('profileAmizadeLog', function(data){
      react.loadUser()
    })
    socket.on('notification', function(data){
      if(data.acao == 'atualizarPerfil'){
        react.loadUser()
      }
    })
  }
  componentDidMount(){
    this.loadUser()
    const react = this
    socket.on('profileAmizadeLog', function(data){
      react.loadUser()
    })
    socket.on('notification', function(data){
      if(data.acao == 'atualizarPerfil' || data.acao == 'levelUp'){
        react.loadUser()
      } else if(data.acao == 'errorProfile'){
        toast.error(data.message);
      }
    })
    socket.on('capaAtualizada', () => {
      react.loadUser()
    })
  }
  loadUser(){
    const react = this
    const url = window.location.pathname
    const array = url.split('/')
    const user = array[2]
    socket.emit('profileInfo', {"de": user, "para": JSON.parse(window.localStorage.getItem('myUser')).username})
    socket.on('userInfo', function(user){
      if(user.status != 'error'){
        react.setState({myUser: user})
      } else{
        react.setState({myUser: null})
      }
    })
  }
  sendMessage(){
    const react = this
    const openMessages = window.localStorage.getItem('openMessages')
    if(openMessages){
      let json = JSON.parse(openMessages)
      const foundPeople = json.find(e => e.id == this.state.myUser.id)
      if(!foundPeople){
        let userT = this.state.myUser
        json.push(userT)
      }
      window.localStorage.setItem('openMessages', JSON.stringify(json))
    } else{
      let json = []
      let userT = this.state.myUser
      json.push(userT)
      window.localStorage.setItem('openMessages', JSON.stringify(json))
    }
    socket.emit('focarMensagemPessoa', this.state.myUser)
  }
  enviarPedido(){
    socket.emit('enviarPedidoDeAmizade', {
      'de': JSON.parse(window.localStorage.getItem('myUser')).username,
      'para': this.state.myUser.username,
      'token': window.localStorage.getItem('token')
    })
  }
  aceitarSoltiacao(){
    socket.emit('aceitarAmizade', {
      'de': JSON.parse(window.localStorage.getItem('myUser')).username,
      'para': this.state.myUser.username,
      'token': window.localStorage.getItem('token')
    })
  }
  removerAmizadeSolitacao(){
    socket.emit('removerAmizade', {
      'de': JSON.parse(window.localStorage.getItem('myUser')).username,
      'para': this.state.myUser.username,
      'token': window.localStorage.getItem('token')
    })
  }
  openPhotoModal(photo){
    if(photo != ''){
      $(".modalPhotoSelect").addClass("abertoModalTwo")
      $(".modalPhotoSelect img").attr('src', photo)
    }
  }
  changeCover(file){
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
          socket.emit('changeCover', ciphertext)
        };
        reader.onerror = function (error) {
          console.log('Error: ', error);
        };
      } catch (error) {
        console.log(error)
      }
  }
  trigger(){
    document.querySelector("#photoCover").click()
  }
  render(){
  return (
    <div className="Home">
      <div className="headerBirl">
        { this.state.myUser !== null && <h1>{ this.state.myUser.username }
        { this.state.myUser.verificado == 1 && 
        <svg data-tip="Perfil verificado" className="badgeVerificado" viewBox="0 0 24 24" aria-label="Verified account" class="r-jwli3a r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg>
        }
        </h1> }
        { this.state.myUser == null && <h1> Perfil não encontrado </h1> }
      </div>
      {
        this.state.myUser !== null &&
        <div className="profile">
        <div className="prof_header">
            <div className="cover_img" style={{backgroundImage: `url(${(this.state.myUser.background == '' ? '../../defaultCover.jpg': this.state.myUser.background)})`}}>
              <div 
              onClick={() => this.openPhotoModal((this.state.myUser.background == '' ? '../../defaultCover.jpg': this.state.myUser.background))}
              className="transparent clickable coverClicable">
              </div>
              <div>
                {this.state.myUser.username == JSON.parse(window.localStorage.getItem("myUser")).username  &&
                <label 
                onClick={this.trigger}
                for="photoCover">
                  <button 
                  data-tip="Mudar cover do perfil" className="button_trans">
                  <i className="fas fa-images"></i>
                  </button>
                </label> }
                <input type="file" 
                name="photoCover"
                id="photoCover"
                accept="image/x-png,image/gif,image/jpeg"
                onChange={this.changeCover} 
                ></input>
              </div>
            </div>
            <Avatar 
            src={(this.state.myUser.avatar == '' ? '../defaultAvatar.png' : this.state.myUser.avatar)}
            level={this.state.myUser.level}
            percentual={`${this.state.myUser.exp == 0 ? 2 : (this.state.myUser.exp / (this.state.myUser.level * 6) * 10)}`}
            expAtual={this.state.myUser.exp}
            proximoLevel={(this.state.myUser.exp == 0 ? 2 : (this.state.myUser.level * 6) * 10)}
            only={this.state.myUser.username == JSON.parse(window.localStorage.getItem('myUser')).username}/>
            { this.state.myUser.badges != undefined && this.state.myUser.badges.map((item, i) =>
            <div key={i} data-tip={`${item.name} desde de ${item.adquirido}`} className="badge_t">
              <img src={`../badges/${item.photo}`}/>
            </div>
            )}

        </div>

        { 
          this.state.myUser.username != JSON.parse(window.localStorage.getItem('myUser')).username &&
          <div className="options">
            {
            this.state.myUser.aceito == -1 &&
            <button onClick={() => this.enviarPedido()}>Adicionar como amigo</button>
            }
            {
            this.state.myUser.aceito == 0 && this.state.myUser.para == JSON.parse(window.localStorage.getItem('myUser')).username &&
            <button onClick={() => this.aceitarSoltiacao()}>Aceitar solitação</button>
            }
            {
            this.state.myUser.aceito == 0 && this.state.myUser.para == JSON.parse(window.localStorage.getItem('myUser')).username &&
            <button onClick={() => this.removerAmizadeSolitacao()}>Recusar solitação</button>
            }
            {
            this.state.myUser.aceito == 0 && this.state.myUser.de == JSON.parse(window.localStorage.getItem('myUser')).username &&
            <button onClick={() => this.removerAmizadeSolitacao()}>Cancelar solitação</button>
            }
            {
            this.state.myUser.aceito == 1 &&
            <button onClick={() => this.removerAmizadeSolitacao()}>Remover amizade</button>
            }
            { this.state.myUser.aceito == 1 && <button onClick={() => this.sendMessage()}>Send Message</button> }
          </div>
        }

      </div> }
    </div>
  );
}
}

class Avatar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          file:null,
          moreOption: false
        }
        this.onChange = this.onChange.bind(this)
      }
      handleAvatar(event){
        event.preventDefault()
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
              'base64': reader.result,
              'token': token
            }
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'kaueehfodapakaraio404').toString();
            socket.emit('changeAvatar', data)
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
      openPhotoModal(photo){
        $(".modalPhotoSelect").addClass("abertoModalTwo")
        $(".modalPhotoSelect img").attr('src', photo)
      }
      removeClassModal(){
        setTimeout(() => {
          $(".modalPhotoSelect").removeClass("abertoModalTwo")
        }, 500);
      }
      render(){
      return (
          <div 
          className={`avatar`} onClick={() => this.setState({moreOption: !this.state.moreOption})}>
            { this.props.only && 
            <div>
              <label for="imgUploader">
                <i class="fas fa-image"></i>
              </label>
              <input type="file" accept="image/x-png,image/gif,image/jpeg" onChange={this.onChange} name="imgUploader" id="imgUploader" multiple />
            </div>
            }
            <CircularProgressbar value={this.props.percentual}></CircularProgressbar>
            <span data-tip={`Level<br>${this.props.expAtual}/${this.props.proximoLevel}`} className="level">{ this.props.level }</span>
            <img 
            onError={(e)=>{e.target.onerror = null; e.target.src=`${imageError.b}`}}
            src={this.props.src}/>  
            {
            this.state.moreOption && 
            <div className="moreOptions">
            <a onClick={() => this.openPhotoModal(this.props.src)}>
            <i class="fas fa-eye"></i> <span>Ver foto</span>
            </a>
          </div> }
          </div>
      );
    }
}

export default Profile;