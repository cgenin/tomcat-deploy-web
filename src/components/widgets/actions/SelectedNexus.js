import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Popover} from 'antd';
import nexusImg from '../../../assets/nexus.png';

const mapStateToProps = function (state) {
  const {nexus} = state;
  return {nexus};
};

class SelectedNexus extends React.PureComponent {
  render() {
    if (this.props.nexus.length === 0) {
      return <div/>;
    }

    const lis = this.props.nexus.map((a, i) => <li key={i}>{a.artifactId} : {a.version}</li>);
    return (
      <div>
        <Popover title="Nexus Artifacts" content={<ul>{lis}</ul>}>
          <img src={nexusImg} width="28" height="28" alt="Nexus 's Deployement"/> : {this.props.nexus.length}
        </Popover>
      </div>
    );
  }
}

SelectedNexus.propTypes = {
  nexus: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(SelectedNexus);


