import React from 'react';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/ServerEdit';
import { connect} from 'react-redux';


const mapStateToProps = function (state, ownProps) {
  const query = state.routing.location.query;
  if (!query.i)
    return {add: true};
  const id = parseInt(query.i);
  return {add: false, id};
};


class ServerEditPage extends React.Component {
  render() {
    return (
      <div>
        <Title text="Edit and Save server"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerEdit add={this.props.add} id={this.props.id}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ServerEditPage.propTypes = {add: React.PropTypes.bool.isRequired, id: React.PropTypes.number};

export default connect(mapStateToProps)(ServerEditPage);
