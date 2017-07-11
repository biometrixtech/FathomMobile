/**
 * Group Management Screen
 */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Swipeable from 'react-native-swipeable';
import Modal from 'react-native-modalbox';

// Consts and Libs
import { AppStyles, AppColors } from '@theme/';
import { Actions } from 'react-native-router-flux';

// Components
import { Card, Button, ListItem, FormInput, FormLabel, Spacer } from '@ui/';

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
class GroupsView extends Component {
    static componentName = 'GroupsView';

    static propTypes = {
        trainingGroups: PropTypes.array,
        isModalVisible: PropTypes.bool,
        addGroup:       PropTypes.func.isRequired,
        editGroup:      PropTypes.func.isRequired,
        removeGroup:    PropTypes.func.isRequired,
    };

    static defaultProps = {
        trainingGroups: [],
        isModalVisible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            modalStyle:     {},
            trainingGroup:  { title: '', description: '' },
            trainingGroups: this.props.trainingGroups,
        };
    }

    /* eslint-disable max-len */
    resizeModal(ev) {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    /* eslint-disable react/no-string-refs */
    addGroup = () => {
        this.state.trainingGroup.id             = this.state.trainingGroups.length + 1;
        this.state.trainingGroup.trainingActive = false;
        this.state.trainingGroup.athletes       = [];
        this.props.addGroup(this.state.trainingGroup);
        this.setState({ trainingGroups: this.state.trainingGroups.concat([this.state.trainingGroup]), trainingGroup: { title: '', description: '' } });
        Actions.refresh({ isModalVisible: false });
    }

    editGroup = () => {
        const index = this.state.trainingGroups.findIndex(trainingGroup => trainingGroup.id === this.state.trainingGroup.id);
        if (index > -1) {
            this.state.trainingGroups[index] = this.state.trainingGroup;
            this.props.editGroup(this.state.trainingGroup);
            this.setState({ trainingGroups: this.state.trainingGroups, trainingGroup: { title: '', description: '' } });
        }
        Actions.refresh({ isModalVisible: false });
    }

    removeGroup = (id) => {
        this.props.removeGroup(id);
        this.setState({ trainingGroups: this.state.trainingGroups.filter(group => group.id !== id) });
    }

    leftButton = data => (
      <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.editButton]}>
        <Icon name="pencil" onPress={() => { this.setState({ trainingGroup: data }); Actions.refresh({ isModalVisible: true }); }} type="material-community" color="#FFFFFF" />
      </View>
    );

    rightButton = id => (
      <View style={[{ alignItems: 'flex-start', paddingLeft: 25 }, AppStyles.deleteButton]}>
        <Icon name="delete" onPress={() => { this.removeGroup(id); }} type="material-community" color="#FFFFFF" />
      </View>
    );

    /* eslint-disable max-len */
    render = () =>
        (
          <View style={[AppStyles.container]}>
            <ScrollView>
              {
                this.state.trainingGroups.map(group => (
                  <Swipeable key={group.id} leftButtons={[this.leftButton(group)]} rightButtons={[this.rightButton(group.id)]} >
                    <ListItem hideChevron title={group.title} titleContainerStyle={[styles.listItemStyle]} />
                  </Swipeable>
                ))
              }
            </ScrollView>
            <Modal position={'center'} style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose={false} onClosed={() => { this.setState({ trainingGroup: { title: '', description: '' } }); Actions.refresh({ isModalVisible: false }); }}>
              <View onLayout={(ev) => { this.resizeModal(ev); }}>
                <Card title={`${this.state.trainingGroup.id ? 'Edit' : 'Add'} Training Group`}>

                  <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                  <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.title} onChangeText={title => this.setState({ trainingGroup: (this.state.trainingGroup.title = title) })} />

                  <Spacer />

                  <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Description</FormLabel>
                  <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.trainingGroup.description} onChangeText={description => this.setState({ trainingGroup: (this.state.trainingGroup.description = description) })} />

                  <Spacer />

                  <Button
                    title={'Save'}
                    onPress={() => { if (this.state.trainingGroup.id) { this.editGroup(); } else { this.addGroup(); } }}
                  />
                </Card>
              </View>
            </Modal>
          </View>
        );
}

/* Export Component ==================================================================== */
export default GroupsView;
