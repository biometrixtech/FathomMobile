/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:19:12 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:19:12 
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col } from 'reactstrap';
import HeaderContainer from '../../containers/base/Header';
import HeaderComponent from './Header';
import Footer from './Footer';
import { Sidebar } from './Sidebar';

const Template = ({ children }) => (
    <div style={{ backgroundColor: 'white' }}>
        <HeaderContainer Layout={HeaderComponent}/>
        <Container fluid>
            <Row>
                <Sidebar />
                <Col md='10' sm='9' className='px-sm-5 py-sm-5 ml-sm-auto'>
                    {children}
                    <Footer />
                </Col>
            </Row>
        </Container>
    </div>
);

Template.propTypes = {
    children: PropTypes.element.isRequired,
};

export default Template;
