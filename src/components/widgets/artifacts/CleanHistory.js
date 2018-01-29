import React from 'react';
import {connect} from 'react-redux';
import {Modal, Button, Form, Input} from 'antd';
import {clean} from '../../../modules/artifacts/actions';

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onAction(nb) {
      return dispatch(clean(nb));
    }
  };
};

class CleanHistory extends React.Component {

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.onClick = this.onClick.bind(this);
    this.state = {nb: 5};
  }


  onChange(e) {
    e.preventDefault();
    const nb = e.target.value;
    this.setState({nb});
  }

  onClick() {
    if (this.state.nb > 0) {
      this.props.onAction(this.state.nb).then(this.props.onHide());
    }
  }

  render() {
    return (
      <Modal visible={this.props.visible} title="Clean History" onCancel={this.props.onHide}
             footer={
               [
                 <Button key={1} onClick={() => this.props.onHide()} title="close" shape="circle" icon="close">
                 </Button>,
                 <Button key={2} type="primary" title="Go clean !" shape="circle" icon="minus-square"
                         disabled={this.state.nb < 1} onClick={this.onClick}>
                 </Button>
               ]
             }>
        <Form>
          <Form.Item labelCol={{xs: {span: 5},}} wrapperCol={{xs: {span: 12}}} label="Keep Last">
            <Input addonAfter="artifacts !" type="number" placeholder="Number" value={this.state.nb}
                   onChange={this.onChange}/>
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(CleanHistory);
