import React from 'react';
import { connect} from 'react-redux';
import { save } from '../../../modules/server/actions';
import { routeActions } from 'react-router-redux';

function isDisabled(server) {
  return !server.host || server.host.length === 0 || !server.username || server.username.length === 0
    || !server.password || server.password.length === 0;
}

const mapStateToProps = function (state, ownProps) {
  if (ownProps.add === true) {
    return {server: {}, disabled: true};
  }
  const server = state.servers[ownProps.id];
  return {server};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onBack: function () {
      dispatch(routeActions.push('/'));
    },
    onSave: function (server) {
      dispatch(save(server)).then(dispatch(routeActions.push('/')));
    }
  };
};


class Edition extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {
      server: {},
      disabled: true
    };
  }

  componentWillMount() {
    const server = this.props.server;
    const disabled = isDisabled(server);
    this.setState({server, disabled});
  }


  componentWillReceiveProps(newProps) {
    const server = newProps.server;
    const disabled = isDisabled(server);
    this.setState({server, disabled});
  }

  onClick(e) {
    e.preventDefault();
    const server = this.state.server;
    this.props.onSave(server);
    return false;
  }

  onChange(e) {
    e.preventDefault();
    const host = this.refs.host.value;
    const username = this.refs.username.value;
    const password = this.refs.password.value;
    const server = this.state.server;
    server.host = host;
    server.username = username;
    server.password = password;
    const disabled = isDisabled(server);
    this.setState({server, disabled});
  }

  render() {
    return (
      <div className="row">
        <form className="form-inline">
          <div className=" col-md-offset-2  col-md-8 col-xs-12">
            <div className="form-group col-xs-12">
              <label htmlFor="server" className="hidden-sm">Server :&nbsp;&nbsp;</label>

              <div className="input-group col-xs-11">
                <span className="input-group-addon">http://</span>
                <input type="text" id="server" className="form-control" ref="host"
                       value={this.state.server.host} aria-label="host:port"
                       placeholder="host:port" onChange={this.onChange}
                />
                <span className="input-group-addon">/manager/text</span>
              </div>
            </div>
          </div>
          <div className="col-md-offset-2 col-md-4 col-xs-12">
            <div className="form-group">
              <label htmlFor="user" className="hidden-sm">User :&nbsp;&nbsp;</label>
              <input type="text" className="form-control" id="user" ref="username"
                     value={this.state.server.username} onChange={this.onChange}
                     placeholder="User"
              />
            </div>
          </div>
          <div className="col-md-6 col-xs-12">
            <div className="form-group">
              <label htmlFor="password" className="hidden-sm">Password :&nbsp;&nbsp;</label>
              <input type="password" className="form-control" id="password" ref="password"
                     value={this.state.server.password} onChange={this.onChange} placeholder="Password"
              />
            </div>
          </div>
          <div className="col-xs-offset-4 col-xs-4">
            <button type="button" onClick={() => this.props.onBack()} className="btn btn-default">
              <li className="fa fa-backward"/>
              &nbsp;Cancel
            </button>
          </div>
          <div className=" col-xs-4">
            <button type="button" onClick={this.onClick} className="btn btn-primary" disabled={this.state.disabled}>
              <li className="glyphicon glyphicon-ok"/>
              &nbsp;Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

Edition.propTypes = {server: React.PropTypes.object.isRequired, add: React.PropTypes.bool.isRequired};


export default connect(mapStateToProps, mapDispatchToProps)(Edition);
