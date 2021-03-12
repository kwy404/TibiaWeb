import React from 'react';
import smallTooltip from 'small-tooltip';
import 'small-tooltip/smallTooltip.css';
import Carousel from 'react-elastic-carousel';
import { ToastContainer, toast } from 'react-toastify';
import socket from '../../socket';
import $ from 'jquery';

import Ads from './../Convite';
const imageError = require('../../imageErrorLoad')

class HomeMain extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    localStorage.setItem("see", '0')
  }
  render(){
  return (
    <div className="Home">
      <div className="headerBirl">
        <h1>Home</h1>
      </div>
      <Ads/>
      <br></br>
      <br></br>
      <Post 
      commentsCount={0}
      comments={[]}
      postVerificado={true}
      name={'kaway404'}
      post={'Bem vindo ao Social Network'}
      liked={false}
      countLike={0}
      photo={''}
      />
    </div>
  );
}
}


class Post extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      liked: this.props.liked,
      commentAtivo: false,
      comentarCond: false,
      opened: false
    }
  }
  render(){
  return (
    <div 
    onClick={() => this.setState({opened: !this.state.opened})}
    className={`post ${(this.state.opened ? 'opened': '')}`} >
      <div className="header">
        <div className="avatar">
          <img src="../defaultAvatar.png"/>
        </div>
      <h2>{ this.props.name } <svg data-tip="Perfil verificado" className="badgeVerificado" viewBox="0 0 24 24" aria-label="Verified account" class="r-jwli3a r-4qtqp9 r-yyyyoo r-1xvli5t r-9cviqr r-dnmrzs r-bnwqim r-1plcrui r-lrvibr"><g><path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"></path></g></svg></h2>
      </div>
      <p>
        { this.props.post }
      </p>
      <div className="bottom">
        <button 
        onClick={() => this.setState({comentarCond: !this.state.comentarCond})}
        className={`comment ${this.state.comentarCond ? 'comentando' : ''}`}>
          <i class="far fa-comment"></i>
        </button>
        <button className="repost">
          <i class="fas fa-retweet"></i>
        </button>
        <button onClick={() => this.setState({liked: !this.state.liked})} className={`love ${(this.state.liked ? 'liked' : '')}`}>
          { !this.state.liked && <i class="far fa-heart"></i> }
          { this.state.liked && <i class="fas fa-heart"></i> }
        </button>
      </div>
     {  this.state.comentarCond && <div className="comments">
        <h3>Comments</h3>
        <div className="commentList">
        </div>
        <div className="commentFazer">
          <input type="text" placeholder={`Comentar no post de ${this.props.name}`}/>
        </div>
      </div> }
    </div>
  );
}
}

export default HomeMain;