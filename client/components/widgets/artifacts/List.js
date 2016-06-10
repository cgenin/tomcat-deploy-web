import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import connect from 'react-redux/lib/components/connect';
import {routeActions} from 'react-router-redux';
import classNames from 'classnames';
import moment from 'moment';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import ButtonToolbar from 'react-bootstrap/lib/ButtonToolbar';
import DropdownButton from 'react-bootstrap/lib/DropdownButton';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import LaunchButton from '../artifacts/LaunchButton';
import ArtifactVersions from '../versions/ArtifactVersions';
import {del, load} from '../../../modules/artifacts/actions';
import {removeArtifacts} from '../../../modules/actions/actions';
import ItemCheck from './../actions/ItemCheck';
import AllItemsCheck from './../actions/AllItemsCheck';

const mapStateToProps = function (state) {
  return {
    artifacts: state.artifacts
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
    onEdit(artifact) {
      dispatch(routeActions.push(
        {
          pathname: '/edit',
          query: { i: artifact.name }
        }));
    }
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

class NexusArtifact extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { groupId, artifactId } = this.props.artifact;
    if (groupId && artifactId && groupId.length > 0 && artifactId.length > 0) {
      return (<img src="/images/nexus.png" width="28" height="28"  style={{margin: 'auto'}} title="Artifact present in nexus "/>);
    }
    return (<div />);
  }

}

NexusArtifact.propTypes = { artifact: React.PropTypes.object.isRequired };

class ItemStatus extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const status = this.props.artifact.deployStates;
    if (!status) {
      return null;
    }
    return (<div>{Object.keys(status).map((k) => transform(k, status[k]))}</div>);
  }

}

ItemStatus.propTypes = { artifact: React.PropTypes.object.isRequired };

class ItemName extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const style = {
      cursor: 'pointer'
    };
    const popup = `URL : ${this.props.url}`;
    const tool = (<Tooltip id="0"><strong>{popup}</strong></Tooltip>);
    return (
      <OverlayTrigger placement="right" overlay={tool}>
        <a href="#" style={style}>{this.props.name}</a>
      </OverlayTrigger>
    );
  }
}

ItemName.propTypes = { name: React.PropTypes.string.isRequired, url: React.PropTypes.string.isRequired };

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
    const title = `open in a new window ${this.props.name}.`;


    return (
      <tr>
        <td className="text-center" scope="row" style={{paddingTop: '12px'}}>
          <ItemCheck artifact={this.props.artifact} checked={this.props.checked}/>
        </td>
        <td className="text-left" style={{paddingTop: '14px'}}>
          <ItemName name={this.props.artifact.name} url={this.props.artifact.url}/>
        </td>
        <td className="text-left" style={{paddingTop: '18px'}}>
          <ItemStatus artifact={this.props.artifact}/>
        </td>
        <td className="text-center"><NexusArtifact artifact={this.props.artifact}/></td>
        <td className="text-center" >
          <ArtifactVersions name={this.props.artifact.name} id={this.props.artifact.$loki}/>
        </td>
        <td className="text-right" style={{paddingTop: '2px'}}>
          <div style={{display: 'flex', margin: 'auto', flexDirection: 'row', justifyContent: 'flex-end'}}>
            <ButtonToolbar>
              <DropdownButton id={this.props.artifact.name} title={<li className="fa fa-cogs"/>}>
                <LaunchButton name={this.props.artifact.name} />
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

ItemList.propTypes = { artifact: React.PropTypes.object.isRequired };

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = { asc: true };
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  componentDidMount() {
    this.props.onInit();
  }

  render() {
    const onDelete = this.props.onDelete;
    const onEdit = this.props.onEdit;
    const sorting = (this.state.asc) ? (a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      if (a.name < b.name) {
        return -1;
      }
      return 1;
    } : (a, b) => {
      if (a.name === b.name) {
        return 0;
      }
      if (a.name < b.name) {
        return 1;
      }
      return -1;
    };
    const sortingName = (this.state.asc) ? 'Asc' : 'Desc';
    const clsName = classNames({ fa: true, 'fa-sort-desc': !this.state.asc, 'fa-sort-asc': this.state.asc });
    const artifacts = this.props.artifacts.sort(sorting).map(
      (artifact, i) => <ItemList key={i} onDelete={onDelete} onEdit={onEdit} artifact={artifact}/>
    );
    return (
      <div className="col-xs-12 ">
        <table className="table table-hover table-responsive">
          <caption> Results {this.props.artifacts.length}.</caption>
          <thead>
          <tr>
            <th className="text-center">
              <AllItemsCheck />
            </th>
            <th title={sortingName} style={{cursor: 'pointer'}} onClick={() => this.setState({asc: !this.state.asc})}>
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

List.propTypes = { artifacts: React.PropTypes.array.isRequired };

export default connect(mapStateToProps, mapDispatchToProps)(List);
