import React from 'react';
import moment from 'moment';
import {connect} from 'react-redux';
import {updateHistory} from '../../../modules/actions/actions';


const mapStateToProps = function (state, ownProps) {
  const ref = state.versions.ref;
  const versions = ref[ownProps.name] || [];
  return {
    versions
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSelect(version) {
      dispatch(updateHistory(version));
    }
  };
};


class History extends React.Component {
  render() {
    if (this.props.versions === 0) {
      return null;
    }
    const opts = this.props.versions.map((v) => (
      <option key={v.dt} value={v.dt}>{moment(v.date).format('YYYY/MM/DD HH:mm:ss')}</option>));
    return (
      <optgroup label="History">
        {opts}
      </optgroup>
    );
  }
}

class ArtifactVersions extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange() {
    const value = this.refs.version.value;
    if (value !== '') {
      const version = this.props.versions.find(v => `${v.dt}` === value);
      this.props.onSelect(version);
    } else {
      this.props.onSelect({name: this.props.name});
    }
  }

  render() {
    const disabled = this.props.versions.length === 0;
    return (
      <div className="form-group">
        <select ref="version" onChange={this.onChange} className="form-control" style={{marginTop: '-28px'}}
                disabled={disabled}>
          <option value="">Latest Jenkins</option>
          <History versions={this.props.versions}/>
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactVersions);
