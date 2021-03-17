import React from 'react';
import AbertoConfig from './../Servers';
var config = require('../../config')

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }
  componentDidMount(){
    
  }
  render(){
  return (
    <div className={`header_top`}>
        <div className="center_bru">
            <button className="button">
                <i class="fas fa-bell"></i>
            </button>
        </div>
    </div>
  );
}
}


export default Header;