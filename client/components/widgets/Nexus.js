import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';


export class NexusVersions extends React.Component {

  static propTypes = { nexusVersions: React.PropTypes.array };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    if (this.props.nexusVersions && this.props.nexusVersions.length > 0) {
      return (<strong>{this.props.nexusVersions.length} nexus versions loaded.</strong>);
    }
    return (<strong>No nexus versions loaded.</strong>);
  }
}

export class NexusArtifact extends React.Component {

  static propTypes = { artifact: React.PropTypes.object.isRequired };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { groupId, artifactId } = this.props.artifact;
    if (groupId && artifactId && groupId.length > 0 && artifactId.length > 0) {
      return (<img src="/images/nexus.png" width="28" height="28" style={{margin: 'auto'}}
                   title="Artifact present in nexus "/>);
    }
    return (<div />);
  }

}





