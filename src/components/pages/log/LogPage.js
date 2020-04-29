import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import moment from 'moment';
import {Row, Col, Breadcrumb, Card, Spin, Divider, List} from 'antd';
import {pageLayout} from "../../Styles";
import {load} from "../../../modules/history-log/actions";
import Title from "../../widgets/Title";

import FormCriteria from "../../widgets/log-history/FormCriteria";


const mapStateToProps = function (state) {
  const {logHistory} = state;
  return {...logHistory};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad() {
      dispatch(load());
    },
  };
};

class Content extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      list: [], filtered: []
    };
    this._hasChanged = this._hasChanged.bind(this);
  }

  _hasChanged(props) {
    const {list} = props;
    if (this.state.list !== list) {
      this.setState({list});
    }
  }

  componentDidMount() {
    this._hasChanged(this.props);
  }

  componentWillReceiveProps(newProps) {
    this._hasChanged(newProps);
  }

  render() {
    return (
      <div>
        <List itemLayout="vertical"
              size="small"
              dataSource={this.state.list}
              renderItem={item => {
                const date = moment(item.timestamp);
                return (
                  <List.Item
                    key={date.unix()}
                    extra={item.source}
                  >
                    <span style={{color: 'rgba(0, 0, 0, 0.45)'}}>{date.format('YYYY-MM-DD HH:mm:ss')}</span> : <span
                    style={{fontWeight: 'bold'}}>{item.message}</span>
                  </List.Item>
                );
              }}
        >
        </List>
      </div>
    )
      ;
  }

}


Content.propTypes = {list: PropTypes.array.isRequired};


class LogPage extends PureComponent {

  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }


  componentDidMount() {
    this.props.onLoad();

  }


  handleSubmit(e) {

  }


  render() {
    const content = (this.props.loading) ? (
      <div style={{textAlign: 'center', padding: '10em'}}>
        <Spin size="large"/>
      </div>
    ) : (
      <Content list={this.props.history}/>
    );
    return (
      <div id="log-page">
        <Row>
          <Col {...pageLayout}>
            <Breadcrumb className="main-bread-crumb">
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Log's history</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
          <Title text="Log history"/>
          <Col {...pageLayout}>
            <Card style={{width: '100%'}}>
              <FormCriteria options={this.props.options} onSubmit={this.handleSubmit}/>
              <Divider/>
              {content}
            </Card>
          </Col>
        </Row>
      </div>
    );
  }

}


export default connect(mapStateToProps, mapDispatchToProps)(LogPage);
