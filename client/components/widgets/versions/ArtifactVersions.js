import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import moment from 'moment';
import connect from 'react-redux/lib/components/connect';
import {updateHistory} from '../../../modules/actions/actions';


const mapStateToProps = function (state, ownProps) {
  const ref = state.versions.ref;
  const versions = ref[ownProps.name] || [];
  const vs = state.nexusVersions.find(n => n.id === ownProps.id) || { nexus: { versions: [] } };
  const nexusVersions = vs.nexus.versions;
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


class History extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }


  render() {
    if (this.props.versions.length === 0) {
      return <optgroup label="History"/>;
    }
    const opts = this.props.versions.map((v, i) => (
      <option key={i} value={v.dt}>{moment(v.date).format('YYYY/MM/DD HH:mm:ss')}</option>));
    return (
      <optgroup label="History">
        {opts}
      </optgroup>
    );
  }
}

class Nexus extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }


  render() {
    if (this.props.versions.length === 0) {
      return <optgroup label="Nexus"/>;
    }
    const opts = this.props.versions.map((v, i) => (
      <option key={v} value={v}>{v}</option>));
    return (
      <optgroup label="Nexus">
        {opts}
      </optgroup>
    );
  }
}

History.propTypes = { versions: React.PropTypes.array.isRequired };

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
      this.props.onSelect({ name: this.props.name });
    }
  }

  render() {
    const disabled = this.props.versions.length === 0 && this.props.nexusVersions.length === 0;
    return (
      <div className="form-group">
        <select ref="version" onChange={this.onChange} className="form-control" style={{marginTop: '-28px'}}
                disabled={disabled}>
          <option value="">Latest Jenkins</option>
          <History versions={this.props.versions}/>
          <Nexus versions={this.props.nexusVersions}/>
        </select>
      </div>
    );
  }
}

ArtifactVersions.propTypes = { versions: React.PropTypes.array, nexusVersions: React.PropTypes.array };

export default connect(mapStateToProps, mapDispatchToProps)(ArtifactVersions);
