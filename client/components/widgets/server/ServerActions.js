import React from 'react';
import { connect} from 'react-redux';
import ReactDOM from 'react-dom';
import { routeActions } from 'react-router-redux';
import {Overlay} from 'react-bootstrap';
import { load, del } from '../../../modules/server/actions';

const mapStateToProps = function (state) {
  const servers = state.servers;
  return {servers};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onEdit: function (index) {
      dispatch(routeActions.push(
        {
          pathname: '/server/edit',
          query: {i: index}
        }));
    },
    onDelete: function (server) {
      dispatch(del(server));
    },
    onAdd: function () {
      dispatch(routeActions.push('/server/add'));
    },
    onInit: function () {
      dispatch(load());
    }
  };
};


class ServerActions extends React.Component {
  constructor(props) {
    super(props);
    this.onEdit = this.onEdit.bind(this);
    this.onCreate = this.onCreate.bind(this);
    this.onDelete = this.onDelete.bind(this);
    this.toggle = this.toggle.bind(this);
    this.state = {show: false};
  }

  componentDidMount() {
    this.props.onInit();
  }

  onEdit(e) {
    e.preventDefault();
    const index = this.refs.current.value;
    this.props.onEdit(index);
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

  render() {
    const style = {
      position: 'absolute',
      backgroundColor: '#EEE',
      boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
      border: '1px solid #CCC',
      borderRadius: 3,
      marginLeft: 10,
      marginTop: 10,
      padding: 10
    };
    const styleButt = {marginRight: '5px', marginLeft: '5px'};
    const options = this.props.servers.map((s, i) => (<option key={i} value={i}>{s.host}</option>));
    const disabled = this.props.servers.length === 0;
    return (
      <div className="row">
        <div className="col-md-3 col-md-offset-4 col-xs-12 text-right ">
          <div className="form-group">
            <select ref="current" className="form-control" style={{marginTop: '-28px'}}>
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
            <div style={style}>
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
