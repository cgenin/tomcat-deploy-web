import React from 'react';
import {connect} from 'react-redux';
import Modal from 'react-bootstrap/lib/Modal';
import ModalFooter from 'react-bootstrap/lib/ModalFooter';
import ModalHeader from 'react-bootstrap/lib/ModalHeader';
import ModalTitle from 'react-bootstrap/lib/ModalTitle';
import ModalBody from 'react-bootstrap/lib/ModalBody';
import Button from 'react-bootstrap/lib/Button';

const mapStateToProps = function (state) {
  const test = state.testUrl;
  return {
    test
  };
};

const Success = (props) => {
  return (
    <div className="text-center" style={{marginRight: 'auto', marginLeft: 'auto'}}>
        <span className="fa-stack fa-lg" style={{width: '4em', height: '4em', lineHeight: '4em'}}>
          <i className="fa fa-circle fa-stack-2x " style={{fontSize: '4em', color: '#71c341'}}/>
          <i className="fa fa-check fa-stack-1x  fa-inverse" style={{fontSize: '2em'}}/>
        </span>
      <div>
        <pre style={{textAlign: 'justify'}}>{props.response}</pre>
      </div>
    </div>
  );
}

const Error = (props) => {
  return (
    <div className="text-center" style={{marginRight: 'auto', marginLeft: 'auto'}}>
        <span className="fa-stack fa-lg" style={{width: '4em', height: '4em', lineHeight: '4em'}}>
          <i className="fa fa-circle fa-stack-2x " style={{fontSize: '4em', color: 'darkred'}}/>
          <i className="fa fa-exclamation fa-stack-1x  fa-inverse" style={{fontSize: '2em'}}/>
        </span>
      <div>
        <h2>Code : {props.code}</h2>
      </div>
      <div>
        <pre style={{textAlign: 'justify'}}>{props.response}</pre>
      </div>
    </div>
  );
};

const TestModal = (props) => {
  const inProgress = (props.test.inProgress) ? (
    <div className="text-center"><i className="fa fa-refresh fa-spin fa-4x"/></div>) : null;
  const success = (!props.test.inProgress && props.test.success) ? (
    <Success response={props.test.response}/>) : null;
  const error = (!props.test.inProgress && !props.test.success) ? (
    <Error response={props.test.response} code={props.test.code}/>) : null;
  return (
    <Modal {...props} bsSize="lg" aria-labelledby="contained-modal-title-sm">
      <ModalHeader closeButton>
        <ModalTitle>Connection to ...</ModalTitle>
      </ModalHeader>
      <ModalBody>
        <p>{props.test.url} :</p>
        {inProgress}
        {success}
        {error}
      </ModalBody>
      <ModalFooter>
        <Button onClick={props.onHide}>Close</Button>
      </ModalFooter>
    </Modal>
  );
};

export default connect(mapStateToProps)(TestModal);
