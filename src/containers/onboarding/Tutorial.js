import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const Tutorial = ({
    Layout,
    user,
}) => (
    <Layout
        user={user}
    />
);

Tutorial.propTypes = {
    user: PropTypes.object.isRequired,
};

Tutorial.defaultProps = {};

const mapStateToProps = state => ({
    user: state.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Tutorial);
