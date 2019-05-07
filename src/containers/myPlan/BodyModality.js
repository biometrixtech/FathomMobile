import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { plan as PlanActions, } from '../../actions';

const BodyModality = ({
    Layout,
    handleBodyPartClick,
    modality,
    patchBodyActiveRecovery,
    plan,
}) => (
    <Layout
        handleBodyPartClick={handleBodyPartClick}
        modality={modality}
        patchBodyActiveRecovery={patchBodyActiveRecovery}
        plan={plan}
    />
);

BodyModality.propTypes = {
    handleBodyPartClick:     PropTypes.func.isRequired,
    modality:                PropTypes.string.isRequired,
    patchBodyActiveRecovery: PropTypes.func.isRequired,
    plan:                    PropTypes.object.isRequired,
};

BodyModality.defaultProps = {};

const mapStateToProps = (state, props) => ({
    modality: props.modality,
    plan:     state.plan,
});

const mapDispatchToProps = {
    handleBodyPartClick:     PlanActions.handleBodyPartClick,
    patchBodyActiveRecovery: PlanActions.patchBodyActiveRecovery,
};

export default connect(mapStateToProps, mapDispatchToProps)(BodyModality);