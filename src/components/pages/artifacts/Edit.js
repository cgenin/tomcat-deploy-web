import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import AddForm from '../../widgets/artifacts/AddForm';
import Title from '../../widgets/Title';

const mapStateToProps = function (state, props) {
  const query = props.location.query || {};
  if (!query.i) {
    return {};
  }
  const name = query.i;
  return {name};
};


const EditPage = (props) => {
  return (
    <div>
      <Title text="Edit an artifact"/>
      <div className="row">
        <div className="panel panel-default col-xs-offset-1 col-xs-10">
          <div className="panel-body">
            <AddForm name={props.name}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(EditPage));
