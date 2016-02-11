import React from 'react';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/ServerEdit';

class ServerEditPage extends React.Component {
  render() {
    return (
      <div>
        <Title text="Edit and Save server"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerEdit />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ServerEditPage;
