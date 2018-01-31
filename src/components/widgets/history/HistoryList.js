import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import className from 'classnames';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {Table, Input, Row, Col, Tooltip} from 'antd';
import {load} from '../../../modules/history/actions'
import moment from "moment/moment";
import {filtering} from "../../FiltersAndSorter";
import jenkinsImg from '../../../assets/jenkins.png';
import nexusImg from '../../../assets/nexus.png';
import './HistoryList.css';



const mapStateToProps = function (state) {
  const {history, loading} = state.history;

  return {
    history, loading
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
  return (
    <Tooltip title={<strong>{props.toolText}</strong>}>
      <a href="/" style={style}>{props.name}</a>
    </Tooltip>
  );
};

const Version = (props) => {
  if (props.method.type === 'nexus') {
    return (
      <span>
    <img src={nexusImg} alt="Nexus img" width="28" height="28" style={{margin: 'auto'}}
         title="Artifact present in nexus "/>
        &nbsp;{props.method.version}
    </span>);
  }

  return <img src={jenkinsImg} alt="Jenkins img" width="28" height="28" style={{margin: 'auto'}}
              title="Artifact present in jenkins "/>
};
Version.propTypes = {method: PropTypes.object.isRequired};

ItemName.propTypes = {name: PropTypes.string.isRequired, toolText: PropTypes.string.isRequired};

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
    const lines = arr.map((deploy, index) => {
      return Object.assign({}, deploy, {key: `${deploy.date}-${deploy.name}-${index}`});
    });
    const columns = [
      {
        key: 'name',
        title: 'Server',
        render: (t, deploy) => <ItemName name={deploy.server.name} toolText={deploy.server.host}/>
      },
      {key: 'artifact', title: 'Artifact', dataIndex: 'name'},
      {key: 'date', title: 'Date', dataIndex: 'date', render: (date) => moment(date).format('YYYY/MM/DD HH:mm')},
      {key: 'result', title: 'State', dataIndex: 'result', render: (result) => <LabelResult value={result}/>},
      {key: 'version', title: 'Version', dataIndex: 'method', render: (method) => <Version method={method}/>},

    ];
    return (
      <div id="history-list">
        <Row className="filters">
          <Col span={12}>Results {arr.length}.
          </Col>
          <Col span={12}>
            <Input value={this.state.filter} onChange={this.onFilter} placeholder="Filter..."/>
          </Col>
        </Row>
        <Table dataSource={lines} columns={columns}/>
      </div>
    );
  }
}

HistoryList.propTypes = {history: PropTypes.array.isRequired, loading: PropTypes.bool.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(HistoryList));
