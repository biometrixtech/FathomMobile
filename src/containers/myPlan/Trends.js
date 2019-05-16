import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Trends = ({
    Layout,
}) => (
    <Layout />
);

Trends.propTypes = {
    Layout: PropTypes.func.isRequired,
};

Trends.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Trends);