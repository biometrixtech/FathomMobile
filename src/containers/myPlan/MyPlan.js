import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const MyPlan = ({
    Layout,
}) => (
    <Layout />
);

MyPlan.propTypes = {
    Layout: PropTypes.func.isRequired,
};

MyPlan.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);