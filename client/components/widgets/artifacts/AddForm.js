import React from 'react';
import { connect} from 'react-redux';
import { save } from '../../../modules/artifacts/actions';
import { routeActions } from 'react-router-redux';

const mapStateToProps = function (state) {
  return {
    routing: state.routing
  };
};

const mapDispatchToProps = function (dispatch) {
  return {
    onSave: function (name, url) {
      dispatch(save(name, url)).then(() => dispatch(routeActions.push('/')));
    }
  };
};

class AddForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      url: '',
      disabled: true
    };
    this.onClick = this.onClick.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  onClick(e) {
    e.preventDefault();
    const name = this.state.name;
    const url = this.state.url;
    this.props.onSave(name, url);
    return false;
  }

  onChange() {
    const name = this.refs.name.value;
    const url = this.refs.url.value;
    const disabled = name.length === 0 || url.length === 0;
    this.setState({name, url, disabled});
  }

  render() {
    return (
      <form >

        <div className="form-group ">
          <label className="control-label" htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" placeholder="Name"
                 value={this.state.name} onChange={this.onChange} ref="name"
          />
        </div>
        <div className="form-group">
          <label className="control-label" htmlFor="url">Url</label>

          <div className="input-group">
            <span className="input-group-addon">http://</span>
            <input type="text" className="form-control" id="url" placeholder="Url" value={this.state.url}
                   onChange={this.onChange} ref="url"
            />
          </div>
        </div>
        <div className="col-xs-offset-4 col-xs-4">
          <a href="#/" className="btn btn-default">
            <li className="fa fa-backward"/>
            &nbsp;Cancel
          </a>
        </div>
        <div className=" col-xs-4">
          <button type="button" onClick={this.onClick} className="btn btn-primary" disabled={this.state.disabled}>
            <li className="glyphicon glyphicon-ok"/>
            &nbsp;Submit
          </button>
        </div>
      </form>
    );
  }
}

AddForm.propTypes = {routing: React.PropTypes.object.isRequired};

export default connect(mapStateToProps, mapDispatchToProps)(AddForm);
