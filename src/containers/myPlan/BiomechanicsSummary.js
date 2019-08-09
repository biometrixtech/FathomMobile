import React from 'react';
import PropTypes from 'prop-types';
import { connect, } from 'react-redux';

const BiomechanicsSummary = ({
    Layout,
    title,
}) => (
    <Layout
        title={title}
    />
);

BiomechanicsSummary.propTypes = {
    Layout: PropTypes.func.isRequired,
    title:  PropTypes.string.isRequired,
};

BiomechanicsSummary.defaultProps = {};

const mapStateToProps = (state, props) => ({
    title: props.title,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(BiomechanicsSummary);