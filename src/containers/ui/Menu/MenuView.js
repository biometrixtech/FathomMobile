/**
 * Menu Contents
 */
/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import {
    View,
    Image,
    Alert,
    StyleSheet,
    TouchableOpacity,
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import { Icon } from 'react-native-elements';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';

// Components
import { Spacer, Text, Button } from '@ui/';
import { Roles } from '@constants/';

/* Biometrix Roles =========================================================== */

/* Styles ==================================================================== */
const MENU_BG_COLOR = '#2E3234';

const styles = StyleSheet.create({
    backgroundFill: {
        backgroundColor: AppColors.brand.primary,
        height:          AppSizes.screen.height,
        width:           AppSizes.screen.width,
        position:        'absolute',
        top:             0,
        left:            0,
    },
    container: {
        position: 'relative',
        flex:     1,
    },
    menuContainer: {
        flex:            3,
        left:            0,
        right:           0,
        backgroundColor: AppColors.brand.primary,
        paddingTop:      AppSizes.padding,
        paddingBottom:   AppSizes.padding,
    },
    imageContainer: {
        flex:   1,
        margin: 20
    },

    // Main Menu
    menu: {
        flex:            3,
        left:            0,
        right:           0,
        backgroundColor: AppColors.brand.primary,
        paddingTop:      AppSizes.statusBarHeight,
    },
    menuItem: {
        borderBottomWidth: 1,
        borderBottomColor: AppColors.border,
        padding:           10,
        flexDirection:     'row',
    },
    menuItem_text: {
        fontSize:    AppFonts.scaleFont(18),
        lineHeight:  AppFonts.lineHeight(AppFonts.scaleFont(18)),
        fontWeight:  'normal',
        color:       '#EEEFF0',
        paddingLeft: AppSizes.padding*2.5,
    },

    // Menu Bottom
    menuBottom: {
        flex:           1,
        left:           0,
        right:          0,
        justifyContent: 'flex-end',
        paddingBottom:  10,
    },
    menuBottom_text: {
        color:      '#EEEFF0',
        lineHeight: AppFonts.lineHeight(AppFonts.scaleFont(23)),
        fontSize:   AppFonts.scaleFont(23),
    },
});

/* Component ==================================================================== */
class Menu extends Component {
    static propTypes = {
        logout:        PropTypes.func.isRequired,
        closeSideMenu: PropTypes.func.isRequired,
        user:          PropTypes.object
    }

    static defaultProps = {
        user: null,
    }

    constructor(props) {
        super(props);

        // let action;

        // switch (this.props.user.role) {
        // case Roles.admin:
        //     action = Actions.adminTeamManagement;
        //     break;
        // case Roles.athlete:
        //     action = Actions.athleteAthleteManagement;
        //     break;
        // case Roles.biometrixAdmin:
        //     action = Actions.biometrixAdminTeamCaptureSession;
        //     break;
        // case Roles.manager:
        //     action = Actions.managerTeamManagement;
        //     break;
        // case Roles.researcher:
        //     action = Actions.researcherSubjectManagement;
        //     break;
        // default:
        //     break;
        // }

        this.state = {
            active: 0,
            menu:   [
                // {
                //     itemName: 'view-dashboard',
                //     title:    'Dashboard',
                //     onPress:  () => { this.props.closeSideMenu(); action(); this.setState({ active: 0 }); },
                // },
                {
                    itemName: 'pulse',
                    title:    'Capture Session',
                    onPress:  () => { this.props.closeSideMenu(); Actions.teamCaptureSession(); this.setState({ active: 0 }); }
                },
                // {
                //     itemName: 'tooltip-edit',
                //     title:    'Feedback Settings',
                //     onPress:  () => { this.props.closeSideMenu(); this.setState({ active: 2 }); Actions.settings(); },
                // },
                // {
                //     itemName: 'account-settings-variant',
                //     title:    'Manage Account',
                //     onPress:  () => { this.props.closeSideMenu(); this.setState({ active: 3 }); }
                // },
                {
                    itemName: 'mixcloud',
                    title:    'Manage Kit',
                    onPress:  () => { this.props.closeSideMenu(); this.setState({ active: 1 }); Actions.kitManagement(); },
                },
            ],
        };
    }

    logout = () => {
        if (this.props.logout) {
            this.props.logout()
                .then(() => {
                    this.props.closeSideMenu();
                    return Actions.login();
                }).catch((err) => {
                    return Alert.alert('Uh oh!', 'Something went wrong, please try again.');
                });
        }
    }

    render = () => {
        const { menu } = this.state;

        // Build the actual Menu Items
        const menuItems = menu.map((item, index) => {
            const { title, onPress, itemName } = item;

            return (
                <TouchableOpacity
                    key={`menu-item-${title}`}
                    onPress={onPress}
                >
                    <View style={[styles.menuItem, { backgroundColor: this.state.active === index ? '#FFFFFF' : AppColors.brand.primary }]}>
                        <Icon type={'material-community'} color={this.state.active === index ? AppColors.brand.primary : '#FFFFFF'} name={itemName}/>
                        <Text style={[styles.menuItem_text, { color: this.state.active === index ? AppColors.brand.primary : '#FFFFFF' }]}>
                            {title}
                        </Text>
                    </View>
                </TouchableOpacity>
            );
        });

        return (
            <View style={[styles.container]}>
                <View style={[styles.backgroundFill]} />

                <Image resizeMode={'contain'} style={[styles.imageContainer]} source={{ uri: this.props.user.avatar_url }} />

                <Spacer />

                <Text
                    style={[
                        styles.menuBottom_text,
                        AppStyles.textCenterAligned,
                        { backgroundColor: AppColors.transparent }
                    ]}
                >
                    {this.props.user.first_name && this.props.user.last_name ? `${this.props.user.first_name} ${this.props.user.last_name}` : this.props.user.role}
                </Text>

                <Spacer />

                <View style={[styles.menuContainer]}>
                    <View style={[styles.menu]}>{menuItems}</View>

                    <View style={[styles.menuBottom]}>
                        <View style={[AppStyles.paddingHorizontal, AppStyles.paddingVerticalSml]}>
                            <Button
                                backgroundColor={MENU_BG_COLOR}
                                title={'Log Out'}
                                onPress={this.logout}
                            />
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}

/* Export Component ==================================================================== */
export default Menu;
