import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import connect from 'react-redux/lib/components/connect';
import MenuItem from 'react-bootstrap/lib/MenuItem';

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

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
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

LaunchButton.propTypes = {url: React.PropTypes.string.isRequired, hide: React.PropTypes.bool.isRequired};

export default connect(mapStateToProps)(LaunchButton);
