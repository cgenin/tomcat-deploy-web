import React from 'react';
import { connect} from 'react-redux';
import { save } from '../../../modules/artifacts/actions';
import { routeActions } from 'react-router-redux';

function isDisabled(artifact) {
  return !artifact.name || artifact.name.length === 0;
}

const mapStateToProps = function (state, ownProps) {
  if (ownProps.name) {
    const artifact = state.artifacts.find(a => a.name === ownProps.name);
    if (artifact) {
      return {
        artifact,
        routing: state.routing
      };
    }
  }

  return {
    artifact: {},
    routing: state.routing
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (artifact) {
      dispatch(save(artifact)).then(() => dispatch(routeActions.push('/')));
    }
  };
};

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      artifact: {
        name: '',
        url: ''
      },
      disabled: true
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentWillMount() {
    const artifact = this.props.artifact;
    const disabled = isDisabled(this.props.artifact);
    this.setState({artifact, disabled});
  }

  onClick(e) {
    e.preventDefault();
    const artifact = this.state.artifact;
    this.props.onSave(artifact);
    return false;
  }

  onChange() {
    const name = this.refs.name.value;
    const url = this.refs.url.value;
    const groupId = this.refs.groupId.value;
    const artifactId = this.refs.artifactId.value;
    const artifact = Object.assign({}, this.props.artifact, {name, url, groupId, artifactId});
    const disabled = name.length === 0 && (url.length === 0 || (groupId.length === 0 && artifactId.length === 0));
    this.setState({artifact, disabled});
  }

  render() {
    return (
      <form >

        <div className="form-group ">
          <label className="control-label" htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name"
                 value={this.state.artifact.name} onChange={this.onChange} ref="name"
          />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="url">Jenkins url</label>
          <div className="input-group">
            <span className="input-group-addon">http://</span>
            <input type="text" className="form-control" id="url" placeholder="Url" value={this.state.artifact.url}
                   onChange={this.onChange} ref="url"
            />
          </div>
        </div>
        <div className="panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">Nexus datas</h3>
          </div>
          <div className="panel-body">
            <div className="form-group">
              <label className="control-label" htmlFor="group-id">Group Id</label>
              <input type="text" className="form-control" id="group-id" placeholder="Group Id"
                     value={this.state.artifact.groupId}
                     onChange={this.onChange} ref="groupId"
              />
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="artifact-id">Artifact Id</label>
              <input type="text" className="form-control" id="artifact-id" placeholder="Artifact Id"
                     value={this.state.artifact.artifactId}
                     onChange={this.onChange} ref="artifactId"
              />
            </div>
          </div>
        </div>
        <div className="col-xs-offset-4 col-xs-4">
          <a href="#/" className="btn btn-default">
            <li className="fa fa-backward"/>
            &nbsp;Cancel
          </a>
        </div>
        <div className=" col-xs-4">
          <button type="button" onClick={this.onClick} className="btn btn-primary" disabled={this.state.disabled}>
            <li className="glyphicon glyphicon-ok"/>
            &nbsp;Submit
          </button>
        </div>
      </form>
    );
  }
}

AddForm.propTypes = {routing: React.PropTypes.object.isRequired, artifact: React.PropTypes.object.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);
