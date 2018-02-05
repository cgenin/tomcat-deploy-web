import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {Table, Row, Col, Input, Tooltip, Menu, Dropdown, Icon, Popconfirm} from 'antd';
import LaunchButton from '../artifacts/LaunchButton';
import ArtifactVersions from '../versions/ArtifactVersions';
import {filtering} from '../../FiltersAndSorter';
import {del, load} from '../../../modules/artifacts/actions';
import {updateArtifacts} from '../../../modules/actions/actions';
import {removeArtifacts} from '../../../modules/actions/actions';
import PropTypes from 'prop-types';
import {EDIT_ARTIFACT} from "../../../routesConstant";
import nexusImg from "../../../assets/nexus.png";
import './ArtifactList.css';

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts.map(a => {
      const job = a.job || a.name;
      return Object.assign({}, a, {job})
    }),
    nexusVersions: state.nexusVersions,
    selectedServers: state.actions.servers
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onDelete(artifact) {
      dispatch(del(artifact));
      dispatch(removeArtifacts(artifact));
    },
    onInit() {
      dispatch(load());
    },
    onSelectedArtifacts(servers) {
      dispatch(updateArtifacts(servers));
    }
  };
};


function sortFactory(asc) {
  const df = (asc) ? 1 : -1;
  return (a, b) => {
    if (a.name === b.name) {
      return 0;
    }
    if (a.name < b.name) {
      return -1 * df;
    }
    return df;
  };
}

class NexusArtifact extends React.PureComponent {

  static propTypes = {artifact: PropTypes.object.isRequired};


  render() {
    const {groupId, artifactId} = this.props.artifact;
    if (groupId && artifactId && groupId.length > 0 && artifactId.length > 0) {
      return (<img src={nexusImg} alt="Nexus img" width="28" height="28" style={{margin: 'auto'}}
                   title="Artifact present in nexus "/>);
    }
    return (<div/>);
  }

}


const ItemName = (props) => {
  const style = {
    cursor: 'pointer'
  };
  const popup = `URL : ${props.url}`;
  return (
    <Tooltip title={popup}>
      <a href="/" style={style}>{props.name}</a>
    </Tooltip>
  );
};

ItemName.propTypes = {name: PropTypes.string.isRequired, url: PropTypes.string.isRequired};

class ArtifactList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {asc: true, filter: ''};
    this.onFilter = this.onFilter.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onDelete = this.onDelete.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  onFilter(e) {
    this.setState({filter: e.target.value});
  }

  onEdit(artifact) {
    return (e) => {
      e.preventDefault();
      this.props.history.push(
        {
          pathname: EDIT_ARTIFACT.path(artifact.$loki)
        });
    };
  }

  onDelete(artifact) {
    return (e) => {
      e.preventDefault();
      this.props.onDelete(artifact);
    };
  }

  render() {
    const onDelete = this.onDelete;
    const onEdit = this.onEdit;
    const arr = filtering(this.props.artifacts, this.state.filter);
    const artifacts = arr.sort(sortFactory(this.state.asc)).map(
      (artifact, i) => {
        return Object.assign({}, artifact, {key: `${artifact.job}-${i}`});
      }
    );

    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
        this.props.onSelectedArtifacts(selectedRows);
      },
    };

    const columns = [
      {key: 'job', title: 'Name', render: (t, artifact) => <ItemName name={artifact.job} url={artifact.url}/>},
      {key: 'nexus', title: 'Nexus', render: (t, artifact) => <NexusArtifact artifact={artifact}/>},
      {
        key: 'version',
        title: 'Version',
        render: (t, artifact) => <ArtifactVersions name={artifact.name} id={artifact.$loki}/>
      },
      {
        key: 'actions', title: '#', render: (t, artifact) => {
          const menu = (
            <Menu>
              <Menu.Item key="0">
                <LaunchButton name={artifact.name}/>
              </Menu.Item>
              <Menu.Item key="1">
                <a href="/" onClick={onEdit(artifact)}>
                  <i className="fa fa-pencil-square-o"/>&nbsp; Edition
                </a>
              </Menu.Item>
              <Menu.Item key="2">
                <Popconfirm title="Are you sure to delete this artifact ?" onConfirm={onDelete(artifact)} okText="Yes"
                            cancelText="No">
                  <a href="/">
                    <i className="fa fa-trash"/>&nbsp;Delete
                  </a>
                </Popconfirm>
              </Menu.Item>
            </Menu>
          );
          return (
            <Dropdown key={`${artifact.name}`} overlay={menu}>
              <a>
                <li className="fa fa-cogs"/>
                &nbsp;
                Actions&nbsp;<Icon type="down"/>
              </a>
            </Dropdown>
          );
        }
      }
    ];

    return (
      <div id="artifact-list">
        <Row className="filters">
          <Col span={12}>
            Results {arr.length}.
          </Col>
          <Col span={8}>
            <Input value={this.state.filter} onChange={this.onFilter} placeholder="Filter..."/>
          </Col>
        </Row>
        <Table rowSelection={rowSelection} dataSource={artifacts} columns={columns}  pagination={{ pageSize:50 }}/>
      </div>
    );
  }
}

ArtifactList.propTypes = {artifacts: PropTypes.array.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ArtifactList));
