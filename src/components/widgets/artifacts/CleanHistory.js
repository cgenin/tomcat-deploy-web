import React from 'react';
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import { clean } from '../../../modules/artifacts/actions';
import {OverlayStyle, StyleFabButt} from '../../Styles';

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onAction(nb) {
      return dispatch(clean(nb));
    }
  };
};

class CleanHistory extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {nb: 5};
  }

  componentDidUpdate() {
    if (this.props.x && this.props.y && this.refs.myRefString) {
      ReactDOM.findDOMNode(this.refs.myRefString).style.left = this.props.x + 'px';
      ReactDOM.findDOMNode(this.refs.myRefString).style.top = this.props.y + 'px';
    }
  }

  onChange() {
    const nb = this.refs.nb.value;
    this.setState({nb});
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
    }

    this.props.onAction(this.state.nb).then(this.props.onHide());
  }

  render() {
    const style = Object.assign({}, OverlayStyle, {width: '25em'});
    return (
      <Overlay show={this.props.show}
               onHide={() => this.props.onHide()}
               placement="bottom">
        <div ref="myRefString" style={style}>
          <div className="text-center" style={{fontSize: '24px'}}>
            <strong>Clean History</strong>
          </div>
          <form className="form-horizontal">
            <fieldset>
              <div className="form-group" style={{marginTop: '7px'}}>
                <label htmlFor="inputEmail" className="col-md-3 control-label">Keep Last</label>
                <div className="col-md-5">
                  <input type="number" ref="nb" defaultValue={this.state.nb} onChange={this.onChange} className="form-control"
                         id="inputEmail" placeholder="Number"/>
                </div>
                <label className="col-md-3 control-label">artifacts !</label>
              </div>
            </fieldset>
          </form>
          <div className="text-right">
            <button className="btn btn-danger btn-fab btn-fab-mini" onClick={() => this.props.onHide()} title="close"
                    style={StyleFabButt}><i className="material-icons">clear</i></button>
            <button className="btn btn-primary btn-fab btn-fab-mini" title="Go clean !"
                    disabled={this.state.nb < 1} onClick={this.onClick} style={StyleFabButt}>
              <i className="material-icons">directions_walk</i>
            </button>
          </div>
        </div>
      </Overlay>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CleanHistory);
