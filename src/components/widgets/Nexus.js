import React from 'react';
import PropTypes from 'prop-types';

export class NexusVersions extends React.PureComponent {

  static propTypes = { nexusVersions: PropTypes.array };

  render() {
    if (this.props.nexusVersions && this.props.nexusVersions.length > 0) {
      return (<strong>{this.props.nexusVersions.length} nexus versions loaded.</strong>);
    }
    return (<strong>No nexus versions loaded. To update : Configuration -> Nexus -> Refresh Versions</strong>);
  }
}

export class NexusArtifact extends React.PureComponent {

  static propTypes = { artifact: PropTypes.object.isRequired };


  render() {
    const { groupId, artifactId } = this.props.artifact;
    if (groupId && artifactId && groupId.length > 0 && artifactId.length > 0) {
      return (<img src="/images/nexus.png" alt="Nexus img" width="28" height="28" style={{margin: 'auto'}}
                   title="Artifact present in nexus "/>);
    }
    return (<div />);
  }

}





