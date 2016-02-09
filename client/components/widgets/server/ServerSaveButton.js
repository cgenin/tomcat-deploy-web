import React from 'react';
import { connect} from 'react-redux';
import { save } from '../../../modules/server/actions';
import { send, TYPE_SUCCESS } from '../../../modules/message/actions';

let mapStateToProps = function (state, ownProps) {
    const server = state.server;
    const disabled = !server.host || server.host.length === 0 || !server.username
        || server.username.length === 0 || !server.password || server.password.length === 0;
    return {
        disabled
    };
};

let mapDispatchToProps = function (dispatch) {
    return {
        onSave: function () {
            dispatch(save());
            setTimeout(()=> dispatch(send(TYPE_SUCCESS, 'config saved !')), 1000);
        }
    }
};
class ServerSaveButton extends React.Component {

    constructor(props) {
        super(props);
        this.onClick = this.onClick.bind(this);
    }

    onClick(e) {
        this.props.onSave();
    }

    render() {

        return (
            <button type="button" onClick={this.onClick} disabled={this.props.disabled} className="btn btn-default">
                <i className="fa fa-floppy-o"/>
                &nbsp;Save
            </button>);
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ServerSaveButton);
