import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

class BlockUI extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }


  render() {
    const text = this.props.text || 'Loading ...';
    if (!this.props.show) {
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
}

BlockUI.propTypes = {
  show: React.PropTypes.bool.isRequired,
  text: React.PropTypes.string
};

export default BlockUI;
