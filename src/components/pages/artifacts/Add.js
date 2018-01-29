import React from 'react';
import {Row, Col, Card, Breadcrumb} from 'antd';
import AddForm from '../../widgets/artifacts/ArtifactForm';
import Title from '../../widgets/Title';

const AddPage = () => {
  return (
    <div>
      <Row>
        <Col offset={2} span={20}>
          <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Add an artifact</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Title text="Add an artifact"/>
      <Row>
        <Col span={20} offset={2}>
          <Card style={{width: '100%'}}>
            <AddForm/>
          </Card>
        </Col>
      </Row>¬
    </div>
  );
};

export default AddPage;
