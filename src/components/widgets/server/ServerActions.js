import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import {Row, Col, Select, Button, Popover} from 'antd'
import {EDIT_SERVER} from '../../../routesConstant';
import {load, del} from '../../../modules/server/actions';
import {updateServers} from '../../../modules/actions/actions';
import './ServerActions.css'

const Option = Select.Option;

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
    this.state = {show: false, server: null};
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
    const server = this.props.servers.find(s => s.name === this.state.server);
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
    const server = this.props.servers.find(s => s.name === this.state.server);
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

  onChange(value) {
    if (value === '') {
      this.setState({server: null});
      this.props.onSelect(null);
      return;
    }

    const server = this.props.servers.find(s => s.name === value);
    this.setState({server: value});
    this.props.onSelect(server);
  }


  render() {
    const options = this.props.servers.map((s) => (<Option key={`${s.name}`}>{s.name} ({s.host})</Option>));
    const disabled = this.props.servers.length === 0;
    const buttonEdit = (this.state.server) ? (
      <div className="button-container">
        <Button onClick={this.onEdit} type="success" title="Edit current server" shape="circle"
                size="large" disabled={disabled}>
          <i className="fa fa-edit"/>
        </Button>
      </div>
    ) : (<span/>);
    const buttonRemove = (this.state.server) ? (
      <div className="button-container">
        <Popover content={
          <div>
            <strong>Are you sure to delete ?</strong> <a href="/" onClick={this.onDelete}>Yes</a>&nbsp;/&nbsp;
            <a href="/" onClick={this.toggle}>No</a>
          </div>
        } trigger="click" visible={this.state.show} onVisibleChange={(show) => this.setState({show})}>
          <Button type="danger" shape="circle" size="large"
                  icon="minus" title="Remove an server" disabled={disabled}>
          </Button>
        </Popover>
      </div>
    ) : (<span/>);
    return (
      <div id="server-actions">
        <Row type="flex" justify="center">
          <Col sm={20} xs={24}>
            <div className="container">
              <Select className="select-server" value={this.state.server} onChange={this.onChange}>
                {options}
              </Select>
              {buttonEdit}
              <div className="button-container">
                <Button onClick={this.onCreate} title="Add an server" shape="circle" type="primary" size="large">
                  <i className="fa fa-plus"/>
                </Button>
              </div>
              {buttonRemove}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ServerActions));
