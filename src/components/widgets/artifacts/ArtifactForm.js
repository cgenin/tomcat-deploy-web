import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import {Form, Button, Input, Card, Row, Col} from 'antd'
import TestArtifact from '../nexus/TestNexusArtifact';
import {save, load} from '../../../modules/artifacts/actions';
import PropTypes from 'prop-types';
import {formItemLayout, formItemInnerLayout} from '../../Styles';
import {HOME} from "../../../routesConstant";
import './ArtifactForm.css'

const FormItem = Form.Item;

function isDisabled(artifact) {
  return !artifact.name || artifact.name.length === 0 ||
    (
      (!artifact.url || artifact.url.length === 0)
      && (
        (!artifact.groupId || artifact.groupId.length === 0)
        && (!artifact.artifactId || artifact.artifactId.length === 0)
      )
    );
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

class ArtifactForm extends React.Component {
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
      const {name, url, groupId, artifactId, job} = this.state.artifact;
      const n = {name, url, groupId, artifactId, job};
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
      <Form id="artifact-form">
        <FormItem {...formItemLayout} label="Job">
          <Input placeholder="Job Name" value={this.state.artifact.job} onChange={this.onChange('job')}/>
        </FormItem>
        <FormItem {...formItemLayout} label="Name">
          <Input placeholder="Name" value={this.state.artifact.name} onChange={this.onChange('name')}/>
        </FormItem>
        <FormItem {...formItemLayout} label="Jenkins url">
          <Input addonBefore="http://" placeholder="Url" value={this.state.artifact.url}
                 onChange={this.onChange('url')}/>
        </FormItem>
        <Card type="inner" title="Nexus datas" className="nexus-card">
          <FormItem {...formItemInnerLayout} label="Group Id">
            <Input placeholder="Group Id" value={this.state.artifact.groupId} onChange={this.onChange('groupId')}/>
          </FormItem>
          <FormItem {...formItemInnerLayout} label="Artifact Id">
            <Input placeholder="Artifact Id" value={this.state.artifact.artifactId}
                   onChange={this.onChange('artifactId')}/>
          </FormItem>
        </Card>
        <Row className="buttons">
          <Col span={8} className="one-button">
            <Button onClick={this.onCancel}>
              <li className="fa fa-backward"/>
              &nbsp;Cancel</Button>
          </Col>
          <Col span={8} className="one-button">
            <Button onClick={this.onTest}>
              <li className="fa fa-retweet"/>
              &nbsp;Test
            </Button>
          </Col>
          <Col span={8} className="one-button">
            <Button type="primary" onClick={this.onClick} icon="check" disabled={this.state.disabled}>
              &nbsp;Submit
            </Button>
          </Col>
        </Row>
        {testNexusModal}
      </Form>
    );
  }
}

ArtifactForm.propTypes = {artifact: PropTypes.object.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtifactForm));
