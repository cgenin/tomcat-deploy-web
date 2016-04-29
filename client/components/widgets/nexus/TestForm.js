import React from 'react';
import connect from 'react-redux/lib/components/connect';
import {TimeSpinner} from '../../widgets/Spinner';

import {test} from '../../../modules/nexus/actions';

const mapStateToProps = function () {
  return {};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onTest(host, port) {
      return dispatch(test(host, port || 80));
    }
  };
};

class Results extends React.Component {

  render() {
    if (this.props.result.statusCode === 200) {
      return (
        <div className="text-center">
          <div className="message success" style={{margin: '2em', padding: '2px'}}>
            <div className="text-left"
                 style={{marginTop: '2em', marginBottom: '2em', paddingLeft: '2px', paddingRight: '2px'}}>
              <h4 style={{ wordWrap: 'break-word'}}>Success on calling : {this.props.result.url}</h4>
            </div>
          </div>
        </div>);
    }
    return (
      <div className="text-center">
        <div className="message error" style={{margin: '2em', paddingTop: '30px', paddingLeft: '5px'}}>
          <div className="fa-stack fa-lg" style={{margin: 'auto'}}>
            <i className="fa fa-square-o fa-stack-2x"/>
            <i className="fa fa-warning fa-stack-1x"/>
          </div>
          <div className="text-center">
            <h3>Status code : {this.props.result.statusCode }</h3>
          </div>
        </div>
      </div>);
  }
}

class TestForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = { waiting: true, result: {} };
  }

  componentDidMount() {
    this.props.onTest(this.props.host, this.props.port).then(
      r => this.setState({ waiting: false, result: r }));
  }

  render() {
    const spinner = (this.state.waiting) ? (<div className="text-center"><TimeSpinner /></div>) :
      <Results result={this.state.result}/>;
    return (
      <div>
        <div className="text-center" style={{fontSize: '24px'}}>
          <strong>Test Nexus</strong>
        </div>
        {spinner}
        <div className="text-center">
          <button className="btn btn-raised btn-default" onClick={() => this.props.onClose()}>Close</button>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TestForm);
