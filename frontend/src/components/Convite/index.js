import React from 'react';
const config = require('../../config')

class Ads extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  render(){
  return (
    <div className="ads">
        <h3>
            Seja bem vindo ao Social Network
            <p>Você pode convidar seus amigos para participar da Rede junto com você, basta enviar
                esse Link para ele <code>{config.configSite.urlPrincipal}/invite/{
                window.localStorage.getItem('myUser') && JSON.parse(window.localStorage.getItem('myUser')).invite
                }</code>
            </p>
        </h3>
    </div>
  );
}
}


export default Ads;