/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:35:22 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-12 00:50:42
 */

/**
 * Menu Contents
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    View,
    ScrollView,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';
import Collapsible from 'react-native-collapsible';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '../../../theme/';

// Components
import { Spacer, Text, Button } from '../../../components/ui/';
import { Roles } from '../../../constants/';

const styles = StyleSheet.create({
    // Container
    container: {
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        flex:            1,
    },
    menuContainer: {
        flex:            3,
        left:            0,
        right:           0,
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        paddingTop:      AppSizes.padding/2,
        paddingBottom:   AppSizes.padding,
    },
    imageContainer: {
        flex:        1,
        height:      null,
        width:       null,
        marginTop:   20,
        marginLeft:  50,
        marginRight: 50,
        resizeMode:  'contain'
    },

    // Main Menu
    menu: {
        flex:            3,
        left:            0,
        right:           0,
        backgroundColor: AppColors.secondary.blue.hundredPercent,
        paddingTop:      AppSizes.statusBarHeight,
    },
    menuItem: {
        borderBottomWidth: 0,
        borderBottomColor: AppColors.border,
        padding:           10,
        flexDirection:     'row',
    },
    menuItem_text: {
        fontSize:    AppFonts.scaleFont(18),
        lineHeight:  AppFonts.lineHeight(AppFonts.scaleFont(18)),
        fontWeight:  'normal',
        color:       '#EEEFF0',
        paddingLeft: AppSizes.padding*2,
    },
    menu_name: {
        color:       '#EEEFF0',
        paddingLeft: 10,
        lineHeight:  AppFonts.lineHeight(AppFonts.scaleFont(18)),
        fontSize:    AppFonts.scaleFont(18),
    },

    // Collapse
    collapseItem_text: {
        fontSize:    AppFonts.scaleFont(18),
        lineHeight:  AppFonts.lineHeight(AppFonts.scaleFont(18)),
        fontWeight:  'normal',
        color:       '#EEEFF0',
        paddingLeft: AppSizes.padding*4,
    },
});

/* Component ==================================================================== */
class Menu extends Component {
    static propTypes = {
        logout:        PropTypes.func.isRequired,
        disconnect:    PropTypes.func.isRequired,
        closeSideMenu: PropTypes.func.isRequired,
        user:          PropTypes.object,
        setKitState:   PropTypes.func.isRequired,
        id:            PropTypes.string,
        teamSelect:    PropTypes.func.isRequired,
        userSelect:    PropTypes.func.isRequired,
    }

    static defaultProps = {
        user: null,
        id:   null
    }

    constructor(props) {
        super(props);

        // let action;
        let active = 1;

        switch (this.props.user.role) {
        case Roles.athlete:
            // action = Actions.athleteAthleteManagement;
            active = 0;
            this.props.teamSelect(0);
            this.props.userSelect(0);
            break;
        case Roles.admin:
            // action = Actions.adminTeamManagement;
            break;
        case Roles.biometrixAdmin:
            // action = Actions.biometrixAdminTeamCaptureSession;
            break;
        case Roles.manager:
            // action = Actions.managerTeamManagement;
            break;
        case Roles.researcher:
            // action = Actions.researcherSubjectManagement;
            break;
        default:
            break;
        }
        

        this.state = {
            active,
            areTeamsCollapsed: true,
            areUsersCollapsed: true,
            menu:              [
                {
                    itemName: 'clipboard-outline',
                    title:    'Training Report',
                    onPress:  () => { this.setState({ areUsersCollapsed: !this.state.areUsersCollapsed }); },
                    select:   (index) => { Promise.resolve(this.props.userSelect(index)).then(() => Promise.resolve(this.props.closeSideMenu())).then(() => this.props.teamSelect(null)); this.setState({ active: 0, areUsersCollapsed: true }); Actions.report(); }
                },
                {
                    itemName: 'chart-bar',
                    title:    'Dashboard',
                    onPress:  () => { this.setState({ areTeamsCollapsed: !this.state.areTeamsCollapsed }); },
                    select:   (index) => { Promise.resolve(this.props.teamSelect(index)).then(() => Promise.resolve(this.props.closeSideMenu())).then(() => this.props.userSelect(null)); this.setState({ active: 1, areTeamsCollapsed: true }); Actions.dashboard(); }
                },
                // {
                //     itemName: 'pulse',
                //     title:    'Capture Session',
                //     onPress:  () => { this.props.closeSideMenu(); Actions.teamCaptureSession(); this.setState({ active: 0 }); return this.props.id ? this.props.setKitState(this.props.id, 'APP_IDLE') : null; }
                // },
                {
                    itemName: 'settings',
                    title:    'Manage Kit',
                    onPress:  () => { Promise.resolve(this.props.closeSideMenu()).then(() => this.props.userSelect(null)); this.setState({ active: 2 }); Actions.kitManagement(); },
                },
                {
                    itemName: 'forum',
                    title:    'Support',
                    onPress:  () => { Promise.resolve(this.props.closeSideMenu()).then(() => this.props.userSelect(null)); this.setState({ active: 3 }); Actions.placeholder(); },
                },
                {
                    itemName: 'power',
                    title:    'Logout',
                    onPress:  () => { Promise.resolve(this.props.closeSideMenu()).then(() => this.logout()); },
                }
            ],
        };
    }

