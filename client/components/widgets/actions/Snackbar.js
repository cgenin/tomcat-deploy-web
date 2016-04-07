import React from 'react';
import connect from 'react-redux/lib/components/connect';
import { hideSnackbar } from '../../../modules/actions/actions';

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

class Snackbar extends React.Component {

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
          <button className="close" aria-label="close" style={{marginLeft: '15px', float: 'right'}}><span
            aria-hidden="true" onClick={this.hide}>&times;</span></button>
          <span>
            Deployement finish ! - <a href="#" onClick={this.refresh}>please refresh for new status</a>
          </span>
        </div>

      </div>
    );
  }
}

Snackbar.propTypes = {snackbar: React.PropTypes.bool.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Snackbar);
