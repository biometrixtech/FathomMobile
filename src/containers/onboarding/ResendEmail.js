import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ResendEmail = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

ResendEmail.propTypes = {
    user: PropTypes.object.isRequired,
};

ResendEmail.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ResendEmail);
