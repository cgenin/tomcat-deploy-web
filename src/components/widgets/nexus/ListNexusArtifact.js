import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {Table, Select, Row, Col, Input} from 'antd'
import {load} from '../../../modules/artifacts/actions';
import {reset, add, remove} from '../../../modules/nexus/actions';
import {filtering, sortStrBy} from "../../FiltersAndSorter";
import './ListNexusArtifact.css';

const mapStateToProps = function (state) {
  let iterable = state.artifacts.filter(a => {
    const {groupId, artifactId} = a;
    return groupId && artifactId;
  })
    .filter(a =>
      state.nexus.findIndex(n => n.groupId === a.groupId &&
        n.artifactId === a.artifactId) === -1
    )
    .map(a => {
      const {groupId, artifactId, p, name} = a;
      const packaging = (p) ? p : 'war';
      return {groupId, artifactId, packaging, name};
    });
  const artifacts = Array.from(new Set(iterable));

  const nexus = [...state.nexus, ...artifacts];
  return {
    nexus
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onInit() {
      dispatch(load()).then(() => dispatch(reset()));
    },
    onRemove(artifact) {
      dispatch(remove(artifact));
    },
    onAdd(artifact) {
      dispatch(add(artifact));
    }
  };
};

const toString = (a) => `${a.groupId}.${a.artifactId}:${a.packaging}`;

const sorting = (a, b) => {
  const itemA = toString(a);
  const itemB = toString(b);
  if (itemA === itemB) {
    return 0;
  }
  if (itemA < itemB) {
    return -1;
  }
  return 1;
};

const toLabel = (version) => {
  if (!version) {
    return 'no';
  }
  switch (version) {
    case 'LATEST' :
      return 'LATEST';
    case 'RELEASE' :
      return 'RELEASE';
    default :
      return "1.0.0";
  }

};


class SelectionVersion extends React.PureComponent {

  constructor(props) {
    super(props);
    this.onChangeInput = this.onChangeInput.bind(this);
  }

  onChangeInput(e) {
    const value = e.target.value || '';
    this.props.onChange(value);
  }


  render() {

    const title = toLabel(this.props.version);
    const inputVersion = (title === '1.0.0') ?
      <Input value={this.props.version} onChange={this.onChangeInput}/> : null;

    return (
      <div className="selection-version">
        <Select className="select" value={title} onChange={this.props.onChange}>
          <Select.Option key="no">No Deploy</Select.Option>
          <Select.Option key="LATEST">LATEST</Select.Option>
          <Select.Option key="RELEASE">RELEASE</Select.Option>
          <Select.Option key="1.0.0">Specific</Select.Option>
        </Select>
        {inputVersion}
      </div>
    );
  }
}

class ListNexusArtifact extends React.PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      filter: ''
    };
    this.onFilter = this.onFilter.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleChangeTable = this.handleChangeTable.bind(this);
  }

  onFilter(e) {
    this.setState({filter: e.target.value});
  }

  onChange(artifact) {
    return (version) => {
      if (!version || version === '' || version === 'no') {
        // SUppress nexus data
        this.props.onRemove(artifact);
      } else if (version !== '') {
        // ADD version
        artifact.version = version;
        this.props.onAdd(artifact);
      }
    }
  }

  handleChangeTable(pagination, filters, sorter) {
    console.log('Various parameters', pagination, filters, sorter);
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  }

  componentDidMount() {
    this.props.onInit();
  }

  render() {
    let {sortedInfo, filteredInfo} = this.state;
    filteredInfo = filteredInfo || {};
    sortedInfo = sortedInfo || {};
    const arr = filtering(this.props.nexus, this.state.filter);
    const artifacts = arr.sort(sorting).map(
      (artifact, i) => {
        return Object.assign({}, artifact, {
          key: i,
        });
      });
    const columns = [
      {
        key: 'groupId', dataIndex: 'groupId', title: 'GroupId',
        filteredValue: filteredInfo.groupId || null,
        onFilter: (value, record) => record.groupId.includes(value),
        sorter: sortStrBy('groupId'),
        sortOrder: sortedInfo.columnKey === 'groupId' && sortedInfo.order,
      },
      {key: 'artifactId', dataIndex: 'artifactId', title: 'ArtifactId',
        filteredValue: filteredInfo.artifactId || null,
        onFilter: (value, record) => record.artifactId.includes(value),
        sorter: sortStrBy('artifactId'),
        sortOrder: sortedInfo.columnKey === 'artifactId' && sortedInfo.order,},
      {
        key: 'version',
        title: 'Nexus Version',
        render: (text, artifact) => <SelectionVersion onChange={this.onChange(artifact)} version={artifact.version}/>
      },
    ];

    return (
      <div id="list-nexus-artifact">
        <Row className="filter-panel">
          <Col xs={24} sm={12}>
            Results {arr.length}.
          </Col>
          <Col xs={24} sm={12}>
            <Input value={this.state.filter} onChange={this.onFilter} placeholder="Filter..."/>
          </Col>
        </Row>
        <Row>
          <Col xs={24}>
            <Table dataSource={artifacts} columns={columns} onChange={this.handleChangeTable} pagination={{ pageSize:50 }}/>
          </Col>
        </Row>
      </div>
    );
  }
}

ListNexusArtifact.propTypes = {nexus: PropTypes.array.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListNexusArtifact));
