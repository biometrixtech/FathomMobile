/**
 * Survey's SlideUpPanel
 *
     <SurveySlideUpPanel
          expandSlideUpPanel={this.setState({ isSlideUpPanelExpanded: true, })}
          isSlideUpPanelExpanded={this.state.isSlideUpPanelExpanded}
          isSlideUpPanelOpen={this.state.isSlideUpPanelOpen}
          toggleSlideUpPanel={this._toggleSlideUpPanel()}
     />
 *
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { Platform, TouchableOpacity, View, } from 'react-native';

// import third-party libraries
import SlidingUpPanel from 'rn-sliding-up-panel';

// // Consts and Libs
import { AppColors, AppFonts, AppSizes, MyPlan as MyPlanConstants, } from '../../../constants';
import { Spacer, TabIcon, Text, } from '../../custom';

const sorenessVSPainMessage = MyPlanConstants.sorenessVSPainMessage();

/* Component ==================================================================== */
class SurveySlideUpPanel extends Component {
    constructor(props) {
        super(props);
        this._panel = {};
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        if(prevProps.isSlideUpPanelOpen !== this.props.isSlideUpPanelOpen) {
            if(this.props.isSlideUpPanelOpen) {
                this._panel.show();
            } else if(this._panel && this._panel.hide) {
                this._panel.hide();
            }
        }
    }

    render = () => {
        const { expandSlideUpPanel, isSlideUpPanelExpanded, isSlideUpPanelOpen, toggleSlideUpPanel, } = this.props;
        if(!isSlideUpPanelOpen) {
            return(null)
        }
        /*eslint no-return-assign: 0*/
        return(
            <SlidingUpPanel
                allowDragging={false}
                backdropOpacity={0.8}
                ref={ref => this._panel = ref}
            >
                <View style={{flex: 1, flexDirection: 'column',}}>
                    <View style={{flex: 1,}} />
                    <View style={{backgroundColor: AppColors.white,}}>
                        <View style={{backgroundColor: AppColors.primary.white.hundredPercent, flexDirection: 'row', padding: AppSizes.padding,}}>
                            <Text oswaldRegular style={{color: AppColors.black, flex: 9, fontSize: AppFonts.scaleFont(22),}}>{sorenessVSPainMessage.header}</Text>
                            <TabIcon
                                containerStyle={[{flex: 1,}]}
                                icon={'close'}
                                iconStyle={[{color: AppColors.black}]}
                                onPress={() => toggleSlideUpPanel(isSlideUpPanelExpanded ? true : false)}
                                reverse={false}
                                size={30}
                                type={'material-community'}
                            />
                        </View>
                        <View style={{padding: AppSizes.paddingLrg,}}>
                            <Text robotoRegular style={{color: AppColors.black, fontSize: AppFonts.scaleFont(14),}}>{sorenessVSPainMessage.lessText}</Text>
                            <Spacer size={30} />
                            { isSlideUpPanelExpanded ?
                                <View>
                                    <Text robotoMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(18),}}>{sorenessVSPainMessage.moreText[0].boldText}</Text>
                                    <Text robotoRegular style={{color: AppColors.black, fontSize: AppFonts.scaleFont(14),}}>{sorenessVSPainMessage.moreText[0].body}</Text>
                                    <Spacer size={20} />
                                    <Text robotoMedium style={{color: AppColors.black, fontSize: AppFonts.scaleFont(18),}}>{sorenessVSPainMessage.moreText[1].boldText}</Text>
                                    <Text robotoRegular style={{color: AppColors.black, fontSize: AppFonts.scaleFont(14),}}>{sorenessVSPainMessage.moreText[1].body}</Text>
                                    <Spacer size={20} />
                                    <TouchableOpacity
                                        onPress={() => toggleSlideUpPanel(isSlideUpPanelExpanded ? true : false)}
                                        style={{alignSelf: 'flex-end',}}
                                    >
                                        <Text
                                            robotoMedium
                                            style={{
                                                color:    AppColors.zeplin.yellow,
                                                fontSize: AppFonts.scaleFont(15),
                                            }}
                                        >
                                            {'GOT IT'}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                :
                                <TouchableOpacity
                                    onPress={() => expandSlideUpPanel()}
                                    style={{alignSelf: 'center', flexDirection: 'row', justifyContent: 'center', paddingVertical: AppSizes.paddingMed, width: AppSizes.screen.widthHalf,}}
                                >
                                    <Text
                                        robotoBold
                                        style={{
                                            color:              AppColors.zeplin.yellow,
                                            fontSize:           AppFonts.scaleFont(12),
                                            textAlign:          'center',
                                            textDecorationLine: 'none',
                                        }}
                                    >
                                        {'LEARN MORE'}
                                    </Text>
                                    <Spacer size={10} />
                                    <TabIcon
                                        icon={'chevron-down'}
                                        iconStyle={[{color: AppColors.zeplin.yellow}]}
                                        onPress={() => expandSlideUpPanel()}
                                        reverse={false}
                                        size={AppFonts.scaleFont(12)}
                                        type={'material-community'}
                                    />
                                </TouchableOpacity>
                            }
                            <Spacer size={Platform.OS === 'ios' ? 0 : 30} />
                        </View>
                    </View>
                </View>
            </SlidingUpPanel>
        )
    }
}

SurveySlideUpPanel.propTypes = {
    expandSlideUpPanel:     PropTypes.func.isRequired,
    isSlideUpPanelExpanded: PropTypes.bool.isRequired,
    isSlideUpPanelOpen:     PropTypes.bool.isRequired,
    toggleSlideUpPanel:     PropTypes.func.isRequired,
};

SurveySlideUpPanel.defaultProps = {};

SurveySlideUpPanel.componentName = 'SurveySlideUpPanel';

/* Export Component ================================================================== */
export default SurveySlideUpPanel;