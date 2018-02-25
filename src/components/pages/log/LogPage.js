import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Row, Col, Breadcrumb} from 'antd';
import {pageLayout} from "../../Styles";
import {load} from "../../../modules/history-log/actions";
import Title from "../../widgets/Title";


const mapStateToProps = function (state) {
  const {logHistory} = state;
  return {logHistory};
};

const mapDispatchToProps = (dispatch) => {
  return {
    onLoad() {
      dispatch(load());
    },
  };
};


class LogPage extends PureComponent {

  componentDidMount() {
    this.props.onLoad();
  }

  render() {
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

          </Col>
        </Row>
      </div>
    );
  }
}



export default connect(mapStateToProps, mapDispatchToProps)(LogPage);
