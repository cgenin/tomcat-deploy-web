import React from 'react';
import Logger from './../../widgets/logger/Logger';
import Message from '../../widgets/message/Message';
import ServerActions from './../../widgets/server/ServerActions';
import List from './../../widgets/artifacts/List';
import Title from '../../widgets/Title';
import InProgress from './../../widgets/actions/InProgress';

class HomePage extends React.Component {
  render() {
    return (
      <div>
        <Title text="List and deploy"/>
        <div className="row">
          <div className="col-xs-offset-3 col-xs-6 text-center">
            <Message />
          </div>
        </div>
        <div className="row">
          <div className=" col-xs-offset-4 col-xs-4">
            <InProgress />
          </div>
        </div>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerActions />
            </div>
            <div className="row">
              <div className="col-xs-3 col-xs-offset-3 text-right">
                <button type="button" className="btn btn-default" disabled='{{!enabledButt}}'>
                  <i className="fa fa-trash-o"/>
                  &nbsp;Undeploy
                </button>
              </div>
              <div className="col-xs-6 text-left">
                <button type="button" className="btn btn-info" disabled='{{!enabledButt}}'>
                  <i className="fa fa-play"/>
                  &nbsp;Run
                </button>
              </div>
            </div>
            <div className="row">
              <div>
                <ul className="nav nav-tabs" role="tablist"
                    style={{marginLeft: '2em',marginRight: '2em'}}>
                  <li role="presentation" className="active"><a href="#artifacts"
                                                                aria-controls="artifacts" role="tab"
                                                                data-toggle="tab">Artifacts</a>
                  </li>
                  <li role="presentation"><a href="#logs" aria-controls="logs" role="tab"
                                             data-toggle="tab">Logs</a>
                  </li>
                </ul>
                <div className="tab-content">
                  <div role="tabpanel" className="tab-pane fade in active" id="artifacts">
                    <List />
                  </div>
                  <div role="tabpanel" className="tab-pane fade " id="logs">
                    <Logger />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default HomePage;
