/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:19:03 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:19:03 
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';

// Templates
import TemplateNothing from '../components/TemplateNothing';
import TemplateSidebar from '../components/TemplateSidebar';

// Routes
import ReportContainer from '../../containers/report/Report';
import ReportComponent from '../components/Report';

import SignUpContainer from '../../containers/auth/SignUp';
import SignUpComponent from '../components/SignUp';

import LoginContainer from '../../containers/auth/Login';
import LoginComponent from '../components/Login';

import ForgotPasswordContainer from '../../containers/auth/ForgotPassword';
import ForgotPasswordComponent from '../components/ForgotPassword';

import Error from '../components/Error';

const Index = () => (
    <Switch>
        <Route
            path="/login"
            render={props => <TemplateNothing><LoginContainer {...props} Layout={LoginComponent} /></TemplateNothing>}
        />
        <Route
            exact
            path="/"
            render={props => <TemplateNothing><LoginContainer {...props} Layout={LoginComponent} /></TemplateNothing>}
        />
        <Route
            path="/sign-up"
            render={props => <TemplateNothing><SignUpContainer {...props} Layout={SignUpComponent} /></TemplateNothing>}
        />
        <Route
            path="/forgot-password"
            render={props => <TemplateNothing><ForgotPasswordContainer {...props} Layout={ForgotPasswordComponent} /></TemplateNothing>}
        />
        <Route
            path="/report"
            render={props => (
                <TemplateSidebar>
                    <ReportContainer {...props} Layout={ReportComponent}/>
                </TemplateSidebar>
            )}
        />
        <Route
            render={props => (
                <TemplateSidebar>
                    <Error {...props} title="404" content="Sorry, the route you requested does not exist" />
                </TemplateSidebar>
            )}
        />
    </Switch>
);

export default Index;
