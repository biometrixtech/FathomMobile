/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:20:16 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:20:16 
 */

import React from 'react';
import { Row, Col } from 'reactstrap';

const Footer = () => (
    <footer className='mt-5'>
        <Row>
            <Col sm='12' className='text-right pt-3'>
                <p>
                    Learn More on the <a target='_blank' rel='noopener noreferrer' href='https://github.com/biometrixtech/FathomMobile'>Github Repo</a> | Created by Vir Desai.
                </p>
            </Col>
        </Row>
    </footer>
);

export default Footer;
