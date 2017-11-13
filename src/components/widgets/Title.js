import React from 'react';
import PropTypes from 'prop-types';

const Title = (props) => {
  return (
    <div className="row">
      <div className="col-xs-offset-1 col-xs-10 text-center">
        <div className="title-container">
          <div className="ribbon-left"/>
          <div className="backflag-left"/>
          <div className="title"><a href="/">{props.text}</a></div>
          <div className="backflag-right"/>
          <div className="ribbon-right"/>
        </div>
      </div>
    </div>
  );
};

Title.propTypes = {text: PropTypes.string.isRequired};

export default Title;
