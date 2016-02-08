import React from 'react';
import { Link } from 'react-router';
import classNames from 'classnames';
import { connect} from 'react-redux';

let mapStateToProps = function (state, ownProps) {
    const homeActive = state.routing.location.pathname === '/';
    const addAcive = state.routing.location.pathname === '/add';
    return {
        homeActive, addAcive
    };
};

class Header extends React.Component {
    render() {
        const clsHome = classNames({'active': this.props.homeActive});
        const clsAdd = classNames({'active': this.props.addAcive});
        return (
            <nav className="navbar navbar-default navbar-static-top" style={{backgroundColor: 'rgb(63, 81, 181)'}}>
                <div className="container-fluid">
                    <div className="navbar-header">
                        <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                                data-target="#menu-navbar-collapse" aria-expanded="false">
                            <span className="sr-only">Toggle navigation</span>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                            <span className="icon-bar"/>
                        </button>
                        <a className="navbar-brand" href="#">Deploy tool</a>
                    </div>

                    <div className="collapse navbar-collapse" id="menu-navbar-collapse">
                        <ul className="nav navbar-nav">
                            <li className={clsHome}>
                                <a href="#" data-toggle="collapse" data-target="#menu-navbar-collapse">
                                    <i className="fa fa-cog fa-home"/>&nbsp; Home <span
                                    className="sr-only">(current)</span></a></li>
                            <li className={clsAdd}>
                                <a href="#/add" data-toggle="collapse" data-target="#menu-navbar-collapse">
                                    <i className="fa fa-cog fa-plus"/>&nbsp; Add</a></li>

                        </ul>
                        <ul className="nav navbar-nav navbar-right">
                        </ul>
                    </div>
                </div>
            </nav>
        );
    }
}


export default connect(mapStateToProps)(Header);
