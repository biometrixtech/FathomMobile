import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Onboarding = ({
    Layout,
}) => (
    <Layout />
);

Onboarding.propTypes = {
    Layout: PropTypes.func.isRequired,
};

Onboarding.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Onboarding);
