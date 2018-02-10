import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import {Button} from 'antd';
import {start} from "../../../modules/schedulers/actions";


const mapStateToProps = function () {
  return {};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onStart(scheduler) {
      dispatch(start(scheduler));
    },
  };
};


class StartSchedulerButton extends PureComponent {

  constructor(props) {
    super(props);
    this.handleStart = this.handleStart.bind(this);
  }

  handleStart() {
    this.props.onStart(this.props.scheduler);
  }

  render() {
    return (
      <Button onClick={this.handleStart} type="success" shape="circle" title="Launch the job">
        <i className="fa fa-play"/>
      </Button>
    )
  }
}


StartSchedulerButton.propTypes = {scheduler: PropTypes.object.isRequired};


export default connect(mapStateToProps, mapDispatchToProps)(StartSchedulerButton);



