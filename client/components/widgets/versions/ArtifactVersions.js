import React from 'react';
import moment from 'moment';
import { connect} from 'react-redux';

const mapStateToProps = function (state, ownProps) {
  const ref = state.versions.ref;
  const versions = ref[ownProps.name] || [];
  return {
    versions
  };
};

class History extends React.Component {
  render() {
    if(this.props.versions === 0){
      return null;
    }
    const opts = this.props.versions.map((v) => (<option key={v.dt} value={v.dt}>{moment(v.date).format('YYYY/MM/DD HH:mm:ss')}</option>));
    return (
      <optgroup label="History">
        {opts}
      </optgroup>
    );
  }
}

class ArtifactVersions extends React.Component {
  render() {
    const disabled = this.props.versions.length === 0;
    return (
      <div className="form-group">
        <select className="form-control" style={{marginTop: '-28px'}} disabled={disabled}>
          <option value="">Latest Jenkins</option>
          <History versions={this.props.versions} />
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps)(ArtifactVersions);
