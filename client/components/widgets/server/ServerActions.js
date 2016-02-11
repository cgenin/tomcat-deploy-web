import React from 'react';
import { connect} from 'react-redux';
import { routeActions } from 'react-router-redux';

const mapStateToProps = function (state) {

  return {};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onEdit: function () {
      dispatch(routeActions.push('/server/edit'));
    }
  }
};
class ServerActions extends React.Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    this.props.onEdit();
    return false;
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-3 col-md-offset-4 col-xs-12 text-right ">
          <select id="" className="form-control" style={{marginTop:'-28px'}}>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
        </div>
        <div className="col-md-5 col-xs-12  text-left">
          <div className="btn-group-sm">
            <a href onClick= {this.onClick} className="btn btn-xs btn-success btn-fab"><i
              className="material-icons">create</i></a>
          </div>
        </div>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);
