import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {clear} from '../../../modules/logger/actions';
import PropTypes from 'prop-types';

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
      <div>
        <div className="col-xs-2" style={{marginTop: '1em'}}>
          <button className="btn btn-danger" onClick={this.onClick}>
            <i className="fa fa-trash-o"/> Clear
          </button>
        </div>
        <div className="col-xs-10">
          <div className="panel panel-default ">
            <div className="panel-body deploy-logger-main-panel"
                 style={{fontWeight: 'bold', backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
              <ul>
                <li> > Ready !</li>
                {logs}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Logger.propTypes = {logs: PropTypes.array.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Logger);
