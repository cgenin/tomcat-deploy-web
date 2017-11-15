import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import TestArtifact from '../nexus/TestArtifact';
import {save, load} from '../../../modules/artifacts/actions';
import PropTypes from 'prop-types';
import {HOME} from "../../../routesConstant";

function isDisabled(artifact) {
  return !artifact.name || artifact.name.length === 0 || (artifact.url.length === 0 && (artifact.groupId.length === 0 && artifact.artifactId.length === 0));
}

const mapStateToProps = function (state, ownProps) {
  if (ownProps.id) {
    const artifact = state.artifacts.find(a => `${a.$loki}` === ownProps.id);
    if (artifact) {
      return {
        artifact, id: ownProps.id

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
      dispatch(save(artifact)).then(() => history.push(HOME.path()));
    },
    onInit() {
      dispatch(load());
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
      testNexus: false
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onTest = this.onTest.bind(this);
    this._update = this._update.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  componentWillMount() {
    const artifact = this.props.artifact;
    this._update(artifact);
  }

  _update(artifact) {
    const disabled = isDisabled(artifact);
    this.setState({artifact, disabled});
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.artifact.$loki !== nextProps.artifact.$loki) {
      this._update(nextProps.artifact);
    }
  }

  onTest(e) {
    if (e) {
      e.preventDefault();
    }
    const testNexus = !this.state.testNexus;
    this.setState({testNexus})
  }

  onCancel(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.history.push(HOME.path());
  }

  onClick(e) {
    e.preventDefault();
    const artifact = this.state.artifact;
    this.props.onSave(artifact, this.props.history);
    return false;
  }

  onChange(attr) {
    return (evt) => {
      const {name, url, groupId, artifactId} =  this.state.artifact;
      const n = {name, url, groupId, artifactId};
      n[attr] = evt.target.value;
      const artifact = Object.assign({}, this.props.artifact, n);
      const disabled = isDisabled(artifact);
      this.setState({artifact, disabled});
    };

  }

  render() {

    const testNexusModal = (this.state.testNexus) ?
      <TestArtifact artifact={this.state.artifact} onHide={this.onTest}/> : null;

    return (
      <form>

        <div className="form-group ">
          <label className="control-label" htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name"
                 value={this.state.artifact.name} onChange={this.onChange('name')}
          />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="url">Jenkins url</label>
          <div className="input-group">
            <span className="input-group-addon">http://</span>
            <input type="text" className="form-control" id="url" placeholder="Url"
                   value={this.state.artifact.url}
                   onChange={this.onChange('url')}
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
                     value={this.state.artifact.groupId}
                     onChange={this.onChange('groupId')}
              />
            </div>
            <div className="form-group">
              <label className="control-label" htmlFor="artifact-id">Artifact Id</label>
              <input type="text" className="form-control" id="artifact-id" placeholder="Artifact Id"
                     value={this.state.artifact.artifactId}
                     onChange={this.onChange('artifactId')}
              />
            </div>
          </div>

        </div>
        <div className="col-xs-4 text-center">
          <a href="/" onClick={this.onCancel} className="btn btn-default">
            <li className="fa fa-backward"/>
            &nbsp;Cancel
          </a>
        </div>
        <div className="col-xs-4 text-center">
          <a href="/" onClick={this.onTest} className="btn btn-default">
            <li className="fa fa-retweet"/>
            &nbsp;Test
          </a>
        </div>
        <div className="col-xs-4 text-center">
          <button type="button" onClick={this.onClick} className="btn btn-primary" disabled={this.state.disabled}>
            <li className="glyphicon glyphicon-ok"/>
            &nbsp;Submit
          </button>
        </div>
        {testNexusModal}
      </form>
    );
  }
}

AddForm.propTypes = {artifact: PropTypes.object.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(AddForm));
