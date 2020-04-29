import React from 'react';
import {Layout} from 'antd';
import HeaderCustom from './Header';
import Snackbar from '../widgets/actions/Snackbar';

const {Header, Footer, Content} = Layout;


class MainLayout extends React.Component {


  render() {
    return (
      <Layout className="layout">
        <Header>
          <HeaderCustom/>
        </Header>
        <Content className="main-layout-content">
          {this.props.children}
          <Snackbar/>
        </Content>
        <Footer style={{textAlign: 'center'}}>
          Tomcat Web deploy ©2018 Created by Christophe Genin
        </Footer>
      </Layout>
    );
  }
}

export default MainLayout;
