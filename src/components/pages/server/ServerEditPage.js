import React from 'react';
import {withRouter} from 'react-router';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/Edition';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';

const mapStateToProps = function (state, props) {
  const query = props.match.params || {};
  if (!query.loki) {
    return {add: true};
  }
  const id = query.loki;
  return {add: false, id};
};


const ServerEditPage = (props) => {

  return (
    <div>
      <Title text="Edit and Save server"/>
      <div className="row">
        <div className="panel panel-default col-xs-offset-1 col-xs-10">
          <div className="panel-body">
            <ServerEdit add={props.add} id={props.id}/>
          </div>
        </div>
      </div>
    </div>
  );
};


ServerEditPage.propTypes = {add: PropTypes.bool.isRequired, id: PropTypes.string};

export default withRouter(connect(mapStateToProps)(ServerEditPage));
