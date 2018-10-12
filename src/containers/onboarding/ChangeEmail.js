import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const ChangeEmail = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

ChangeEmail.propTypes = {
    user: PropTypes.object.isRequired,
};

ChangeEmail.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(ChangeEmail);
