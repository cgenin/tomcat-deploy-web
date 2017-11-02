import React from 'react';
import {withRouter} from 'react-router'
import {connect} from 'react-redux';
import AddForm from '../../widgets/artifacts/AddForm';
import Title from '../../widgets/Title';

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  if (!query.loki) {
    return {};
  }
  return {id: query.loki};
};


const EditPage = (props) => {
  return (
    <div>
      <Title text="Edit an artifact"/>
      <div className="row">
        <div className="panel panel-default col-xs-offset-1 col-xs-10">
          <div className="panel-body">
            <AddForm id={props.id}/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(connect(mapStateToProps)(EditPage));
