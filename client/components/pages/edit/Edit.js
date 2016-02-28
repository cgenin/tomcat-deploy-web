import React from 'react';
import { connect } from 'react-redux';
import AddForm from '../../widgets/artifacts/AddForm';
import Title from '../../widgets/Title';

const mapStateToProps = function (state) {
  const query = state.routing.location.query;
  if (!query.i) {
    return {};
  }
  const name = query.i;
  return {name};
};


class EditPage extends React.Component {
  render() {
    return (
      <div>
        <Title text="Edit an artifact"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <AddForm name={this.props.name}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps)(EditPage);
