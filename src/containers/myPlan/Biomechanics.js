import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const Biomechanics = ({
    Layout,
    getBiomechanicsDetails,
    user,
    plan,
}) => (
    <Layout
        getBiomechanicsDetails={getBiomechanicsDetails}
        plan={plan}
        user={user}
    />
);

Biomechanics.propTypes = {
    Layout:                 PropTypes.func.isRequired,
    getBiomechanicsDetails: PropTypes.func.isRequired,
    plan:                   PropTypes.object.isRequired,
    user:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

const mapStateToProps = (state, props) => ({
    plan: state.plan,
    user: state.user,
});

const mapDispatchToProps = {
    getBiomechanicsDetails: PlanActions.getBiomechanicsDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Biomechanics);
