import React from 'react';
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import classNames from 'classnames';
import moment from 'moment';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import LaunchButton from '../artifacts/LaunchButton';
import ArtifactVersions from '../versions/ArtifactVersions';
import {NexusVersions, NexusArtifact} from '../Nexus';
import {del, load} from '../../../modules/artifacts/actions';
import {removeArtifacts} from '../../../modules/actions/actions';
import ItemCheck from './../actions/ItemCheck';
import AllItemsCheck from './../actions/AllItemsCheck';
import PropTypes from 'prop-types';
import {EDIT_ARTIFACT} from "../../../routesConstant";

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts,
    nexusVersions: state.nexusVersions
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
  };
};

function transform(server, value) {
  const formattedDate = moment(value.dt).format('YYYY/MM/DD HH:mm');
  if (value.state === 'KO') {
    return (
      <div key={value.dt}>
      <span className="text-danger">
                <i className="fa fa-frown-o"/> {formattedDate} on {server}
        </span>
      </div>
    );
  }

  return (
    <div key={value.dt}>
    <span className="text-success">
      <i className="fa fa-check"/> {formattedDate} on {server}
      </span>
    </div>
  );
}

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


const ItemStatus = (props) => {
  const status = props.artifact.deployStates;
  if (!status) {
    return null;
  }
  return (<div>{Object.keys(status).map((k) => transform(k, status[k]))}</div>);
};

ItemStatus.propTypes = {artifact: PropTypes.object.isRequired};

const ItemName = (props) => {
  const style = {
    cursor: 'pointer'
  };
  const popup = `URL : ${props.url}`;
  const tool = (<Tooltip id="0"><strong>{popup}</strong></Tooltip>);
  return (
    <OverlayTrigger placement="right" overlay={tool}>
      <a href="/" style={style}>{props.name}</a>
    </OverlayTrigger>
  );
};

ItemName.propTypes = {name: PropTypes.string.isRequired, url: PropTypes.string.isRequired};

class ItemList extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    const artifact = this.props.artifact;
    this.props.onDelete(artifact);
    return false;
  }

  onEdit(e) {
    e.preventDefault();
    const artifact = this.props.artifact;
    this.props.onEdit(artifact);
    return false;
  }

//
  render() {
    return (
      <tr>
        <td className="text-center" style={{paddingTop: '12px'}}>
          <ItemCheck artifact={this.props.artifact} checked={this.props.checked}/>
        </td>
        <td className="text-left" style={{paddingTop: '14px'}}>
          <ItemName name={this.props.artifact.name} url={this.props.artifact.url}/>
        </td>
        <td className="text-left" style={{paddingTop: '18px'}}>
          <ItemStatus artifact={this.props.artifact}/>
        </td>
        <td className="text-center"><NexusArtifact artifact={this.props.artifact}/></td>
        <td className="text-center">
          <ArtifactVersions name={this.props.artifact.name} id={this.props.artifact.$loki}/>
        </td>
        <td className="text-right" style={{paddingTop: '2px'}}>
          <div style={{display: 'flex', margin: 'auto', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <ButtonToolbar>
              <DropdownButton id={this.props.artifact.name} title={<li className="fa fa-cogs"/>}>
                <LaunchButton name={this.props.artifact.name}/>
                <MenuItem divider/>
                <MenuItem eventKey="1" onClick={this.onEdit}><i className="fa fa-pencil-square-o"/>&nbsp;
                  Edition</MenuItem>
                <MenuItem eventKey="2" onClick={this.onClick}><i className="fa fa-trash"/>&nbsp;Delete</MenuItem>
              </DropdownButton>
            </ButtonToolbar>
          </div>
        </td>
      </tr>
    );
  }
}

ItemList.propTypes = {artifact: PropTypes.object.isRequired};

class List extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {asc: true, filter: ''};
    this.onFilter = this.onFilter.bind(this);
    this.onEdit = this.onEdit.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  onFilter(e) {
    this.setState({filter: e.target.value});
  }

  onEdit(artifact) {
    this.props.history.push(
      {
        pathname: EDIT_ARTIFACT.path(artifact.$loki)
      });
  }

  render() {
    const onDelete = this.props.onDelete;
    const onEdit = this.onEdit;
    const sortingName = (this.state.asc) ? 'Asc' : 'Desc';
    const clsName = classNames({fa: true, 'fa-sort-desc': !this.state.asc, 'fa-sort-asc': this.state.asc});
    const arr = (this.state.filter !== '') ? this.props.artifacts
        .filter(a => JSON.stringify(a).indexOf(this.state.filter) !== -1) :
      this.props.artifacts;
    const artifacts = arr.sort(sortFactory(this.state.asc)).map(
      (artifact, i) => <ItemList key={i} onDelete={onDelete} onEdit={onEdit} artifact={artifact}/>
    );
    return (
      <div className="col-xs-12 ">
        <table className="table table-hover table-responsive">
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
            <th className="text-center">
              <AllItemsCheck/>
            </th>
            <th title={sortingName} style={{cursor: 'pointer'}}
                onClick={() => this.setState({asc: !this.state.asc})}>
              Name&nbsp;&nbsp;<i className={clsName}/>
            </th>
            <th className="text-center">Deploy</th>
            <th className="text-center">Nexus</th>
            <th className="text-center">Versions</th>
            <th className="text-center">&nbsp;</th>
          </tr>
          </thead>
          <tbody>
          {artifacts}
          </tbody>
        </table>
      </div>
    );
  }
}

List.propTypes = {artifacts: PropTypes.array.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(List));
