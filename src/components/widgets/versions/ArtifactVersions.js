import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {updateHistory} from '../../../modules/actions/actions';
import PropTypes from 'prop-types';

const mapStateToProps = function (state, ownProps) {
  const ref = state.versions.ref;
  const name = ownProps.name;
  const versions = (ref[name] || [])
    .map(v => Object.assign({ type: 'history' }, v));
  const vs = state.nexusVersions.find(n => n.id === ownProps.id) || { nexus: { versions: [] } };
  const nexusVersions = vs.nexus.versions.map(version => {
    return { type: 'nexus', version, name };
  });
  return {
    versions,
    nexusVersions
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSelect(version) {
      dispatch(updateHistory(version));
    }
  };
};


class History extends React.PureComponent {

  render() {
    if (this.props.versions.length === 0) {
      return <optgroup label="History"/>;
    }
    const opts = this.props.versions.map((v, i) => (
      <option key={i} value={JSON.stringify(v)}>{moment(v.date).format('YYYY/MM/DD HH:mm:ss')}</option>));
    return (
      <optgroup label="History">
        {opts}
      </optgroup>
    );
  }
}
History.propTypes = { versions: PropTypes.array.isRequired };


class ArtifactVersions extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const value = this.refs.version.value;
    if (value !== '') {
      const version = JSON.parse(value);
      this.props.onSelect(version);
    } else {
      this.props.onSelect({ name: this.props.name });
    }
  }

  render() {
    const disabled = this.props.versions.length === 0 && this.props.nexusVersions.length === 0;
    return (
      <div className="form-group">
        <select ref="version" onChange={this.onChange} className="form-control" style={{ marginTop: '-28px' }}
                disabled={disabled}>
          <option value="">Latest Jenkins</option>
          <History versions={this.props.versions}/>
        </select>
      </div>
    );
  }
}

ArtifactVersions.propTypes = {
  versions: PropTypes.array,
  nexusVersions: PropTypes.array,
  name: PropTypes.string
};

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactVersions);
