import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';


export class TimeSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <div className="timer"></div>;
  }
}

export class TypingloaderSpinner extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return <div className="typing_loader"></div>;
  }
}
