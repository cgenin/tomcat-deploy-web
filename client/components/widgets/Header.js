import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import connect from 'react-redux/lib/components/connect';
import {routeActions} from 'react-router-redux';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import CleanHistory from './artifacts/CleanHistory';
import BlockUI from './Blockui';
import AboutModal from './AboutModal';
import Configuration from './nexus/Configuration';

import {reload} from '../../modules/nexus-versions/actions';

const mapStateToProps = function (state) {
  const homeActive = state.routing.location.pathname === '/';
  const addActive = state.routing.location.pathname === '/add';
  return {
    homeActive, addActive
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onHome() {
      dispatch(routeActions.push('/'));
    },
    onAddArtifact() {
      dispatch(routeActions.push('/add'));
    },
    onRefreshNexus() {
     return dispatch(reload());
    }
  };
};


class Header extends React.Component {

  constructor(props) {
    super(props);
    this.state = { smShow: false, show: false, nexusConfiguration: false, refreshNexusVersion: false };
    this.onLaunchAbout = this.onLaunchAbout.bind(this);
    this.onLaunchCleanHistory = this.onLaunchCleanHistory.bind(this);
    this.onNexusConfiguration = this.onNexusConfiguration.bind(this);
    this.onRefresh = this.onRefresh.bind(this);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  onLaunchAbout(e) {
    e.preventDefault();
    this.setState({ smShow: true });
  }

  onLaunchCleanHistory(e) {
    if (e) {
      e.preventDefault();
    }
    const x = e.clientX;
    const y = e.clientY;
    this.setState({ show: !this.state.show, x, y });
    return false;
  }

  onNexusConfiguration(e) {
    if (e) {
      e.preventDefault();
    }
    const x = e.clientX;
    const y = e.clientY;
    this.setState({ nexusConfiguration: !this.state.nexusConfiguration, x, y });
    return false;
  }

  onRefresh(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({ refreshNexusVersion: true });
    this.props.onRefreshNexus().then(() => this.setState({refreshNexusVersion: false}))
  }


  render() {
    const smClose = () => this.setState({ smShow: false });
    const onHideCleanHistory = () => this.setState({ show: false });
    const onHideNexusConfiguration = () => this.setState({ nexusConfiguration: false });
    return (
      <div>
        <Navbar inverse={true} fluid={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Deploy tool</a>

            </Navbar.Brand>
            <Navbar.Toggle />
          </Navbar.Header>

          <Navbar.Collapse>
            <Nav>
              <NavItem eventKey={1} onClick={() => this.props.onHome()} active={this.props.homeActive}>
                <i className="fa fa-cog fa-home"/> &nbsp; Home
              </NavItem>
              <NavItem eventKey={2} onClick={() => this.props.onAddArtifact()} active={this.props.addActive}>
                <i className="fa fa-cog fa-plus"/>&nbsp; Add
              </NavItem>
              <NavDropdown eventKey={3} title={<span><i className="fa fa-cog"/>&nbsp; Configuration</span>}
                           id="config-dropdown">
                <MenuItem eventKey={3.0} header>Nexus</MenuItem>
                <MenuItem eventKey={3.1} onClick={this.onNexusConfiguration}>Nexus Configuration</MenuItem>
                <MenuItem eventKey={3.4} onClick={this.onRefresh}>Refresh Versions</MenuItem>
                <MenuItem divider/>
                <MenuItem eventKey={3.2} header>Artifacts</MenuItem>
                <MenuItem eventKey={3.3} onClick={this.onLaunchCleanHistory}>Clean history</MenuItem>
              </NavDropdown>
            </Nav>
            <Nav pullRight>
              <NavItem eventKey={4} onClick={this.onLaunchAbout}><strong>&nbsp;?&nbsp;</strong></NavItem>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <AboutModal show={this.state.smShow} onHide={smClose}/>
        <CleanHistory show={this.state.show} x={this.state.x} y={this.state.y} onHide={onHideCleanHistory}/>
        <Configuration show={this.state.nexusConfiguration} x={this.state.x} y={this.state.y}
                       onHide={onHideNexusConfiguration}/>
          <BlockUI show={this.state.refreshNexusVersion}/>
      </div>
    );
  }
}
Header.propTypes = {
  homeActive: React.PropTypes.bool.isRequired,
  addActive: React.PropTypes.bool.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
