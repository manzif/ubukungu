import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Routes
} from 'react-router-dom';
import Register from './views/Register';
import Login from './views/Login';

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/register">
          <Register />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Routes>
    </Router>
  );
}

export default AppRoutes;
