import React from 'react';
import moment from 'moment';
import connect from 'react-redux/lib/components/connect';
import { clear } from '../../../modules/logger/actions';

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

class LogItem extends React.Component {
  render() {
    const formattedDate = moment(this.props.log.dt).format('YYYY/MM/DD HH:mm:ss SSSSSSSSS');
    if (this.props.log.error) {
      return (<li><span className="text-danger">{formattedDate} - {this.props.log.msg}</span></li>);
    }
    return (<li><span className="text-success">{formattedDate} - {this.props.log.msg}</span></li>);
  }
}

LogItem.propTypes = {log: React.PropTypes.object.isRequired};

class Logger extends React.Component {

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
              <ul >
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

Logger.propTypes = {logs: React.PropTypes.array.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(Logger);
