/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-28 16:48:33
 */

/**
 * Dashboard View Screen
 */
import React, { Component } from 'react';
import { TouchableWithoutFeedback, View, Platform, BackHandler } from 'react-native';

import PropTypes from 'prop-types';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

// Consts and Libs
import { AppStyles, AppSizes } from '../../theme/';
import { Roles, ErrorMessages, AppColors } from '../../../constants/';

// Components
import { ListItem, Text, StackedBarChart, FloatingBarChart } from '../custom/';

// Tabs titles
const tabs = ['Biomechanical Response', 'Workload', 'Force Exposure'];

/* Component ==================================================================== */
class Dashboard extends Component {
    static componentName = 'DashboardView';
    
    static propTypes = {
        user:             PropTypes.object,
        setStatsCategory: PropTypes.func.isRequired,
        getTeams:         PropTypes.func.isRequired,
        getTeamStats:     PropTypes.func.isRequired,
        startRequest:     PropTypes.func.isRequired,
        stopRequest:      PropTypes.func.isRequired,
    }
    
    static defaultProps = {
        user: {
            teamIndex: 0
        },
    }

    constructor(props) {
        super(props);
        this.state = {
            tabbarHeight:                     AppSizes.tabbarHeight,
            preprocessingHeight:              0,
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true
        };
    }

