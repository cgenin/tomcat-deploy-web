import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {load} from '../../../modules/history/actions'
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import moment from "moment/moment";
import {filtering} from "../../Filters";


const mapStateToProps = function (state) {
  const {history} = state.history;

  return {
    history,
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onInit() {
      dispatch(load());
    },
  };
};

const LabelResult = (props) => {
  const clazzLabel = className({
    'label': true,
    'label-success': props.value === 'OK',
    'label-danger': props.value !== 'OK'
  });
  const clazzIcon = className({'fa': true, 'fa-check': props.value === 'OK', 'fa-frown-o': props.value !== 'OK'});
  return (<span className={clazzLabel}><i className={clazzIcon}/>&nbsp;{props.value}</span>);
};

LabelResult.propTypes = {value: PropTypes.string.isRequired};

const ItemName = (props) => {
  const style = {
    cursor: 'pointer'
  };
  const tool = (<Tooltip id="0"><strong>{props.toolText}</strong></Tooltip>);
  return (
    <OverlayTrigger placement="right" overlay={tool}>
      <a href="/" style={style}>{props.name}</a>
    </OverlayTrigger>
  );
};

const Version = (props) => {
  if (props.method.type === 'nexus') {
    return (
      <span>
    <img src="/images/nexus.png" alt="Nexus img" width="28" height="28" style={{margin: 'auto'}}
         title="Artifact present in nexus "/>
        &nbsp;{props.method.version}
    </span>);
  }

  return <img src="/images/jenkins.png" alt="Nexus img" width="28" height="28" style={{margin: 'auto'}}
              title="Artifact present in nexus "/>
};
Version.propTypes = {method: PropTypes.object.isRequired};

ItemName.propTypes = {name: PropTypes.string.isRequired, toolText: PropTypes.string.isRequired};

const Line = (props) => {
  const {name, date, result, server, method} = props.deploy;
  const formattedDate = moment(date).format('YYYY/MM/DD HH:mm');
  return (
    <tr>
      <td><ItemName name={server.name} toolText={server.host}/></td>
      <td>{name}</td>
      <td>{formattedDate}</td>
      <td><LabelResult value={result}/></td>
      <td><Version method={method}/></td>
    </tr>
  )
};

Line.propTypes = {deploy: PropTypes.object.isRequired};

class HistoryList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };

    this.onFilter = this.onFilter.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  onFilter(e) {
    this.setState({filter: e.target.value});
  }


  render() {
    if (this.props.loading) {
      return (
        <div className="col-xs-12 ">
          <i className="fa fa-spinner fa-spin fa-3x fa-fw"/>
        </div>
      );
    }

    const arr = filtering(this.props.history, this.state.filter).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const lines = arr.map((deploy, index) => <Line key={`${deploy.date}-${deploy.name}-${index}`} deploy={deploy}/>);
    return (
      <div className="col-xs-12 ">
        <table className="table table-hover table-responsive" style={{fontSize: '1.5em'}}>
          <caption>
            <div className="row">
              <div className="col-xs-6">
                Results {arr.length}.
              </div>
              <div className="col-xs-4">
                <div className="form-group" style={{marginTop: 0}}>
                  <input type="text" className="form-control" defaultValue={this.state.filter} onChange={this.onFilter}
                         placeholder="Filter..."/>
                </div>
              </div>
            </div>
          </caption>
          <thead>
          <tr>
            <th>Server</th>
            <th>Artifact</th>
            <th>Date</th>
            <th>State</th>
            <th>Version</th>
          </tr>
          </thead>
          <tbody>
          {lines}
          </tbody>
        </table>
      </div>
    );
  }
}

HistoryList.propTypes = {history: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoryList));
