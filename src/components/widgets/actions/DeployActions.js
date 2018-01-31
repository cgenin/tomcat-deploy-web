import React from 'react';
import {connect} from 'react-redux';
import {Button, Row, Col, Alert} from 'antd';
import {deploy, deployByNexus, undeploy} from '../../../modules/actions/actions';
import PropTypes from 'prop-types';
import SelectedUrls from './SelectedUrls';
import SelectedNexus from './SelectedNexus';
import './DeployActions.css';

const mapStateToProps = function (state) {
  const {actions, nexus} = state;
  const disabled = !actions.artifacts || !actions.servers || actions.artifacts.length === 0 || !actions.servers[0] || actions.servers[0].length === 0
  const showNexusButton = nexus.length > 0 && actions.servers.length > 0;
  console.log(showNexusButton);
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
      <Button onClick={this.onDeployByNexus} size="large">
        <i className="fa fa-play"/>
        &nbsp;Run
      </Button>
    ) : (
      <Button onClick={this.onDeploy} disabled={this.props.disabled} size="large">
        <i className="fa fa-play"/>
        &nbsp;Run
      </Button>
    );

    return (
      <Row id="deploy-actions">
        <Col span={3} offset={9}>
          <Button onClick={this.onUnDeploy} disabled={this.props.disabled} size="large">
            <i className="fa fa-trash-o"/>
            &nbsp;Undeploy
          </Button>
        </Col>
        <Col span={8}>
          {buttonDeploy}
        </Col>
        <Col span={2}>
          <SelectedUrls/>
        </Col>
        <Col span={2}>
          <SelectedNexus/>
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

export default connect(mapStateToProps, mapDispatchToProps)(DeployActions);
