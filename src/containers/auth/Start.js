import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Start = ({
    Layout,
}) => (
    <Layout />
);

Start.propTypes = {
    Layout: PropTypes.func.isRequired,
};

Start.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Start);
