import React, {PureComponent} from 'react';
import PropTypes from "prop-types";
import {connect} from 'react-redux';
import {Button, Modal} from 'antd';
import {remove} from "../../../modules/schedulers/actions";

const mapStateToProps = () => {
  return {};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onRemove(scheduler) {
      dispatch(remove(scheduler));
    },
  };
};


class DeleteSchedulerButton extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleDelete() {
    this.setState({showModal: false});
    this.props.onRemove(this.props.scheduler);
  }

  render() {
    const onHide = () => this.setState({showModal: false});
    return (
      <div>
        <Button type="danger" onClick={() => this.setState({showModal: true})} shape="circle" title="Delete the job">
          <i className="fa fa-trash"/>
        </Button>
        <Modal visible={this.state.showModal} title="Confirm" onCancel={onHide}
               footer={
                 [
                   <Button key={1} onClick={onHide} title="No">
                     No
                   </Button>,
                   <Button key={2} type="primary" title="Yes"
                           onClick={this.handleDelete}>
                     Yes
                   </Button>
                 ]
               }>
          <h3>Do you want delete the job '{this.props.scheduler.name}' ?</h3>
        </Modal>
      </div>
    )
  }
}

DeleteSchedulerButton.propTypes = {scheduler: PropTypes.object.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(DeleteSchedulerButton);
