/**
 * Account Type Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { init as InitActions, } from '../../actions';

const AccountType = ({
    Layout,
    setAccountCode,
}) => (
    <Layout
        setAccountCode={setAccountCode}
    />
);

AccountType.propTypes = {
    Layout:         PropTypes.func.isRequired,
    setAccountCode: PropTypes.func.isRequired,
};

AccountType.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    setAccountCode: InitActions.setAccountCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountType);
