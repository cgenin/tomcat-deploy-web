import React from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import ServerActions from './../../widgets/server/ServerActions';
import {artifactsList, nexusArtifactsList, historyList, logger} from '../../Lazy';
import Title from '../../widgets/Title';
import DeployActions from './../../widgets/actions/DeployActions';
import {hideConsole} from './../../../modules/actions/actions';
import {reset} from './../../../modules/nexus/actions';
import IOComponent from "../../../IOComponent";

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
      dispatch(reset());
    }
  };
};

class HomePage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      key: 2
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.onEnter = this.onEnter.bind(this);
  }

  componentWillMount() {
    const showLogger = this.props.showLogger;
    if (showLogger) {
      this.setState({key: 3});
    }
  }


  componentWillReceiveProps(newProps) {
    const showLogger = newProps.showLogger;
    if (showLogger) {
      this.setState({key: 3});
    }
  }

  handleSelect(key) {
    this.setState({key});
    this.props.onSelect();
  }

  onEnter() {
    this.props.onResetNexusArtifact();
  }

  render() {
    return (
      <div>
        <Title text="List and deploy"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerActions/>
            </div>
            <DeployActions/>
            <div className="row">
              <div>
                <Tabs id="home-tabs" activeKey={this.state.key} onSelect={this.handleSelect}
                      style={{marginLeft: '2em', marginRight: '2em'}}>
                  <Tab eventKey={2} onExit={this.onEnter} title="Nexus">
                    <IOComponent lazy={nexusArtifactsList}/>
                  </Tab>
                  <Tab eventKey={1} title="Artifacts / Jenkins">
                    <IOComponent lazy={artifactsList}/>
                  </Tab>
                  <Tab eventKey={4} title="History">
                    <IOComponent lazy={historyList}/>
                  </Tab>
                  <Tab eventKey={3} title="Logs">
                    <IOComponent lazy={logger}/>
                  </Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

HomePage.propTypes = {showLogger: PropTypes.bool};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
