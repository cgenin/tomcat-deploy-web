import {connect} from 'react-redux';
import ShowUrls from '../ShowUrls'

const mapStateToProps = function (state) {
  const {actions} = state;
  const {artifacts} = actions;
  return {artifacts};
};

export default connect(mapStateToProps)(ShowUrls);


