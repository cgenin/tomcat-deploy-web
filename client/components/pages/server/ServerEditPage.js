import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import Title from '../../widgets/Title';
import ServerEdit from '../../widgets/server/Edition';
import connect from 'react-redux/lib/components/connect';


const mapStateToProps = function (state) {
  const query = state.routing.location.query;
  if (!query.i) {
    return {add: true};
  }
  const id = query.i;
  return {add: false, id};
};


class ServerEditPage extends React.Component {

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div>
        <Title text="Edit and Save server"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <ServerEdit add={this.props.add} id={this.props.id}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
ServerEditPage.propTypes = {add: React.PropTypes.bool.isRequired, id: React.PropTypes.string};

export default connect(mapStateToProps)(ServerEditPage);
