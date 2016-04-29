import React from 'react';
import connect from 'react-redux/lib/components/connect';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import {OverlayStyle, StyleFabButt} from '../../Styles';

import TestForm from './TestForm';

import {save, load} from '../../../modules/nexus/actions';


const mapStateToProps = function (state) {
  const nexus = state.nexus;
  return { nexus };
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

const style = Object.assign({}, OverlayStyle, { width: '25em' });

class FormPage extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = { nexus: { host: '', port: '' }, test: false };
  }


  onChange() {
    const nexus = Object.assign({}, this.state.nexus);
    nexus.host = this.refs.host.value;
    nexus.port = this.refs.port.value;
    this.props.onSaveState(nexus);
  }

  onClick(e) {
    if (e) {
      e.preventDefault();
    }
    this.props.onAction(this.props.nexus).then(() => this.props.onHide());
  }

  render() {
    const formGroupStyle = { marginTop: '0px', marginLeft: '0px', marginRight: '0px' };
    return (
      <div >
        <div className="text-center" style={{fontSize: '24px'}}>
          <strong>Nexus Configuration</strong>
        </div>
        <form className="form-horizontal">
          <fieldset>
            <div className="form-group" style={formGroupStyle}>
              <label className="control-label" htmlFor="host">Host</label>
              <input type="text" className="form-control" id="host" placeholder="Host of nexus"
                     value={this.props.nexus.host} onChange={this.onChange} ref="host"
              />
            </div>
            <div className="form-group" style={formGroupStyle}>
              <label className="control-label" htmlFor="port">Port</label>
              <input type="number" className="form-control" id="port" placeholder="Default to 80"
                     value={this.props.nexus.port} onChange={this.onChange} ref="port"
              />
            </div>
          </fieldset>
        </form>
        <div className="text-right">
          <button className="btn btn-default btn-fab btn-fab-mini" onClick={() => this.props.onTest()}
                  title="Test connection"
                  style={StyleFabButt}><i className="material-icons" style={{color: 'black'}}>swap_vert</i></button>
          <button className="btn btn-danger btn-fab btn-fab-mini" onClick={() => this.props.onHide()} title="close"
                  style={StyleFabButt}><i className="material-icons">clear</i></button>
          <button className="btn btn-primary btn-fab btn-fab-mini" title="Save"
                  disabled={this.props.nexus.host === '' } onClick={this.onClick} style={StyleFabButt}>
            <i className="material-icons">library_add</i>
          </button>
        </div>
      </div>
    );
  }
}

class View extends React.Component {

  constructor(props) {
    super(props);
    this.state = { nexus: { host: '', port: '' }, test: false };
    this.handleTest = this.handleTest.bind(this);
  }

  componentWillMount() {
    const nexus = this.props.nexus || {};
    this.setState({ nexus });
  }

  componentWillReceiveProps(nextProps) {
    const nexus = nextProps.nexus || {};
    this.setState({ nexus });
  }

  handleTest() {
    const test = !this.state.test;
    this.setState({ test });
  }

  render() {
    const vnexus = this.state.nexus || {};
    const testPage = (this.state.test) ?
      <TestForm host={vnexus.host} port={vnexus.port} onClose={this.handleTest}/> : (
      <FormPage nexus={vnexus} onSaveState={(nexus) => this.setState({ nexus })}
                onTest={this.handleTest} onAction={this.props.onAction} onHide={this.props.onHide}/>);
    return (
      <div>
        {testPage}
      </div>
    );
  }
}

class Configuration extends React.Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.onInit();
  }

  componentDidUpdate() {
    if (this.props.x && this.props.y && this.refs.position) {
      ReactDOM.findDOMNode(this.refs.position).style.left = this.props.x + 'px';
      ReactDOM.findDOMNode(this.refs.position).style.top = this.props.y + 'px';
    }
  }


//
  render() {
    return (
      <Overlay show={this.props.show} onHide={() => this.props.onHide()} placement="bottom">
        <div ref="position" style={style}>
          <View nexus={this.props.nexus} onAction={this.props.onAction} onHide={() => this.props.onHide()}/>
        </div>
      </Overlay>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(Configuration);
