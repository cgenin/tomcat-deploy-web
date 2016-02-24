import React from 'react';
import { connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {Overlay} from 'react-bootstrap';
import {OverlayStyle} from '../../Styles';

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts
  };
};

const mapDispatchToProps = function (dispatch) {

  return {
    onInit() {
    }
  };
};

class CleanHistory extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidUpdate() {
    if (this.props.x && this.props.y) {
      ReactDOM.findDOMNode(this.refs.myRefString).style.left = this.props.x + 'px';
      ReactDOM.findDOMNode(this.refs.myRefString).style.top = this.props.y + 'px';
    }
  }

  render() {
    return (
      <Overlay show={this.props.show}
               onHide={() => this.props.onHide()}
               placement="bottom" rootClose={true}>
        <div ref="myRefString" style={OverlayStyle}>
          <strong>TEST</strong>
        </div>
      </Overlay>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CleanHistory);