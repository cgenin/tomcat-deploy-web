import React from 'react';
import {connect} from 'react-redux';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import { del, load } from '../../../modules/artifacts/actions';
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
    },
    onInit() {
      dispatch(load());
    }
  };
};

class ItemStatus extends React.Component {

  render() {
    if (!this.props.artifact.last) {
      return null;
    }

    return (
      <span
        className="{{status.state === 'OK' ? 'text-success' :''}} {{status.state === 'KO' ? 'text-danger' :''}}">
                <i
                  className="fa {{status.state === 'OK' ? 'fa-check' :''}} {{status.state === 'KO' ? ' fa-frown-o' :''}} "/>
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
        <td scope="row">
          <ItemCheck artifact={this.props.artifact} checked={this.props.checked}/>
        </td>
        <td>
          <ItemName artifact={this.props.artifact}/>
        </td>
        <td>
          <ItemStatus artifact={this.props.artifact}/>
        </td>
        <td style={{paddingTop: '2px'}}>

          <div className="btn-group" style={{marginTop: '4px'}}>
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
            <th>
              <AllItemsCheck />
            </th>
            <th>Name</th>
            <th>Deploy</th>
            <th/>
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
