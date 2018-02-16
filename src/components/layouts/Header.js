import React from 'react';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Menu, Row, Col, Icon} from 'antd';
import CleanHistory from './artifacts/CleanHistory';
import AboutModal from './AboutModal';
import {ADD_ARTIFACT, HOME} from '../../routesConstant'


const mapStateToProps = function (state, props) {
  const homeActive = props.location.pathname === HOME.path();
  const addActive = props.location.pathname === ADD_ARTIFACT.path();
  return {
    homeActive, addActive
  };
};


class Header extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {smShow: false, show: false, nexusConfiguration: false,};
    this.onLaunchAbout = this.onLaunchAbout.bind(this);
    this.onLaunchCleanHistory = this.onLaunchCleanHistory.bind(this);
    this.onHome = this.onHome.bind(this);
    this.onHelpPage = this.onHelpPage.bind(this);
    this.onAddArtifact = this.onAddArtifact.bind(this);
    this.onLicensePage = this.onLicensePage.bind(this);
    this.handleChangeMenu = this.handleChangeMenu.bind(this);

  }

  onHome() {
    this.props.history.push(HOME.path());
  }

  onAddArtifact() {
    this.props.history.push(ADD_ARTIFACT.path());
  }

  onApiRestPage() {
    window.open('/apidoc', 'api-rest');
  }

  onLicensePage() {
    this.props.history.push('/md/license');
  }


  onHelpPage() {
    this.props.history.push('/md/help');
  }

  onLaunchAbout() {
    this.setState({smShow: true});
  }

  onLaunchCleanHistory() {

    this.setState({show: !this.state.show});
    return false;
  }

  handleChangeMenu(item, key) {
    switch (item.key) {
      case '2' :
        this.onAddArtifact();
        break;
      case '3.2':
        this.onLaunchCleanHistory();
        break;
      case '4.1' :
        this.onHelpPage();
        break;
      case '4.2':
        this.onApiRestPage();
        break;
      case '4.3' :
        this.onLicensePage();
        break;
      case '4.4' :
        this.onLaunchAbout();
        break;
      default:
        this.onHome();
    }
  }


  render() {
    const smClose = () => this.setState({smShow: false});
    const onHideCleanHistory = () => this.setState({show: false});
    const defaultSelectedKeys = (this.props.homeActive) ? ['1']
      : (this.props.addActive) ? ['2'] : [];
    return (
      <div className="main-layout-header">
        <Row>
          <Col xs={{span: 0}} md={{span: 3}}>
            <a href="/" className="label-item-menu" style={{color: 'white', fontWeight: 'bold'}}>Deploy tool</a>
          </Col>
          <Col span={20}>
            <Menu
              theme="dark"
              mode="horizontal"
              defaultSelectedKeys={defaultSelectedKeys}
              onClick={this.handleChangeMenu}
              style={{lineHeight: '56px'}}
              forceSubMenuRender={true}
            >
              <Menu.Item key="1">
                <i className="fa fa-cog fa-home "/><span className="label-item-menu">&nbsp; Home</span>
              </Menu.Item>

              <Menu.Item key="2">
                <i className="fa fa-cog fa-plus"/><span className="label-item-menu">&nbsp; Add</span>
              </Menu.Item>
              <Menu.SubMenu title={<span><i className="fa fa-cog "/><span
                className="label-item-menu">&nbsp; Configuration</span></span>}>
                <Menu.ItemGroup title="Artifacts">
                  <Menu.Item key="3.2">Clean history</Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
            </Menu>
          </Col>
          <Col md={{span: 1}} xs={{span:3}}>
            <Menu
              theme="dark"
              mode="horizontal"
              onClick={this.handleChangeMenu}
              style={{lineHeight: '56px'}}
              forceSubMenuRender={true}
            >
              <Menu.SubMenu id="help-dropdown" key={4}
                            title={<strong>&nbsp;?&nbsp;<Icon type="caret-down" /></strong>}>
                <Menu.Item key="4.1">Help</Menu.Item>
                <Menu.Item key="4.2">APi Rest Doc</Menu.Item>
                <Menu.Item key="4.3">License</Menu.Item>
                <Menu.Item key="4.4" onClick={this.onLaunchAbout}>About</Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Col>
        </Row>
        <AboutModal visible={this.state.smShow} onHide={smClose}/>
        <CleanHistory visible={this.state.show} onHide={onHideCleanHistory}/>
      </div>
    );
  }
}

Header.propTypes = {
  homeActive: PropTypes.bool.isRequired,
  addActive: PropTypes.bool.isRequired
};

export default withRouter(connect(mapStateToProps)(Header));
