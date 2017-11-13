import React from 'react';
import {connect} from 'react-redux';
import {TimeSpinner} from '../../widgets/Spinner';
import Modal from 'react-bootstrap/lib/Modal';
import ModalFooter from 'react-bootstrap/lib/ModalFooter';
import ModalHeader from 'react-bootstrap/lib/ModalHeader';
import ModalTitle from 'react-bootstrap/lib/ModalTitle';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Button from 'react-bootstrap/lib/Button';

import {testArtifact} from '../../../modules/nexus/actions';
import StringToText from "../StringToText";

const mapStateToProps = function (state) {
  const nexus = state.nexus;
  return {nexus};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onTest(artifact) {
      return dispatch(testArtifact(artifact.groupId, artifact.artifactId));
    }
  };
};

const SuccessResult = (props) => {
  const data = props.result.body.stdout;
  return (
    <div className="text-center">
      <div className="message success" style={{margin: '2em', paddingTop: '30px', paddingLeft: '5px'}}>
        <div className="text-center">
          <h3>artifact found</h3>
          <h4>status : {props.result.statusCode}</h4>
        </div>
        <div className="text-left">
          <StringToText value={data}/>
        </div>
      </div>
    </div>
  );
}

const ErrorResult = (props) => {
  return (
    <div className="text-center">
      <div className="message error" style={{margin: '2em', paddingTop: '30px', paddingLeft: '5px'}}>
        <div className="fa-stack fa-lg" style={{margin: 'auto'}}>
          <i className="fa fa-square-o fa-stack-2x"/>
          <i className="fa fa-warning fa-stack-1x"/>
        </div>
        <div className="text-center">
          <h3>Status code : {props.result.statusCode}</h3>
        </div>
        <div className="text-center">
          <h3>Module not found</h3>
        </div>
      </div>
    </div>
  );
};

const Result = (props) => {
  const error = (props.result.statusCode !== 200) || !props.result.body.found;
  console.log(props);
  if (error) {
    return <ErrorResult result={props.result}/>;
  }
  return <SuccessResult result={props.result}/>;
};


class TestArtifact extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {waiting: true, result: {}};
  }

  componentDidMount() {
    this.setState({waiting: true});
    this.props.onTest(this.props.artifact).then(
      r => this.setState({waiting: false, result: r}));
  }

  render() {
    const waiting = (this.state.waiting) ? <TimeSpinner/> : <Result result={this.state.result}/>;

    return (
      <Modal show={true} onHide={this.props.onHide} bsSize="lg" aria-labelledby="contained-modal-title-sm">
        <ModalHeader>
          <ModalTitle>Get Version of Nexus</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <div className="text-center">
            <h3>{this.props.artifact.name}</h3>
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
