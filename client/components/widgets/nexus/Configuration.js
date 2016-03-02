import React from 'react';
import { connect} from 'react-redux';
import ReactDOM from 'react-dom';
import {Overlay} from 'react-bootstrap';
import {OverlayStyle, StyleFabButt} from '../../Styles';
import {save, load} from '../../../modules/nexus/actions';

const mapStateToProps = function (state) {
  const nexus = state.nexus;
  return {nexus};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onInit() {
      dispatch(load());
    },
    onAction(nexus) {
      return dispatch(save(nexus));
    }
  };
};

class Configuration extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {nexus: {host: '', port: ''}};
  }

  componentDidMount() {
    this.props.onInit();
  }

  componentWillMount() {
    const nexus = this.props.nexus || {};
    this.setState({nexus});
  }

  componentWillReceiveProps(nextProps) {
    const nexus = nextProps.nexus || {};
    this.setState({nexus});
  }

  componentDidUpdate() {
    if (this.props.x && this.props.y && this.refs.position) {
      ReactDOM.findDOMNode(this.refs.position).style.left = this.props.x + 'px';
      ReactDOM.findDOMNode(this.refs.position).style.top = this.props.y + 'px';
    }
  }

  onChange() {
    const nexus = Object.assign({}, this.state.nexus);
    nexus.host = this.refs.host.value;
    nexus.port = this.refs.port.value;
    this.setState({nexus});
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
    }
    console.log(this.state.nexus)
    this.props.onAction(this.state.nexus).then(() => this.props.onHide());
  }

  render() {
    const style = Object.assign({}, OverlayStyle, {width: '25em'});
    const formGroupStyle = {marginTop: '0px', marginLeft: '0px', marginRight: '0px'};
    return (
      <Overlay show={this.props.show}
               onHide={() => this.props.onHide()}
               placement="bottom">
        <div ref="position" style={style}>
          <div className="text-center" style={{fontSize: '24px'}}>
            <strong>Nexus Configuration</strong>
          </div>
          <form className="form-horizontal">
            <fieldset>
              <div className="form-group" style={formGroupStyle}>
                <label className="control-label" htmlFor="host">Host</label>
                <input type="text" className="form-control" id="host" placeholder="Host of nexus"
                       value={this.state.nexus.host} onChange={this.onChange} ref="host"
                />
              </div>
              <div className="form-group" style={formGroupStyle}>
                <label className="control-label" htmlFor="port">Port</label>
                <input type="number" className="form-control" id="port" placeholder="Default to 80"
                       value={this.state.nexus.port} onChange={this.onChange} ref="port"
                />
              </div>
            </fieldset>
          </form>
          <div className="text-right">
            <button className="btn btn-danger btn-fab btn-fab-mini" onClick={() => this.props.onHide()} title="close"
                    style={StyleFabButt}><i className="material-icons">clear</i></button>
            <button className="btn btn-primary btn-fab btn-fab-mini" title="Save"
                    disabled={this.state.nexus.host === '' } onClick={this.onClick} style={StyleFabButt}>
              <i className="material-icons">library_add</i>
            </button>
          </div>
        </div>
      </Overlay>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Configuration);