import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {Table, Input, Row, Col} from 'antd';
import {load} from '../../../modules/schedulers/actions'
import {filtering} from "../../FiltersAndSorter";
import {koColor, okColor} from "../../Styles";
import ShowUrls from "../ShowUrls";
import ShowNexus from "../ShowNexus";
import moment from "moment";
import './SchedulersList.css'
import DeleteSchedulerButton from "./DeleteSchedulerButton";
import StartSchedulerButton from "./StartSchedulerButton";
import StopSchedulerButton from "./StopSchedulerButton";


const mapStateToProps = function (state) {
  const {schedulers} = state;

  return {
    schedulers
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onInit() {
      dispatch(load());
    },
  };
};

const formatDate = (date) => {
  if (!date) {
    return '-';
  }
  return moment(date).format('YYYY-MM-DD HH:mm');
};

class SchedulersList extends PureComponent {

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


    const arr = filtering(this.props.schedulers, this.state.filter).sort((a, b) => {
      return new Date(b.date) - new Date(a.date);
    });
    const lines = arr.map((deploy, index) => {
      return Object.assign({}, deploy, {key: `${deploy.date}-${deploy.name}-${index}`});
    });
    const columns = [
      {
        key: 'name',
        dataIndex: 'name',
        title: 'Name',
        //      render: (t, deploy) => <ItemName name={deploy.server.name} toolText={deploy.server.host}/>
      },
      {
        key: 'date',
        dataIndex: 'date',
        title: 'Date',
        render: formatDate
      },
      {
        key: 'cron',
        dataIndex: 'cron',
        title: 'Cron',
      },
      {
        key: 'type', dataIndex: 'type', title: 'Type', render: (type, scheduler) => {
          switch (type) {
            case 'job' :
              return <ShowUrls artifacts={scheduler.artifacts}/>
            case 'nexus' :
              return <ShowNexus nexus={scheduler.nexus}/>;
            default :
              return <span>Unkonwn Type</span>
          }
        }
      },
      {
        key: 'run', dataIndex: 'run', title: 'State', render: (run) => {
          if (run) {
            return (
              <div style={okColor}><i className="fa fa-play"/>&nbsp;Running</div>
            );
          }
          return (
            <div style={koColor}><i className="fa fa-stop"/>&nbsp;Stop</div>
          );
        }
      },
      {key: 'lastDate', dataIndex: 'lastDate', title: 'Last Date', render: formatDate},
      {key: 'nextDate', dataIndex: 'nextDate', title: 'Next Date', render: formatDate},
      {
        key: 'action', title: 'Actions', render: (t, scheduler) => {
          const runButt = (!scheduler.run) ? <StartSchedulerButton scheduler={scheduler}/> : null;
          const stopButt = (scheduler.run) ? <StopSchedulerButton scheduler={scheduler}/> : null;
          return (
            <div className="actions-btn">{runButt}{stopButt}{<DeleteSchedulerButton scheduler={scheduler}/>}</div>)
        }
      },
    ];
    return (
      <div id="schedulers-list">
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

SchedulersList.propTypes = {history: PropTypes.object.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(SchedulersList));
