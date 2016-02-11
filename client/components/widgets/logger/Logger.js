import React from 'react';

class Logger extends React.Component {
  render() {
    let logs = null;
    return (
      <div>
        <div className="col-xs-2" style={{marginTop:'1em'}}>
          <button className="btn btn-danger"><i className="fa fa-trash-o"/> Clear</button>
        </div>
        <div className="col-xs-10">
          <div className="panel panel-default ">
            <div className="panel-body deploy-logger-main-panel"
                 style={{fontWeight: 'bold',backgroundColor: 'rgba(0, 0, 0, 0.05)'}}>
              <ul >
                <li>> Ready !</li>
                {logs}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Logger;