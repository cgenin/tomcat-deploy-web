import React from 'react';
import Header from '../widgets/header';
import Snackbar from '../widgets/actions/Snackbar';

class MainLayout extends React.Component {

  componentDidMount() {
    window.$.material.init();
  }

  render() {
    return (
      <div>
        <Header/>
        {this.props.children}
        <Snackbar />
      </div>
    );
  }
}

export default MainLayout;
