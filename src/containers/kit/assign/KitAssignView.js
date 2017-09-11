/**
 * Kit Assign Screen
 */
import React, { Component, PropTypes } from 'react';
import {
    Image,
    ScrollView,
    View,
    KeyboardAvoidingView,
    StyleSheet,
    ActivityIndicator
} from 'react-native';
import { Icon, SearchBar } from 'react-native-elements';
import { Actions } from 'react-native-router-flux';

// Consts and Libs
import { AppStyles, AppSizes, AppColors, AppFonts } from '@theme/';
import { Roles } from '@constants/';

// Components
import { Spacer, Button, FormLabel, Text, ListItem } from '@ui/';
import { Placeholder } from '@general/';

const font10 = AppFonts.scaleFont(10);
const font14 = AppFonts.scaleFont(14);

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    indicator: {
        position: 'absolute',
        left:     0,
        right:    0,
        bottom:   0,
        top:      0,
    }
});

/* Component ==================================================================== */
class KitAssignView extends Component {
    static componentName = 'KitAssignView';

    static propTypes = {
        user:                  PropTypes.object,
        bluetooth:             PropTypes.object,
        assignKitOrganization: PropTypes.func.isRequired,
        assignKitTeam:         PropTypes.func.isRequired,
        assignKitIndividual:   PropTypes.func.isRequired
    }

    static defaultProps = {
        user: {},
    }

    constructor(props) {
        super(props);

        this.state = {
            searchText:      '',
            categoryHeight:  0,
            searchBarHeight: 0
        };
    }

    adminView = () => (
        <Placeholder />
    );

    athleteView = () => (
        <Placeholder />
    );

    biometrixAdminView = () => {
        let accessory = this.props.bluetooth.accessoryData;
        let assignType = this.props.bluetooth.assignType;
        let users = this.props.user.teams[this.props.user.teamIndex].users_with_training_groups;
        let category, name;
        switch(assignType) {
        case 'team':
            category =  'TEAM';
            name = this.props.bluetooth.accessoryData.team ? this.props.bluetooth.accessoryData.team.name : '{None}';
            break;
        case 'individual':
            category = 'INDIVIDUAL';
            name = this.props.bluetooth.accessoryData.individual ? `${this.props.bluetooth.accessoryData.individual.first_name} ${this.props.bluetooth.accessoryData.individual.last_name}` : '{None}';
            break;
        case 'organization':
            category = 'ORGANIZATION';
            name = this.props.bluetooth.accessoryData.organization ? this.props.bluetooth.accessoryData.organization.name : '{None}';
            break;
        default:
            category = '';
            name = '';
            break;
        }

        return (
            <KeyboardAvoidingView
                behavior={'position'}
                style={[AppStyles.container, { backgroundColor: AppColors.brand.light }]}
            >
                <View style={{ backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center', height: AppSizes.screen.heightOneThird }}>
                    <Image source={require('@images/kit-diagram.png')} resizeMode={'contain'} style={{ width: AppSizes.screen.widthTwoThirds, height: AppSizes.screen.widthTwoThirds * 268/509 }}/>
                    <Spacer size={5}/>
                    <Text>{accessory.name || ''}</Text>
                    <Text style={{ fontSize: font10 }}>{accessory.wifiMacAddress || ''}</Text>
                </View>
                { this.props.bluetooth.indicator ? 
                    <View style={[styles.indicator, { justifyContent: 'center', alignItems: 'center'}]}>
                        <ActivityIndicator
                            animating={true}
                            size={'large'}
                            color={'#C1C5C8'}
                        />
                    </View> : null
                }
                <View>
                    <ListItem
                        title={category}
                        containerStyle={{ padding: 10, backgroundColor: AppColors.brand.light }}
                        hideChevron
                        onLayout={(ev) => { this.setState({ categoryHeight: ev.nativeEvent.layout.height }); }}
                    />
                    {
                        assignType !== 'organization' ?
                            <SearchBar
                                containerStyle={{ backgroundColor: '#FFFFFF', borderWidth: 0 }}
                                inputStyle={{ backgroundColor: '#FFFFFF' }}
                                placeholder={`Enter ${assignType}`}
                                onChangeText={text => this.setState({ searchText: text })}
                                lightTheme
                                onLayout={(ev) => { this.setState({ searchBarHeight: ev.nativeEvent.layout.height }); }}
                            /> : null
                    }
                    <ScrollView style={{ height: AppSizes.screen.heightTwoThirds - AppSizes.navbarHeight - this.state.categoryHeight - this.state.searchBarHeight - 40 }}>
                        {
                            assignType === 'individual'
                                ?
                                users.filter(user => `${user.first_name} ${user.last_name}`.toUpperCase().indexOf(this.state.searchText.toUpperCase()) > -1).map(user => {
                                    return <ListItem
                                        key={user.id}
                                        title={`${user.first_name} ${user.last_name}`}
                                        containerStyle={{ backgroundColor: `${user.first_name} ${user.last_name}` === name ? AppColors.brand.fogGrey : AppColors.background }}
                                        onPress={() => this.props.assignKitIndividual(accessory, user)}
                                        hideChevron
                                    />
                                })
                                :
                                assignType === 'team'
                                    ?
                                    this.props.user.teams.filter(team => team.name.toUpperCase().indexOf(this.state.searchText.toUpperCase()) > -1).map(team => {
                                        return <ListItem
                                            key={team.id}
                                            title={team.name}
                                            containerStyle={{ backgroundColor: team.name === name ? AppColors.brand.fogGrey : AppColors.background }}
                                            onPress={() => this.props.assignKitTeam(accessory, team)}
                                            hideChevron
                                        />
                                    })
                                    :
                                    <ListItem
                                        title={this.props.user.organization.name}
                                        containerStyle={{ backgroundColor: this.props.user.organization.name === name ? AppColors.brand.fogGrey : AppColors.background }}
                                        onPress={() => this.props.assignKitOrganization(accessory, this.props.user.organization)}
                                        hideChevron
                                    />
                        }
                        <Text style={{
                            paddingLeft: 20,
                            fontSize:    name === '{None}' ? font14 : font10,
                            fontWeight:  name === '{None}' ? 'bold' : 'normal'
                        }}>{`Step 1: Select the ${category} to assign to this kit`}</Text>
                        <Text style={{
                            paddingLeft: 20,
                            fontSize:    name !== '{None}' ? font14 : font10,
                            fontWeight:  name !== '{None}' ? 'bold' : 'normal'
                        }}>{`Step 2: Select another ${category} or go to the previous menu`}</Text>
                        <Spacer/>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        );
    }

    managerView = () => (
        <Placeholder />
    );

    researcherView = () => (
        <Placeholder />
    );

    render = () => {
        switch(this.props.user.role) {
        case Roles.admin:
            return this.adminView();
        case Roles.athlete:
            return this.athleteView();
        case Roles.biometrixAdmin:
            return this.biometrixAdminView();
        case Roles.superAdmin:
            return this.biometrixAdminView();
        case Roles.manager:
            return this.biometrixAdminView();
        case Roles.researcher:
            return this.researcherView();
        default:
            return <Placeholder />;
        }
    }
}

/* Export Component ==================================================================== */
export default KitAssignView;