    componentWillMount = () => {
        switch (this.props.user.role) {
        case Roles.athlete:
            Actions.report();
            break;
        case Roles.admin:
        case Roles.biometrixAdmin:
        case Roles.manager:
        case Roles.researcher:
        default:
            Actions.dashboard();
            break;
        }
    }

    logout = () => {
        if (this.props.logout) {
            return this.props.logout()
                .then(() => {
                    this.props.closeSideMenu();
                    return Actions.login();
                }).catch((err) => {
                    console.log(err);
                    return Alert.alert('Uh oh!', 'Something went wrong, please try again.');
                })
                .then(() => this.props.id ? this.props.disconnect(this.props.id) : null)
                .catch(err => Promise.reject(err));
        }
        return null;
    }


    collapseFunction = (index, onPress, select) => {
        if (!index) {
            return this.props.user.users.length === 1 ? select(0) : onPress();
        } else if (index === 1) {
            return this.props.user.teams.length === 1 ? select(0) : onPress();
        }
        return onPress();
    }

    render = () => {
        const { menu } = this.state;

        // Build the actual Menu Items
        const menuItems = menu.map((item, index) => {
            const { title, onPress, itemName, select } = item;

            return (
                <View key={`menu-item-${title}`}>
                    <TouchableOpacity onPress={() => this.collapseFunction(index, onPress, select)}>
                        <View style={[styles.menuItem]}>
                            <Icon type={'material-community'} color={this.state.active === index ? AppColors.primary.yellow.hundredPercent : AppColors.white} name={itemName}/>
                            <Text style={[styles.menuItem_text, { color: this.state.active === index ? AppColors.primary.yellow.hundredPercent : AppColors.white }]}>
                                {title}
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {
                        index === 1 ?
                            <Collapsible collapsed={this.state.areTeamsCollapsed} >
                                {
                                    this.props.user.teams.map((team, teamIndex) => 
                                        <TouchableOpacity
                                            key={`team-item-${team.name}-${teamIndex}`}
                                            onPress={() => select(teamIndex)}
                                        >
                                            <View style={[styles.menuItem]}>
                                                <Text style={[styles.collapseItem_text, { color: this.props.user.teamIndex === teamIndex ? AppColors.primary.yellow.hundredPercent : AppColors.white }]}>
                                                    {team.name}
                                                </Text>
                                            </View>
                                        </TouchableOpacity>
                                    )
                                }
                            </Collapsible>
                            :
                            !index ?
                                <Collapsible collapsed={this.state.areUsersCollapsed} >
                                    {
                                        this.props.user.users.map((user, userIndex) =>
                                            <TouchableOpacity
                                                key={`user-item-${user.first_name}_${user.last_name}-${userIndex}`}
                                                onPress={() => select(userIndex)}
                                            >
                                                <View style={[styles.menuItem]}>
                                                    <Text style={[styles.collapseItem_text, { color: this.props.user.userIndex === userIndex ? AppColors.primary.yellow.hundredPercent : AppColors.white }]}>
                                                        {`${user.first_name} ${user.last_name}`}
                                                    </Text>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    }
                                </Collapsible>
                                : null
                    }
                </View>
            );
        });

        return (
            <View style={[styles.container]}>
                <Image resizeMode={'contain'} style={[styles.imageContainer]} source={require('../../../../assets/images/fathom_gold_and_white.png')} />

                <Text
                    style={[
                        styles.menu_name,
                        AppStyles.textLeftAligned,
                        { backgroundColor: AppColors.transparent }
                    ]}
                >
                    {this.props.user.first_name && this.props.user.last_name ? `${this.props.user.first_name} ${this.props.user.last_name}` : this.props.user.role}
                </Text>

                <View style={[styles.menuContainer]}>
                    <ScrollView style={[styles.menu]}>{menuItems}</ScrollView>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Menu;
