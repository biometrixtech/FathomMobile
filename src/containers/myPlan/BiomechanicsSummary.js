import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

const BiomechanicsSummary = ({
    Layout,
    currentIndex,
    plan,
    step,
    title,
}) => (
    <Layout
        currentIndex={currentIndex}
        plan={plan}
        step={step}
        title={title}
    />
);

BiomechanicsSummary.propTypes = {
    Layout:       PropTypes.func.isRequired,
    currentIndex: PropTypes.number.isRequired,
    plan:         PropTypes.object.isRequired,
    step:         PropTypes.number.isRequired,
    title:        PropTypes.string.isRequired,
};

BiomechanicsSummary.defaultProps = {};

const mapStateToProps = (state, props) => ({
    currentIndex: props.currentIndex,
    plan:         state.plan,
    step:         props.step,
    title:        props.title,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BiomechanicsSummary);