import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ProtectedRoute } from './scenes/login/protectedRoute';
import Login from './scenes/login/Login';
import HomeTeacher from './scenes/teacher/home/Home';
import LoggedInList from './scenes/teacher/reset/LogedInList';
import Describe from './scenes/teacher/createTest/Describe';
import SelectType from './scenes/teacher/createQuestion/selectType';
import CreateMcq from './scenes/teacher/createQuestion/createMCQ';
import GeneratePassword from './scenes/teacher/GeneratePassword';
import ChangePassword from './scenes/teacher/ChangePassword';
import CreateStudentUser from './scenes/teacher/CreateStudentUser';
import CreateTeacherUser from './scenes/teacher/CreateTeacherUser';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <ProtectedRoute path="/manage" component={HomeTeacher} />
        <ProtectedRoute path="/reset" component={LoggedInList} />
        <ProtectedRoute path="/create-test" component={Describe} />
        <ProtectedRoute path="/create-question" component={SelectType} />
        <ProtectedRoute path="/create-mcq" component={CreateMcq} />
        <ProtectedRoute
          path="/generate-password"
          component={GeneratePassword}
        />
        <ProtectedRoute
          path="/change-password"
          component={ChangePassword}
        />
        <ProtectedRoute
          path="/add-student"
          component={CreateStudentUser}
        />
        <ProtectedRoute
          path="/add-teacher"
          component={CreateTeacherUser}
        />
        <Route
          render={() => <h1 align="center">404 Page Not Found</h1>}
        />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
