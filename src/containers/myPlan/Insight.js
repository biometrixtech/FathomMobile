import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

const Insight = ({
    Layout,
    insightType,
    plan,
}) => (
    <Layout
        insightType={insightType}
        plan={plan}
    />
);

Insight.propTypes = {
    Layout:      PropTypes.func.isRequired,
    insightType: PropTypes.number.isRequired,
    plan:        PropTypes.object.isRequired,
};

Insight.defaultProps = {};

const mapStateToProps = (state, props) => ({
    insightType: props.insightType,
    plan:        state.plan,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Insight);