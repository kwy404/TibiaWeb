import React from 'react';

class Explore extends React.Component {
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
        <h1>Explore</h1>
      </div>
    </div>
  );
}
}

export default Explore;