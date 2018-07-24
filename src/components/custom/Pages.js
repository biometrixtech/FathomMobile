/*
 * @Author: Vir Desai
 * @Date: 2018-04-23 15:00:26
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 16:47:15
 */

import PropTypes from 'prop-types';
import React, { PureComponent, Children } from 'react';
import { View, ScrollView, Animated, Platform, ViewPropTypes, StyleSheet } from 'react-native';

import { Indicator } from './';

const styles = StyleSheet.create({
    rtl: {
        transform: [{
            rotate: '180deg',
        }],
    },

    container: {
        flex: 1,
    },

    bottom: {
        position: 'absolute',
        right:    0,
        bottom:   0,
        left:     0,
    },

    top: {
        position: 'absolute',
        top:      0,
        right:    0,
        left:     0,
    },

    left: {
        position: 'absolute',
        top:      0,
        bottom:   0,
        left:     0,
    },

    right: {
        position: 'absolute',
        top:      0,
        right:    0,
        bottom:   0,
    },
});

const floatEpsilon = Math.pow(2, -23);

function equal(a, b) {
    return Math.abs(a - b) <= floatEpsilon * Math.max(Math.abs(a), Math.abs(b));
}

export default class Pages extends PureComponent {
    static defaultProps = {
        pagingEnabled:                  true,
        showsHorizontalScrollIndicator: false,
        showsVerticalScrollIndicator:   false,
        scrollEventThrottle:            30,
        scrollsToTop:                   false,

        indicatorColor:   'rgb(255, 255, 255)',
        indicatorOpacity: 0.30,

        startPage: 0,

        horizontal: true,
        rtl:        false,
    };

    static propTypes = {
        style:          ViewPropTypes.style,
        containerStyle: ViewPropTypes.style,

        indicatorColor:    PropTypes.string,
        indicatorOpacity:  PropTypes.number,
        indicatorPosition: PropTypes.oneOf([
            'none',
            'top',
            'right',
            'bottom',
            'left',
        ]),

        startPage: PropTypes.number,
        progress:  PropTypes.instanceOf(Animated.Value),

        horizontal: PropTypes.bool,
        rtl:        PropTypes.bool,

        children: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.node),
            PropTypes.node,
        ]),

        onLayout:    PropTypes.func,
        onScrollEnd: PropTypes.func,
        renderPager: PropTypes.func,
    };

    constructor(props) {
        super(props);

        this.onLayout = this.onLayout.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onScrollBeginDrag = this.onScrollBeginDrag.bind(this);
        this.onScrollEndDrag = this.onScrollEndDrag.bind(this);

        this.updateRef = this.updateRef.bind(this, 'scroll');
        this.renderPage = this.renderPage.bind(this);

        let { startPage, progress = new Animated.Value(startPage) } = this.props;

        this.progress = startPage;
        this.mounted = false;
        this.scrollState = -1;

        this.state = {
            width:  0,
            height: 0,
            progress,
        };
    }

    componentDidMount() {
        this.mounted = true;
    }

    componentDidUpdate() {
        if (this.scrollState === -1) {
        /* Fix scroll position after layout update */
        /* eslint-disable no-undef */
            requestAnimationFrame(() => {
                this.scrollToPage(Math.floor(this.progress), false);
            });
        }
    }

    componentWillUnmount() {
        this.mounted = false;
    }

    componentWillReceiveProps(props) {
        let { progress } = props;

        if (progress !== this.props.progress) {
            progress.setValue(this.progress);

            this.setState({ progress });
        }
    }

    updateRef(name, ref) {
        this[name] = ref;
    }

    onLayout(event) {
        let { width, height } = event.nativeEvent.layout;
        let { onLayout } = this.props;

        if (typeof onLayout === 'function') {
            onLayout(event);
        }

        this.setState({ width, height });
    }

    onScroll(event) {
        if (this.scrollState === -1) {
            return;
        }

        let { horizontal } = this.props;
        let { [horizontal? 'x' : 'y']: offset } = event.nativeEvent.contentOffset;
        let { [horizontal? 'width' : 'height']: base, progress } = this.state;

        progress.setValue(this.progress = base? offset / base : 0);

        let discreteProgress = Math.round(this.progress);

        if (this.scrollState === 1 && equal(discreteProgress, this.progress)) {
            this.onScrollEnd();

            this.scrollState = -1;
        }
    }

    onScrollBeginDrag() {
        this.scrollState = 0;
    }

    onScrollEndDrag() {
        let { horizontal } = this.props;

        /* Vertical pagination is not working on android, scroll by hands */
        if (Platform.OS === 'android' && !horizontal) {
            this.scrollToPage(Math.round(this.progress));
        }

        this.scrollState = 1;
    }

    onScrollEnd() {
        let { onScrollEnd } = this.props;

        if (typeof onScrollEnd === 'function') {
            onScrollEnd(Math.round(this.progress));
        }
    }

    scrollToPage(page, animated = true) {
        let { horizontal } = this.props;
        let { [horizontal? 'width' : 'height']: base } = this.state;

        if (animated) {
            this.scrollState = 1;
        }

        if (this.mounted && this.scroll) {
            this.scroll.scrollTo({
                [horizontal? 'x' : 'y']: page * base,
                animated,
            });
        }
    }

    isDragging() {
        return this.scrollState === 0;
    }

    isDecelerating() {
        return this.scrollState === 1;
    }

    renderPage(page, index) {
        let { width, height, progress } = this.state;
        let { children, horizontal, rtl } = this.props;

        let pages = Children.count(children);

        let pageStyle = (horizontal && rtl)?
            styles.rtl:
            null;

        /* Adjust progress by page index */
        progress = Animated.add(progress, -index);

        return (
            <View style={[{ width, height }, pageStyle]}>
                {React.cloneElement(page, { index, pages, progress })}
            </View>
        );
    }

    renderPager(pager) {
        let { renderPager, horizontal, rtl } = this.props;

        if (typeof renderPager === 'function') {
            return renderPager({ horizontal, rtl, ...pager });
        }

        let { indicatorPosition } = pager;

        if (indicatorPosition === 'none') {
            return null;
        }

        let indicatorStyle = (horizontal && rtl)?
            styles.rtl:
            null;

        return (
            <View style={[styles[indicatorPosition], indicatorStyle]}>
                <Indicator {...pager} />
            </View>
        );
    }

    render() {
        let { progress } = this.state;
        let { horizontal, rtl } = this.props;
        let {
            style,
            containerStyle,
            children,
            indicatorColor,
            indicatorOpacity,
            indicatorPosition = horizontal? 'bottom' : 'right',
            ...props
        } = this.props;

        let pages = Children.count(children);

        let Pager = () =>
            this.renderPager({
                pages,
                progress,
                indicatorColor,
                indicatorOpacity,
                indicatorPosition,
            });

        let scrollStyle = (horizontal && rtl)?
            styles.rtl:
            null;

        return (
            <View style={[styles.container, containerStyle]}>
                <ScrollView
                    {...props}
                    style={[styles.container, style, scrollStyle]}
                    onLayout={this.onLayout}
                    onScroll={this.onScroll}
                    onScrollBeginDrag={this.onScrollBeginDrag}
                    onScrollEndDrag={this.onScrollEndDrag}
                    scrollEnabled={false}
                    ref={this.updateRef}
                >
                    {Children.map(children, this.renderPage)}
                </ScrollView>

                <Pager />
            </View>
        );
    }
}