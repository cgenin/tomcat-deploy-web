import React from 'react';

class InProgress extends React.Component {
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="alert alert-warning">
        <h3>Warning deployement in progress! <i className="fa fa-refresh fa-spin"/></h3>
        <strong>sss</strong>
      </div>
    );
  }
}

export default InProgress;
