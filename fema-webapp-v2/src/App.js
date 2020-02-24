import React, { Component } from 'react';
import Layout from './components/Layout/Layout';
import AppBuilder from './containers/AppBuilder/AppBuilder';
import Landing from './containers/Landing/Landing'
import { Route, Switch, withRouter, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actionCreators from './store/actions/index';
import asyncComponent from './hoc/asyncComponent/asyncComponent'


const asyncApplications = asyncComponent(() => {
  return import('./containers/Applications/Applications')
});

const asyncReports = asyncComponent(() => {
  return import('./containers/Reports/Reports')
});

const asyncAuth = asyncComponent(() => {
  return import('./containers/Auth/Auth')
});

export class App extends Component {


  componentDidMount() {
    this.props.onTryAutoSignIn();
  }

  render() {
    let routes = (
      <Switch>
        <Route path="/login" component={asyncAuth} />
        <Route path="/process" component={asyncApplications} />
        <Route path="/reports" component={asyncReports} />
        <Route path="/app" exact component={AppBuilder} />
        <Route path="/" exact component={Landing} />
      </Switch>)

    if (!this.props.isAuthenticated) {
      routes = (
        <Switch>
          <Route path="/login" component={asyncAuth} />
          <Route path="/" exact component={Landing} />
          <Redirect to="/" />
        </Switch>);
    }
    return (
        <div>
          <Layout>
            {routes}
          </Layout>
        </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.auth.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onTryAutoSignIn: () => dispatch(actionCreators.checkAuthState())
  };
};


export default withRouter(connect(mapStateToProps, mapDispatchToProps)(App));

