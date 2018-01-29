import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import {Row, Col, Card, Breadcrumb} from 'antd';
import AddForm from '../../widgets/artifacts/ArtifactForm';
import Title from '../../widgets/Title';

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  if (!query.loki) {
    return {};
  }
  return {id: query.loki};
};


const EditPage = (props) => {
  return (
    <div>
      <Row>
        <Col offset={2} span={20}>
          <Breadcrumb style={{margin: '16px 0'}}>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
            <Breadcrumb.Item>Edit an artifact</Breadcrumb.Item>
          </Breadcrumb>
        </Col>
      </Row>
      <Title text="Edit an artifact"/>
      <Row>
        <Col span={20} offset={2}>
          <Card style={{width: '100%'}}>
          <AddForm id={props.id}/>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(EditPage));
