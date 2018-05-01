/*
 * @Author: Vir Desai 
 * @Date: 2018-04-30 13:20:21 
 * @Last Modified by:   Vir Desai 
 * @Last Modified time: 2018-04-30 13:20:21 
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import { Link } from 'react-router-dom';

const Error = ({ title, content }) => (
    <Row>
        <Col lg='4'>
            <h2>{title}</h2>
            <p>{content}</p>
            <p>
                <Link to='/' className='btn btn-primary'>Go Home</Link>
            </p>
        </Col>
    </Row>
);

Error.propTypes = {
    title:   PropTypes.string,
    content: PropTypes.string,
};

Error.defaultProps = {
    title:   'Uh oh',
    content: 'An unexpected error came up',
};

export default Error;
