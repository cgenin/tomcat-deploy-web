import React from 'react';
import { connect} from 'react-redux';
import { Modal, ModalFooter, ModalHeader, ModalTitle, ModalBody, Button} from 'react-bootstrap';

const mapStateToProps = function (state) {
  const test = state.testUrl;
  return {
    test
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onTest() {
    }
  };
};

class TestModal extends React.Component {
  render() {
    const inProgress = (this.props.test.inProgress) ? (<div className="text-center"><i className="fa fa-refresh fa-spin fa-4x" /></div>) : null;
    return (
      <Modal {...this.props} bsSize="large" aria-labelledby="contained-modal-title-sm">
        <ModalHeader closeButton>
          <ModalTitle>Connection to ...</ModalTitle>
        </ModalHeader>
        <ModalBody>
          <h3>{ this.props.test.url}</h3>
          {inProgress}
        </ModalBody>
        <ModalFooter>
          <Button onClick={this.props.onHide}>Close</Button>
        </ModalFooter>
      </Modal>
    );
  }
}
export default connect(mapStateToProps, mapDispatchToProps)(TestModal);