import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router';
import {connect} from 'react-redux';
import {DropdownButton, MenuItem} from 'react-bootstrap'
import {load} from '../../../modules/artifacts/actions';
import {reset, add, remove} from '../../../modules/nexus/actions';
import {filtering} from "../../Filters";

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
    return 'No Deploy';
  }
  switch (version) {
    case 'LATEST' :
      return 'LATEST';
    case 'RELEASE' :
      return 'RELEASE';
    default :
      return "Specific";
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
    const inputVersion = (title === 'Specific') ?
      <input type="text" className="form-control" defaultValue={this.props.version}
             onChange={this.onChangeInput}/> : null;

    return (
      <div>
        <DropdownButton title={title} id="bg-nested-dropdown" onSelect={this.props.onChange}>
          <MenuItem eventKey={null}>{toLabel(null)}</MenuItem>
          <MenuItem eventKey="LATEST">{toLabel('LATEST')}</MenuItem>
          <MenuItem eventKey="RELEASE">{toLabel('RELEASE')}</MenuItem>
          <MenuItem eventKey="1.0.0">{toLabel('fdsfsd')}</MenuItem>
        </DropdownButton>
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
  }

  onFilter(e) {
    this.setState({filter: e.target.value});
  }

  onChange(artifact) {
    return (version) => {
      if (!version && version !== '') {
        // SUppress nexus data
        this.props.onRemove(artifact);
      } else if (version !== '') {
        // ADD version
        artifact.version = version;
        this.props.onAdd(artifact);
      }
    }
  }


  render() {

    const arr = filtering(this.props.nexus, this.state.filter);
    const artifacts = arr.sort(sorting).map(
      (artifact, i) => (
        <tr key={i}>
          <td style={{verticalAlign: 'middle'}}>
            {artifact.groupId}
          </td>
          <td style={{verticalAlign: 'middle'}}>
            {artifact.artifactId}
          </td>
          <td style={{verticalAlign: 'middle'}}>
            {artifact.packaging}
          </td>
          <td>
            <SelectionVersion onChange={this.onChange(artifact)} version={artifact.version}/>
          </td>
        </tr>
      )
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
            <th>
              GroupId
            </th>
            <th>
              ArtifactId
            </th>
            <th>Packaging</th>
            <th className="text-center">Nexus Version</th>

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

ListNexusArtifact.propTypes = {nexus: PropTypes.array.isRequired};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ListNexusArtifact));
