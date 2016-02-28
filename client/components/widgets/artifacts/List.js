import React from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';
import classNames from 'classnames';
import moment from 'moment';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import LaunchButton from '../artifacts/LaunchButton';
import ArtifactVersions from '../versions/ArtifactVersions';
import { del, load } from '../../../modules/artifacts/actions';
import { removeArtifacts} from '../../../modules/actions/actions';
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
          query: {i: artifact.name}
        }));
    }
  };
};


class ItemStatus extends React.Component {

  render() {
    const status = this.props.artifact.status;
    if (!status) {
      return null;
    }
    const formattedDate = moment(status.dt).format('YYYY/MM/DD HH:mm:ss');
    if (status.state === 'KO') {
      return (<span className="text-danger">
                <i className="fa  fa-frown-o "/> {formattedDate}
      </span>);
    }

    return (
      <span className="text-success">
      <i className="fa fa-check"/> {formattedDate}
      </span>
    );
  }

}

ItemStatus.propTypes = {artifact: React.PropTypes.object.isRequired};

class ItemName extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const style = {
      cursor: 'pointer'
    };
    const popup = `URL : ${this.props.artifact.url}`;
    const tool = (<Tooltip id="0"><strong>{popup}</strong></Tooltip>);
    return (
      <OverlayTrigger placement="right" overlay={tool}>
        <a href="#" style={style}>{this.props.artifact.name}</a>
      </OverlayTrigger>
    );
  }
}

ItemName.propTypes = {artifact: React.PropTypes.object.isRequired};

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

  render() {
    return (
      <tr>
        <td className="text-center" scope="row" style={{paddingTop: '12px'}}>
          <ItemCheck artifact={this.props.artifact} checked={this.props.checked}/>
        </td>
        <td className="text-left" style={{paddingTop: '14px'}}>
          <ItemName artifact={this.props.artifact}/>
        </td>
        <td className="text-center" style={{paddingTop: '18px'}}>
          <ItemStatus artifact={this.props.artifact}/>
        </td>
        <td>
          <ArtifactVersions name={this.props.artifact.name}/>
        </td>
        <td className="text-center" style={{paddingTop: '2px'}}>

          <div className="btn-group" style={{marginTop: '11px'}}>
            <a href="bootstrap-elements.html" data-target="#"
               className="btn btn-raised btn-sm dropdown-toggle" data-toggle="dropdown"
               aria-expanded="false">
              <li className="fa fa-cogs"/>
              <span className="caret"/>
              <div className="ripple-container"></div>
            </a>
            <ul className="dropdown-menu">
              <li><a href="#" onClick={this.onEdit}><i className="fa fa-pencil-square-o"/>&nbsp;Edition</a></li>
              <li><a href="#" onClick={this.onClick}><i className="fa fa-trash"/>&nbsp;Delete</a></li>
            </ul>
            <LaunchButton name={this.props.artifact.name}/>
          </div>
        </td>
      </tr>
    );
  }
}

ItemList.propTypes = {artifact: React.PropTypes.object.isRequired};

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {asc: true};
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
    const clsName = classNames({fa: true, 'fa-sort-desc': !this.state.desc, 'fa-sort-asc': this.state.asc});
    const artifacts = this.props.artifacts.sort(sorting).map((artifact, i) => <ItemList key={i} onDelete={onDelete}
                                                                                        onEdit={onEdit}
                                                                                        artifact={artifact}/>);
    return (
      <div className="col-xs-offset-1 col-xs-10">
        <table className="table table-hover">
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

List.propTypes = {artifacts: React.PropTypes.array.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(List);
