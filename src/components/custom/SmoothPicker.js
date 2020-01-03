// https://github.com/rdhox/react-native-smooth-picker
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { View, FlatList } from 'react-native';
import { alignSelect, marginEnd, marginStart, onSelect, } from './helpers';

class SmoothPicker extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            fakeBool:       0,
            selected:       this.props.initialScrollToIndex || 1,
            scrollPosition: null,

        };
        this.countItems = 0;
        this.fingerAction = false;
        this.heightParent = null;
        this.onMomentum = false;
        this.options = [];
        this.widthParent = null;
    }

    _alignAfterMount = isFromMount => {
        try {
            const { horizontal, scrollAnimation, initialScrollToIndex } = this.props;
            if (typeof initialScrollToIndex !== 'undefined') {
                const option = this.options[initialScrollToIndex];
                if (option) {
                    alignSelect(
                        horizontal,
                        scrollAnimation,
                        false,// option,
                        this.refs.smoothPicker
                    );
                }
            }
        } catch (error) {
            console.log('error', error);
        }
    };

    _save = (index, layout, item, horizontal) => {
        this.options[index] = {
            layout,
            item,
            index
        };
        /*eslint no-shadow: 0*/
        for (let index in this.options) {
            if (horizontal) {
                let left = this.options[index - 1] ? this.options[index - 1].right : 0;
                let right = this.options[index - 1]
                    ? left + this.options[index].layout.width
                    : this.options[index].layout.width;
                this.options[index].right = right;
                this.options[index].left = left;
            } else {
                let top = this.options[index - 1] ? this.options[index - 1].bottom : 0;
                let bottom = this.options[index - 1]
                    ? top + this.options[index].layout.height
                    : this.options[index].layout.height;
                this.options[index].bottom = bottom;
                this.options[index].top = top;
            }
        }
    };

    _handleSelection = (item, index, scrollPosition) => {
        this.props.onSelected({ item, index });
        this.setState({
            selected:       index,
            scrollPosition: scrollPosition
        });
    };

    _renderItem = info => {
        const {
            data,
            renderItem,
            horizontal,
            offsetSelection,
            startMargin,
            endMargin
        } = this.props;
        const { item, index } = info;
        return (
            <View
                key={index}
                onLayout={({ nativeEvent: { layout } }) => {
                    this.setState(
                        { fakeBool: (this.state.fakeBool + 1), },
                        () => {
                            this._save(index, layout, item, horizontal);
                            if (this.countItems === data.length) {
                                this.countItems = 0;
                                this._alignAfterMount();
                            } else {
                                this.countItems = this.countItems + 1;
                            }
                        }
                    );
                }}
                style={{
                    marginLeft: marginStart(
                        horizontal,
                        index,
                        this.widthParent,
                        offsetSelection,
                        startMargin
                    ) || 0,
                    marginRight: marginEnd(
                        horizontal,
                        data.length - 1,
                        index,
                        this.widthParent,
                        offsetSelection,
                        endMargin
                    ) || 0,
                    marginTop: marginStart(
                        !horizontal,
                        index,
                        this.heightParent,
                        offsetSelection,
                        startMargin
                    ) || 0,
                    marginBottom: marginEnd(
                        !horizontal,
                        data.length - 1,
                        index,
                        this.heightParent,
                        offsetSelection,
                        endMargin
                    ) || 0,
                }}
            >
                {renderItem(info)}
            </View>
        );
    };

    render = () => {
        const { horizontal, magnet, snapInterval, snapToAlignment } = this.props;
        let snap = {};
        if (snapInterval) {
            snap = {
                snapToInterval:  snapInterval,
                snapToAlignment: snapToAlignment
            };
        }
        return (
            <FlatList
                {...this.props}
                {...snap}
                onLayout={({ nativeEvent: { layout } }) => {
                    this.widthParent = layout.width;
                    this.heightParent = layout.height;
                }}
                onScroll={({ nativeEvent }) => {
                    if (this.fingerAction) {
                        onSelect(
                            nativeEvent,
                            this.state.selected,
                            this.options,
                            this._handleSelection,
                            this.state.scrollPosition,
                            horizontal
                        );
                    }
                }}
                getItemLayout={(_, index) => {
                    let itemLayout;
                    if (snapInterval) {
                        itemLayout = {
                            length: snapInterval,
                            offset: snapInterval * index,
                            index
                        };
                    } else {
                        itemLayout = {
                            length: this.options[index]
                                ? horizontal
                                    ? this.options[index].layout.width
                                    : this.options[index].layout.height
                                : 30,
                            offset: this.options[index]
                                ? horizontal
                                    ? this.options[index].left
                                    : this.options[index].top
                                : 30 * index,
                            index
                        };
                    }
                    return itemLayout;
                }}
                onScrollBeginDrag={() => {
                    this.onMomentum = true;
                    this.fingerAction = true;
                }}
                onMomentumScrollEnd={() => {
                    this.fingerAction = false;
                    if (this.onMomentum && magnet && !snapInterval) {
                        this.onMomentum = false;
                        alignSelect(
                            this.props.horizontal,
                            this.props.scrollAnimation,
                            this.options[this.state.selected],
                            this.refs.smoothPicker
                        );
                    }
                }}
                renderItem={this._renderItem}
                ref={'smoothPicker'}
            />
        );
    }
}

SmoothPicker.defaultProps = {
    onSelected:       data => data,
    horizontal:       true,
    offsetSelection:  0,
    decelerationRate: 0.85,
    magnet:           false,
    scrollAnimation:  false,
    snapInterval:     null,
    snapToAlignment:  'center'
};

SmoothPicker.propTypes = {
    onSelected:           PropTypes.func.isRequired,
    offsetSelection:      PropTypes.number.isRequired,
    scrollAnimation:      PropTypes.bool.isRequired,
    magnet:               PropTypes.bool.isRequired,
    snapInterval:         PropTypes.number,
    initialScrollToIndex: PropTypes.number,
    startMargin:          PropTypes.number,
    endMargin:            PropTypes.number
};

export default SmoothPicker;