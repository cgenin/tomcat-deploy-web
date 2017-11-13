import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/home/Home';
import AddPage from './components/pages/artifacts/Add';
import EditPage from './components/pages/artifacts/Edit';
import ServerEditPage from './components/pages/server/ServerEditPage';
import ServerAddPage from './components/pages/server/ServerAddPage';
import {ADD_ARTIFACT, EDIT_ARTIFACT, ADD_SERVER, EDIT_SERVER} from './routesConstant';

const routes = () => (

  <BrowserRouter>
    <MainLayout>
      <Route exact path="/" component={HomePage}/>
      <Route path={ADD_ARTIFACT.CST} component={AddPage}/>
      <Route path={EDIT_ARTIFACT.CST} component={EditPage}/>
      <Route path={ADD_SERVER.CST} component={ServerAddPage}/>
      <Route path={EDIT_SERVER.CST} component={ServerEditPage}/>
    </MainLayout>
  </BrowserRouter>

);

export default routes;
