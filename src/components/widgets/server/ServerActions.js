import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import ReactDOM from 'react-dom';
import Overlay from 'react-bootstrap/lib/Overlay';
import {EDIT_SERVER} from '../../../routesConstant';
import {OverlayStyle, StyleFabButt} from '../../Styles';
import {load, del} from '../../../modules/server/actions';
import {updateServers} from '../../../modules/actions/actions';

const mapStateToProps = function (state) {
  const servers = state.servers;
  return {servers};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onDelete: function (server) {
      dispatch(del(server)).then((data) => {
        if (!data || data.length === 0) {
          dispatch(updateServers([]));
        } else {
          dispatch(updateServers(Array.of(data[0])));
        }
      });
    },

    onInit: function () {
      dispatch(load()).then((data) => {
          dispatch(updateServers([]));
      });
    },
    onSelect: function (server) {
      dispatch(updateServers(Array.of(server || [])));
    }
  };
};


class ServerActions extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {show: false};
    this.onEdit = this.onEdit.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.onChange = this.onChange.bind(this);
    this.toggle = this.toggle.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  onEdit(e) {
    e.preventDefault();
    const index = this.refs.current.value;
    const server = this.props.servers[index];
    this.props.history.push(
      {
        pathname: EDIT_SERVER.path(server.$loki)
      });
    return false;
  }

  onCreate(e) {
    e.preventDefault();
    this.props.history.push('/server/add');
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
    const options = this.props.servers.map((s, i) => (<option key={i} value={i}>{s.name} ({s.host})</option>));
    const disabled = this.props.servers.length === 0;
    return (
      <div className="row">
        <div className="col-sm-3 col-sm-offset-4 col-xs-12 text-right ">
          <div className="form-group">
            <select ref="current" className="form-control" onChange={this.onChange} style={{marginTop: '-28px'}}>
              <option value="" selected/>
              {options}
            </select>
          </div>
        </div>
        <div className="col-sm-offset-0 col-sm-5 col-xs-offset-3 col-xs-6  text-left">
          <div className="btn-group-sm">
            <a onClick={this.onEdit} className="btn btn-xs btn-success btn-fab" title="Edit current server"
               disabled={disabled} style={StyleFabButt}>
              <i className="material-icons">create</i>
            </a>
            <a onClick={this.onCreate} className="btn btn-xs btn-primary btn-fab" title="Add an server"
               style={StyleFabButt}
            >
              <i className="material-icons">add</i>
            </a>
            <button ref="target" onClick={this.toggle} className="btn btn-xs btn-danger btn-fab"
                    title="Remove an server" disabled={disabled} style={StyleFabButt}>
              <i className="material-icons">remove</i>
            </button>
          </div>
          <Overlay
            show={this.state.show} onHide={() => this.setState({show: false})} placement="bottom" container={this}
            target={() => ReactDOM.findDOMNode(this.refs.target)}>
            <div style={OverlayStyle}>
              <strong>Are you sure to delete ?</strong> <a href="/" onClick={this.onDelete}>Yes</a>&nbsp;/&nbsp;
              <a href="/" onClick={this.toggle}>No</a>
            </div>
          </Overlay>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServerActions));
