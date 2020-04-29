import React from 'react';
import {Row, Col, Card, Breadcrumb} from 'antd';
import AddForm from '../../widgets/artifacts/ArtifactForm';
import Title from '../../widgets/Title';
import {pageLayout} from "../../Styles";

const AddPage = () => {
  return (
    <div>
      <Row>
        <Col {...pageLayout}>
          <Breadcrumb className="main-bread-crumb">
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Add an artifact</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Title text="Add an artifact"/>
      <Row>
        <Col {...pageLayout}>
          <Card style={{width: '100%'}}>
            <AddForm/>
          </Card>
        </Col>
      </Row>¬
    </div>
  );
};

export default AddPage;
