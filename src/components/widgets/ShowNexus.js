import React from 'react';
import PropTypes from 'prop-types';
import {Popover} from 'antd';
import nexusImg from '../../assets/nexus.png';

class ShowNexus extends React.PureComponent {
  render() {
    if (this.props.nexus.length === 0) {
      return <div/>;
    }

    const lis = this.props.nexus.map((a, i) => <li key={i}>{a.artifactId} : {a.version}</li>);
    return (
      <div>
        <Popover title="Nexus Artifacts" content={<ul>{lis}</ul>}>
          <img src={nexusImg} width="28" height="28" alt="Nexus"/> : {this.props.nexus.length}
        </Popover>
      </div>
    );
  }
}

ShowNexus.propTypes = {
  nexus: PropTypes.array.isRequired,
};

export default ShowNexus;
