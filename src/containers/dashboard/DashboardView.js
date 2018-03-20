/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-16 17:28:28
 */

import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';

import PropTypes from 'prop-types';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';
import { Roles, ErrorMessages } from '@constants/';

// Components
import { ListItem, Text, StackedBarChart, FloatingBarChart } from '@ui/';

// Tabs title (index: 0) and subtitle (index: 1)
const tabs = {
    0: ['RESPONSE TO LOAD', 'Biomechanical Fatigue'],
    1: ['TRAINING VOLUME', 'Accumulated GRF'],
    2: ['TRAINING VOLUME', 'Accumulated CoM Acceleration']
}

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
            preprocessing_upload_visible:     true,
            preprocessing_processing_visible: true,
            preprocessing_error_visible:      true
        };
    }

    componentWillMount = () => {
        return this.props.startRequest()
            .then(() => this.props.getTeams(this.props.user.statsStartDate, this.props.user.statsEndDate, this.props.user.weekOffset))
            .then(() => this.props.stopRequest());
    }

    renderTab(name, page, isTabActive, onPressHandler, onLayoutHandler, subtitle) {
        const textStyle = AppStyles.tabHeaders;
        const inactiveTextColor = AppColors.brand.grey;
        const activeTextColor = AppColors.brand.primary;
        const textColor = isTabActive ? activeTextColor : inactiveTextColor;
        const fontWeight = isTabActive ? 'bold' : 'normal';
        let padding1 = 0;
        
        return <TouchableHighlight
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View>
                <View style={[page === 0 ? AppStyles.leftTabBar : page === 1 ? AppStyles.centerTabBar : AppStyles.rightTabBar]}>
                    <View onLayout={ev => {
                        if (page === 0) { 
                            let padding = (ev.nativeEvent.layout.width/2 + ev.nativeEvent.layout.x)-AppSizes.screen.width/2;
                            padding1 = padding;
                        }
                    }} style={{ alignItems: 'center', justifyContent: 'center', marginRight: page === 0 ? padding1 : 0 }}>
                        <Text style={[{color: textColor, fontWeight }, textStyle, ]}>
                            {name}
                        </Text>
                        <Text h6 style={{ color: textColor, fontWeight }}>{tabs[page][1]}</Text>
                    </View>
                </View>
                {
                    isTabActive ? <View style={{ backgroundColor: AppColors.brand.yellow, width: AppSizes.screen.widthQuarter, height: 4, bottom: 0, left: AppSizes.screen.width * (page === 0 ? 0.375 : page === 1 ? 0.1275 : 0.1125), position: 'absolute' }} /> : null
                }
            </View>
        </TouchableHighlight>;
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
            data.y1 = allTeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.percOptimal || 0 : 0;
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
            data.y1 = allTeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.percOptimal || 0);
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
        let red = AppColors.brand.red;
        let grey = AppColors.brand.grey;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_UPLOADING;
        } else {
            text = uploadArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_UPLOADING : ErrorMessages.MULTIPLE_PREPROCESSING_UPLOADING;
            text.replace('X', String(uploadArray.length));
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
        let red = AppColors.brand.red;
        let grey = AppColors.brand.grey;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_PROCESSING;
        } else {
            text = processingArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_PROCESSING : ErrorMessages.MULTIPLE_PREPROCESSING_PROCESSING;
            text.replace('X', String(processingArray.length));
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
        let red = AppColors.brand.red;
        let grey = AppColors.brand.grey;
        let text = '';
        if (role === Roles.athlete) {
            text = ErrorMessages.ATHLETE_PREPROCESSING_ERROR;
        } else {
            text = errorArray.length === 1 ? ErrorMessages.SINGLE_PREPROCESSING_ERROR : ErrorMessages.MULTIPLE_PREPROCESSING_ERROR;
            text.replace('X', String(errorArray.length));
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
        return <View>
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
                tabBarActiveTextColor={AppColors.brand.primary}
                tabBarInactiveTextColor={AppColors.brand.grey}
                renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab} />}
            >
                <View tabLabel={tabs[0][0]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <FloatingBarChart
                        xAxis={'Movement Quality Score (0 to 100)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={movementQualityScoreData}
                        tabOffset={-7}
                        user={user}
                        startRequest={this.props.startRequest}
                        stopRequest={this.props.stopRequest}
                        resetVisibleStates={this.resetVisibleStates}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View tabLabel={tabs[1][0]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <StackedBarChart
                        xAxis={'Accum. GRF (Millions of Newtons)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={grfData}
                        tabOffset={-8}
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
                <View tabLabel={tabs[2][0]}>
                    { this.preprocessingMessages(preprocessing, role) }
                    <StackedBarChart
                        xAxis={'Accum. CoM Accel. (Meters per sec. sqr.)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={accelData}
                        tabOffset={-6.5}
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
