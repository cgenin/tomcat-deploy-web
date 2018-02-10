import {connect} from 'react-redux';
import ShowNexus from '../ShowNexus'

const mapStateToProps = function (state) {
  const {nexus} = state;
  return {nexus};
};


export default connect(mapStateToProps)(ShowNexus);


