import React from 'react';
import connect from 'react-redux/lib/components/connect';
import Tabs from 'react-bootstrap/lib/Tabs';
import Tab from 'react-bootstrap/lib/Tab';
import Logger from './../../widgets/logger/Logger';
import Message from '../../widgets/message/Message';
import ServerActions from './../../widgets/server/ServerActions';
import List from './../../widgets/artifacts/List';
import Title from '../../widgets/Title';
import DeployActions from './../../widgets/actions/DeployActions';
import {hideConsole} from './../../../modules/actions/actions';

const mapStateToProps = function (state) {
  const showLogger = state.actions.forceLogger;
  return {showLogger};
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSelect: function () {
      dispatch(hideConsole());
    }
  };
};

class HomePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      key: 1
    };
    this.handleSelect = this.handleSelect.bind(this);
  }

  componentWillMount() {
    const showLogger = this.props.showLogger;
    if (showLogger) {
      this.setState({key: 2});
    }
  }


  componentWillReceiveProps(newProps) {
    const showLogger = newProps.showLogger;
    if (showLogger) {
      this.setState({key: 2});
    }
  }

  handleSelect(key) {
    this.setState({key});
    this.props.onSelect();
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
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerActions />
            </div>
            <DeployActions />
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

HomePage.propTypes = {showLogger: React.PropTypes.bool};

export default connect(mapStateToProps, mapDispatchToProps)(HomePage);
