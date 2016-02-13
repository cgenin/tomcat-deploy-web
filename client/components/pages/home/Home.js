import React from 'react';
import {Tabs, Tab} from 'react-bootstrap';
import Logger from './../../widgets/logger/Logger';
import Message from '../../widgets/message/Message';
import ServerActions from './../../widgets/server/ServerActions';
import List from './../../widgets/artifacts/List';
import Title from '../../widgets/Title';
import InProgress from './../../widgets/actions/InProgress';

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: 1
    };

    this.handleSelect = this.handleSelect.bind(this);
  }

  handleSelect(key) {
    this.setState({key});
  }

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
                <button type="button" className="btn btn-default" >
                  <i className="fa fa-trash-o"/>
                  &nbsp;Undeploy
                </button>
              </div>
              <div className="col-xs-6 text-left">
                <button type="button" className="btn btn-info">
                  <i className="fa fa-play"/>
                  &nbsp;Run
                </button>
              </div>
            </div>
            <div className="row">
              <div>
                <Tabs activeKey={this.state.key} onSelect={this.handleSelect}
                      style={{marginLeft: '2em', marginRight: '2em'}}>
                  <Tab eventKey={1} title="Artifacts"> <List /></Tab>
                  <Tab eventKey={2} title="Logs"> <Logger /></Tab>
                </Tabs>
              </div>
            </div>
          </div>
        </div>
      </div>);
  }
}

export default HomePage;
