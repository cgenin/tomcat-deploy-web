import React from 'react';
import connect from 'react-redux/lib/components/connect';

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

class LaunchButton extends React.Component {
  render() {
    if (this.props.hide) {
      return null;
    }
    const title = `open in a new window ${this.props.name}.`;
    return (
      <a href={this.props.url} className="btn btn-primary" target="_blanck"
         style={{paddingTop: '0', paddingBottom: '0'}} title={title}><i className="fa fa-send-o fa-2x"/></a>
    );
  }
}

LaunchButton.propTypes = {url: React.PropTypes.string.isRequired, hide: React.PropTypes.bool.isRequired};

export default connect(mapStateToProps)(LaunchButton);
