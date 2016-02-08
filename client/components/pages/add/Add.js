import React from 'react';
import AddForm from '../../widgets/artifacts/AddForm';

class AddPage extends React.Component {
    render() {
        return (
            <div>
                <div className="row">
                    <div className="col-xs-offset-1 col-xs-10 text-center">
                        <div className="title-container">
                            <div className="ribbon-left"></div>
                            <div className="backflag-left"></div>
                            <div className="title"><a href="#">Add an artifact</a></div>
                            <div className="backflag-right"></div>
                            <div className="ribbon-right"></div>
                        </div>
                    </div>
                </div>
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
