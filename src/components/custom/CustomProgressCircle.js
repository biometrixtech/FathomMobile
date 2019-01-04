import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ART, Animated, StyleSheet, Text, View } from 'react-native';

import Arc from './helpers/Arc';
import withAnimation from './helpers/withAnimation';

const CIRCLE = Math.PI * 2;

const AnimatedSurface = Animated.createAnimatedComponent(ART.Surface);
const AnimatedArc = Animated.createAnimatedComponent(Arc);

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'transparent',
        overflow:        'hidden',
    },
});

export class CustomProgressCircle extends Component {
  static propTypes = {
      animated:      PropTypes.bool,
      borderColor:   PropTypes.string,
      borderWidth:   PropTypes.number,
      color:         PropTypes.string,
      children:      PropTypes.node,
      direction:     PropTypes.oneOf(['clockwise', 'counter-clockwise']),
      fill:          PropTypes.string,
      formatText:    PropTypes.string,
      indeterminate: PropTypes.bool,
      progress:      PropTypes.oneOfType([
          PropTypes.number,
          PropTypes.instanceOf(Animated.Value),
      ]),
      rotation:      PropTypes.instanceOf(Animated.Value),
      showsText:     PropTypes.bool,
      size:          PropTypes.number,
      style:         PropTypes.any,
      strokeCap:     PropTypes.oneOf(['butt', 'square', 'round']),
      textStyle:     PropTypes.any,
      thickness:     PropTypes.number,
      unfilledColor: PropTypes.string,
      endAngle:      PropTypes.number,
  };

  static defaultProps = {
      borderWidth: 1,
      color:       'rgba(0, 122, 255, 1)',
      direction:   'clockwise',
      formatText:  '',
      endAngle:    0.9,
      progress:    0,
      showsText:   false,
      size:        40,
      thickness:   3,
  };

  constructor(props, context) {
      super(props, context);
      this.progressValue = 0;
  }

  componentWillMount() {
      if (this.props.animated) {
          this.props.progress.addListener(event => {
              this.progressValue = event.value;
              if (this.props.showsText || this.progressValue === 1) {
                  this.forceUpdate();
              }
          });
      }
  }

  render() {
      const {
          animated,
          borderColor,
          borderWidth,
          color,
          children,
          direction,
          endAngle,
          fill,
          formatText,
          indeterminate,
          progress,
          rotation,
          showsText,
          size,
          style,
          strokeCap,
          textStyle,
          thickness,
          unfilledColor,
          ...restProps
      } = this.props;
      const border = borderWidth || (indeterminate ? 1 : 0);
      const radius = size / 2 - border;
      const offset = {
          top:  border,
          left: border,
      };
      const textOffset = border + thickness;
      const textSize = size - textOffset * 2;
      const Surface = rotation ? AnimatedSurface : ART.Surface;
      const Shape = animated ? AnimatedArc : Arc;
      const progressValue = animated ? this.progressValue : progress;
      const angle = animated
          ? Animated.multiply(progress, CIRCLE)
          : progress * CIRCLE;
      return (
          <View style={[styles.container, style]} {...restProps}>
              <Surface
                  height={size}
                  style={{
                      transform: [{
                          rotate: indeterminate && rotation ?
                              rotation.interpolate({
                                  inputRange:  [0, 1],
                                  outputRange: ['0deg', '360deg'],
                              })
                              :
                              '0deg',
                      },],
                  }}
                  width={size}
              >
                  {unfilledColor && progressValue !== 1 ? (
                      <Shape
                          direction={direction}
                          endAngle={CIRCLE}
                          fill={fill}
                          offset={offset}
                          radius={radius}
                          startAngle={angle}
                          stroke={unfilledColor}
                          strokeWidth={thickness}
                      />
                  ) : (
                      false
                  )}
                  {!indeterminate ? (
                      <Shape
                          direction={direction}
                          endAngle={angle}
                          fill={fill}
                          offset={offset}
                          radius={radius}
                          startAngle={0}
                          stroke={color}
                          strokeCap={strokeCap}
                          strokeWidth={thickness}
                      />
                  ) : (
                      false
                  )}
                  {border ? (
                      <Arc
                          endAngle={(indeterminate ? endAngle * 2 : 2) * Math.PI}
                          radius={size / 2}
                          startAngle={0}
                          stroke={borderColor || color}
                          strokeCap={strokeCap}
                          strokeWidth={border}
                      />
                  ) : (
                      false
                  )}
              </Surface>
              {showsText ? (
                  <View
                      style={{
                          alignItems:     'center',
                          borderRadius:   textSize / 2,
                          height:         textSize,
                          justifyContent: 'center',
                          left:           textOffset,
                          position:       'absolute',
                          top:            textOffset,
                          width:          textSize,
                      }}
                  >
                      <Text
                          style={[
                              {
                                  color,
                                  fontSize:   textSize / 4.5,
                                  fontWeight: '300',
                              },
                              textStyle,
                          ]}
                      >
                          {formatText}
                      </Text>
                  </View>
              ) : (
                  false
              )}
              {children}
          </View>
      );
  }
}

export default withAnimation(CustomProgressCircle);