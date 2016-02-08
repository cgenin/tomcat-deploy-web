import React from 'react';
import { connect} from 'react-redux';
import {Overlay} from 'react-bootstrap';

let mapStateToProps = function (state, ownProps) {
    return {
        artifacts: state.artifacts
    };
};

let mapDispatchToProps = function (dispatch) {
    return {}
};

class ItemStatus extends React.Component {
    render() {
        return (
            <span
                className="{{status.state === 'OK' ? 'text-success' :''}} {{status.state === 'KO' ? 'text-danger' :''}}">
                <i className="fa {{status.state === 'OK' ? 'fa-check' :''}} {{status.state === 'KO' ? ' fa-frown-o' :''}} "/>

                                        </span>
        );
    }

}

class ItemName extends React.Component {
    constructor(props) {
        super(props);
        this.state = {show: true};
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({show: !this.state.show});
    }

    render() {
        const style = {
            position: 'absolute',
            backgroundColor: '#EEE',
            boxShadow: '0 5px 10px rgba(0, 0, 0, 0.2)',
            border: '1px solid #CCC',
            borderRadius: 3,
            marginLeft: -5,
            marginTop: 5,
            padding: 10
        };
        const popup = 'URL : ' + this.props.artifact.url;
        return (<span>
            <a href="#" data-toggle="tooltip" data-placement="top" ref="target">{this.props.artifact.name}</a>
            <Overlay
                show={this.state.show}
                onHide={() => this.setState({ show: false })}
                placement="right" container={this} target={() => ReactDOM.findDOMNode(this.refs.target)}>
                <div style={style}>
                    <strong>{popup}</strong>
                </div>
            </Overlay>

        </span>);
    }
}

class ItemList extends React.Component {
    render() {

        return (
            <tr>
                <td scope="row">
                    <input type="checkbox"/></td>
                <td>
                    <ItemName artifact={this.props.artifact}/>
                </td>
                <td>

                </td>
                <td style={{paddingTop: '2px'}}>

                    <div className="btn-group" style={{marginTop: '4px'}}>
                        <a href="bootstrap-elements.html" data-target="#"
                           className="btn btn-raised btn-sm dropdown-toggle" data-toggle="dropdown"
                           aria-expanded="false">
                            <li className="fa fa-cogs"/>
                            <span className="caret"/>
                            <div className="ripple-container"></div>
                        </a>
                        <ul className="dropdown-menu">
                            <li><a href="#"> <i className="fa fa-trash"/>
                                Delete</a></li>
                        </ul>
                    </div>
                </td>
            </tr>
        );
    }
}

class List extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const artifacts = this.props.artifacts.map((artifact, i)=> <ItemList key={i} artifact={artifact}/>);
        return (
            <div className="col-xs-offset-1 col-xs-10">
                <table className="table table-hover">
                    <caption> Results {this.props.artifacts.length}.</caption>
                    <thead>
                    <tr>
                        <th>
                            <input type="checkbox"/>
                        </th>
                        <th>Name</th>
                        <th>Deploy</th>
                        <th/>
                    </tr>
                    </thead>
                    <tbody>
                    {artifacts}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);

