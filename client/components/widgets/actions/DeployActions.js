import React from 'react';
import {connect} from 'react-redux';
import { deploy, undeploy } from '../../../modules/actions/actions';

const mapStateToProps = function (state) {
  const actions = state.actions;
  const disabled = actions.artifacts.length === 0 || actions.servers.length === 0;
  return {disabled, actions};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onDeploy(server, artifacts, versions) {
      dispatch(deploy(server, artifacts, versions));
    },
    onUnDeploy(server, artifacts) {
      dispatch(undeploy(server, artifacts));
    }
  };
};

class DeployActions extends React.Component {
  constructor(props) {
    super(props);
    this.onDeploy = this.onDeploy.bind(this);
    this.onUnDeploy = this.onUnDeploy.bind(this);
  }

  onDeploy(e) {
    e.preventDefault();
    const server = this.props.actions.servers[0];
    const artifacts = this.props.actions.artifacts;
    const versions = this.props.actions.versions;
    this.props.onDeploy(server, artifacts, versions);
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
            <h3>Deploiement in progress <i className="fa fa-refresh fa-spin"/></h3>
          </div>
        </div>
      );
    }
    return (
      <div className="row">
        <div className="col-xs-3 col-xs-offset-3 text-right">
          <button type="button" onClick={this.onUnDeploy} disabled={this.props.disabled} className="btn btn-default">
            <i className="fa fa-trash-o"/>
            &nbsp;Undeploy
          </button>
        </div>
        <div className="col-xs-6 text-left">
          <button type="button" onClick={this.onDeploy} disabled={this.props.disabled} className="btn btn-info">
            <i className="fa fa-play"/>
            &nbsp;Run
          </button>
        </div>
      </div>
    );
  }
}

DeployActions.propTypes = {disabled: React.PropTypes.bool.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(DeployActions);
