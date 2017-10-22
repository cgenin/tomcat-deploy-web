import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import {save} from '../../../modules/artifacts/actions';
import PropTypes from 'prop-types';

function isDisabled(artifact) {
  return !artifact.name || artifact.name.length === 0;
}

const mapStateToProps = function (state, ownProps) {
  if (ownProps.name) {
    const artifact = state.artifacts.find(a => a.name === ownProps.name);
    if (artifact) {
      return {
        artifact
      };
    }
  }

  return {
    artifact: {}
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave(artifact, history) {
      dispatch(save(artifact)).then(() => history.push('/'));
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
      disabled: true,
      searchNexus: false,
      testNexus: false
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  componentWillMount() {
    const artifact = this.props.artifact;
    const disabled = isDisabled(this.props.artifact);
    this.setState({artifact, disabled});
  }

  onCancel(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.history.push('/');
  }

  onClick(e) {
    e.preventDefault();
    const artifact = this.state.artifact;
    this.props.onSave(artifact, this.props.history);
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
      <form>

        <div className="form-group ">
          <label className="control-label" htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name"
                 defaultValue={this.state.artifact.name} onChange={this.onChange} ref="name"
          />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="url">Jenkins url</label>
          <div className="input-group">
            <span className="input-group-addon">http://</span>
            <input type="text" className="form-control" id="url" placeholder="Url" defaultValue={this.state.artifact.url}
                   onChange={this.onChange} ref="url"
            />
          </div>
        </div>
        <div className="panel panel-danger">
          <div className="panel-heading">
            <div className="row">
              <div className="col-xs-3  col-sm-8 " style={{marginTop: '15px'}}>
                <h2 className="panel-title" style={{fontSize: '30px', margin: 'auto'}}>Nexus datas</h2>
              </div>
            </div>
          </div>
          <div className="panel-body">
            <div className="form-group">
              <label className="control-label" htmlFor="group-id">Group Id</label>
              <input type="text" className="form-control" id="group-id" placeholder="Group Id"
                     defaultValue={this.state.artifact.groupId}
                     onChange={this.onChange} ref="groupId"
              />
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="artifact-id">Artifact Id</label>
              <input type="text" className="form-control" id="artifact-id" placeholder="Artifact Id"
                     defaultValue={this.state.artifact.artifactId}
                     onChange={this.onChange} ref="artifactId"
              />
            </div>
          </div>

        </div>
        <div className="col-xs-offset-4 col-xs-4">
          <a href="/" onClick={this.onCancel} className="btn btn-default">
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

AddForm.propTypes = {artifact: PropTypes.object.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddForm));
