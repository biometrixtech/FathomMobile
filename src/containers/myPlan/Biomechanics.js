import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const Biomechanics = ({
    Layout,
    getBiomechanicsDetails,
    plan,
}) => (
    <Layout
        getBiomechanicsDetails={getBiomechanicsDetails}
        plan={plan}
    />
);

Biomechanics.propTypes = {
    Layout:                 PropTypes.func.isRequired,
    getBiomechanicsDetails: PropTypes.func.isRequired,
    plan:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

const mapStateToProps = (state, props) => ({
    plan: state.plan,
});

const mapDispatchToProps = {
    getBiomechanicsDetails: PlanActions.getBiomechanicsDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Biomechanics);