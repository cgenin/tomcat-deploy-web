import React from 'react';
import {connect} from 'react-redux';
import moment from 'moment';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
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
  }

  onClick(e) {
    e.preventDefault();
    const artifact = this.props.artifact;
    this.props.onDelete(artifact);
    return false;
  }

  render() {
    return (
      <tr>
        <td className="text-center" scope="row" style={{paddingTop: '7px'}}>
          <ItemCheck artifact={this.props.artifact} checked={this.props.checked}/>
        </td>
        <td className="text-left" style={{paddingTop: '7px'}}>
          <ItemName artifact={this.props.artifact}/>
        </td>
        <td className="text-center" style={{paddingTop: '7px'}}>
          <ItemStatus artifact={this.props.artifact}/>
        </td>
        <td>
          <div className="form-group">
            <select className="form-control" style={{marginTop: '-28px'}} disabled="true">
              <option value="">Latest</option>
            </select>
          </div>
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
              <li><a href="#" onClick={this.onClick}><i className="fa fa-trash"/>&nbsp;Delete</a></li>
            </ul>
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
  }

  componentDidMount() {
    this.props.onInit();
  }

  render() {
    const onDelete = this.props.onDelete;
    const artifacts = this.props.artifacts.map((artifact, i) => <ItemList key={i} onDelete={onDelete}
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
            <th>Name</th>
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
