/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-23 11:08:54
 */

import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import ScrollableTabView, { ScrollableTabBar } from 'react-native-scrollable-tab-view';

// Consts and Libs
import { AppColors, AppStyles, AppSizes } from '@theme/';

// Components
import { ListItem, Text, StackedBarChart, FloatingBarChart } from '@ui/';
import { Placeholder } from '@general/';

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
        teamSelect:       PropTypes.func.isRequired,
        getTeams:         PropTypes.func.isRequired,
        setStatsCategory: PropTypes.func.isRequired,
        getTeamStats:     PropTypes.func.isRequired,
    }
    
    static defaultProps = {
        user: {
            teamIndex: 0
        },
    }

    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentWillMount = () => {
        return this.props.getTeams();
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
        data.x = allData.TeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
            data.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.percOptimal || 0 : 0;
                }
                return 0;
            });
            data.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.fatigue || 0 : 0;
                }
                return 0;
            });
        } else {
            data.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.percOptimal || 0);
            data.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.fatigue || 0);
        }
        return data;
    }

    getAccumulatedGRFData = () => {
        let grfData = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex] ? this.props.user.teams[this.props.user.teamIndex].stats : null;
        if (!allData) {
            return {};
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

    render() {
        let movementQualityScoreData = this.getBiomechanicalFatigueData();
        let {grfData, grfMax} = this.getAccumulatedGRFData();
        let {accelData, accelMax} = this.getAccumulatedCoMAcceleration();
        return (
            <ScrollableTabView
                initialPage={0}
                tabBarUnderlineStyle={{ height: 0 }}
                tabBarActiveTextColor={AppColors.brand.primary}
                tabBarInactiveTextColor={AppColors.brand.grey}
                renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab} />}
            >
                <View tabLabel={tabs[0][0]}>
                    <FloatingBarChart
                        xAxis={'Movement Quality Score (0 to 100)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={movementQualityScoreData}
                        tabOffset={-7}
                        user={this.props.user}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View tabLabel={tabs[1][0]}>
                    <StackedBarChart
                        xAxis={'Accum. GRF (Millions of Newtons)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={grfData}
                        tabOffset={-8}
                        max={grfMax}
                        user={this.props.user}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View tabLabel={tabs[2][0]}>
                    <StackedBarChart
                        xAxis={'Accum. CoM Accel. (Meters per sec. sqr.)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight*2/5}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={accelData}
                        tabOffset={-6.5}
                        max={accelMax}
                        user={this.props.user}
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
