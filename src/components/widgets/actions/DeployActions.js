import React from 'react';
import {connect} from 'react-redux';
import { deploy, deployByNexus, undeploy } from '../../../modules/actions/actions';
import PropTypes from 'prop-types';

const mapStateToProps = function (state) {
  const {actions, nexus} = state;
  const disabled = actions.artifacts.length === 0 || actions.servers.length === 0;
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
        <div className="row">
          <div className="alert alert-dismissible alert-warning col-xs-6 col-xs-offset-3 text-center">
            <h3>Deployement in progress <i className="fa fa-refresh fa-spin fa-2x"/></h3>
          </div>
        </div>
      );
    }

    const buttonDeploy = (this.props.showNexusButton) ? (
      <button type="button" onClick={this.onDeployByNexus}  className="btn btn-info">
        <i className="fa fa-play"/>
        &nbsp;Run via Nexus
      </button>
    ) : (
      <button type="button" onClick={this.onDeploy} disabled={this.props.disabled} className="btn btn-info">
        <i className="fa fa-play"/>
        &nbsp;Run
      </button>
    );

    return (
      <div className="row">
        <div className="col-xs-3 col-xs-offset-3 text-right">
          <button type="button" onClick={this.onUnDeploy} disabled={this.props.disabled} className="btn btn-default">
            <i className="fa fa-trash-o"/>
            &nbsp;Undeploy
          </button>
        </div>
        <div className="col-xs-6 text-left">
          {buttonDeploy}
        </div>
      </div>
    );
  }
}

DeployActions.propTypes = {
  disabled: PropTypes.bool.isRequired,
  showNexusButton: PropTypes.bool.isRequired,
  actions:PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DeployActions);
