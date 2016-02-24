import React from 'react';
import { connect} from 'react-redux';
import ReactDOM from 'react-dom';
import { routeActions } from 'react-router-redux';
import {Overlay} from 'react-bootstrap';
import {OverlayStyle} from '../../Styles';
import { load, del } from '../../../modules/server/actions';
import { updateServers } from '../../../modules/actions/actions';

const mapStateToProps = function (state) {
  const servers = state.servers;
  return {servers};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onEdit: function (server) {
      dispatch(routeActions.push(
        {
          pathname: '/server/edit',
          query: {i: server.host}
        }));
    },
    onDelete: function (server) {
      dispatch(del(server)).then((data) => {
        if (!data || data.length === 0) {
          dispatch(updateServers([]));
        } else {
          dispatch(updateServers(Array.of(data[0])));
        }
      });
    },
    onAdd: function () {
      dispatch(routeActions.push('/server/add'));
    },
    onInit: function () {
      dispatch(load()).then((data) => {
        if (!data || data.length === 0) {
          dispatch(updateServers([]));
        } else {
          dispatch(updateServers(Array.of(data[0])));
        }
      });
    },
    onSelect: function (server) {
      dispatch(updateServers(Array.of(server)));
    }
  };
};


class ServerActions extends React.Component {
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {show: false};
  }

  componentDidMount() {
    this.props.onInit();
  }

  onEdit(e) {
    e.preventDefault();
    const index = this.refs.current.value;
    const server = this.props.servers[index];
    this.props.onEdit(server);
    return false;
  }

  onCreate(e) {
    e.preventDefault();
    this.props.onAdd();
    return false;
  }

  onDelete(e) {
    this.toggle(e);
    const index = this.refs.current.value;
    const server = this.props.servers[index];
    this.props.onDelete(server);
    return false;
  }

  toggle(e) {
    if (e) {
      e.preventDefault();
    }
    this.setState({show: !this.state.show});
    return false;
  }

  onChange(e) {
    if (e) {
      e.preventDefault();
    }
    const index = this.refs.current.value;
    const server = this.props.servers[index];
    this.props.onSelect(server);
    return false;
  }

  render() {

    const styleButt = {marginRight: '5px', marginLeft: '5px'};
    const options = this.props.servers.map((s, i) => (<option key={i} value={i}>{s.host}</option>));
    const disabled = this.props.servers.length === 0;
    return (
      <div className="row">
        <div className="col-md-3 col-md-offset-4 col-xs-12 text-right ">
          <div className="form-group">
            <select ref="current" className="form-control" onChange={this.onChange} style={{marginTop: '-28px'}}>
              {options}
            </select>
          </div>
        </div>
        <div className="col-md-5 col-xs-12  text-left">
          <div className="btn-group-sm">
            <a onClick={this.onEdit} className="btn btn-xs btn-success btn-fab" title="Edit current server"
               disabled={disabled} style={styleButt}>
              <i className="material-icons">create</i>
            </a>
            <a onClick={this.onCreate} className="btn btn-xs btn-primary btn-fab" title="Add an server"
               style={styleButt}
            >
              <i className="material-icons">add</i>
            </a>
            <button ref="target" onClick={this.toggle} className="btn btn-xs btn-danger btn-fab"
                    title="Remove an server" disabled={disabled} style={styleButt}>
              <i className="material-icons">remove</i>
            </button>
          </div>
          <Overlay
            show={this.state.show} onHide={() => this.setState({ show: false })} placement="bottom" container={this}
            target={() => ReactDOM.findDOMNode(this.refs.target)}>
            <div style={OverlayStyle}>
              <strong>Are you sure to delete ?</strong> <a href="#" onClick={this.onDelete}>Yes</a>&nbsp;/&nbsp;
              <a href="#" onClick={this.toggle}>No</a>
            </div>
          </Overlay>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);
