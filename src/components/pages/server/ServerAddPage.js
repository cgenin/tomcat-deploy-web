import React from 'react';
import {Row, Col, Card, Breadcrumb} from 'antd';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/ServerForm';
import {pageLayout} from '../../Styles';


const ServerAddPage = () =>
  (<div>
    <Row>
      <Col {...pageLayout}>
        <Breadcrumb className="main-bread-crumb">
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>Add an server</Breadcrumb.Item>
        </Breadcrumb>
      </Col>
    </Row>
    <Title text="Add and Save server"/>
    <Row>
      <Col {...pageLayout}>
        <Card style={{width: '100%'}}>
          <ServerEdit add />
        </Card>
      </Col>
    </Row>
  </div>);

export default ServerAddPage;
