import React from 'react';
import {
    LayoutChangeEvent,
    PanResponder,
    PanResponderGestureState,
    StyleSheet,
    View,
} from 'react-native';

// import constants
import { AppColors, } from '../../constants';

type StateType = {
    barHeight:  number | null,
    deltaValue: number,
    value:      number
};

const CIRCLE_DIAMETER = 50;

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    bar: {
        backgroundColor: AppColors.border,
        borderRadius:    5,
        flexGrow:        1,
        width:           7,
    },
    barContainer: {
        alignItems:       'center',
        marginHorizontal: 20,
        // paddingVertical:  (CIRCLE_DIAMETER / 2),
        width:            (CIRCLE_DIAMETER),
    },
    circle: {
        backgroundColor: AppColors.primary.yellow.hundredPercent,
        borderRadius:    (CIRCLE_DIAMETER / 2),
        height:          (CIRCLE_DIAMETER),
        position:        'absolute',
        width:           (CIRCLE_DIAMETER),
    },
    container: {
        alignSelf:      'stretch',
        flexDirection:  'row',
        flexGrow:       1,
        justifyContent: 'center',
    },
    wrapper: {
        alignItems:      'center',
        alignSelf:       'stretch',
        backgroundColor: AppColors.transparent,
        flexGrow:        1,
        transform:       [{ rotate: '180deg', }],
    },
});

export default class Slider extends React.Component<{}, StateType> {
  state = {
      barHeight:  null,
      deltaValue: 0,
      value:      this.props.value
  };

  panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture: () => true,
      onPanResponderMove:                 (_, gestureState) => this.onMove(gestureState),
      onPanResponderRelease:              () => this.onEndMove(),
      onPanResponderTerminate:            () => {}
  });

  onMove(gestureState: PanResponderGestureState) {
      console.log('gestureState', gestureState);
      const { barHeight } = this.state;
      const { maximumValue, minimumValue, } = this.props;
      const newDeltaValue = this.getValueFromBottomOffset(
          -gestureState.dy,
          barHeight,
          minimumValue,
          maximumValue
      );
      this.setState({
          deltaValue: newDeltaValue
      });
  }

  onEndMove() {
      const { value, deltaValue } = this.state;
      this.setState({ value: value + deltaValue, deltaValue: 0 });
  }

  onBarLayout = (event: LayoutChangeEvent) => {
      const { height: barHeight } = event.nativeEvent.layout;
      this.setState({ barHeight });
  };

  capValueWithinRange = (value: number, range: number[]) => {
      if (value < range[0]) { return range[0] }
      if (value > range[1]) { return range[1] }
      return value;
  };

  getValueFromBottomOffset = (
      offset: number,
      barHeight: number | null,
      rangeMin: number,
      rangeMax: number
  ) => {
      if (barHeight === null) { return 0 }
      return ((rangeMax - rangeMin) * offset) / barHeight;
  };

  getBottomOffsetFromValue = (
      value: number,
      rangeMin: number,
      rangeMax: number,
      barHeight: number | null
  ) => {
      if (barHeight === null) { return 0 }
      const valueOffset = value - rangeMin;
      const totalRange = rangeMax - rangeMin;
      const percentage = valueOffset / totalRange;
      return barHeight * percentage;
  };

  render() {
      const { barHeight, deltaValue, value, } = this.state;
      console.log('value',value);
      const { maximumValue, minimumValue, } = this.props;
      const cappedValue = this.capValueWithinRange(value + deltaValue, [
          minimumValue,
          maximumValue
      ]);
      const bottomOffset = this.getBottomOffsetFromValue(
          cappedValue,
          minimumValue,
          maximumValue,
          barHeight
      );
      console.log('bottomOffset',bottomOffset);
      return (
          <View style={[styles.wrapper]}>
              <View style={[styles.container]}>
                  <View style={[styles.barContainer]}>
                      <View style={[styles.bar]} onLayout={this.onBarLayout} />
                      <View
                          style={[styles.circle, {bottom: `${bottomOffset}%`,}]}
                          {...this.panResponder.panHandlers}
                      />
                  </View>
              </View>
          </View>
      );
  }
}
