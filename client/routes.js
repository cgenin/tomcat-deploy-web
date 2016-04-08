import React from 'react';
import Route from 'react-router/lib/Route';
import IndexRoute from 'react-router/lib/IndexRoute';
import MainLayout from './components/layouts/MainLayout';
import HomePage from './components/pages/home/Home';
import AddPage from './components/pages/artifacts/Add';
import EditPage from './components/pages/artifacts/Edit';
import ServerEditPage from './components/pages/server/ServerEditPage';
import ServerAddPage from './components/pages/server/ServerAddPage';
import {ADD_ARTIFACT, EDIT_ARTIFACT, ADD_SERVER, EDIT_SERVER} from './routesConstant';

export default (
  <Route>
    <Route path="/" component={MainLayout}>
      <IndexRoute component={HomePage}/>
      <Route path={ADD_ARTIFACT.CST} component={AddPage}/>
      <Route path={EDIT_ARTIFACT.CST} component={EditPage}/>
      <Route path={EDIT_SERVER.CST} component={ServerEditPage}/>
      <Route path={ADD_SERVER.CST} component={ServerAddPage}/>
    </Route>
  </Route>
);
