import React from 'react';
import PropTypes from 'prop-types';

const BlockUI =(props)=> {

    const text = props.text || 'Loading ...';
    if (!props.show) {
      return (<div></div>);
    }
    return (
      <div className="block-ui-main block-ui-visible block-ui-active">
        <div className="block-ui-container">
          <div className="block-ui-overlay"></div>
          <div className="block-ui-message-container" aria-live="assertive" aria-atomic="true">
            <div className="block-ui-message">{text}</div>
          </div>
        </div>
      </div>
    );
}

BlockUI.propTypes = {
  show: PropTypes.bool.isRequired,
  text: PropTypes.string
};

export default BlockUI;
