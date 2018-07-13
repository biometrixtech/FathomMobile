/*
 * @Author: Vir Desai 
 * @Date: 2018-07-12 18:48:09 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-07-13 11:27:41
 */

/**
 * SVGImage
 *
     <SVGImage svg={height: 100, width: 100} image={source: require('../some/image/path.svg')} />
 *
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';

/* Component ==================================================================== */
class SVGImage extends Component {
    static propTypes = {
        svg:   PropTypes.object,
        image: PropTypes.object,
    }

    static defaultProps = {
        svg:   {},
        image: {}
    }

    imageProps = () => {
        // Defaults
        const props = {
            ...this.props.image,
            href: this.props.image.source // just a guess if that works or not
        };

        return props;
    }

    svgProp = () => {
        // Defaults
        const props = {
            ...this.props.svg
        };

        return props;
    }

    render = () => (null);
}

/* Export Component ==================================================================== */
export default SVGImage;
