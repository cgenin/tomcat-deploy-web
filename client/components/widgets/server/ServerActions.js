import React from 'react';
import { connect} from 'react-redux';
let mapStateToProps = function (state) {

    return {};
};

let mapDispatchToProps = function (dispatch) {
    return {
        onEdit: function () {

        }
    }
};
class ServerActions extends React.Component {
    render() {
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-2 col-xs-12 text-right " >
                    <select id="" className="form-control" style={{marginTop:'-28px'}}>
                        <option>1</option>
                        <option>2</option>
                        <option>3</option>
                        <option>4</option>
                        <option>5</option>
                    </select>
                </div>
                <div className="col-md-6 col-xs-12 text-left">
                    <div className="btn-group-sm">
                    <a href="javascript:void(0)" className="btn btn-xs btn-success btn-fab"><i className="material-icons">create</i></a>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerActions);