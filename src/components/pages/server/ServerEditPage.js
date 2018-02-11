import React from 'react';
import {withRouter} from 'react-router';
import {Row, Col, Card, Breadcrumb} from 'antd';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/ServerForm';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {pageLayout} from "../../Styles";

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  if (!query.loki) {
    return {add: true};
  }
  const id = query.loki;
  return {add: false, id};
};


const ServerEditPage = (props) => {

  return (
    <div>
      <Row>
        <Col {...pageLayout}>
          <Breadcrumb className="main-bread-crumb">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Edit an server</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Title text="Edit and Save server"/>
      <Row>
        <Col {...pageLayout}>
          <Card style={{width: '100%'}}>
            <ServerEdit add={props.add} id={props.id}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


ServerEditPage.propTypes = {add: PropTypes.bool.isRequired, id: PropTypes.string};

export default withRouter(connect(mapStateToProps)(ServerEditPage));
