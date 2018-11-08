/**
 * Account Type Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AccountType = ({
    Layout,
}) => (
    <Layout />
);

AccountType.propTypes = {
    Layout: PropTypes.func.isRequired,
};

AccountType.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AccountType);
