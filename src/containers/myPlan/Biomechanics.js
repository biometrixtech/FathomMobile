import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const Biomechanics = ({
    Layout,
    dataType,
    getBiomechanicsDetails,
    index,
    plan,
    session,
    user,
}) => (
    <Layout
        dataType={dataType}
        getBiomechanicsDetails={getBiomechanicsDetails}
        index={index}
        plan={plan}
        session={session}
        user={user}
    />
);

Biomechanics.propTypes = {
    Layout:                 PropTypes.func.isRequired,
    dataType:               PropTypes.number.isRequired,
    getBiomechanicsDetails: PropTypes.func.isRequired,
    index:                  PropTypes.string.isRequired,
    plan:                   PropTypes.object.isRequired,
    session:                PropTypes.object.isRequired,
    user:                   PropTypes.object.isRequired,
};

Biomechanics.defaultProps = {};

const mapStateToProps = (state, props) => ({
    dataType: props.dataType,
    index:    props.index,
    plan:     state.plan,
    session:  props.session,
    user:     state.user,
});

const mapDispatchToProps = {
    getBiomechanicsDetails: PlanActions.getBiomechanicsDetails,
};

export default connect(mapStateToProps, mapDispatchToProps)(Biomechanics);
