import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan, } from '../../actions/';

const MyPlan = ({
    Layout,
    getMyPlan,
    getSoreBodyParts,
    postReadinessSurvey,
    soreBodyParts,
    user,
}) => (
    <Layout
        getMyPlan={getMyPlan}
        getSoreBodyParts={getSoreBodyParts}
        postReadinessSurvey={postReadinessSurvey}
        soreBodyParts={soreBodyParts}
        user={user}
    />
);

MyPlan.propTypes = {
    Layout:              PropTypes.func.isRequired,
    getMyPlan:           PropTypes.func.isRequired,
    getSoreBodyParts:    PropTypes.func.isRequired,
    postReadinessSurvey: PropTypes.func.isRequired,
    soreBodyParts:       PropTypes.array.isRequired,
    user:                PropTypes.object.isRequired,
};

MyPlan.defaultProps = {
};

const mapStateToProps = state => ({
    soreBodyParts: state.plan.soreBodyParts,
    user:          state.user,
});

const mapDispatchToProps = {
    getMyPlan:           plan.getMyPlan,
    getSoreBodyParts:    plan.getSoreBodyParts,
    postReadinessSurvey: plan.postReadinessSurvey,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyPlan);