import React from 'react';
import Logger from './../../widgets/logger/Logger';
import Message from '../../widgets/message/Message';
import ServerEdit from './../../widgets/server/ServerEdit';
import ServerSaveButton from './../../widgets/server/ServerSaveButton';
import List from './../../widgets/artifacts/List';


class HomePage extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-offset-1 col-xs-10 text-center">
                        <div className="title-container">
                            <div className="ribbon-left"></div>
                            <div className="backflag-left"></div>
                            <div className="title"><a href="#">List and deploy</a></div>
                            <div className="backflag-right"></div>
                            <div className="ribbon-right"></div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-xs-offset-3 col-xs-6 text-center">
                        <Message />
                    </div>
                </div>
                <div className="row">
                    <div className="alert alert-warning col-xs-offset-4 col-xs-4">
                        <h3>Warning deployement in progress! <i className="fa fa-refresh fa-spin"/></h3>
                        <strong>sss</strong>
                    </div>
                </div>
                <div className="row">
                    <div className="panel panel-default col-xs-offset-1 col-xs-10">
                        <div className="panel-body">
                            <ServerEdit />
                        </div>

                        <div className="row">
                            <div className="col-xs-6 text-right">
                                <ServerSaveButton />
                                <button type="button" className="btn btn-default">
                                    <i className="fa fa-trash-o"/>
                                    &nbsp;Undeploy
                                </button>
                            </div>
                            <div className="col-xs-6 text-left">
                                <button type="button" className="btn btn-info" disabled='{{!enabledButt}}'
                                >
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
