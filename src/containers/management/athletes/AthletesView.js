/**
 * Team Management Screen
 */
/* eslint-disable max-len */
import React, { Component, PropTypes } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import ProgressBarClassic from 'react-native-progress-bar-classic';
import ModalPicker from 'react-native-modal-picker';

// Consts and Libs
import { AppStyles, AppSizes, AppColors } from '@theme/';

// Components
import { Text, ListItem, Card, Spacer, Button } from '@ui/';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    whiteText: {
        color: '#FFFFFF',
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
    cardStyle: {
        borderWidth:   0,
        paddingTop:    0,
        paddingBottom: 0,
    },
    cardView: {
        alignItems: 'center',
    },
});

/* Component ==================================================================== */
class AthletesView extends Component {
    static componentName = 'AthletesView';

    /* eslint-disable react/forbid-prop-types */
    static propTypes = {
        regimens:       PropTypes.array,
        trainingGroups: PropTypes.array,
        isModalVisible: PropTypes.bool,
        addAthlete:     PropTypes.func.isRequired,
        removeAthlete:  PropTypes.func.isRequired,
    };

    static defaultProps = {
        regimens:       [],
        trainingGroups: [],
        isModalVisible: false,
    };

    constructor(props) {
        super(props);

        this.state = {
            trainingGroups: this.props.trainingGroups,
            isModalVisible: this.props.isModalVisible,
            sectionIndex:   0,
        };
    }

    getTextColor = (athlete) => {
        if (athlete.training) {
            if (athlete.kitStatus === 'Inactive') {
                return this.status.notReady;
            }
            return '#FFFFFF';
        }
        if (athlete.kitStatus === 'Inactive') {
            return this.status.notReady;
        }
        return AppColors.brand.primary;
    }

    getIndicatorColor = (athlete) => {
        if (athlete.training) {
            if (athlete.kitStatus === 'Active') {
                return this.status.allGood;
            } else if (athlete.kitStatus === 'Error') {
                return this.status.error;
            }
            return this.status.notReady;
        }
        if (athlete.kitStatus === 'Active') {
            return this.status.ready;
        }
        return null;
    }

    getContainerColor = (athlete) => {
        if (athlete.training) {
            return AppColors.brand.primary;
        }
        return '#FFFFFF';
    }

    status = {
        notReady: AppColors.brand.secondary,
        error:    AppColors.red,
        ready:    AppColors.brand.primary,
        allGood:  '#00FF00',
    };

     // function call to start or stop a group training session
    /* eslint-disable react/no-string-refs */
    toggleGroupSession = (group) => {
        group.trainingActive = !group.trainingActive;
        const index = this.state.trainingGroups.findIndex(trainingGroup => trainingGroup.id === group.id);
        if (index > -1) {
            this.state.trainingGroups[index] = group;
            this.setState({ trainingGroups: this.state.trainingGroups });
        }
    }

    // function call to start or stop a player's training session
    /* eslint-disable react/no-string-refs */
    toggleAthleteSession = (athlete) => {
    }

    // function call to add a new player to a training group
    addAthlete = () => {
    }

    toggleCollapsed = (section, index) => {
        this.state.trainingGroups[section].athletes[index].collapsed = !this.state.trainingGroups[section].athletes[index].collapsed;
        this.setState({ trainingGroups: this.state.trainingGroups });
    }

    /* eslint-disable react/no-string-refs */
    renderModal = (
      <ModalPicker
        ref="modal"
        initValue="Pick a regimen to start"
        data={this.props.regimens.map(regimen => ({
            key:   regimen.id,
            label: regimen.name,
        }))}
      />
    )

    /* eslint-disable max-len */
    renderHeader = (section, index, isActive) => {
        const title = section.title;
        const numberOfAthletes = section.athletes.length;
        return (
          <View>
            <ListItem title={title} containerStyle={{ backgroundColor: AppColors.lightGrey }} badge={{ value: numberOfAthletes, badgeTextStyle: styles.badgeTextStyle }} />
          </View>
        );
    }

