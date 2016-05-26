import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import connect from 'react-redux/lib/components/connect';
import {TimeSpinner} from '../../widgets/Spinner';
import Modal from 'react-bootstrap/lib/Modal';
import ModalFooter from 'react-bootstrap/lib/ModalFooter';
import ModalHeader from 'react-bootstrap/lib/ModalHeader';
import ModalTitle from 'react-bootstrap/lib/ModalTitle';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Button from 'react-bootstrap/lib/Button';

import {testArtifact, search} from '../../../modules/nexus/actions';

const mapStateToProps = function (state) {
  const nexus = state.nexus;
  return { nexus };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onTest(nexus, artifact) {
      return dispatch(testArtifact(nexus.host, nexus.port, artifact.groupId, artifact.artifactId));
    },
    onSearch(nexus, artifact) {
      return dispatch(search(nexus.host, nexus.port, artifact.name));
    }
  };
};

class SuccessResult extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const data = this.props.result.body.data || [];
    const versions = data.map(d => <li key={`${d.version}`}>{d.version}</li>)
    return (
      <div className="text-center">
        <div className="message success" style={{margin: '2em', paddingTop: '30px', paddingLeft: '5px'}}>
          <div className="text-center">
            <h3>Total Count : {this.props.result.body.totalCount}</h3>
          </div>
          <div className="text-left">
            <ul>
              {versions}
            </ul>
          </div>
        </div>
      </div>
    );
  }
}

class ErrorResult extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const totalCount = (this.props.result.statusCode !== 200) ? 0 : this.props.result.body.totalCount || 0;
    return (
      <div className="text-center">
        <div className="message error" style={{margin: '2em', paddingTop: '30px', paddingLeft: '5px'}}>
          <div className="fa-stack fa-lg" style={{margin: 'auto'}}>
            <i className="fa fa-square-o fa-stack-2x"/>
            <i className="fa fa-warning fa-stack-1x"/>
          </div>
          <div className="text-center">
            <h3>Status code : {this.props.result.statusCode }</h3>
          </div>
          <div className="text-center">
            <h3>Total Count : {totalCount }</h3>
          </div>
        </div>
      </div>
    );
  }
}

class Result extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const error = (this.props.result.statusCode !== 200) || !this.props.result.body || this.props.result.body.totalCount === 0;
    if (error) {
      return <ErrorResult result={this.props.result}/>;
    }
    return <SuccessResult result={this.props.result}/>;
  }
}


class TestArtifact extends React.Component {

  constructor(props) {
    super(props);
    this.state = { waiting: true, result: {} };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.props.onTest(this.props.nexus, this.props.artifact).then(
      r => this.setState({ waiting: false, result: r }));
  }

  render() {
    const waiting = (this.state.waiting) ? <TimeSpinner /> : <Result result={this.state.result}/>;

    return (
      <Modal show={true} aria-labelledby="contained-modal-title-sm">
        <ModalHeader>
          <ModalTitle>Get Version of Nexus</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <h3>{ this.props.artifact.name}</h3>
          </div>
          {waiting}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestArtifact);
