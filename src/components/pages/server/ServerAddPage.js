import React from 'react';
import {Row, Col, Card, Breadcrumb} from 'antd';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/ServerForm';


export default class ServerAddPage extends React.PureComponent {

  render() {
    return (
      <div>
        <Row>
          <Col offset={2} span={20}>
            <Breadcrumb style={{margin: '16px 0'}}>
              <Breadcrumb.Item>Home</Breadcrumb.Item>
              <Breadcrumb.Item>Add an server</Breadcrumb.Item>
            </Breadcrumb>
          </Col>
        </Row>
        <Title text="Add and Save server"/>
        <Row>
          <Col span={20} offset={2}>
            <Card style={{width: '100%'}}>
              <ServerEdit add={true}/>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
