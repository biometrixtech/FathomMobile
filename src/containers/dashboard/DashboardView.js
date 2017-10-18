/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:08:20 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2017-10-17 18:30:56
 */

import React, { Component } from 'react';
import { TouchableHighlight, View } from 'react-native';

import PropTypes from 'prop-types';
import { Icon } from 'react-native-elements';
import ModalDropdown from 'react-native-modal-dropdown';
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

const d = {
    x:  [new Date('2017-03-01'), new Date('2017-03-02'), new Date('2017-03-03'), new Date('2017-03-04'), new Date('2017-03-05'), new Date('2017-03-06'), new Date('2017-03-07')],
    y1: [150, 62, 0, 99, 53, 148, 63],
    y2: [31, 24, 0, 16, 9, 8, 8]
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
        
        return <TouchableHighlight
            key={`${name}_${page}`}
            accessible={true}
            accessibilityLabel={name}
            accessibilityTraits='button'
            onPress={() => onPressHandler(page)}
            onLayout={onLayoutHandler}
        >
            <View style={[AppStyles.tabbar]}>
                <Text style={[{color: textColor, fontWeight }, textStyle, ]}>
                    {name}
                </Text>
                <Text h6 style={{ color: textColor, fontWeight }}>{tabs[page][1]}</Text>
            </View>
        </TouchableHighlight>;
    }

    modalDropdown = () => {
        return <View style={{ justifyContent: 'center', backgroundColor: '#FFFFFF', alignSelf: 'flex-end' }} >
            {
                this.props.user.teams.length > 1 ?
                    <View style={{ justifyContent: 'center', flexDirection: 'row' }}>
                        <ModalDropdown
                            options={this.props.user.teams.map(team => team.name)}
                            defaultIndex={this.props.user.teamIndex}
                            defaultValue={this.props.user.teams[this.props.user.teamIndex].name}
                            textStyle={AppStyles.h3}
                            dropdownTextStyle={AppStyles.h3}
                            onSelect={index =>  Promise.resolve(this.props.teamSelect(index))}
                        />
                        <Icon name={'caret-down'} type={'font-awesome'} size={16} containerStyle={{ marginLeft: 5 }} color={AppColors.brand.blue}/>
                    </View>
                    :
                    <Text style={AppStyles.h3}>{this.props.user.teams[this.props.user.teamIndex].name || 'No teams'}</Text>

            }
        </View>
    }

    getBiomechanicalFatigueData = () => {
        let data = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex].stats;
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
        let data = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex].stats;
        if (!allData) {
            return null;
        }
        data.x = allData.TeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
            data.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.totalGRF || 0 : 0;
                }
                return 0;
            });
            data.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => {
                if (teamMovementQualityData.athletes && teamMovementQualityData.athletes.length) {
                    let foundAthlete = teamMovementQualityData.athletes.find(athlete => athlete.userId === athleteId);
                    return foundAthlete ? foundAthlete.irregularGRF || 0 : 0;
                }
                return 0;
            });
        } else {
            data.y1 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.totalGRF || 0);
            data.y2 = allData.TeamMovementQualityData.map(teamMovementQualityData => teamMovementQualityData.irregularGRF || 0);
        }
        return data;
    }

    getAccumulatedCoMAcceleration = () => {
        let data = { x: [], y1: [], y2: [] };
        let allData = this.props.user.teams[this.props.user.teamIndex].stats;
        if (!allData) {
            return null;
        }
        data.x = allData.TeamMovementQualityData.map(teamMovementQualityData => new Date(teamMovementQualityData.eventDate));
        if (this.props.user.selectedStats.athlete) {
            let athleteId = this.props.user.selectedStats.athleteId;
        }
        return data;
    }

    render() {
        let movementQualityScoreData = this.getBiomechanicalFatigueData();
        let grfData = this.getAccumulatedGRFData();
        return (
            <ScrollableTabView
                initialPage={0}
                tabBarUnderlineStyle={{ backgroundColor: AppColors.brand.yellow }}
                tabBarActiveTextColor={AppColors.brand.primary}
                tabBarInactiveTextColor={AppColors.brand.grey}
                tabBarTextStyle={AppStyles.tabHeaders}
                renderTabBar={() => <ScrollableTabBar renderTab={this.renderTab} />}
            >
                <View tabLabel={tabs[0][0]}>
                    <FloatingBarChart
                        xAxis={'Movement Quality Score (0 to 100)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight/2}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={movementQualityScoreData}
                        tabOffset={-0.5}
                        user={this.props.user}
                        teamSelect={this.props.teamSelect}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View tabLabel={tabs[1][0]}>
                    <StackedBarChart
                        xAxis={'Accum. GRF (Millions of Newtons)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight/2}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={grfData}
                        tabOffset={-1}
                        user={this.props.user}
                        teamSelect={this.props.teamSelect}
                        setStatsCategory={this.props.setStatsCategory}
                        getTeamStats={this.props.getTeamStats}
                    />
                </View>
                <View tabLabel={tabs[2][0]}>
                    <StackedBarChart
                        xAxis={'Accum. CoM Accel. (Meters per sec. sqr.)'}
                        width={AppSizes.screen.widthFourFifths}
                        height={AppSizes.screen.usableHeight/2}
                        margin={{ horizontal: AppSizes.padding, vertical: AppSizes.paddingSml }}
                        data={d}
                        tabOffset={1.5}
                        user={this.props.user}
                        teamSelect={this.props.teamSelect}
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
