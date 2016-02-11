import React from 'react';

class Title extends React.Component {
  render() {
    return (
      <div className="row">
        <div className="col-xs-offset-1 col-xs-10 text-center">
          <div className="title-container">
            <div className="ribbon-left"></div>
            <div className="backflag-left"></div>
            <div className="title"><a href="#">{this.props.text}</a></div>
            <div className="backflag-right"></div>
            <div className="ribbon-right"></div>
          </div>
        </div>
      </div>
    );
  }
}

Title.propTypes = { text: React.PropTypes.string.isRequired };

export default Title;
