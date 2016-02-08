import React from 'react';
import { Route } from 'react-router';

import MainLayout from './components/layouts/mainLayout';
import HomePage from './components/pages/home/Home';
import AddPage from './components/pages/add/Add';

export default (
  <Route>
    <Route component={MainLayout}>
      <Route path="/" component={HomePage}/>
      <Route path="/add" component={AddPage}/>
    </Route>
  </Route>
);
