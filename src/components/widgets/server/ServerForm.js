import React from 'react';
import {connect} from 'react-redux';
import {Form, Input, Row, Col, Button} from 'antd';
import TestModal from '../test/TestModal';
import {save, load} from '../../../modules/server/actions';
import {testServer} from '../../../modules/test/actions';
import {withRouter} from 'react-router';
import PropTypes from 'prop-types';
import {HOME} from "../../../routesConstant";
import {formMidItemLayout, formItemLayout} from '../../Styles';
import './ServerForm.css';

const FormItem = Form.Item;

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
      <div id="server-edition">
        <Form onSubmit={this.onClick}>
          <FormItem {...formItemLayout} label="Name">
            <Input value={this.state.server.name} onChange={this.onChange('name')}
                   placeholder="The title in the interface"/>
          </FormItem>
          <FormItem {...formItemLayout} label="Server">
            <Input value={this.state.server.host} onChange={this.onChange('host')} addonBefore="http://"
                   addonAfter="/manager/text" placeholder="host:port"/>
          </FormItem>
          <Row>
            <Col span={12}>
              <FormItem {...formMidItemLayout} label="User">
                <Input value={this.state.server.username} onChange={this.onChange('username')}
                       placeholder="User login"/>
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formMidItemLayout} label="Password">
                <Input type="password" value={this.state.server.password} onChange={this.onChange('password')}
                       placeholder="User Password"/>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8} className="button-container ">
              <Button size="large" onClick={this.onBack}>
                <li className="fa fa-backward"/>
                &nbsp;Cancel
              </Button>
            </Col>
            <Col span={8} className="button-container ">
              <Button size="large" className="gold-6" onClick={this.onTest} disabled={this.state.disabled} icon="up-circle">
                &nbsp;Test
              </Button>
            </Col>
            <Col span={8} className="button-container ">
              <Button size="large" type="primary" onClick={this.onClick} disabled={this.state.disabled} icon="check">
                &nbsp;Submit
              </Button>
            </Col>
          </Row>
        </Form>
        <TestModal visible={this.state.testShow} onHide={() => this.setState({testShow: false})}/>
      </div>
    );
  }
}

Edition.propTypes = {server: PropTypes.object.isRequired, add: PropTypes.bool.isRequired};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Edition));
