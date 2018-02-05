import React, {Component} from "react";

const ATTR = 'data-io-view';
let number = 0;
const functions = {};
const intersectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const number = entry.target.getAttribute(ATTR);
      functions[number]();
    }
  });
});


export default class IOComponent extends Component {


  constructor(props) {
    super(props);
    this.id = `c${number++}`;
    this.state = {
      component: null
    };
    this.handleImport = this.handleImport.bind(this);
  }

  handleImport() {
    if (!this.state.component) {
      this.props.lazy()
        .then(module => module.default)
        .then(component => {
          this.setState({component});
        })
        .catch(err => {
          console.error(err);
        });
    }
  }


  componentWillUnmount() {
    if (this.elm) {
      intersectionObserver.unobserve(this.elm);
    }
  }

  componentDidMount() {
    this.elm.setAttribute(ATTR, this.id);
    functions[this.id] = () => {
      this.handleImport();
      intersectionObserver.unobserve(this.elm);
      this.elm = null;
    };
    intersectionObserver.observe(this.elm);
  }

  render() {
    if (!this.state.component) {
      return (<div ref={elm => this.elm = elm}>&nbsp;</div>);

    }
    const Tag = this.state.component;
    return (<Tag {...this.props} />);
  }
}
