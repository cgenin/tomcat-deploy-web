import React from 'react';
import classNames from 'classnames';
import { connect} from 'react-redux';
import { Modal, ModalFooter, ModalHeader, ModalTitle, ModalBody, Button} from 'react-bootstrap';
import CleanHistory from './artifacts/CleanHistory';

const mapStateToProps = function (state) {
  const homeActive = state.routing.location.pathname === '/';
  const addActive = state.routing.location.pathname === '/add';
  return {
    homeActive, addActive
  };
};

class AboutModal extends React.Component {
  render() {
    return (
      <Modal {...this.props} bsSize="small" aria-labelledby="contained-modal-title-sm">
        <ModalHeader closeButton>
          <ModalTitle id="contained-modal-title-sm">About ?</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <h4>0.4.2</h4>
          <p>Tu comprends, là on voit qu'on a beaucoup à travailler sur nous-mêmes car il y a de bonnes règles, de
            bonnes rules et c'est une sensation réelle qui se produit si on veut ! Pour te dire comme on a beaucoup
            à apprendre sur la vie !
          </p>
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = {smShow: false, show: false};
    this.onLaunchAbout = this.onLaunchAbout.bind(this);
    this.onLaunchCleanHistory = this.onLaunchCleanHistory.bind(this);
  }

  onLaunchAbout(e) {
    e.preventDefault();
    this.setState({smShow: true});
  }

  onLaunchCleanHistory(e) {
    if (e) {
      e.preventDefault();
    }
    const x = e.clientX;
    const y = e.clientY;
    this.setState({show: !this.state.show, x, y});
    return false;
  }

  render() {
    const clsHome = classNames({active: this.props.homeActive});
    const clsAdd = classNames({active: this.props.addActive});
    const smClose = () => this.setState({smShow: false});
    const onHideCleanHistory = () => this.setState({show: false});
    return (
      <nav className="navbar navbar-default navbar-static-top" style={{backgroundColor: 'rgb(63, 81, 181)'}}>
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                    data-target="#menu-navbar-collapse" aria-expanded="false">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <a className="navbar-brand" href="#">Deploy tool</a>
          </div>

          <div className="collapse navbar-collapse" id="menu-navbar-collapse">
            <ul className="nav navbar-nav">
              <li className={clsHome}>
                <a href="#" data-toggle="collapse" data-target="#menu-navbar-collapse">
                  <i className="fa fa-cog fa-home"/>&nbsp; Home <span
                  className="sr-only">(current)</span></a></li>
              <li className={clsAdd}>
                <a href="#/add" data-toggle="collapse" data-target="#menu-navbar-collapse">
                  <i className="fa fa-cog fa-plus"/>&nbsp; Add</a>
              </li>
              <li className="dropdown">
                <a href="bootstrap-elements.html" data-target="#" className="dropdown-toggle" data-toggle="dropdown"><i
                  className="fa fa-cog"/>&nbsp; Configuration
                  <b className="caret"/></a>
                <ul className="dropdown-menu">
                  <li className="dropdown-header">Artifacts</li>
                  <li><a href="#" onClick={this.onLaunchCleanHistory}>Clean history</a></li>
                </ul>
              </li>
            </ul>
            <ul className="nav navbar-nav navbar-right">
              <li><a href="#" onClick={this.onLaunchAbout}><strong>&nbsp;?&nbsp;</strong></a></li>
            </ul>
            <AboutModal show={this.state.smShow} onHide={smClose}/>
            <CleanHistory show={this.state.show} x={this.state.x} y={this.state.y} onHide={onHideCleanHistory}/>
          </div>
        </div>
      </nav>
    );
  }
}
Header.propTypes = {
  homeActive: React.PropTypes.bool.isRequired,
  addActive: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps)(Header);
