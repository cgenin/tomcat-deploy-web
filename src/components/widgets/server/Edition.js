import React from 'react';
import {connect} from 'react-redux';
import TestModal from '../test/TestModal';
import {save, load} from '../../../modules/server/actions';
import {testServer} from '../../../modules/test/actions';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';
import {HOME} from "../../../routesConstant";

function isDisabled(server) {
  return !server.host || server.host.length === 0 || !server.username || server.username.length === 0
    || !server.password || server.password.length === 0;
}

const mapStateToProps = function (state, ownProps) {
  if (ownProps.add === true) {
    return {server: {}, disabled: true};
  }
  const server = state.servers.find(s => `${s.$loki}` === ownProps.id);
  if (!server) {
    return {server: {}, disabled: true};
  }
  return {server};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (server, history) {
      dispatch(save(server)).then(() => history.push(HOME.path()));
    },
    onTest: function (host, username, password) {
      dispatch(testServer(host, username, password));
    },
    onInit: function () {
      dispatch(load());
    }
  };
};


class Edition extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.onTest = this.onTest.bind(this);
    this.onBack = this.onBack.bind(this);
    this._update = this._update.bind(this);
    this.state = {
      server: {},
      disabled: true,
      testShow: false
    };
  }

  componentWillMount() {
    const server = this.props.server;
    this._update(server);
  }

  _update(server) {
    const disabled = isDisabled(server);
    this.setState({server, disabled});
  }

  componentDidMount() {
    this.props.onInit();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.server.$loki !== nextProps.server.$loki) {
      this._update(nextProps.server);
    }
  }


  onBack(e) {
    e.preventDefault();
    this.props.history.push(HOME.path());
  }

  onClick(e) {
    e.preventDefault();
    const server = Object.assign({}, this.props.server, this.state.server);
    this.props.onSave(server, this.props.history);
    return false;
  }

  onTest(e) {
    e.preventDefault();
    this.setState({testShow: true});
    const {host, username, password} = this.state.server;
    this.props.onTest(host, username, password);
  }

  onChange(attr) {
    return (e) => {
      e.preventDefault();
      const {host, name, username, password} = this.state.server;
      const server = {host, name, username, password};
      server[attr] = e.target.value;
      this._update(server);
    }

  }


  render() {
    return (
      <div className="row">
        <form className="form-inline">
          <div className="col-xs-12">
            <div className="form-group col-xs-12">
              <label htmlFor="name" className="hidden-sm">Name :&nbsp;&nbsp;</label>
              <input type="text" id="name" className="form-control"
                     value={this.state.server.name} aria-label="The title" style={{width: '60%'}}
                     placeholder="The title in the interface" onChange={this.onChange('name')}/>
            </div>
          </div>

          <div className=" col-xs-12">

            <div className="form-group col-xs-12">
              <label htmlFor="server" className="hidden-sm">Server :&nbsp;&nbsp;</label>

              <div className="input-group col-xs-11">
                <span className="input-group-addon">http://</span>
                <input type="text" id="server" className="form-control"
                       value={this.state.server.host} aria-label="host:port"
                       placeholder="host:port" onChange={this.onChange('host')}
                />
                <span className="input-group-addon">/manager/text</span>
              </div>
            </div>
          </div>
          <div className="col-md-5 col-xs-12">
            <div className="form-group col-xs-12">
              <label htmlFor="user" className="hidden-sm">User :&nbsp;&nbsp;</label>
              <input type="text" className="form-control" id="user" style={{width: '70%'}}
                     value={this.state.server.username} onChange={this.onChange('username')}
                     placeholder="User"
              />
            </div>
          </div>
          <div className="col-md-6 col-xs-12">
            <div className="form-group col-xs-12">
              <label htmlFor="password" className="hidden-sm">Password :&nbsp;&nbsp;</label>
              <input type="password" className="form-control" id="password" style={{width: '60%'}}
                     value={this.state.server.password} onChange={this.onChange('password')} placeholder="Password"
              />
            </div>
          </div>
          <div className="col-xs-4 text-center">
            <button type="button" onClick={this.onBack} className="btn btn-default">
              <li className="fa fa-backward"/>
              &nbsp;Cancel
            </button>
          </div>
          <div className=" col-xs-4 text-center">
            <button type="button" onClick={this.onTest} className="btn btn-warning" disabled={this.state.disabled}>
              <li className="glyphicon glyphicon-transfer"/>
              &nbsp;Test
            </button>
          </div>
          <div className=" col-xs-4 text-center">
            <button type="button" onClick={this.onClick} className="btn btn-primary" disabled={this.state.disabled}>
              <li className="glyphicon glyphicon-ok"/>
              &nbsp;Submit
            </button>
          </div>
        </form>
        <TestModal show={this.state.testShow} onHide={() => this.setState({testShow: false})}/>
      </div>
    );
  }
}

Edition.propTypes = {server: PropTypes.object.isRequired, add: PropTypes.bool.isRequired};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edition));
