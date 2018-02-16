import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd';
import './Title.css';

const Title = (props) => {
  return (
    <Row className="component-title">
      <Col span={20} offset={2} style={{display: 'flex', justifyContent: 'center'}}>
        <div className="title">
          <h1>
            <span>Tomcat Web Deploy</span>
            <div>{props.text}</div>
          </h1>
        </div>
      </Col>
    </Row>
  );
};

Title.propTypes = {text: PropTypes.string.isRequired};

export default Title;
