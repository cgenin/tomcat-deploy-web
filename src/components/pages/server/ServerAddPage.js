import React from 'react';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/Edition';


export default class ServerAddPage extends React.PureComponent {

  render() {
    return (
      <div>
        <Title text="Add and Save server"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerEdit add={true}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
