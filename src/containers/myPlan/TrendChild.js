import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

const TrendChild = ({
    Layout,
    insightType,
    plan,
    triggerType,
}) => (
    <Layout
        insightType={insightType}
        plan={plan}
        triggerType={triggerType}
    />
);

TrendChild.propTypes = {
    Layout:      PropTypes.func.isRequired,
    insightType: PropTypes.number.isRequired,
    plan:        PropTypes.object.isRequired,
    triggerType: PropTypes.number,
};

TrendChild.defaultProps = {
    triggerType: null,
};

const mapStateToProps = (state, props) => ({
    insightType: props.insightType,
    plan:        state.plan,
    triggerType: props.triggerType,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrendChild);