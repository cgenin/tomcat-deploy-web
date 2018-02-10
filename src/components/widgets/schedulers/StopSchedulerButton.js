import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {stop} from "../../../modules/schedulers/actions";

const mapStateToProps = function () {
  return {};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onStop(scheduler) {
      dispatch(stop(scheduler));
    },
  };
};


class StopSchedulerButton extends PureComponent {

  constructor(props) {
    super(props);
    this.handleStart = this.handleStart.bind(this);
  }

  handleStart() {
    this.props.onStop(this.props.scheduler);
  }

  render() {
    return (
      <Button onClick={this.handleStart} type="success" shape="circle" title="Launch the job">
        <i className="fa fa-stop"/>
      </Button>
    )
  }
}


StopSchedulerButton.propTypes = {scheduler: PropTypes.object.isRequired};


export default connect(mapStateToProps, mapDispatchToProps)(StopSchedulerButton);



