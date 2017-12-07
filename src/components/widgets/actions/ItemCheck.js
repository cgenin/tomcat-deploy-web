import React from 'react';
import {connect} from 'react-redux';
import { addArtifacts, removeArtifacts } from '../../../modules/actions/actions';
import PropTypes from 'prop-types';

const mapStateToProps = function (state, ownProps) {
  const checkedArtifacts = state.actions.artifacts;
  const checked = checkedArtifacts.findIndex(c => {
    if (ownProps.artifact.job) {
      return c.job === ownProps.artifact.job;
    }
    return c.name === ownProps.artifact.name;
  }) !== -1;
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

class ItemCheck extends React.PureComponent {

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

ItemCheck.propTypes = {artifact: PropTypes.object.isRequired, checked: PropTypes.bool.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(ItemCheck);
