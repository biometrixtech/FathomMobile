/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:19:17 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-05-05 21:43:01
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Container, Row, Col, Media } from 'reactstrap';
import { AppColors } from '../../constants';
import logo from '../../assets/images/fathom-colored.png';

const Template = ({ children }) => (
    <Container style={{ flexDirection: 'column', alignItems: 'center', display: 'flex' }}>
        <Media className='responsive' object src={logo} alt={'Fathom logo'}/>
        <Container style={{ padding: 10 }}>
            <Row>
                <Col sm='12'>
                    {children}
                </Col>
            </Row>
        </Container>
    </Container>
); 

Template.propTypes = { children: PropTypes.element.isRequired };

export default Template;
