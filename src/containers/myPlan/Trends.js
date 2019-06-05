import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

const Trends = ({
    Layout,
    plan,
}) => (
    <Layout
        plan={plan}
    />
);

Trends.propTypes = {
    Layout: PropTypes.func.isRequired,
    plan:   PropTypes.object.isRequired,
};

Trends.defaultProps = {};

const mapStateToProps = state => ({
    plan: state.plan,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Trends);