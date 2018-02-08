import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col, Card, Breadcrumb, Form, Input, Switch, DatePicker, TimePicker, Button} from 'antd';
import {HOME} from "../../../routesConstant";
import {add} from "../../../modules/schedulers/actions";
import Title from "../../widgets/Title";
import {withRouter} from "react-router";
import {formItemLayout} from "../../Styles";
import './Scheduler.css';

const FormItem = Form.Item;

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  const type = query.type;
  const {schedulers, actions, nexus} = state;
  const {artifacts} = actions;
  return {schedulers, type, artifacts, nexus};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (scheduler, history) {
      dispatch(add(scheduler))
        .then(() => history.push(HOME.path()));
    },
  };
};

const NexusDatas = ({nexus}) => {
  const lis = nexus.map((n, i) => {
    return (
      <li key={i}><strong>{n.groupId}.{n.artifactId}</strong> : {n.version} </li>
    )
  });
  return (
    <div>
      <h4>Nexus artifact to deploy : </h4>
      <ul>
        {lis}
      </ul>
    </div>
  )
};

const JobsDatas = ({artifacts}) => {
  const lis = artifacts.map((a, i) => {
    return (
      <li key={i}><strong>{a.job}</strong></li>
    )
  });
  return (
    <div>
      <h4>Nexus artifact to deploy : </h4>
      <ul>
        {lis}
      </ul>
    </div>
  )
};

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field]);
}

class Scheduler extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {selectedDate: true};
    this.onBack = this.onBack.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();
    console.log(this);
  }

  onChange(attr) {
    return (e) => {
      const state = Object.assign({}, this.state);
      state[attr] = e.target.value;
      this.setState(state);

      this.props.form.setFieldsValue(Object.assign({}, state))
    };
  }

  onBack() {
    this.props.history.push(HOME.path());
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
            <Col span={9} offset={2}>
              <FormItem validateStatus={dateError ? 'error' : ''}
                        help={dateError || ''} label="Date">
                {
                  getFieldDecorator('date', {
                    rules: [{required: true, message: 'Please input the date!'}],
                  })(
                    <DatePicker onChange={this.onChange('date')} showTime={true}/>
                  )
                }
              </FormItem>
            </Col>

          </Row>
        </div>
      ) : (
        <div>
          <FormItem {...formItemLayout} label="Cron" validateStatus={cronError ? 'error' : ''}
                    help={cronError || ''}>
            {
              getFieldDecorator('cron', {
                rules: [{required: true, message: 'Please check the cron format'}],
              })(
                <Input  onChange={this.onChange('cron')}
                       placeholder="Cron value"/>
              )}
          </FormItem>
        </div>
      );
    const dataPresentation = (this.props.type === 'job')
      ? <JobsDatas artifacts={this.props.artifacts}/>
      : <NexusDatas nexus={this.props.nexus}/>;
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
                <FormItem label="Name" validateStatus={nameError ? 'error' : ''}
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
                  <Col span={21} offset={3}>
                    <Switch checkedChildren="Date" size="large" unCheckedChildren="Cron"
                            checked={this.state.selectedDate}
                            onChange={() => this.setState({selectedDate: !this.state.selectedDate})}/>
                  </Col>
                </Row>
                {formDateOrCron}
                <Row className="margin-between-forms">
                  <Col span={21} offset={3}>
                    {dataPresentation}
                  </Col></Row>
                <Row type="flex" justify="space-around">
                  <Col span={4}>
                    <Button size="large" onClick={this.onBack}>
                      <li className="fa fa-backward"/>
                      &nbsp;Cancel
                    </Button>
                  </Col>
                  <Col span={4}>
                    <Button size="large" type="primary" htmlType="submit" disabled={hasErrors(getFieldsError())}
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




