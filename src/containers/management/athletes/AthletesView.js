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
        borderWidth: 0,
        padding:     0,
    },
    cardView: {
        alignItems:  'flex-start',
        paddingLeft: 5,
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
        notReady: AppColors.brand.grey,
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
            <Spacer />
            <View style={{ flexDirection: 'row', justifyContent: 'center', width: AppSizes.screen.width, height: 40 }}>
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-plus" type="material-community" color={AppColors.brand.primary} underlayColor="transparent" onPress={() => this.refs.addAthlete.open()} /> : null}
              </View>
              <Button
                style={[AppStyles.flex2]}
                raised
                onPress={() => { if (section.trainingActive) { this.toggleGroupSession(section); } else { this.setState({ sectionIndex }); this.refs.startRegimen.open(); } }}
                title={`${section.trainingActive ? 'Stop' : 'Start'} Group Session`}
                backgroundColor={section.trainingActive ? styles.stop.color : styles.start.color}
              />
              <View style={[AppStyles.flex1, AppStyles.containerCentered]}>
                {section.title !== 'Team' ? <Icon name="account-remove" type="material-community" color={AppColors.brand.primary} underlayColor="transparent" onPress={() => { this.setState({ sectionIndex }); this.refs.removeAthlete.open(); }} /> : null}
              </View>
            </View>
            <View style={[styles.cardView]} >
              <Spacer />
              <Text style={{ color: AppColors.brand.grey, fontSize: 14 }}>READY</Text>
              {
                section.athletes.reduce((array, athlete, athleteIndex) => {
                    if (athlete.training) {
                        array.push(
                          <View key={athlete.id}>
                            <TouchableOpacity onPress={() => { if (athlete.training || athlete.kitStatus === 'Active') { this.toggleCollapsed(sectionIndex, athleteIndex); } }} >
                              <Card containerStyle={[styles.cardStyle, { backgroundColor: AppColors.lightGrey }]} >
                                <View style={{ borderRadius: 2, flexDirection: 'row', height: AppSizes.screen.heightTenth/1.5 }}>
                                  <View style={{ borderRadius: 2, backgroundColor: this.getIndicatorColor(athlete), flex: 1 }} />
                                  <View style={{ flex: 1 }} />
                                  <View style={{ flex: 14, justifyContent: 'center' }}>
                                    <Text>{ athlete.name }</Text>
                                  </View>
                                  <View style={{ flex: 4, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10 }} >OFFLINE</Text>
                                  </View>
                                </View>
                                <Collapsible collapsed={athlete.collapsed}>
                                  <Spacer />
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 2, marginLeft: 10 }}>
                                      <View style={{ backgroundColor: this.getIndicatorColor(athlete) }}>
                                        <Text style={{ color: 'white', marginLeft: 5 }}>
                                          READY TO START SESSION
                                        </Text>
                                      </View>
                                      <Spacer size={15} />
                                      <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 75, backgroundColor: '#D0D0D0' }}><Text style={{ marginLeft: 5, color: 'white', fontSize: 10 }}>BATTERY</Text></View>
                                        <View style={{ flex: 25 }} />
                                      </View>
                                      <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 50, backgroundColor: '#B0B0B0' }}><Text style={{ marginLeft: 5, color: 'white', fontSize: 10 }}>MEMORY</Text></View>
                                        <View style={{ flex: 50 }} />
                                      </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                      {
                                        section.title === 'Team' ?
                                        (
                                          <Button
                                            style={[AppStyles.containerCentered]}
                                            raised
                                            onPress={() => { if (section.trainingActive) { this.toggleAthleteSession(); } this.refs.modal.open(); }}
                                            textStyle={{ textAlign: 'center' }}
                                            title={`${section.trainingActive ? 'Stop' : 'Start'}\nSession`}
                                            backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary}
                                          />
                                        ) : null
                                      }
                                    </View>
                                  </View>
                                  <Spacer />
                                </Collapsible>
                              </Card>
                            </TouchableOpacity>
                          </View>,
                        );
                    }

                    return array;
                }, [])
              }
              <Spacer />
              <Text style={{ color: AppColors.brand.grey, fontSize: 14 }}>NOT READY</Text>
              {
                section.athletes.reduce((array, athlete, athleteIndex) => {
                    if (!athlete.training) {
                        array.push(
                          <View key={athlete.id}>
                            <TouchableOpacity onPress={() => { if (athlete.training || athlete.kitStatus === 'Active') { this.toggleCollapsed(sectionIndex, athleteIndex); } }} >
                              <Card containerStyle={[styles.cardStyle, { backgroundColor: AppColors.lightGrey }]} >
                                <View style={{ borderRadius: 2, flexDirection: 'row', height: AppSizes.screen.heightTenth/1.5 }}>
                                  <View style={{ borderRadius: 2, backgroundColor: this.getIndicatorColor(athlete), flex: 1 }} />
                                  <View style={{ flex: 1 }} />
                                  <View style={{ flex: 14, justifyContent: 'center' }}>
                                    <Text>{ athlete.name }</Text>
                                  </View>
                                  <View style={{ flex: 4, justifyContent: 'center' }}>
                                    <Text style={{ fontSize: 10 }} >OFFLINE</Text>
                                  </View>
                                </View>
                                <Collapsible collapsed={athlete.collapsed}>
                                  <Spacer />
                                  <View style={{ flexDirection: 'row' }}>
                                    <View style={{ flex: 2, marginLeft: 10 }}>
                                      <View style={{ backgroundColor: this.getIndicatorColor(athlete) }}>
                                        <Text style={{ color: 'white', marginLeft: 5 }}>
                                          READY TO START SESSION
                                        </Text>
                                      </View>
                                      <Spacer size={15} />
                                      <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 75, backgroundColor: '#D0D0D0' }}><Text style={{ marginLeft: 5, color: 'white', fontSize: 10 }}>BATTERY</Text></View>
                                        <View style={{ flex: 25 }} />
                                      </View>
                                      <View style={{ flexDirection: 'row' }}>
                                        <View style={{ flex: 50, backgroundColor: '#B0B0B0' }}><Text style={{ marginLeft: 5, color: 'white', fontSize: 10 }}>MEMORY</Text></View>
                                        <View style={{ flex: 50 }} />
                                      </View>
                                    </View>
                                    <View style={{ flex: 1 }}>
                                      {
                                        section.title === 'Team' ?
                                        (
                                          <Button
                                            style={[AppStyles.containerCentered]}
                                            raised
                                            onPress={() => { if (section.trainingActive) { this.toggleAthleteSession(); } this.refs.modal.open(); }}
                                            textStyle={{ textAlign: 'center' }}
                                            title={`${section.trainingActive ? 'Stop' : 'Start'}\nSession`}
                                            backgroundColor={section.trainingActive ? AppColors.brand.red : AppColors.brand.primary}
                                          />
                                        ) : null
                                      }
                                    </View>
                                  </View>
                                  <Spacer />
                                </Collapsible>
                              </Card>
                            </TouchableOpacity>
                          </View>,
                        );
                    }

                    return array;
                }, [])
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
