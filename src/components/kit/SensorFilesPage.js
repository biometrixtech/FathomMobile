/**
 * SensorFilesPage View
 */
import React, { Component, } from 'react';
import PropTypes from 'prop-types';
import { BackHandler, Platform, ScrollView, StatusBar, View, } from 'react-native';

// import third-party libraries
import { Actions, } from 'react-native-router-flux';
import { Pages, } from 'react-native-pages';
import _ from 'lodash';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, } from '../../constants';
import { AppUtil, SensorLogic, } from '../../lib';
import { Battery, Calibration, Connect, Placement, Session, } from './ConnectScreens';
import { ListItem, Spacer, TabIcon, Text, } from '../custom';

const ICON_SIZE = 24;

/* Component ==================================================================== */
const TopNavBar = () => (
    <View>
        <StatusBar backgroundColor={'white'} barStyle={'dark-content'} />
        <View style={{backgroundColor: AppColors.white, flexDirection: 'row', marginHorizontal: AppSizes.padding, marginTop: AppSizes.statusBarHeight, paddingVertical: AppSizes.paddingSml,}}>
            <View style={{flex: 1, justifyContent: 'center',}}>
                <TabIcon
                    color={AppColors.zeplin.slate}
                    icon={'chevron-left'}
                    onPress={() => Actions.pop()}
                    size={40}
                />
            </View>
            <View style={{flex: 8, justifyContent: 'center',}} />
            <View style={{flex: 1, justifyContent: 'center',}} />
        </View>
    </View>
);

class SensorFilesPage extends Component {
    static componentName = 'SensorFilesPage';
    static propTypes = {
        pageStep: PropTypes.string.isRequired,
        user:     PropTypes.object.isRequired,
    }

    static defaultProps = {}

    constructor(props) {
        super(props);
        this.state = {
            pageIndex: 0,
        };
        this._pages = {};
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
    }

    componentWillUnmount = () => {
        this._pages = {};
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }

    componentDidUpdate = (prevProps, prevState, snapshot) => {
        AppUtil.getNetworkStatus(prevProps, this.props.network, Actions);
    }

