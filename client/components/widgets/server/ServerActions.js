import React from 'react';
import { connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
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
    e.preventDefault();
    const index = this.refs.current.value;
    const server = this.props.servers[index];
    this.props.onDelete(server);
    return false;
  }

  render() {
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
            <a href onClick={this.onEdit} className="btn btn-xs btn-success btn-fab" disabled={disabled}>
              <i className="material-icons">create</i>
            </a>
            <a href onClick={this.onCreate} className="btn btn-xs btn-primary btn-fab">
              <i className="material-icons">add</i>
            </a>
            <a href onClick={this.onDelete} className="btn btn-xs btn-danger btn-fab" disabled={disabled}>
              <i className="material-icons">remove</i>
            </a>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);
