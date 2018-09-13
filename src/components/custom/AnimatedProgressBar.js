/**
  * Hacked version of https://github.com/rafaelmotta/react-native-progress-bar-animated
  * - this was hacked so we can display children nodes inside the progress bar
  *
  * // type - default - description
      <AnimatedProgressBar
          barEasing={} // string - 'linear' - Easing animation type(bounce, cubic, ease, sin, linear, quad)
          barAnimationDuration={} // number - [] - Duration in ms of bar width animation
          backgroundAnimationDuration={} // number - null - Duration in ms of bar background color change
          backgroundColor={} // string - '#148cF0' - Color that will complete the bar
          borderWidth={} // number - 1 - Style prop
          borderColor={} // string - '#148cF0' - Style prop
          borderRadius={} // number - 6 - Style prop
          backgroundColorOnComplete={'#6CC644'} // string - null - Optional color that will overwrite background color when reach the max value prop
          height={100} // number - 15 - Height of bar
          maxValue={100} // number - 500 - Max percentage bar can have
          onComplete={} // function - null - Callback after bar reach the max value prop
          value={50} // number - 500 - Max percentage bar can have
          width={AppSizes.screen.width} // number - REQUIRED - Width of bar
          wrapperBackgroundColor={AppColors.white}
      >
          <Text>{'HI'}</Text>
      </AnimatedProgressBar>
  *
  */

import React from 'react';
import PropTypes from 'prop-types';
import {
    Animated,
    Easing,
    View,
} from 'react-native';

class ProgressBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: props.value,
        };
        this.widthAnimation = new Animated.Value(0);
        this.backgroundAnimation = new Animated.Value(0);
        this.backgroundInterpolationValue = null;
    }

    componentDidMount() {
        if (this.state.progress > 0) {
            this.animateWidth();
        }
    }

    componentWillReceiveProps(props) {
        if (props.value !== this.state.progress) {
            if (props.value >= 0 && props.value <= this.props.maxValue) {
                this.setState({ progress: props.value }, () => {
                    if (this.state.progress === this.props.maxValue) {
                        // Callback after complete the progress
                        const callback = this.props.onComplete;
                        if (callback) {
                            setTimeout(callback, this.props.barAnimationDuration);
                        }
                    }
                });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.value !== prevProps.value) {
            this.animateWidth();
            if (this.props.backgroundColorOnComplete) {
                if (this.props.value === this.props.maxValue) {
                    this.animateBackground();
                }
            }
        }
    }

    animateWidth() {
        const toValue = ((this.props.width * this.state.progress) / 100) - this.props.borderWidth * 2;
        Animated.timing(this.widthAnimation, {
            duration: this.props.barAnimationDuration,
            easing:   Easing[this.props.barEasing],
            toValue:  toValue > 0 ? toValue : 0,
        }).start();
    }

    animateBackground() {
        Animated.timing(this.backgroundAnimation, {
            duration: this.props.backgroundAnimationDuration,
            toValue:  1,
        }).start();
    }

    render() {
        if (this.props.backgroundColorOnComplete) {
            this.backgroundInterpolationValue = this.backgroundAnimation.interpolate({
                inputRange:  [0, 1],
                outputRange: [this.props.backgroundColor, this.props.backgroundColorOnComplete],
            });
        }

        return (
            <View
                style={{
                    backgroundColor: this.props.wrapperBackgroundColor,
                    borderColor:     this.props.borderColor,
                    borderRadius:    this.props.borderRadius,
                    borderWidth:     this.props.borderWidth,
                    height:          this.props.height,
                    width:           this.props.width,
                }}
            >
                <Animated.View
                    style={{
                        backgroundColor: this.backgroundInterpolationValue || this.props.backgroundColor,
                        borderRadius:    this.props.borderRadius,
                        height:          this.props.height - (this.props.borderWidth * 2),
                        width:           this.widthAnimation,
                    }}
                >
                    {this.props.children}
                </Animated.View>
            </View>
        );
    }
}

ProgressBar.propTypes = {
    /**
     * Bar values
     */
    maxValue: PropTypes.number,
    value:    PropTypes.number,

    /**
     * Animations
     */
    backgroundAnimationDuration: PropTypes.number,
    barAnimationDuration:        PropTypes.number,
    barEasing:                   PropTypes.oneOf([
        'bounce',
        'cubic',
        'ease',
        'linear',
        'quad',
        'sin',
    ]),
    /**
     * StyleSheet props
     */
    backgroundColor:           PropTypes.string,
    backgroundColorOnComplete: PropTypes.string,
    borderColor:               PropTypes.string,
    borderRadius:              PropTypes.number,
    borderWidth:               PropTypes.number,
    height:                    PropTypes.number,
    width:                     PropTypes.number.isRequired,
    wrapperBackgroundColor:    PropTypes.string,
    /**
     * Callbacks
     */
    onComplete:                PropTypes.func,
};

ProgressBar.defaultProps = {
    backgroundAnimationDuration: 2500,
    backgroundColor:             '#148cF0',
    backgroundColorOnComplete:   null,
    barAnimationDuration:        500,
    barEasing:                   'linear',
    borderWidth:                 1,
    borderColor:                 '#C8CCCE',
    borderRadius:                6,
    height:                      15,
    maxValue:                    100,
    onComplete:                  null,
    value:                       0,
    wrapperBackgroundColor:      '#000000',
};

export default ProgressBar;