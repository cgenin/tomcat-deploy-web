import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col, Card, Breadcrumb, Form, Input, Switch, DatePicker, TimePicker, Button, Alert} from 'antd';
import moment from 'moment';
import {HOME} from "../../../routesConstant";
import {add} from "../../../modules/schedulers/actions";
import Title from "../../widgets/Title";
import {withRouter} from "react-router";
import './Scheduler.css';

const FormItem = Form.Item;

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  const type = query.type;
  const {schedulers, actions, nexus} = state;
  const {artifacts, servers} = actions;
  return {schedulers, type, artifacts, nexus, servers};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (scheduler, history) {
      dispatch(add(scheduler))
        .then(() => history.push(HOME.path()));
    },
  };
};

const Error = ({}) => {
  return (
    <Alert
      message="No artifacts found. Surely, you have reloaded this page. select another time the components for adding a new scheduler's job"
      type="error" showIcon/>

  );
};

const NexusDatas = ({nexus, servers}) => {
  if (nexus.length === 0) {
    return <Error/>;
  }

  const {name, host} = servers[0] || {};
  const lis = nexus.map((n, i) => {
    return (
      <li key={i}><strong>{n.groupId}.{n.artifactId}</strong> : {n.version} </li>
    )
  });
  return (
    <div className="deploy-types">
      <h4>Nexus artifact to deploy : </h4>
      <ul>
        {lis}
      </ul>
      <h4>to {name} ({host})</h4>
    </div>
  )
};

const JobsDatas = ({artifacts, servers}) => {
  if (artifacts.length === 0) {
    return <Error/>;
  }
  const {name, host} = servers[0] || {};
  const lis = artifacts.map((a, i) => {
    return (
      <li key={i}><strong>{a.job}</strong></li>
    )
  });
  return (
    <div className="deploy-types">
      <h4>Nexus artifact to deploy : </h4>
      <ul>
        {lis}
      </ul>
      <h4>to {name} ({host})</h4>
    </div>
  )
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

const hasNoDeployements = (props) => {
  return (props.type === 'job') ? props.artifacts === 0 : props.nexus === 0;
}

const defOffset = 8;

const cromLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: defOffset},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 10},
  },
};

class Scheduler extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {selectedDate: true, name: ''};
    this.onBack = this.onBack.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onChangeDate = this.onChangeDate.bind(this);
    this.onChangeTime = this.onChangeTime.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this.state);
    const {te, dt, name, selectedDate, cron} = this.state;
    const obj = {name};
    if (selectedDate) {
      obj.date = moment(dt)
        .set('hour', te.get('hour'))
        .set('minute', te.get('minute'))
        .set('second', 0)
        .toDate();

    } else {
      obj.cron = cron;
    }
    console.log(obj);
  }

  onChange(attr) {
    return (e) => {
      const state = Object.assign({}, this.state);
      state[attr] = e.target.value;
      this.setState(state);

      //this.props.form.setFieldsValue(Object.assign({}, state))
    };
  }

  onBack() {
    this.props.history.push(HOME.path());
  }

  onChangeDate(dt) {
    this.setState({dt});
    this.props.form.setFieldsValue({date: dt});
  }

  onChangeTime(te) {
    this.setState({te});
    this.props.form.setFieldsValue({time: te});
  }

  componentDidMount() {
    // To disabled submit button at the beginning.
    this.props.form.validateFields();
  }

  render() {
    const {getFieldDecorator, isFieldTouched, getFieldError, getFieldsError} = this.props.form;

    // Only show error after a field is touched.
    const nameError = isFieldTouched('name') && getFieldError('name');
    const dateError = isFieldTouched('date') && getFieldError('date');
    const timeError = isFieldTouched('time') && getFieldError('time');
    const cronError = isFieldTouched('cron') && getFieldError('cron');

    const formDateOrCron = (this.state.selectedDate) ?
      (

        <div>
          <Row>
            <Col span={4} offset={defOffset}>
              <FormItem validateStatus={dateError ? 'error' : ''}
                        help={dateError || ''} label="Date">
                {
                  getFieldDecorator('date', {
                    rules: [{required: true, message: 'Please input the date!'}],
                  })(
                    <DatePicker onChange={this.onChangeDate}/>
                  )
                }
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem validateStatus={timeError ? 'error' : ''}
                        help={timeError || ''} label="Time">
                {
                  getFieldDecorator('time', {
                    rules: [{required: true, message: 'Please input the time !'}],
                  })(
                    <TimePicker onChange={this.onChangeTime} format="HH:mm" disabledSeconds={() => 0}/>
                  )
                }
              </FormItem>
            </Col>

          </Row>
        </div>
      ) : (
        <FormItem {...cromLayout} label="Cron" validateStatus={cronError ? 'error' : ''}
                  help={cronError || ''}>
          {
            getFieldDecorator('cron', {
              rules: [{required: true, message: 'Please check the cron format'}],
            })(
              <Input.Search onChange={this.onChange('cron')}
                            placeholder="Cron value" enterButton="Test"/>
            )}
        </FormItem>
      );

    const dataPresentation = (this.props.type === 'job')
      ? <JobsDatas artifacts={this.props.artifacts} servers={this.props.servers}/>
      : <NexusDatas nexus={this.props.nexus} servers={this.props.servers}/>;
    const cannotSubmit = hasNoDeployements(this.props);
    return (
      <div id="add-scheduler">
        <Row>
          <Col offset={2} span={20}>
            <Breadcrumb style={{margin: '16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Add an Job</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Title text={`Add an Job (${this.props.type})`}/>
        <Row>
          <Col span={20} offset={2}>
            <Card style={{width: '100%'}}>
              <Form
                className="ant-advanced-search-form" onSubmit={this.handleSubmit}>
                <FormItem {...cromLayout} label="Name" validateStatus={nameError ? 'error' : ''}
                          help={nameError || ''}>
                  {
                    getFieldDecorator('name', {
                      rules: [{required: true, message: 'Please input the name!'}],
                    })(
                      <Input onChange={this.onChange('name')}
                             placeholder="The job's name"/>
                    )}
                </FormItem>
                <Row className="margin-between-forms">
                  <Col span={21} offset={defOffset}>
                    <Switch checkedChildren="Date" size="large" unCheckedChildren="Cron"
                            checked={this.state.selectedDate}
                            onChange={() => this.setState({selectedDate: !this.state.selectedDate})}/>
                  </Col>
                </Row>
                {formDateOrCron}
                <Row className="margin-between-forms">
                  <Col span={12} offset={defOffset - 2}>
                    {dataPresentation}
                  </Col>
                </Row>
                <Row type="flex" justify="space-around">
                  <Col span={4}>
                    <Button size="large" onClick={this.onBack}>
                      <li className="fa fa-backward"/>
                      &nbsp;Cancel
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="primary" htmlType="submit"
                            disabled={hasErrors(getFieldsError()) || cannotSubmit}
                            icon="check">
                      &nbsp;Submit
                    </Button>
                  </Col>
                </Row>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

Scheduler.propTypes = {schedulers: PropTypes.array.isRequired};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Form.create()(Scheduler)));




