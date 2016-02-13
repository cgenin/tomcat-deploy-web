import React from 'react';
import {connect} from 'react-redux';
import { addArtifacts, removeArtifacts } from '../../../modules/actions/actions';

const mapStateToProps = function (state, ownProps) {
  const checkedArtifacts = state.actions.artifacts;
  const checked = checkedArtifacts.findIndex(c => c.name === ownProps.artifact.name) !== -1;
  return {
    checked
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onCheck(artifact) {
      dispatch(addArtifacts(Array.of(artifact)));
    },
    onUnCheck(artifact) {
      dispatch(removeArtifacts(Array.of(artifact)));
    }
  };
};

class ItemCheck extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    if (this.props.checked) {
      this.props.onUnCheck(this.props.artifact);
    } else {
      this.props.onCheck(this.props.artifact);
    }
  }

  render() {
    return (
      <input type="checkbox" className="success material-checkbox" title="deploy this item" checked={this.props.checked} onChange={this.onChange}/>
    );
  }
}

ItemCheck.propTypes = {artifact: React.PropTypes.object.isRequired, checked: React.PropTypes.bool.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheck);
