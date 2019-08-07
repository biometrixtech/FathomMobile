import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const TrendChild = ({
    Layout,
    clearFTECategory,
    clearFTEView,
    insightType,
    plan,
    triggerType,
}) => (
    <Layout
        clearFTECategory={clearFTECategory}
        clearFTEView={clearFTEView}
        insightType={insightType}
        plan={plan}
        triggerType={triggerType}
    />
);

TrendChild.propTypes = {
    Layout:           PropTypes.func.isRequired,
    clearFTECategory: PropTypes.func.isRequired,
    clearFTEView:     PropTypes.func.isRequired,
    insightType:      PropTypes.number.isRequired,
    plan:             PropTypes.object.isRequired,
    triggerType:      PropTypes.number,
};

TrendChild.defaultProps = {
    triggerType: null,
};

const mapStateToProps = (state, props) => ({
    clearFTECategory: PlanActions.clearFTECategory,
    clearFTEView:     PlanActions.clearFTEView,
    insightType:      props.insightType,
    plan:             state.plan,
    triggerType:      props.triggerType,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TrendChild);