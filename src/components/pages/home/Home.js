import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Row, Col, Tabs, Card, Breadcrumb} from 'antd';
import ServerActions from './../../widgets/server/ServerActions';
import {artifactsList, nexusArtifactsList, historyList, logger, schedulersList} from '../../Lazy';
import Title from '../../widgets/Title';
import DeployActions from './../../widgets/actions/DeployActions';
import {hideConsole, updateArtifacts} from './../../../modules/actions/actions';
import {reset} from './../../../modules/nexus/actions';
import {load as loadSchedulers} from './../../../modules/schedulers/actions';
import IOComponent from "../../../IOComponent";
import {
  HOME_TABS, TAB_HISTORY, TAB_LIST_ARTIFACTS, TAB_LIST_NEXUS, TAB_LIST_SCHEDULERS,
  TAB_LOGGER
} from "../../../routesConstant";
import {pageLayout} from "../../Styles";

const mapStateToProps = function (state) {
  const showLogger = state.actions.forceLogger;
  return {showLogger};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSelect() {
      dispatch(hideConsole());
    },
    onResetNexusArtifact() {
      return dispatch(reset())
        .then(() => this.onSelect());
    },
    onResetArtifact() {
      return dispatch(updateArtifacts([]))
        .then(() => this.onSelect());
    },
    onReloadSchedulers() {
      return dispatch(loadSchedulers())
    }
  };
};

class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      key: TAB_LIST_NEXUS
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  componentWillMount() {
    const showLogger = this.props.showLogger;
    if (showLogger) {
      this.setState({key: TAB_LOGGER});
    }
  }


  componentWillReceiveProps(newProps) {
    const showLogger = newProps.showLogger;
    if (showLogger) {
      this.setState({key: TAB_LOGGER});
    }


  }

  handleSelect(key) {
    this.setState({key});
    switch (key) {
      case TAB_LIST_NEXUS :
        this.props.onResetArtifact();
        break;
      case TAB_LIST_ARTIFACTS :
        this.props.onResetNexusArtifact();
        break;
      case TAB_LIST_SCHEDULERS :
        this.props.onReloadSchedulers();
        break;
      default:
        this.props.onSelect();
    }
    this.props.history.push(HOME_TABS.path(key));
  }

  componentDidMount() {
    const {tab} = this.props.match.params;
    if (tab) {
      this.setState({key: tab});
    }
  }

  onEnter() {
    this.props.onResetNexusArtifact();
  }

  render() {
    return (
      <div>
        <Row>
          <Col {...pageLayout}>
            <Breadcrumb className="main-bread-crumb">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Title text="List and deploy"/>
          <Col {...pageLayout}>
            <Card style={{width: '100%'}}>
              <ServerActions/>
              <DeployActions/>
              <Tabs id="home-tabs" defaultActiveKey="2" activeKey={this.state.key} onChange={this.handleSelect}>
                <Tabs.TabPane key={TAB_LIST_NEXUS} tab="Nexus">
                  <IOComponent lazy={nexusArtifactsList}/>
                </Tabs.TabPane>
                <Tabs.TabPane key={TAB_LIST_ARTIFACTS} tab="Artifacts / Jenkins">
                  <IOComponent lazy={artifactsList}/>
                </Tabs.TabPane>
                <Tabs.TabPane key={TAB_HISTORY} tab="History">
                  <IOComponent lazy={historyList}/>
                </Tabs.TabPane>
                <Tabs.TabPane key={TAB_LIST_SCHEDULERS} tab="Job's list">
                  <IOComponent lazy={schedulersList}/>
                </Tabs.TabPane>
                <Tabs.TabPane key={TAB_LOGGER} tab="Logs">
                  <IOComponent lazy={logger}/>
                </Tabs.TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </div>);
  }
}

HomePage.propTypes = {showLogger: PropTypes.bool};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HomePage));
