/**
 * Regimens Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon, CheckBox } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';
import { Actions } from 'react-native-router-flux';

// Components
import { FormInput, FormLabel, Card, Button, ListItem, Spacer } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    whiteText: {
        color: '#FFF',
    },
    start: {
        color: AppColors.brand.primary,
    },
    stop: {
        color: AppColors.brand.red,
    },
    badgeTextStyle: {
        fontWeight: 'bold',
    },
    cardView: {
        backgroundColor: '#31363D',
        alignItems:      'center',
    },
    listItemStyle: {
        alignItems:     'center',
        justifyContent: 'center',
        height:         40,
    },
});

/* Component ==================================================================== */
class RegimensView extends Component {
    static componentName = 'RegimensView';

    static propTypes = {
        regimens:       PropTypes.array,
        trainingGroups: PropTypes.array,
        isModalVisible: PropTypes.bool,
        addRegimen:     PropTypes.func.isRequired,
        editRegimen:    PropTypes.func.isRequired,
        removeRegimen:  PropTypes.func.isRequired,
    };

    static defaultProps = {
        regimens:       [],
        trainingGroups: [],
        isModalVisible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            modalStyle:     {},
            regimen:        { name: '', trainingGroupIds: [] },
            regimens:       this.props.regimens,
            trainingGroups: this.props.trainingGroups,
        };
    }

    /* eslint-disable max-len */
    resizeModal(ev) {
        this.setState({ modalStyle: { height: (AppStyles.windowSize.height-80 > ev.nativeEvent.layout.height ? ev.nativeEvent.layout.height : AppStyles.windowSize.height-80), width: ev.nativeEvent.layout.width } });
    }

    /* eslint-disable react/no-string-refs */
    addRegimen = () => {
        this.state.regimen.id = this.state.regimens.length + 1;
        this.props.addRegimen(this.state.regimen);
        this.setState({ regimens: this.state.regimens.concat([this.state.regimen]), regimen: { name: '', trainingGroupIds: [] } });
        Actions.refresh({ isModalVisible: false });
    }

    editRegimen = () => {
        const index = this.state.regimens.findIndex(regimen => regimen.id === this.state.regimen.id);
        if (index > -1) {
            this.state.regimens[index] = this.state.regimen;
            this.props.editRegimen(this.state.regimen);
            this.setState({ regimens: this.state.regimens, regimen: { name: '', trainingGroupIds: [] } });
        }
        Actions.refresh({ isModalVisible: false });
    }

    removeRegimen = (id) => {
        this.props.removeRegimen(id);
        this.setState({ regimens: this.state.regimens.filter(regimen => regimen.id !== id) });
    };

    toggleTrainingGroup = (id) => {
        const index = this.state.regimen.trainingGroupIds.findIndex(groupId => groupId === id);
        if (index > -1) {
            this.state.regimen.trainingGroupIds.splice(index, 1);
        } else {
            this.state.regimen.trainingGroupIds.push(id);
        }
        this.setState({ regimen: this.state.regimen });
    };

    leftButton = data => (
      <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.editButton]}>
        <Icon name="pencil" onPress={() => { this.setState({ regimen: data }); Actions.refresh({ isModalVisible: true }); }} type="material-community" color="#FFFFFF" />
      </View>
    );

    rightButton = id => (
      <View style={[{ alignItems: 'flex-start', paddingLeft: 25 }, AppStyles.deleteButton]}>
        <Icon name="delete" onPress={() => { this.removeRegimen(id); }} type="material-community" color="#FFFFFF" />
      </View>
    );

    /* eslint-disable max-len */
    render = () =>
        (
          <View style={[AppStyles.container]}>
            <ScrollView>
              {
                this.state.regimens.map(regimen => (
                  <Swipeable key={regimen.id} leftButtons={[this.leftButton(regimen)]} rightButtons={[this.rightButton(regimen.id)]} >
                    <ListItem hideChevron title={regimen.name} titleContainerStyle={[styles.listItemStyle]} />
                  </Swipeable>
                ))
              }
            </ScrollView>
            <Modal style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose={false} onClosed={() => { this.setState({ regimen: { name: '', trainingGroupIds: [] } }); Actions.refresh({ isModalVisible: false }); }}>
              <View onLayout={(ev) => { this.resizeModal(ev); }}>
                <ScrollView>
                  <Card title={`${this.state.regimen.id ? 'Edit' : 'Add'} Regimen`}>

                    <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                    <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.regimen.name} onChangeText={name => this.setState({ regimen: { name, trainingGroupIds: this.state.regimen.trainingGroupIds } })} />
                    <Spacer />
                    <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Training Groups</FormLabel>
                    {
                        this.state.trainingGroups.map(group => (
                          <CheckBox key={group.id} title={group.title} onPress={() => { this.toggleTrainingGroup(group.id); }} checked={this.state.regimen.trainingGroupIds ? this.state.regimen.trainingGroupIds.some(id => id === group.id) : false} />
                        ))
                    }
                    <Spacer />

                    <Button
                      title={'Save'}
                      onPress={() => { if (this.state.regimen.id) { this.editRegimen(); } else { this.addRegimen(); } }}
                    />
                  </Card>
                </ScrollView>
              </View>
            </Modal>
          </View>
        );
}

/* Export Component ==================================================================== */
export default RegimensView;
