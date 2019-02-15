/**
 * Account Type Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { init, user, } from '../../actions';

const InviteCode = ({
    Layout,
    checkAccountCode,
    setAccountCode,
}) => (
    <Layout
        checkAccountCode={checkAccountCode}
        setAccountCode={setAccountCode}
    />
);

InviteCode.propTypes = {
    Layout:           PropTypes.func.isRequired,
    checkAccountCode: PropTypes.func.isRequired,
    setAccountCode:   PropTypes.func.isRequired,
};

InviteCode.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    checkAccountCode: user.checkAccountCode,
    setAccountCode:   init.setAccountCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteCode);
