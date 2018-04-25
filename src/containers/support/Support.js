/*
 * @Author: Vir Desai 
 * @Date: 2018-03-22 23:11:22 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 13:45:41
 */

/**
 * Support Screen Container
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// import { init } from '../../actions/';

const Support = ({
    Layout,
}) => (
    <Layout />
);

Support.propTypes = {
    Layout: PropTypes.func.isRequired,
};

Support.defaultProps = {
};

const mapStateToProps = state => ({
});

const mapDispatchToProps = {
};

export default connect(mapStateToProps, mapDispatchToProps)(Support);
