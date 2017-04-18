/**
 * Regimens Management Screen
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
import { AppStyles, AppSizes, AppColors } from '@theme/';
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

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        regimens:       PropTypes.array,
        isModalVisible: PropTypes.bool,
        addRegimen:     PropTypes.func.isRequired,
        removeRegimen:  PropTypes.func.isRequired,
    };

    static defaultProps = {
        regimens:       [],
        isModalVisible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            modalStyle: {},
            regimens:   this.props.regimens,
            name:       '',
        };
    }

    /* eslint-disable max-len */
    resizeModal(ev) {
        this.setState({ modalStyle: { height: ev.nativeEvent.layout.height, width: ev.nativeEvent.layout.width } });
    }

    /* eslint-disable react/no-string-refs */
    addRegimen = (data) => {
        data.id = this.state.regimens.length + 1;
        this.props.addRegimen(data);
        this.setState({ regimens: this.state.regimens.concat([data]) });
        Actions.refresh({ isModalVisible: false });
    }

    removeRegimen = (id) => {
        this.props.removeRegimen(id);
        this.setState({ regimens: this.state.regimens.filter(regimen => regimen.id !== id) });
    };

    leftDeleteButton = id => (
      <View style={[{ alignItems: 'flex-end', paddingRight: 25 }, AppStyles.deleteButton]}>
        <Icon name="delete" onPress={() => { this.removeRegimen(id); }} type="material-community" color="#FFFFFF" />
      </View>
    );

    rightDeleteButton = id => (
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
                  <Swipeable key={regimen.id} leftButtons={[this.leftDeleteButton(regimen.id)]} rightButtons={[this.rightDeleteButton(regimen.id)]} >
                    <ListItem hideChevron title={regimen.name} titleContainerStyle={[styles.listItemStyle]} />
                  </Swipeable>
                ))
              }
            </ScrollView>
            <Modal style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose={false}>
              <View onLayout={(ev) => { this.resizeModal(ev); }}>
                <Card title="Add Regimen">

                  <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000', marginBottom: 0 }]} >Name</FormLabel>
                  <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.name} onChangeText={name => this.setState({ name })} />

                  <Spacer size={10} />

                  <Button
                    title={'Save'}
                    onPress={() => { this.addRegimen({ name: this.state.name }); }}
                  />
                </Card>
              </View>
            </Modal>
            {/* <Modal position={'center'} style={[AppStyles.containerCentered, this.state.modalStyle, { backgroundColor: AppColors.transparent }]} isOpen={this.props.isModalVisible} backButtonClose swipeToClose>
              <View onLayout={(ev) => { this.resizeModal(ev); }}>
                <Card title="Add Regimen">
                  <Alerts
                    status={this.state.resultMsg.status}
                    success={this.state.resultMsg.success}
                    error={this.state.resultMsg.error}
                  />
                  <Form
                    ref={(b) => { this.form = b; }}
                    type={this.state.form_fields}
                    value={this.state.form_values}
                    options={this.state.options}
                  />
                  <FormLabel labelStyle={[AppStyles.h4, { fontWeight: 'bold', color: '#000000' }]} >Name</FormLabel>
                  <FormInput containerStyle={{ borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderBottomWidth: 1, borderColor: AppColors.border }} inputContainer={{ backgroundColor: '#ffffff', paddingLeft: 15, paddingRight: 15, borderBottomColor: 'transparent' }} value={this.state.name} onChangeText={name => this.setState({ name })} />

                  <Spacer size={10} />

                  <Button
                    title={'Save'}
                    onPress={() => { this.addRegimen({ name: this.state.name }); }}
                  />
                </Card>
              </View>
            </Modal> */}
          </View>
        );
}

/* Export Component ==================================================================== */
export default RegimensView;
