import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {Row, Col, Button} from 'antd';
import {clear} from '../../../modules/logger/actions';
import PropTypes from 'prop-types';
import './Logger.css';

const mapStateToProps = function (state) {
  return {
    logs: state.logger
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onClear() {
      dispatch(clear());
    }
  };
};

const LogItem = (props) => {
  const formattedDate = moment(props.log.dt).format('YYYY/MM/DD HH:mm:ss SSSSSSSSS');
  if (props.log.error) {
    return (<li><span className="text-danger">{formattedDate} - {props.log.msg}</span></li>);
  }
  return (<li><span className="text-success">{formattedDate} - {props.log.msg}</span></li>);
};

LogItem.propTypes = {log: PropTypes.object.isRequired};

class Logger extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.onClear();
  }

  render() {
    const logs = this.props.logs.map((log, i) => <LogItem key={i} log={log}/>);
    return (
      <div id="logger">
        <Row>
          <Col span={4}>
            <Button type="danger" onClick={this.onClick}>
              <i className="fa fa-trash-o"/> Clear
            </Button>
          </Col>
        </Row>
        <Row>
          <Col span={24}>
            <div className="deploy-logger-main-panel">
              <ul>
                <li> > Ready !</li>
                {logs}
              </ul>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

Logger.propTypes = {logs: PropTypes.array.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Logger);
