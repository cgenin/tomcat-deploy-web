import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {Popover} from 'antd';
import jenkinsImg from '../../../assets/jenkins.png';

const mapStateToProps = function (state) {
  const {actions} = state;
  const {artifacts} = actions;
  return {artifacts};
};

class SelectedUrls extends React.PureComponent {
  render() {
    if (this.props.artifacts.length === 0) {
      return <div/>;
    }

    const lis = this.props.artifacts.map((a, i) => <li key={i}>{a.name}</li>);
    return (
      <div>
        <Popover title="Artifacts" content={<ul>{lis}</ul>}>
          <img src={jenkinsImg} width="28" height="28"/> : {this.props.artifacts.length}
        </Popover>
      </div>
    );
  }
}

SelectedUrls.propTypes = {
  artifacts: PropTypes.array.isRequired,
};

export default connect(mapStateToProps)(SelectedUrls);