    _renderNextPage = page => {
        let nextPageIndex = page ? page : (this.state.pageIndex + 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    _renderPreviousPage = () => {
        let nextPageIndex = (this.state.pageIndex - 1);
        this._pages.scrollToPage(nextPageIndex);
        this.setState({ pageIndex: nextPageIndex, });
    }

    render = () => {
        const { pageStep, user, } = this.props;
        const { pageIndex, } = this.state;
        if(pageStep !== 'sessions') {
            return(
                <View style={{backgroundColor: AppColors.white, flex: 1,}}>
                    { pageStep === 'battery' ?
                        <Battery showTopNavStep={false} />
                        : pageStep === 'session' ?
                            <Connect page={5} showTopNavStep={false} />
                            : pageStep === 'calibrate' ?
                                <Pages
                                    containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                    indicatorPosition={'none'}
                                    // onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)} // TODO: DO WE NEED THIS?
                                    ref={pages => { this._pages = pages; }}
                                    scrollEnabled={false}
                                    startPage={pageIndex}
                                >
                                    <Calibration nextBtn={this._renderNextPage} page={1} showTopNavStep={false} />
                                    <Calibration nextBtn={() => Actions.pop()} onBack={this._renderPreviousPage} page={2} showTopNavStep={false} />
                                </Pages>
                                : pageStep === 'placement' ?
                                    <Pages
                                        containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                        indicatorPosition={'none'}
                                        // onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)} // TODO: DO WE NEED THIS?
                                        ref={pages => { this._pages = pages; }}
                                        scrollEnabled={false}
                                        startPage={pageIndex}
                                    >
                                        <Placement nextBtn={this._renderNextPage} page={1} showTopNavStep={false} />
                                        <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} showTopNavStep={false} />
                                        <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={3} showTopNavStep={false} />
                                        <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={4} showTopNavStep={false} />
                                        <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={5} showTopNavStep={false} />
                                        <Placement nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={6} showTopNavStep={false} />
                                        <Placement nextBtn={() => Actions.pop()} onBack={this._renderPreviousPage} page={7} showTopNavStep={false} />
                                    </Pages>
                                    : pageStep === 'end' ?
                                        <Pages
                                            containerStyle={{backgroundColor: AppColors.white, flex: 1,}}
                                            indicatorPosition={'none'}
                                            // onScrollEnd={currentPage => this._onPageScrollEnd(currentPage)} // TODO: DO WE NEED THIS?
                                            ref={pages => { this._pages = pages; }}
                                            scrollEnabled={false}
                                            startPage={pageIndex}
                                        >
                                            <Session nextBtn={this._renderNextPage} page={1} showTopNavStep={false} />
                                            <Session nextBtn={this._renderNextPage} onBack={this._renderPreviousPage} page={2} showTopNavStep={false} />
                                            <Connect nextBtn={() => Actions.pop()} onBack={this._renderPreviousPage} page={5} showTopNavStep={false} />
                                        </Pages>
                                        :
                                        <View />
                    }
                </View>
            );
        }
        return (
            <View style={{backgroundColor: AppColors.white, flex: 1, flexDirection: 'column', justifyContent: 'space-between',}}>
                <TopNavBar />
                <View style={{flex: 1,}}>
                    <Text oswaldRegular style={{color: AppColors.zeplin.splash, fontSize: AppFonts.scaleFont(28), textAlign: 'center',}}>{'SENSOR SESSIONS'}</Text>
                    <Text robotoRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14), marginHorizontal: AppSizes.padding, marginVertical: AppSizes.padding, textAlign: 'center',}}>{'Sessions that have started and completed upload will appear here. Make sure you bring your kit to wifi after you train to sync your data!'}</Text>
                    <Spacer isDivider />
                    { user.sensor_data.sessions.length > 0 ?
                        <ScrollView
                            contentContainerStyle={{flexGrow: 1,}}
                        >
                            {_.map(user.sensor_data.sessions, (session, key) => {
                                const {
                                    leftIconString,
                                    subtitle,
                                    title,
                                } = SensorLogic.handleSessionRenderLogic(session);
                                return (
                                    <View key={key}>
                                        <ListItem
                                            containerStyle={{paddingVertical: AppSizes.padding,}}
                                            leftIcon={
                                                <View style={{alignItems: 'center', backgroundColor: AppColors.zeplin.superLight, borderRadius: (40 / 2), height: 40, justifyContent: 'center', width: 40,}}>
                                                    <Text oswaldRegular style={{color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(14),}}>{leftIconString}</Text>
                                                </View>
                                            }
                                            subtitle={subtitle}
                                            subtitleStyle={{...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(12), paddingLeft: AppSizes.paddingMed,}}
                                            subtitleProps={{allowFontScaling: false, numberOfLines: 1,}}
                                            title={title}
                                            titleProps={{allowFontScaling: false, numberOfLines: 1,}}
                                            titleStyle={{...AppStyles.oswaldRegular, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(18), paddingLeft: AppSizes.paddingMed,}}
                                        />
                                        <Spacer isDivider />
                                    </View>
                                )
                            })}
                        </ScrollView>
                        :
                        <View style={{alignItems: 'center', flex: 1, justifyContent: 'center',}}>
                            <Text style={{textAlign: 'center',}}>{'NO WORKOUTS YET!'}</Text> // TODO: STYLE ME!
                        </View>
                    }
                </View>
                <Text
                    onPress={() => Actions.sensorFilesPage({ pageStep: 'session', })}
                    robotoMedium
                    style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(18), paddingVertical: AppSizes.paddingMed, textAlign: 'center',}}
                >
                    {'Learn how to upload data'}
                </Text>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default SensorFilesPage;
