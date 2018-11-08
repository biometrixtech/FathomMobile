/**
 * Account Type Container
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { user, } from '../../actions';

const InviteCode = ({
    Layout,
    checkAccountCode,
}) => (
    <Layout
        checkAccountCode={checkAccountCode}
    />
);

InviteCode.propTypes = {
    Layout:           PropTypes.func.isRequired,
    checkAccountCode: PropTypes.func.isRequired
};

InviteCode.defaultProps = {};

const mapStateToProps = state => ({});

const mapDispatchToProps = {
    checkAccountCode: user.checkAccountCode,
};

export default connect(mapStateToProps, mapDispatchToProps)(InviteCode);
