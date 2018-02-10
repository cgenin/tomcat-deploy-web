import React, {PureComponent} from 'react';
import {Modal, Button} from 'antd';
import {test} from '../../../modules/schedulers/actions';
import PropTypes from "prop-types";
import moment from 'moment';
import {okColor, koColor} from '../../Styles';
import '../TestModal.css'

const Success = (props) => {
  const {nextDates} = props;
  return (
    <div className="test-modal-body">
        <span className="fa-stack fa-lg icon">
          <i className="fa fa-circle fa-stack-2x first" style={okColor}/>
          <i className="fa fa-check fa-stack-1x  fa-inverse second"/>
        </span>
      <div>
        <pre style={{textAlign: 'justify'}}>Valid cron expression</pre>
        <p>
          Next Execution : {moment(nextDates).format()}.
        </p>
      </div>
    </div>
  );
};

const Error = (props) => {
  const {message} = props;
  return (
    <div className="test-modal-body">
        <span className="fa-stack fa-lg icon">
          <i className="fa fa-circle fa-stack-2x first" style={koColor}/>
          <i className="fa fa-exclamation fa-stack-1x fa-inverse second"/>
        </span>
      <div>
        <h2>Invalid expression</h2>
        <h2>{message}</h2>
      </div>
      <div>
      </div>
    </div>
  );
};


class TestCronModal extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {inProgress: true};
  }

  componentDidMount() {
    test(this.props.cron)
      .then(res => {
        const newState = Object.assign({}, res, {inProgress: false});
        this.setState(newState);
      })
      .catch(err => {
        this.setState({valid: false, err, inProgress: false});
      })
  }

  render() {
    const inProgress = (this.state.inProgress) ? (
      <div className="text-center"><i className="fa fa-refresh fa-spin fa-4x"/></div>) : null;
    const success = (!this.state.inProgress && this.state.valid) ? (
      <Success {...this.state}/>) : null;
    const error = (!this.state.inProgress && !this.state.valid) ? (
      <Error {...this.state}/>) : null;
    return (
      <Modal visible={true}
             onCancel={this.props.onHide}
             footer={[<Button onClick={this.props.onHide}>Close</Button>]}
             title={`test '${this.props.cron}'`}>
        {inProgress}
        {success}
        {error}
      </Modal>
    );
  }
}

TestCronModal.propTypes = {onHide: PropTypes.func.isRequired, cron: PropTypes.string.isRequired};

export default TestCronModal;
