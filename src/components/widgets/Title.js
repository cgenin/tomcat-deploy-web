import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col} from 'antd'
import {pageLayout} from "../Styles";

const Title = (props) => {
  return (
    <Row>
      <Col {...pageLayout} style={{display: 'flex', justifyContent: 'center'}}>
        <div className="title-container">
          <div className="ribbon-left"/>
          <div className="backflag-left"/>
          <div className="title"><a href="/">{props.text}</a></div>
          <div className="backflag-right"/>
          <div className="ribbon-right"/>
        </div>
      </Col>
    </Row>
  );
};

Title.propTypes = {text: PropTypes.string.isRequired};

export default Title;
