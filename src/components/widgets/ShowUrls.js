import React from 'react';
import PropTypes from 'prop-types';
import {Popover} from 'antd';
import jenkinsImg from '../../assets/jenkins.png';


class ShowUrls extends React.PureComponent {
  render() {
    if (this.props.artifacts.length === 0) {
      return <div/>;
    }

    const lis = this.props.artifacts.map((a, i) => <li key={i}>{a.name}</li>);
    return (
      <div>
        <Popover title="Artifacts" content={<ul>{lis}</ul>}>
          <img src={jenkinsImg} width="28" height="28" alt="Urls"/> : {this.props.artifacts.length}
        </Popover>
      </div>
    );
  }
}

ShowUrls.propTypes = {
  artifacts: PropTypes.array.isRequired,
};

export default ShowUrls;
