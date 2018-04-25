import React from 'react';
import { Row, Col, Jumbotron } from 'reactstrap';

const About = () => (
    <div>
        <Row>
            <Jumbotron className='bg-primary text-white'>
                <h1>Web & Mobile App Starter</h1>
                <p className='lead'>What's up Paul?</p>
                <p>This Cross Platform App Starter is built to support both a web app + mobile app so we don't have to write and maintain multiple different code bases. The project shares the 'business logic' and allows flexibility in View components to ensure the project looks and feels native in each platform.</p>
            </Jumbotron>
        </Row>
        <Row className='pt-5'>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-map' /> Routing</h3>
                <p>React Router is used to handle all web-side routing.</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://github.com/ReactTraining/react-router' className='btn btn-primary'>
                        React Router Docs
                    </a>
                </p>
            </Col>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-fire' /> Firebase</h3>
                <p>Firebase is all ready to go with examples on how to read/write data to/from Firebase but just as a temporary example in this case for simple data.</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://firebase.google.com/docs/database/web/start' className='btn btn-primary'>
                        Firebase Docs
                    </a>
                </p>
            </Col>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-organization' /> Redux</h3>
                <p>State management the 'clean way' via Redux is setup - woohoo!</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://redux.js.org/docs/introduction/' className='btn btn-primary'>
                        Redux Docs
                    </a>
                </p>
            </Col>
        </Row>
        <Row className='pt-md-5 pb-5'>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-layers' /> Redux Persist</h3>
                <p>Persist the data stored in Redux for faster load times without needing to hit the server each page load (disabled right now because of N+1 loads needed for new assets to get through the background cache).</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://github.com/rt2zz/redux-persist' className='btn btn-primary'>
                        Redux Persist Docs
                    </a>
                </p>
            </Col>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-drop' /> Web Styles</h3>
                <p>Webpack, SCSS, Bootstrap and ReactStrap - ready at our fingertips.</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://reactstrap.github.io/components/alerts/' className='btn btn-primary'>
                        ReactStrap Docs
                    </a>
                </p>
            </Col>
            <Col xs='12' md='4' className='pt-3 pt-md-0'>
                <h3><i className='icon-user-following' /> Auth</h3>
                <p>Initial POC Auth with Firebase`</p>
                <p>
                    <a target='_blank' rel='noopener noreferrer' href='https://firebase.google.com/docs/auth/' className='btn btn-primary'>
                        Firebase Auth Docs
                    </a>
                </p>
            </Col>
        </Row>
        <hr />
        <Row className='pt-5'>
            <Col xs='5' sm='3' lg='2' className='offset-lg-2'>
                <img className='img-fluid rounded-circle' src='https://avatars0.githubusercontent.com/u/9044436?s=460&v=4' />
            </Col>
            <Col xs='12' sm='9' lg='5' className='pt-4 pt-sm-0'>
                <h3>Built by: <a target='_blank' rel='noopener noreferrer' href='https://virdesai.github.io'>Vir Desai</a></h3>
            </Col>
        </Row>
    </div>
);

export default About;
