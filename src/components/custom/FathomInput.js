// https://react-native-training.github.io/react-native-elements/docs/input.html
import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Easing,
    Platform,
    StyleSheet,
    Text,
    TextInput,
    View,
    ViewPropTypes,
} from 'react-native';

import { nodeType, renderNode, } from './helpers';

import { TabIcon, } from './';

import { AppColors, AppFonts, } from '../../constants';

const styles = {
    container: {
        width: '100%',
    },
    error: theme => ({
        color:    AppColors.zeplin.coachesDashError,
        fontSize: 12,
        margin:   5,
    }),
    iconContainer: {
        alignItems:     'center',
        height:         40,
        justifyContent: 'center',
        marginLeft:     15,
    },
    input: {
        alignSelf: 'center',
        color:     AppColors.black,
        flex:      1,
        fontSize:  18,
        minHeight: 40,
    },
    inputContainer: theme => ({
        alignItems:        'center',
        borderBottomWidth: 1,
        borderColor:       AppColors.zeplin.light,
        flexDirection:     'row',
    }),
    label: theme => ({
        color:    AppColors.zeplin.superLight,
        fontSize: 16,
    }),
};

const renderText = (content, defaultProps, style) =>
    renderNode(Text, content, {
        ...defaultProps,
        style: StyleSheet.flatten([style, defaultProps && defaultProps.style]),
    });

class FathomInput extends React.Component {
  shakeAnimationValue = new Animated.Value(0);

  focus() {
      this.input.focus();
  }

  blur() {
      this.input.blur();
  }

  clear() {
      this.input.clear();
  }

  isFocused() {
      return this.input.isFocused();
  }

  setNativeProps(nativeProps) {
      this.input.setNativeProps(nativeProps);
  }

  shake = () => {
      const { shakeAnimationValue } = this;
      shakeAnimationValue.setValue(0);
      // Animation duration based on Material Design
      // https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations
      Animated.timing(shakeAnimationValue, {
          duration: 375,
          ease:     Easing.bounce,
          toValue:  3,
      }).start();
  };

  render() {
      const {
          containerStyle,
          errorMessage,
          errorProps,
          errorStyle,
          label,
          labelProps,
          labelStyle,
          leftIcon,
          leftIconContainerStyle,
          inputComponent: InputComponent = TextInput,
          inputContainerStyle,
          inputStyle,
          rightIcon,
          rightIconContainerStyle,
          theme,
          ...attributes
      } = this.props;

      const translateX = this.shakeAnimationValue.interpolate({
          inputRange:  [0, 0.5, 1, 1.5, 2, 2.5, 3],
          outputRange: [0, -15, 0, 15, 0, -15, 0],
      });

      return (
          <View style={StyleSheet.flatten([styles.container, containerStyle])}>
              {renderText(
                  label,
                  { style: labelStyle, ...labelProps },
                  styles.label(theme)
              )}

              <Animated.View
                  style={StyleSheet.flatten([
                      styles.inputContainer(theme),
                      inputContainerStyle,
                      { transform: [{ translateX }] },
                  ])}
              >
                  {leftIcon && (
                      <View
                          style={StyleSheet.flatten([
                              styles.iconContainer,
                              leftIconContainerStyle,
                          ])}
                      >
                          {renderNode(TabIcon, leftIcon)}
                      </View>
                  )}

                  <InputComponent
                      testID="RNE__Input__text-input"
                      underlineColorAndroid="transparent"
                      {...attributes}
                      ref={ref => {
                          this.input = ref;
                      }}
                      style={StyleSheet.flatten([styles.input, inputStyle])}
                  />

                  {rightIcon && (
                      <View
                          style={StyleSheet.flatten([
                              styles.iconContainer,
                              rightIconContainerStyle,
                          ])}
                      >
                          {renderNode(TabIcon, rightIcon)}
                      </View>
                  )}
              </Animated.View>

              {!!errorMessage && (
                  <Text
                      {...errorProps}
                      style={StyleSheet.flatten([
                          styles.error(theme),
                          errorStyle && errorStyle,
                      ])}
                  >
                      {errorMessage}
                  </Text>
              )}
          </View>
      );
  }
}

FathomInput.propTypes = {
    containerStyle:          ViewPropTypes.style,
    errorMessage:            PropTypes.string,
    errorProps:              PropTypes.object,
    errorStyle:              Text.propTypes.style,
    inputComponent:          PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    inputContainerStyle:     ViewPropTypes.style,
    inputStyle:              Text.propTypes.style,
    label:                   PropTypes.node,
    labelProps:              PropTypes.object,
    labelStyle:              Text.propTypes.style,
    leftIcon:                nodeType,
    leftIconContainerStyle:  ViewPropTypes.style,
    rightIconContainerStyle: ViewPropTypes.style,
    rightIcon:               nodeType,
    shake:                   PropTypes.any,
    theme:                   PropTypes.object,
};

/* Export Component ==================================================================== */
export default FathomInput;
