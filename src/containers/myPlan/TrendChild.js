import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const TrendChild = ({
    Layout,
}) => (
    <Layout />
);

TrendChild.propTypes = {
    Layout: PropTypes.func.isRequired,
};

TrendChild.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrendChild);