import React from 'react';
import {Route} from 'react-router';
import {BrowserRouter} from 'react-router-dom';
import MainLayout from './components/layouts/MainLayout';
import routesMd from './components/pages/Markdowns'
import {ADD_ARTIFACT, EDIT_ARTIFACT, ADD_SERVER, EDIT_SERVER, HOME, ADD_SCHEDULER} from './routesConstant';
import AsyncComponent from "./AsyncComponent";

const LazyAddPage = AsyncComponent(() => import(/* webpackChunkName: "add-artifact" */ './components/pages/artifacts/Add'));
const LazyServerAddPage = AsyncComponent(() => import(/* webpackChunkName: "add-server" */ './components/pages/server/ServerAddPage'));
const LazyHome = AsyncComponent(() => import(/* webpackChunkName: "home" */ './components/pages/home/Home'));
const LazyEdit = AsyncComponent(() => import(/* webpackChunkName: "edit-artifact" */ './components/pages/artifacts/Edit'));
const LazyServerEdit = AsyncComponent(() => import(/* webpackChunkName: "edit-server" */ './components/pages/server/ServerEditPage'));
const LazySchedulers = AsyncComponent(() => import(/* webpackChunkName: "add-scheduler" */ './components/pages/schedulers/Scheduler'));

const routes = () => (
  <BrowserRouter>
    <MainLayout>
      <Route exact path={HOME.CST()} component={LazyHome}/>
      <Route path={ADD_ARTIFACT.CST()} component={LazyAddPage}/>
      <Route path={EDIT_ARTIFACT.CST()} component={LazyEdit}/>
      <Route path={ADD_SERVER.CST()} component={LazyServerAddPage}/>
      <Route path={EDIT_SERVER.CST()} component={LazyServerEdit}/>
      <Route path={ADD_SCHEDULER.CST()} component={LazySchedulers}/>
      {routesMd.map(r => <Route key={r.path} path={r.path} component={r.component}/>)}
    </MainLayout>
  </BrowserRouter>
);

export default routes;
