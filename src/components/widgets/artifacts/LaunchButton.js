import React from 'react';
import {connect} from 'react-redux';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import PropTypes from 'prop-types';

const mapStateToProps = function (state, ownProps) {
  if (state.actions.servers.length === 0) {
    return {url: '', hide: true};
  }
  const name = ownProps.name;
  const url = `http://${state.actions.servers[0].host}/${name}/`;
  return {
    url, hide: false
  };
};

class LaunchButton extends React.PureComponent {

  render() {
    if (this.props.hide) {
      return null;
    }
    const title = `open in a new window ${this.props.name}.`;
    return (
      <MenuItem eventKey="0" href={this.props.url} target="_blanck"
         title={title}><i className="fa fa-send-o"/> Launch</MenuItem>
    );
  }
}

LaunchButton.propTypes = {url: PropTypes.string.isRequired, hide: PropTypes.bool.isRequired};

export default connect(mapStateToProps)(LaunchButton);
