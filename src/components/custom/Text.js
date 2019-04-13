/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:30:36
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-09 20:38:37
 */

/**
 * Text
 *
     <Text h1>Hello World</Text>
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Text, View } from 'react-native';

// Consts and Libs
import { AppColors, AppStyles } from '../../constants';

/* Component ==================================================================== */
class CustomText extends Component {
    static propTypes = {
        h0:               PropTypes.bool,
        h1:               PropTypes.bool,
        h2:               PropTypes.bool,
        h3:               PropTypes.bool,
        h4:               PropTypes.bool,
        h5:               PropTypes.bool,
        h6:               PropTypes.bool,
        h7:               PropTypes.bool,
        oswaldBold:       PropTypes.bool,
        oswaldExtraLight: PropTypes.bool,
        oswaldHeavy:      PropTypes.bool,
        oswaldLight:      PropTypes.bool,
        oswaldMedium:     PropTypes.bool,
        oswaldRegular:    PropTypes.bool,
        oswaldSemiBold:   PropTypes.bool,
        robotoH0:         PropTypes.bool,
        robotoH1:         PropTypes.bool,
        robotoH2:         PropTypes.bool,
        robotoH3:         PropTypes.bool,
        robotoH4:         PropTypes.bool,
        robotoH5:         PropTypes.bool,
        robotoH6:         PropTypes.bool,
        robotoH7:         PropTypes.bool,
        robotoBold:       PropTypes.bool,
        robotoBlack:      PropTypes.bool,
        robotoLight:      PropTypes.bool,
        robotoMedium:     PropTypes.bool,
        robotoRegular:    PropTypes.bool,
        robotoThin:       PropTypes.bool,
        onPress:          PropTypes.func,
        p:                PropTypes.bool,
        style:            PropTypes.oneOfType([
            PropTypes.array,
            PropTypes.shape({}),
        ]),
        children: PropTypes.node,
        truncate: PropTypes.number,
    }

    static defaultProps = {
        h0:               false,
        h1:               false,
        h2:               false,
        h3:               false,
        h4:               false,
        h5:               false,
        h6:               false,
        h7:               false,
        oswaldBold:       false,
        oswaldExtraLight: false,
        oswaldHeavy:      false,
        oswaldLight:      false,
        oswaldMedium:     false,
        oswaldRegular:    false,
        oswaldSemiBold:   false,
        robotoH0:         false,
        robotoH1:         false,
        robotoH2:         false,
        robotoH3:         false,
        robotoH4:         false,
        robotoH5:         false,
        robotoH6:         false,
        robotoH7:         false,
        robotoBold:       false,
        robotoBlack:      false,
        robotoLight:      false,
        robotoMedium:     false,
        robotoRegular:    false,
        robotoThin:       false,
        onPress:          null,
        p:                false,
        style:            null,
        children:         null,
        truncate:         null,
    }

    constructor(props) {
        super(props);
        this.state = {
            isTextExpanded: false,
        }
    }

    _toggleTruncatedText = () => {
        this.setState({
            isTextExpanded: !this.state.isTextExpanded
        });
    }

    textProps = () => {
        // Defaults
        const props = {
            ...this.props,
            style: [AppStyles.baseText],
        };

        if (this.props.p)                { props.style = [AppStyles.p];  }
        if (this.props.h0)               { props.style = [AppStyles.h0]; }
        if (this.props.h1)               { props.style = [AppStyles.h1]; }
        if (this.props.h2)               { props.style = [AppStyles.h2]; }
        if (this.props.h3)               { props.style = [AppStyles.h3]; }
        if (this.props.h4)               { props.style = [AppStyles.h4]; }
        if (this.props.h5)               { props.style = [AppStyles.h5]; }
        if (this.props.h6)               { props.style = [AppStyles.h6]; }
        if (this.props.h7)               { props.style = [AppStyles.h7]; }
        if (this.props.oswaldBold)       { props.style = [AppStyles.oswaldBold]; }
        if (this.props.oswaldExtraLight) { props.style = [AppStyles.oswaldExtraLight]; }
        if (this.props.oswaldHeavy)      { props.style = [AppStyles.oswaldHeavy]; }
        if (this.props.oswaldLight)      { props.style = [AppStyles.oswaldLight]; }
        if (this.props.oswaldMedium)     { props.style = [AppStyles.oswaldMedium]; }
        if (this.props.oswaldRegular)    { props.style = [AppStyles.oswaldRegular]; }
        if (this.props.oswaldSemiBold)   { props.style = [AppStyles.oswaldSemiBold]; }
        if (this.props.robotoH0)         { props.style = [AppStyles.robotoH0]; }
        if (this.props.robotoH1)         { props.style = [AppStyles.robotoH1]; }
        if (this.props.robotoH2)         { props.style = [AppStyles.robotoH2]; }
        if (this.props.robotoH3)         { props.style = [AppStyles.robotoH3]; }
        if (this.props.robotoH4)         { props.style = [AppStyles.robotoH4]; }
        if (this.props.robotoH5)         { props.style = [AppStyles.robotoH5]; }
        if (this.props.robotoH6)         { props.style = [AppStyles.robotoH6]; }
        if (this.props.robotoH7)         { props.style = [AppStyles.robotoH7]; }
        if (this.props.robotoBold)       { props.style = [AppStyles.robotoBold]; }
        if (this.props.robotoBlack)      { props.style = [AppStyles.robotoBlack]; }
        if (this.props.robotoLight)      { props.style = [AppStyles.robotoLight]; }
        if (this.props.robotoMedium)     { props.style = [AppStyles.robotoMedium]; }
        if (this.props.robotoRegular)    { props.style = [AppStyles.robotoRegular]; }
        if (this.props.robotoThin)       { props.style = [AppStyles.robotoThin]; }
        if (this.props.onPress)          { props.style.push(AppStyles.link); }

        if (this.props.style) {
            props.style.push(this.props.style);
        }

        return props;
    }


    render = () => {
        if(this.props.truncate) {
            const maxLength = this.props.truncate;
            const ending = '... ';
            let truncatedText = this.props.children.length > maxLength && !this.state.isTextExpanded ?
                (this.props.children.substring(0, maxLength - ending.length) + ending)
                :
                this.props.children + ' ';
            return(
                <View>
                    <Text allowFontScaling={false} {...this.textProps()}>
                        {truncatedText}
                        <Text
                            allowFontScaling={false}
                            onPress={this._toggleTruncatedText}
                            style={{color: AppColors.zeplin.yellow, textDecorationLine: 'underline'}}
                        >
                            {this.state.isTextExpanded ? '\nsee less' : '\nsee more'}
                        </Text>
                    </Text>
                </View>
            );
        }
        return(<Text allowFontScaling={false} {...this.textProps()}>{this.props.children}</Text>);
    };
}

/* Export Component ==================================================================== */
export default CustomText;
