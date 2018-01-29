import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button} from 'antd';
import './TestModal.css';

const mapStateToProps = function (state) {
  const test = state.testUrl;
  return {
    test
  };
};

const Success = (props) => {
  return (
    <div className="test-modal-body">
        <span className="fa-stack fa-lg icon">
          <i className="fa fa-circle fa-stack-2x first" style={{color: '#71c341'}}/>
          <i className="fa fa-check fa-stack-1x  fa-inverse second"/>
        </span>
      <div>
        <pre style={{textAlign: 'justify'}}>{props.response}</pre>
      </div>
    </div>
  );
}

const Error = (props) => {
  return (
    <div className="test-modal-body">
        <span className="fa-stack fa-lg icon">
          <i className="fa fa-circle fa-stack-2x first" style={{color: 'darkred'}}/>
          <i className="fa fa-exclamation fa-stack-1x fa-inverse second"/>
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
    <Modal  visible={props.visible}
            onCancel={props.onHide}
           footer={[<Button onClick={props.onHide}>Close</Button>]}
           title="Connection to ...">
      <p>{props.test.url} :</p>
      {inProgress}
      {success}
      {error}
    </Modal>
  );
};

export default connect(mapStateToProps)(TestModal);