    componentWillMount = () => {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', () => true);
        }
        let {startRequest, getTeams, user, stopRequest} = this.props;
        return startRequest()
            .then(() => getTeams(user))
            .then(() => stopRequest());
    }

    componentWillUnmount = () => {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress');
        }
    }
    
    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) {
        const textStyle = AppStyles.tabHeaders;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        
        return <TouchableWithoutFeedback
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={{ backgroundColor: AppColors.primary.white.hundredPercent }}>
                <View style={[page === 0 ? AppStyles.leftTabBar : page === 1 ? AppStyles.centerTabBar : AppStyles.rightTabBar]}>
                    <Text style={[textStyle, {color: AppColors.primary.grey.hundredPercent, fontWeight }]}>
                        {name}
                    </Text>
                </View>
                {
                    isTabActive ? <View style={{ backgroundColor: AppColors.primary.yellow.hundredPercent, width: AppSizes.screen.widthQuarter, height: 4, bottom: 0, left: AppSizes.screen.width * (page === 0 ? 0.375 : page === 1 ? 0.1275 : 0.1125), position: 'absolute' }} /> : null
                }
            </View>
        </TouchableWithoutFeedback>;
    }

    getBiomechanicalFatigueData = () => {
        let data = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex] ? this.props.user.teams[this.props.user.teamIndex].stats : null;
        if (!allData) {
            return null;
        }
        let allTeamMovementQualityData = allData.TeamMovementQualityData;
        if (allTeamMovementQualityData.every(teamMovementQualityData => Object.keys(teamMovementQualityData).every(key => key === 'eventDate'))) {
            return data;
        }
        data.x = allTeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
            data.yMin = 100;
            data.y1 = allTeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    let y1 = foundAthlete ? foundAthlete.percOptimal || 0 : 0;
                    let y2 = foundAthlete ? foundAthlete.fatigue || 0 : 0;
                    let value = y1+y2;
                    data.yMin = value > 0 && (y2 > 0 ? y1 : value) < data.yMin ? (y2 > 0 ? y1 : value) : data.yMin;
                    return y1;
                }
                return 0;
            });
            data.y2 = allTeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.fatigue || 0 : 0;
                }
                return 0;
            });
        } else {
            data.yMin = 100;
            data.y1 = allTeamMovementQualityData.map(teamMovementQualityData => {
                let y1 = teamMovementQualityData.percOptimal || 0;
                let y2 = teamMovementQualityData.fatigue || 0;
                let value = y1+y2;
                data.yMin = value > 0 && (y2 > 0 ? y1 : value) < data.yMin ? (y2 > 0 ? y1 : value) : data.yMin;
                return y1;
            });
            data.y2 = allTeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.fatigue || 0);
        }
        return data;
    }

    getAccumulatedGRFData = () => {
        let grfData = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex] ? this.props.user.teams[this.props.user.teamIndex].stats : null;
        if (!allData) {
            return {};
        }
        if (allData.TeamMovementQualityData.every(teamMovementQualityData => Object.keys(teamMovementQualityData).every(key => key === 'eventDate'))) {
            return ({grfData, grfMax: 0});
        }
        grfData.x = allData.TeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        let maxDataPerDay = allData.TeamMovementQualityData.map(teamMovementQualityData => {
            if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                let dayAthleteData = teamMovementQualityData.athletes.map(athlete => athlete.totalGRF);
                return dayAthleteData && dayAthleteData.length ? Math.max(...dayAthleteData) : 0;
            }
            return 0;
        });
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
            grfData.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.totalGRF || 0 : 0;
                }
                return 0;
            });
            grfData.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.irregularGRF || 0 : 0;
                }
                return 0;
            });
        } else {
            grfData.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.totalGRF || 0);
            grfData.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.irregularGRF || 0);
        }
        let maxInData = Math.max(...maxDataPerDay);
        let maxInDataLength = Math.round(maxInData).toString().length;
        let roundTo = maxInDataLength === 1 ? 1 : maxInDataLength === 2 ? 10 : maxInDataLength === 3 ? 100 : 1000;
        let grfMax = Math.round(maxInData * roundTo) / roundTo + roundTo;
        return ({grfData, grfMax});
    }

    getAccumulatedCoMAcceleration = () => {
        let accelData = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex] ? this.props.user.teams[this.props.user.teamIndex].stats : null;
        if (!allData) {
            return {};
        }
        if (allData.TeamMovementQualityData.every(teamMovementQualityData => Object.keys(teamMovementQualityData).every(key => key === 'eventDate'))) {
            return ({accelData, accelMax: 0});
        }
        accelData.x = allData.TeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        let maxDataPerDay = allData.TeamMovementQualityData.map(teamMovementQualityData => {
            if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                let dayAthleteData = teamMovementQualityData.athletes.map(athlete => athlete.totalAccel);
                return dayAthleteData && dayAthleteData.length ? Math.max(...dayAthleteData) : 0;
            }
            return 0;
        });
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
            accelData.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.totalAccel || 0 : 0;
                }
                return 0;
            });
            accelData.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.irregularAccel || 0 : 0;
                }
                return 0;
            });
        } else {
            accelData.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.totalAccel || 0);
            accelData.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.irregularAccel || 0);
        }
        let maxInData = Math.max(...maxDataPerDay);
        let maxInDataLength = Math.round(maxInData).toString().length;
        let roundTo = maxInDataLength === 1 ? 1 : maxInDataLength === 2 ? 10 : maxInDataLength === 3 ? 100 : maxInDataLength === 4 ? 1000 : maxInDataLength === 5 ? 10000 : maxInDataLength === 6 ? 100000 : 1000000;
        let accelMax = Math.round(maxInData * roundTo) / roundTo + roundTo;
        return ({accelData, accelMax});
    }

    preprocessingUpload = (uploadArray, role) => {
        if (!uploadArray || !uploadArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_UPLOADING;
        } else {
            text = uploadArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_UPLOADING : ErrorMessages.MULTIPLE_PREPROCESSING_UPLOADING;
            text = text.replace('X', String(uploadArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_upload_visible: false })}
        />
    }

    preprocessingProcessing = (processingArray, role) => {
        if (!processingArray || !processingArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_PROCESSING;
        } else {
            text = processingArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_PROCESSING : ErrorMessages.MULTIPLE_PREPROCESSING_PROCESSING;
            text = text.replace('X', String(processingArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_processing_visible: false })}
        />
    }

    preprocessingError = (errorArray, role) => {
        if (!errorArray || !errorArray.length) {
            return null;
        }
        let red = AppColors.secondary.red.hundredPercent;
        let grey = AppColors.primary.white.hundredPercent;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_ERROR;
        } else {
            text = errorArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_ERROR : ErrorMessages.MULTIPLE_PREPROCESSING_ERROR;
            text = text.replace('X', String(errorArray.length));
        }
        return <ListItem
            title={null}
            subtitle={text}
            subtitleStyle={{ color: grey }}
            subtitleNumberOfLines={null}
            containerStyle={{ backgroundColor: red }}
            rightIcon={{ name: 'clear', color: grey }}
            onPressRightIcon={() => this.setState({ preprocessing_error_visible: false })}
        />
    }

    preprocessingMessages = (preprocessing, role) => {
        if (!preprocessing) {
            return null;
        }
        return <View onLayout={ev => this.setState({ preprocessingHeight: ev.nativeEvent.layout.height })}>
            { this.state.preprocessing_upload_visible ? this.preprocessingUpload(preprocessing.UPLOAD_IN_PROGRESS, role) : null }
            { this.state.preprocessing_processing_visible ? this.preprocessingProcessing(preprocessing.PROCESSING_IN_PROGRESS, role) : null }
            { this.state.preprocessing_error_visible ? this.preprocessingError(preprocessing.PROCESSING_FAILED, role) : null }
        </View>
    }

    resetVisibleStates = () => {
        this.setState({
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true
        })
    }

    render() {
        let { tabbarHeight, preprocessingHeight } = this.state;
        let movementQualityScoreData = this.getBiomechanicalFatigueData();
        let {grfData, grfMax} = this.getAccumulatedGRFData();
        let {accelData, accelMax} = this.getAccumulatedCoMAcceleration();
        let user = this.props.user;
        let preprocessing = user.teams[user.teamIndex] ? user.teams[user.teamIndex].preprocessing : null;
        let role = user.role;
        return (
            <ScrollableTabView
                initialPage={0}
                tabBarUnderlineStyle={{ height: 0 }}
                tabBarActiveTextColor={AppColors.secondary.blue.hundredPercent}
                tabBarInactiveTextColor={AppColors.primary.grey.hundredPercent}
                renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab} />}
            >
                <View style={{ backgroundColor: AppColors.white }} tabLabel={tabs[0]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <FloatingBarChart
                        xAxis={'Movement Quality Score (0 to 100)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={movementQualityScoreData}
                        tabOffset={-7}
                        tabbarHeight={tabbarHeight}
                        preprocessingHeight={preprocessingHeight}
                        user={user}
                        startRequest={this.props.startRequest}
                        stopRequest={this.props.stopRequest}
                        resetVisibleStates={this.resetVisibleStates}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View style={{ backgroundColor: AppColors.white }} tabLabel={tabs[1]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <StackedBarChart
                        xAxis={'Accum. GRF (Millions of Newtons)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={grfData}
                        tabOffset={-8}
                        tabbarHeight={tabbarHeight}
                        preprocessingHeight={preprocessingHeight}
                        max={grfMax}
                        graphNum={1}
                        user={user}
                        startRequest={this.props.startRequest}
                        stopRequest={this.props.stopRequest}
                        resetVisibleStates={this.resetVisibleStates}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View style={{ backgroundColor: AppColors.white }} tabLabel={tabs[2]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <StackedBarChart
                        xAxis={'Accum. CoM Accel. (Meters per sec. sqr.)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={accelData}
                        tabOffset={-6.5}
                        tabbarHeight={tabbarHeight}
                        preprocessingHeight={preprocessingHeight}
                        max={accelMax}
                        graphNum={2}
                        user={user}
                        startRequest={this.props.startRequest}
                        stopRequest={this.props.stopRequest}
                        resetVisibleStates={this.resetVisibleStates}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
            </ScrollableTabView>
        );
    }
}


/* Export Component ==================================================================== */
export default Dashboard;
