import React, { PureComponent, } from 'react';
import PropTypes from 'prop-types';
import { View, } from 'react-native';

// import third-party libraries
import * as d3Scale from 'd3-scale';
import * as array from 'd3-array';
import Svg, { G, Image, Text as SVGText, } from 'react-native-svg';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, } from '../../../constants';

// Components
import { TabIcon, Text, } from '../../custom';

/* Component ==================================================================== */
class XAxis extends PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            height: 0,
            width:  0,
        };
    }

    _getX = domain => {
        const {
            contentInset: {
                left = 0,
                right = 0,
            },
            scale,
            spacingInner,
            spacingOuter,
        } = this.props;
        const { width, } = this.state;
        const x = scale()
            .domain(domain)
            .range([ left, width - right ]);
        if (scale === d3Scale.scaleBand) {
            x
                .paddingInner([ spacingInner ])
                .paddingOuter([ spacingOuter ]);
            // add half a bar to center label
            return (value) => x(value) + (x.bandwidth() / 2);
        }
        return x;
    }

    _onLayout = event => {
        const { nativeEvent: { layout: { width, height } } } = event;
        if (width !== this.state.width) {
            this.setState({ width, height });
        }
    }

    render = () => {
        const {
            children,
            data,
            formatLabel,
            max,
            min,
            numberOfTicks,
            scale,
            style,
            svg,
            xAccessor,
        } = this.props
        const { height, width, } = this.state;
        if (data.length === 0) {
            return <View style={style} />;
        }
        const values = data.map((item, index) => xAccessor({ item, index }));
        const extent = array.extent(values);
        const domain = scale === d3Scale.scaleBand ? values : [ min || extent[0], max || extent[1] ];
        const x = this._getX(domain);
        const ticks = numberOfTicks ? x.ticks(numberOfTicks) : values;
        const extraProps = {
            formatLabel,
            height,
            ticks,
            x,
        };
        return (
            <View style={style}>
                <View
                    style={{flexGrow: 1,}}
                    onLayout={event => this._onLayout(event)}
                >
                    {/* invisible text to allow for parent resizing */}
                    <Text style={{fontSize: svg.fontSize, opacity: 0,}}>
                        {formatLabel(ticks[0], 0)}
                    </Text>
                    {(height > 0 && width > 0) &&
                        <Svg style={{
                            left:     0,
                            position: 'absolute',
                            top:      0,
                            height,
                            width,
                        }}>
                            <G>
                                {React.Children.map(children, child =>
                                    React.cloneElement(child, extraProps)
                                )}
                                {
                                    // don't render labels if width isn't measured yet,
                                    // causes rendering issues
                                    (width > 0) &&
                                    ticks.map((value, index) => {
                                        const { svg: valueSvg = {} } = data[index] || {};
                                        console.log(data[index]);
                                        return (
                                            <SVGText
                                                {...svg}
                                                {...valueSvg}
                                                alignmentBaseline={'hanging'}
                                                key={index}
                                                originX={x(value)}
                                                textAnchor={'middle'}
                                                x={x(value)}
                                            >
                                                {formatLabel(value, index)}
                                                { data[index].hasMultipleSports ?
                                                    <TabIcon
                                                        color={data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light}
                                                        icon={'checkbox-multiple-marked-circle'}
                                                        size={20}
                                                        type={'material-community'}
                                                    />
                                                    : data[index].filteredSport ?
                                                        <Image
                                                            fill={data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light}
                                                            height={20}
                                                            href={data[index].filteredSport.imagePath}
                                                            key={index}
                                                            width={20}
                                                            x={x(value)}
                                                            y={(AppFonts.scaleFont(11) + AppSizes.paddingXSml)}//(index + 1) * 25 * -1}

                                                            // source={data[index].filteredSport.imagePath}
                                                            // style={{height: 20, tintColor: data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light, width: 20,}}
                                                        />
                                                        :
                                                        <View style={{height: 20, width: 20,}} />
                                                }
                                            </SVGText>
                                        )
                                    })
                                }
                                {
                                    // don't render labels if width isn't measured yet,
                                    // causes rendering issues
                                    (width > 0) &&
                                    ticks.map((value, index) => {
                                        const { svg: valueSvg = {} } = data[index] || {};
                                        console.log(data[index]);
                                        return (
                                            <SVGText
                                                {...svg}
                                                {...valueSvg}
                                                alignmentBaseline={'hanging'}
                                                key={index}
                                                originX={x(value)}
                                                textAnchor={'middle'}
                                                x={x(value)}
                                            >
                                                {formatLabel(value, index)}
                                                { data[index].hasMultipleSports ?
                                                    <TabIcon
                                                        color={data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light}
                                                        icon={'checkbox-multiple-marked-circle'}
                                                        size={20}
                                                        type={'material-community'}
                                                    />
                                                    : data[index].filteredSport ?
                                                        <Image
                                                            fill={data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light}
                                                            height={20}
                                                            href={data[index].filteredSport.imagePath}
                                                            key={index}
                                                            width={20}
                                                            x={x(value)}
                                                            y={(AppFonts.scaleFont(11) + AppSizes.paddingXSml)}//(index + 1) * 25 * -1}

                                                            // source={data[index].filteredSport.imagePath}
                                                            // style={{height: 20, tintColor: data[index].fillColor ? data[index].fillColor : AppColors.zeplin.light, width: 20,}}
                                                        />
                                                        :
                                                        <View style={{height: 20, width: 20,}} />
                                                }
                                            </SVGText>
                                        )
                                    })
                                }
                            </G>
                        </Svg>
                    }
                </View>
            </View>
        )
    }
}

XAxis.propTypes = {
    contentInset: PropTypes.shape({
        left:  PropTypes.number,
        right: PropTypes.number,
    }),
    data: PropTypes.arrayOf(PropTypes.oneOfType([
        PropTypes.number,
        PropTypes.object,
    ])).isRequired,
    formatLabel:   PropTypes.func,
    max:           PropTypes.any,
    min:           PropTypes.any,
    numberOfTicks: PropTypes.number,
    scale:         PropTypes.oneOf([ d3Scale.scaleTime, d3Scale.scaleLinear, d3Scale.scaleBand ]),
    spacingInner:  PropTypes.number,
    spacingOuter:  PropTypes.number,
    svg:           PropTypes.object,
    xAccessor:     PropTypes.func,
}

XAxis.defaultProps = {
    contentInset: {},
    formatLabel:  value => value,
    scale:        d3Scale.scaleLinear,
    spacingInner: 0.05,
    spacingOuter: 0.05,
    svg:          {},
    xAccessor:    ({ index }) => index,
}

/* Export Component ==================================================================== */
export default XAxis;