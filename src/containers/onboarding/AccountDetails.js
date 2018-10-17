import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const AccountDetails = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

AccountDetails.propTypes = {
    user: PropTypes.object.isRequired,
};

AccountDetails.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AccountDetails);
