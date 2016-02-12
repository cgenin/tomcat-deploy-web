import React from 'react';
import { Route } from 'react-router';

import MainLayout from './components/layouts/mainLayout';
import HomePage from './components/pages/home/Home';
import AddPage from './components/pages/add/Add';
import ServerEditPage from './components/pages/server/ServerEditPage';
import ServerAddPage from './components/pages/server/ServerAddPage';

export default (
  <Route>
    <Route component={MainLayout}>
      <Route path="/" component={HomePage}/>
      <Route path="/add" component={AddPage}/>
      <Route path="/server/edit" component={ServerEditPage}/>
      <Route path="/server/add" component={ServerAddPage}/>
    </Route>
  </Route>
);