    renderContent = (section, sectionIndex, isActive) =>
        (
          <View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: AppSizes.screen.width, height: 40 }}>
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-plus" type="material-community" underlayColor="transparent" onPress={() => this.refs.addAthlete.open()} /> : null}
              </View>
              <Button
                style={[AppStyles.flex2]}
                raised
                onPress={() => { if (section.trainingActive) { this.toggleGroupSession(section); } else { this.setState({ sectionIndex }); this.refs.startRegimen.open(); } }}
                icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }}
                title={`${section.trainingActive ? 'Stop' : 'Start'} Group Session`}
                backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary}
              />
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-remove" type="material-community" underlayColor="transparent" onPress={() => { this.setState({ sectionIndex }); this.refs.removeAthlete.open(); }} /> : null}
              </View>
            </View>
            <View style={[styles.cardView]} >
              {
                section.athletes.map((athlete, athleteIndex) =>
                  (
                    <View key={athlete.id}>
                      <TouchableOpacity onPress={() => { if (athlete.training || athlete.kitStatus === 'Active') { this.toggleCollapsed(sectionIndex, athleteIndex); } }} >
                        <Card containerStyle={[styles.cardStyle, { backgroundColor: this.getContainerColor(athlete) }]} >
                          <ListItem
                            title={athlete.name}
                            titleStyle={{ color: this.getTextColor(athlete) }}
                            leftIcon={<View style={{ backgroundColor: '#FF0000', width: 8 }} />}
                            containerStyle={{ borderBottomWidth: 0, backgroundColor: this.getContainerColor(athlete) }}
                          />
                          <Collapsible collapsed={athlete.collapsed}>
                            {
                                section.title === 'Team' ?
                                (
                                  <Button
                                    style={[AppStyles.containerCentered]}
                                    raised
                                    onPress={() => { if (section.trainingActive) { this.toggleAthleteSession(); } this.refs.modal.open(); }}
                                    icon={{ name: section.trainingActive ? 'stop-circle' : 'play-circle', type: 'material-community' }}
                                    title={`${section.trainingActive ? 'Stop' : 'Start'} Athlete Session`}
                                    backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary}
                                  />
                                ) : null
                            }
                            <Spacer size={5} />
                            <Text style={{ color: this.getTextColor(athlete) }}>Kit Memory:</Text>
                            <Spacer size={2} />
                            <ProgressBarClassic progress={50} />
                            <Spacer size={5} />
                            <Text style={{ color: this.getTextColor(athlete) }}>Kit Battery:</Text>
                            <Spacer size={2} />
                            <ProgressBarClassic progress={75} />
                          </Collapsible>
                        </Card>
                      </TouchableOpacity>
                    </View>
                  ),
                )
              }
              <Spacer size={15} />
            </View>
          </View>
        );

    render = () =>
        (
          <View style={[AppStyles.container, { backgroundColor: 'white' }]}>
            <ScrollView>
              <Accordion
                sections={this.props.trainingGroups}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
              />
              <ModalPicker
                ref={'startRegimen'}
                initValue=""
                selectStyle={{ borderWidth: 0 }}
                selectTextStyle={{ fontSize: 0 }}
                data={[{ label: 'Select regimen to start',  key: 0, section: true }].concat(this.props.regimens.filter(regimen => regimen.trainingGroupIds.some(trainingGroupId => trainingGroupId === this.state.trainingGroups[this.state.sectionIndex].id))
                  .map(regimen => ({
                      key:   regimen.id,
                      label: regimen.name,
                  })))}
              />
              <ModalPicker
                ref={'addAthlete'}
                initValue=""
                selectStyle={{ borderWidth: 0 }}
                selectTextStyle={{ fontSize: 0 }}
                onChange={(athlete) => { this.props.addAthlete(athlete); }}
                data={[{ label: 'Select player to add to group', key: 0, section: true }].concat(this.state.trainingGroups[0].athletes.map(athlete => ({
                    key:   athlete.id,
                    label: athlete.name,
                })))}
              />
              <ModalPicker
                ref={'removeAthlete'}
                initValue=""
                selectStyle={{ borderWidth: 0 }}
                selectTextStyle={{ fontSize: 0 }}
                onChange={(athlete) => { this.props.removeAthlete(athlete); }}
                data={[{ label: 'Select player to remove from group', key: 0, section: true }].concat(this.state.trainingGroups[this.state.sectionIndex].athletes.map(athlete => ({
                    key:   athlete.id,
                    label: athlete.name,
                })))}
              />
            </ScrollView>
          </View>
        );
}

/* Export Component ==================================================================== */
export default AthletesView;
