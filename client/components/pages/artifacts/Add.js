import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import AddForm from '../../widgets/artifacts/AddForm';
import Title from '../../widgets/Title';

class AddPage extends React.Component {
  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }
  render() {
    return (
      <div>
        <Title text="Add an artifact"/>
        <div className="row">
          <div className="panel panel-default col-xs-offset-1 col-xs-10">
            <div className="panel-body">
              <AddForm />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPage;
