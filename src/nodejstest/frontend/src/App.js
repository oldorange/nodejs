import React, { useState } from 'react';
import { BrowserRouter, Route, Redirect, Switch } from 'react-router-dom';
import AuthPage from './pages/Auth';
import EventsPage from './pages/Events';
import BookingsPage from './pages/Bookings';
import MainNavigation from './components/Navigation/MainNavigation';
import AuthContext from './context/auth-context';
import './App.css';

const App = () => {

  const [token, setToken] = useState(null);
  const [userId, setuserId] = useState(0);
  const [tokenExpiration, settokenExpiration] = useState(null);

  const login = (token, userId, tokenExpiration) => {
    setToken(token);
    setuserId(userId);
  };

  const logout = () => {
    setToken(null);
    setuserId(0);
  };

  return (
    <BrowserRouter>
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: token,
            userId: userId,
            login: login,
            logout: logout
          }}
        >
          <MainNavigation />
          <main className="main-content">
            <Switch>
              {token && <Redirect from="/" to="/events" exact />}
              {token && (
                <Redirect from="/auth" to="/events" exact />
              )}
              {!token && (
                <Route path="/auth" component={AuthPage} />
              )}
              <Route path="/events" component={EventsPage} />
              {token && (
                <Route path="/bookings" component={BookingsPage} />
              )}
              {!token && <Redirect to="/auth" exact />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
