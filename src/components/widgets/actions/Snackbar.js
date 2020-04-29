import React from 'react';
import {connect} from 'react-redux';
import {Button} from 'antd';
import { hideSnackbar } from '../../../modules/actions/actions';
import PropTypes from 'prop-types';
import './Snackbar.css';

const mapStateToProps = function (state) {
  const snackbar = state.actions.snackbar;
  return {
    snackbar
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onHide() {
      dispatch(hideSnackbar());
    }
  };
};

class Snackbar extends React.PureComponent {

  constructor(props) {
    super(props);
    this.refresh = this.refresh.bind(this);
    this.hide = this.hide.bind(this);
  }

  componentWillReceiveProps(newProps) {
    const snackbar = newProps.snackbar;
    if (snackbar) {
      setTimeout(() => this.props.onHide(), 10000);
    }
  }

  refresh(e) {
    e.preventDefault();
    this.props.onHide();
    document.location.reload(true);
    return false;
  }

  hide(e) {
    e.preventDefault();
    this.props.onHide();
    return false;
  }

  render() {
    if (!this.props.snackbar) {
      return null;
    }
    return (
      <div id="snackbar-container">
        <div className="snackbar snackbar-opened">
          <Button size="small" shape="circle" style={{marginLeft: '15px', float: 'right'}} onClick={this.hide} icon="close">
          </Button>
          <span>
            Deployement finish ! - <a href="/" onClick={this.refresh}>please refresh for new status</a>
          </span>
        </div>

      </div>
    );
  }
}

Snackbar.propTypes = {snackbar: PropTypes.bool.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
