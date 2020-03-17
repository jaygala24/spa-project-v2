import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './scenes/login/protectedRoute';
import Login from './scenes/login/Login';
import HomeTeacher from './scenes/teacher/home/Home';
import LoggedInList from './scenes/teacher/reset/LogedInList';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <ProtectedRoute path="/manage" component={HomeTeacher} />
        <ProtectedRoute path="/reset" component={LoggedInList} />
        <Route
          render={() => <h1 align="center">404 Page Not Found</h1>}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
