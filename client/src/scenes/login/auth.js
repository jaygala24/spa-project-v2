class Auth {
  constructor() {
    this.authenticated = Boolean(localStorage.getItem('token'));
  }
  login = (callback = () => console.log('Logged in')) => {
    this.authenticated = true;
    callback();
  };

  logout = (callback = () => console.log('Logged out')) => {
    this.authenticated = false;
    callback();
  };

  isAuthenticated = () => {
    return this.authenticated;
  };
}

export default new Auth();
