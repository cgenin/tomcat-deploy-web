import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {Row, Col, Card, Breadcrumb, Form, Input, Button} from 'antd';
import Title from '../../widgets/Title';
import {pageLayout} from '../../Styles';


const mapStateToProps = function (state) {
  const {toolConfiguration} = state;
  return {toolConfiguration};
};


const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    xs: {span: 24},
    sm: {span: 6},
  },
  wrapperCol: {
    xs: {span: 24},
    sm: {span: 16},
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 6,
    },
  },
};

class SettingsPage extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {mavenRepository: ''};
    this.onSubmit = this.onSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    e.preventDefault();
    const mavenRepository = e.target.value;
    this.setState({mavenRepository});
  }

  onSubmit(e) {
    if (e) {
      e.preventDefault();
    }

    console.log(this.state)
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div>
        <Row>
          <Col {...pageLayout}>
            <Breadcrumb className="main-bread-crumb">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Settings</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Title text="Settings"/>
        <Row>
          <Col {...pageLayout}>
            <Card style={{width: '100%'}}>
              <Form onSubmit={this.onSubmit}>
                <FormItem
                  {...formItemLayout}
                  label="Maven repository PATH"
                >
                  {getFieldDecorator('mavenRepository', {
                    rules: [{
                      required: true, message: 'Please input the maven repository',
                    }],
                  })(
                    <Input value={this.state.mavenRepository} onChange={this.onChange}/>
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout}>
                  <Button type="primary" htmlType="submit">Save</Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

let componentClass = Form.create()(SettingsPage);
export default withRouter(connect(mapStateToProps)(componentClass));
