// https://github.com/yamill/react-native-inviewport
import React, { Component } from 'react';
import { Dimensions, View, } from 'react-native';

/* Component ==================================================================== */
class InViewPort extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rectBottom: 0,
            rectTop:    0,
        };
    }

    componentDidMount = () => {
        if (!this.props.disabled) {
            this.startWatching();
        }
    }

    componentWillUnmount = () => {
        this.stopWatching();
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if (prevProps.disabled) {
            this.stopWatching();
        } else {
            this.lastValue = null
            this.startWatching();
        }
    }

    startWatching = () => {
        if (this.interval) {
            return;
        }
        this.interval = setInterval(() => {
            if (!this.myview) {
                return;
            }
            this.myview.measure((x, y, width, height, pageX, pageY) => {
                this.setState({
                    rectBottom: pageY + height,
                    rectTop:    pageY,
                    rectWidth:  pageX + width
                });
            });
            this.isInViewPort()
        }, this.props.delay || 100);
    }

    stopWatching = () => {
        this.interval = clearInterval(this.interval);
    }

    isInViewPort = () => {
        const window = Dimensions.get('window');
        const isVisible =
          this.state.rectBottom !== 0 &&
          this.state.rectTop >= 0 &&
          this.state.rectBottom <= window.height &&
          this.state.rectWidth > 0 &&
          this.state.rectWidth <= window.width;
        if (this.lastValue !== isVisible) {
            this.lastValue = isVisible;
            this.props.onChange(isVisible);
        }
    }

    render = () => {
        return (
            <View
                collapsable={false}
                ref={component => {
                    this.myview = component;
                }}
                {...this.props}
            >
                {this.props.children}
            </View>
        )
    }
}

/* Export Component ==================================================================== */
export default InViewPort;