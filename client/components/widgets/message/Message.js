import React from 'react';
import { connect} from 'react-redux';
import { hide, TYPE_ERROR, TYPE_SUCCESS } from '../../../modules/message/actions';

const mapStateToProps = function (state) {
  return {
    message: state.messaging
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onHide: function () {
      dispatch(hide());
    }
  };
};


class MessageSuccess extends React.Component {
  render() {
    return (
      <div className="success message">
        <h3>Success - {this.props.text}</h3>
      </div>
    );
  }
}

MessageSuccess.propTypes = {text: React.PropTypes.string.isRequired};

class MessageError extends React.Component {
  render() {
    return (
      <div className="error message">
        <h3>Error - {this.props.text}</h3>
      </div>
    );
  }
}

MessageError.propTypes = {text: React.PropTypes.string.isRequired};

class Message extends React.Component {
  componentWillReceiveProps(nextProps) {
    if (nextProps.message.show && nextProps.message.show !== this.props.message.show) {
      setTimeout(() => this.props.onHide(), 5000);
    }
  }

  render() {
    if (!this.props.message.show) {
      return null;
    }
    switch (this.props.message.type) {
      case TYPE_SUCCESS:

        return (<MessageSuccess text={this.props.message.text}/>);
      case TYPE_ERROR :

        return (<MessageError text={this.props.message.text}/>);
      default :
        return null;
    }
  }
}

Message.propTypes = {message: React.PropTypes.object.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Message);