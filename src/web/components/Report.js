/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:19:45 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-30 13:25:54
 */

import React from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Row, Col, Jumbotron } from 'reactstrap';

class Home extends React.Component {
    static propTypes = {
        user:         PropTypes.shape({}),
        init:         PropTypes.shape({}),
        login:        PropTypes.func.isRequired,
        getTeams:     PropTypes.func.isRequired,
        getTeamStats: PropTypes.func.isRequired,
        startRequest: PropTypes.func.isRequired,
        stopRequest:  PropTypes.func.isRequired,
        selectGraph:  PropTypes.func.isRequired,
        userSelect:   PropTypes.func.isRequired,
        history:      PropTypes.shape({
            push: PropTypes.func.isRequired,
        }).isRequired,
    }

    static defaultProps = {
    }

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount = () => {
        if (this.props.init.jwt) {
            this.props.login(this.props.init, true);
        }
    }

    render = () => {
        if (!this.props.init.jwt) {
            return <Redirect to='/login' />
        }
        return (
            <div>
                <Row>
                    <Jumbotron className='bg-primary text-white'>
                        <h1>Web & Mobile App Starter</h1>
                        <p className='lead'>What's up Fathom?</p>
                        <p>This Cross Platform App Starter is built to support both a web app + mobile app so we don't have to write and maintain multiple different code bases. The project shares the 'business logic' and allows flexibility in View components to ensure the project looks and feels native in each platform.</p>
                    </Jumbotron>
                </Row>
                <Row className='pt-5'>
                    <Col xs='12' md='6' className='pt-3 pt-md-0'>
                        <h3><i className='icon-map' />Routing</h3>
                        <p>React Router is used to handle all web-side routing.</p>
                        <p>
                            <a target='_blank' rel='noopener noreferrer' href='https://github.com/ReactTraining/react-router' className='btn btn-primary'>
                                React Router Docs
                            </a>
                        </p>
                    </Col>
                    <Col xs='12' md='6' className='pt-3 pt-md-0'>
                        <h3><i className='icon-organization' />Redux</h3>
                        <p>State management the 'clean way' via Redux is setup - woohoo!</p>
                        <p>
                            <a target='_blank' rel='noopener noreferrer' href='https://redux.js.org/docs/introduction/' className='btn btn-primary'>
                                Redux Docs
                            </a>
                        </p>
                    </Col>
                </Row>
                <Row className='pt-md-5 pb-5'>
                    <Col xs='12' md='6' className='pt-3 pt-md-0'>
                        <h3><i className='icon-layers' />Redux Persist</h3>
                        <p>Persist the data stored in Redux for faster load times without needing to hit the server each page load.</p>
                        <p>
                            <a target='_blank' rel='noopener noreferrer' href='https://github.com/rt2zz/redux-persist' className='btn btn-primary'>
                                Redux Persist Docs
                            </a>
                        </p>
                    </Col>
                    <Col xs='12' md='6' className='pt-3 pt-md-0'>
                        <h3><i className='icon-drop' />Web Styles</h3>
                        <p>Webpack, SCSS, Bootstrap and ReactStrap - ready at our fingertips.</p>
                        <p>
                            <a target='_blank' rel='noopener noreferrer' href='https://reactstrap.github.io/components/alerts/' className='btn btn-primary'>
                                ReactStrap Docs
                            </a>
                        </p>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default withRouter(Home);
