import React from 'react';
import Header from '../widgets/header';

class MainLayout extends React.Component {

    componentDidMount() {
        $.material.init();
    }

    render() {

        return (
            <div>
                <Header/>
                {this.props.children}
            </div>
        );
    }
}

export default MainLayout;
