import React from 'react';
import Header from '../widgets/Header';
import Snackbar from '../widgets/actions/Snackbar';

class MainLayout extends React.Component {


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
