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
import CreateCode from './scenes/teacher/createQuestion/createCode';
import CreateTest from './scenes/teacher/createTest/createTest';
import ViewQuestions from './scenes/teacher/question/ViewQuestions';
import ViewTests from './scenes/teacher/test/ViewTests';
import ViewTest from './scenes/teacher/test/ViewTest';
import SLogin from './scenes/StudentLogin/slogin';
import EnterSet from './scenes/student/enterSet';
import NewSectionA from './scenes/student/newSectionA';
import NewSectionB from './scenes/student/newSectionB';
import StudentList from './scenes/teacher/eval/StudentList';
import EvalCode from './scenes/teacher/eval/EvalCode';

function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/" component={Login} />
        <Route path="/student" component={SLogin} />
        <ProtectedRoute path="/manage" component={HomeTeacher} />
        <ProtectedRoute path="/enter-set" component={EnterSet} />
        <ProtectedRoute path="/section-a" component={NewSectionA} />
        <ProtectedRoute path="/section-b" component={NewSectionB} />
        <ProtectedRoute path="/reset" component={LoggedInList} />
        <ProtectedRoute path="/create-test" component={CreateTest} />
        <ProtectedRoute path="/create-question" component={SelectType} />
        <ProtectedRoute path="/create-mcq" component={CreateMcq} />
        <ProtectedRoute path="/questions" component={ViewQuestions} />
        <ProtectedRoute path="/view-tests" component={ViewTests} />
        <ProtectedRoute path="/view-paper" component={ViewTest} />
        <ProtectedRoute path="/create-code" component={CreateCode} />
        <ProtectedRoute path="/student-list" component={StudentList} />
        <ProtectedRoute path="/eval-code" component={EvalCode} />
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
