import React from 'react';
import {connect} from 'react-redux';
import {withRouter} from 'react-router';
import {Button, Row, Col, Alert} from 'antd';
import {deploy, deployByNexus, undeploy} from '../../../modules/actions/actions';
import PropTypes from 'prop-types';
import SelectedUrls from './SelectedUrls';
import SelectedNexus from './SelectedNexus';
import {ADD_SCHEDULER} from '../../../routesConstant'
import './DeployActions.css';

const mapStateToProps = function (state) {
  const {actions, nexus} = state;
  const disabled = !actions.artifacts || !actions.servers || actions.artifacts.length === 0 || !actions.servers[0] || actions.servers[0].length === 0
  const showNexusButton = nexus.length > 0 && actions.servers.length > 0;
  return {disabled, actions, showNexusButton, nexus};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onDeploy(server, artifacts, versions) {
      dispatch(deploy(server, artifacts, versions));
    },
    onDeployByNexus(server, nexus) {
      dispatch(deployByNexus(server, nexus));
    },
    onUnDeploy(server, artifacts) {
      dispatch(undeploy(server, artifacts));
    }
  };
};

class ButtonSchedule extends React.PureComponent {

  toNextScreen(type) {
    return () => {
      this.props.history.push(ADD_SCHEDULER.path(type));
    }
  }

  render() {
    if (this.props.showNexus) {
      return (
        <Button icon="clock-circle" onClick={this.toNextScreen('nexus')}>
          Schedule
        </Button>);
    }

    if (this.props.showArtifacts) {
      return (
        <Button icon="clock-circle" onClick={this.toNextScreen('job')}>
          Schedule
        </Button>);
    }


    return null;
  }
}

ButtonSchedule.propTypes = {
  showArtifacts: PropTypes.bool.isRequired,
  showNexus: PropTypes.bool.isRequired,
  history: PropTypes.object.isRequired,
};


class DeployActions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.onDeploy = this.onDeploy.bind(this);
    this.onDeployByNexus = this.onDeployByNexus.bind(this);
    this.onUnDeploy = this.onUnDeploy.bind(this);
  }

  onDeploy(e) {
    e.preventDefault();
    const server = this.props.actions.servers[0];
    const artifacts = this.props.actions.artifacts;
    const versions = this.props.actions.versions;
    this.props.onDeploy(server, artifacts, versions);
  }

  onDeployByNexus(e) {
    e.preventDefault();
    const {nexus, actions} = this.props;
    const {servers} = actions;
    const server = servers[0];
    this.props.onDeployByNexus(server, nexus);
  }

  onUnDeploy(e) {
    e.preventDefault();
    const server = this.props.actions.servers[0];
    const artifacts = this.props.actions.artifacts;
    this.props.onUnDeploy(server, artifacts);
  }

  render() {
    if (this.props.actions.inProgress.active) {
      return (
        <Row className="current-deployement">
          <Col span={12} offset={6} className="text-center">
            <Alert showIcon type="warning"
                   message={<h3>Deployement in progress <i className="fa fa-refresh fa-spin fa-2x"/></h3>}/>
          </Col>
        </Row>
      );
    }

    const buttonDeploy = (this.props.showNexusButton) ? (
      <Button onClick={this.onDeployByNexus}>
        <i className="fa fa-play"/>
        &nbsp;Run
      </Button>
    ) : (
      <Button onClick={this.onDeploy} disabled={this.props.disabled}>
        <i className="fa fa-play"/>
        &nbsp;Run
      </Button>
    );

    return (
      <Row id="deploy-actions">
        <Col md={{span: 3, offset: 6}} xs={{span: 8}}>
          <ButtonSchedule showArtifacts={!this.props.disabled} history={this.props.history}
                          showNexus={this.props.showNexusButton}/>
        </Col>
        <Col md={{span: 3}} xs={{span: 8}}>
          <Button onClick={this.onUnDeploy} disabled={this.props.disabled}>
            <i className="fa fa-trash-o"/>
            &nbsp;Undeploy
          </Button>
        </Col>
        <Col md={{span: 8}} xs={{span: 8}}>
          {buttonDeploy}
        </Col>
        <Col className="main-number-of-items" md={{span: 2, offset:0}} xs={{span: 8, offset: 8}}>
          <SelectedUrls />
        </Col>
        <Col className="main-number-of-items" md={{span: 2, offset:0}} xs={{span: 8, offset: 8}}>
          <SelectedNexus />
        </Col>
      </Row>
    );
  }
}

DeployActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  showNexusButton: PropTypes.bool.isRequired,
  actions: PropTypes.object,
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(DeployActions));
