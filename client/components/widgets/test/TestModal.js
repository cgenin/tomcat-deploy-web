import React from 'react';
import { connect} from 'react-redux';
import { Modal, ModalFooter, ModalHeader, ModalTitle, ModalBody, Button} from 'react-bootstrap';

const mapStateToProps = function (state) {
  const test = state.testUrl;
  return {
    test
  };
};

class Success extends React.Component {
  render() {
    return (
      <div className="text-center" style={{marginRight: 'auto', marginLeft: 'auto'}}>
        <span className="fa-stack fa-lg" style={{width: '4em', height: '4em', lineHeight: '4em'}}>
          <i className="fa fa-circle fa-stack-2x " style={{fontSize: '4em', color: '#71c341'}}/>
          <i className="fa fa-check fa-stack-1x  fa-inverse" style={{fontSize: '2em'}}/>
        </span>
        <div>
          <pre style={{textAlign: 'justify'}}>{this.props.response}</pre>
        </div>
      </div>
    );
  }
}

class Error extends React.Component {
  render() {
    return (
      <div className="text-center" style={{marginRight: 'auto', marginLeft: 'auto'}}>
        <span className="fa-stack fa-lg" style={{width: '4em', height: '4em', lineHeight: '4em'}}>
          <i className="fa fa-circle fa-stack-2x " style={{fontSize: '4em', color: 'darkred'}}/>
          <i className="fa fa-exclamation fa-stack-1x  fa-inverse" style={{fontSize: '2em'}}/>
        </span>
        <div>
          <h2>Code : {this.props.code}</h2>
        </div>
        <div>
          <pre style={{textAlign: 'justify'}}>{this.props.response}</pre>
        </div>
      </div>
    );
  }
}

class TestModal extends React.Component {
  render() {
    const inProgress = (this.props.test.inProgress) ? (
      <div className="text-center"><i className="fa fa-refresh fa-spin fa-4x"/></div>) : null;
    const success = (this.props.test.success) ? (<Success response={this.props.test.response}/>) : null;
    const error = (!this.props.test.success) ? (<Error response={this.props.test.response} code={this.props.test.code}/>) : null;
    return (
      <Modal {...this.props} bsSize="lg" aria-labelledby="contained-modal-title-sm">
        <ModalHeader closeButton>
          <ModalTitle>Connection to ...</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <p>{ this.props.test.url} :</p>
          {inProgress}
          {success}
          {error}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default connect(mapStateToProps)(TestModal);
