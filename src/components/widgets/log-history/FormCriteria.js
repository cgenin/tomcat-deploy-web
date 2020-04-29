import React, {PureComponent} from 'react';
import moment from 'moment';
import {DatePicker, Form, Button, InputNumber} from 'antd';
import PropTypes from "prop-types";

const FormItem = Form.Item;
const {RangePicker} = DatePicker;

class FormCriteria extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      range: [],
      mode:['date', 'date'],
      limit: 1
    };

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChangeDate = this.handleChangeDate.bind(this);
    this._convertProps2State = this._convertProps2State.bind(this);
  }

  _convertProps2State(newProps) {
    const {options} = newProps;
    const {limit, from, until} = options || {};
    const range = [moment(from), moment(until)];
    this.setState({limit, range});
  }


  componentWillReceiveProps(newProps) {
    const {range, limit} = this.state;
    const [from, until] = range;
    const options = newProps.options || {};
    const propsFrom = (options.from) ? moment(options.from) : moment();
    const propsUntil = (options.until) ? moment(options.until) : moment();
    if (newProps.limit !== limit || !propsFrom.isSame(from) || !propsUntil.isSame(until)) {
      this._convertProps2State(newProps);
    }
  }

  handleSubmit(e) {
    if (e) {
      e.preventDefault();
    }
    console.log(this.state)
  }

  handleChangeDate(range, mode, opts) {
    console.log(opts)
    this.setState({range, mode});
  }

  render() {
    return (
      <div>
        <Form layout="inline" onSubmit={this.handleSubmit}>
          <FormItem>
            <RangePicker
              mode={this.state.mode}
              value={this.state.range}
              onChange={this.handleChangeDate}
              format="YYYY-MM-DD HH:mm"
              showTime
              placeholder={['Start Time', 'End Time']}
            />
          </FormItem>
          <FormItem>
            <InputNumber min={1} max={999} value={this.state.limit} placeholder="Limit"/>
          </FormItem>
          <FormItem>
            <Button
              type="primary"
              htmlType="submit"
              icon="search"
            >
              Search
            </Button>
          </FormItem>
        </Form>
      </div>
    );
  }
}

FormCriteria.propTypes = {options: PropTypes.object.isRequired, onSubmit: PropTypes.func.isRequired};


export default FormCriteria;
