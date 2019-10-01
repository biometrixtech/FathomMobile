import React from 'react';
import { Animated, Platform, } from 'react-native';

// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, AppFonts, AppSizes, AppStyles, MyPlan as MyPlanConstants, } from '../constants';
import { Text, } from '../components/custom';
import { SensorLogic, } from './';

const PlanLogic = {

    /**
      * Takes care of the different possible PNs that can come in
      * - MyPlan
      */
    handlePushNotification: (props, state) => {
        // setup varibles
        let dailyPlan = props.plan.dailyPlan[0];
        const validNotifs = ['COMPLETE_ACTIVE_PREP', 'COMPLETE_ACTIVE_RECOVERY', 'COMPLETE_DAILY_READINESS', 'VIEW_PLAN',];
        let pushNotificationUpdate = {
            newStateFields:             '',
            page:                       0,
            stateName:                  '',
            updateExerciseList:         false,
            updatePushNotificationFlag: false,
        }
        // logic
        if(props.notification === 'COMPLETE_ACTIVE_PREP' && !dailyPlan.pre_active_rest_completed) {
            // go to screen 0 & open active prep
            pushNotificationUpdate.newStateFields = _.update( state.prepare, 'isActiveRecoveryCollapsed', () => false);
            pushNotificationUpdate.stateName = 'prepare';
            pushNotificationUpdate.updatePushNotificationFlag = true;
        } else if(props.notification === 'COMPLETE_ACTIVE_RECOVERY' && !dailyPlan.post_active_rest.completed) {
            // go to screen 2 & open active recovery
            pushNotificationUpdate.page = 2;
            pushNotificationUpdate.newStateFields = _.update( state.recover, 'isActiveRecoveryCollapsed', () => false);
            pushNotificationUpdate.stateName = 'recover';
            pushNotificationUpdate.updatePushNotificationFlag = true;
        } else if(props.notification === 'COMPLETE_DAILY_READINESS' && !dailyPlan.daily_readiness_survey_completed) {
            // go to screen 0 & open daily_readiness
            pushNotificationUpdate.newStateFields = true;
            pushNotificationUpdate.stateName = 'isReadinessSurveyModalOpen';
            pushNotificationUpdate.updatePushNotificationFlag = true;
        } else if(props.notification === 'VIEW_PLAN' || !validNotifs.includes(props.notification)) {
            // added catch in case of view plan or other message, do what we did in the past
            pushNotificationUpdate.page = null;
            pushNotificationUpdate.updateExerciseList = true;
            pushNotificationUpdate.updatePushNotificationFlag = true;
        }
        // return
        return pushNotificationUpdate;
    },

    /**
      * Updates to the state when the daily readiness & post session forms are changed
      * - MyPlan
      */
    handleDailyReadinessAndPostSessionFormChange: (name, value, isPain, bodyPart, side, state, isClearCandidate = false, isMovementValue) => {
        // setup varibles
        let newFormFields = _.cloneDeep(state);
        // logic
        if(name === 'already_trained_number') {
            let newValue = [];
            for (let i = 0; i < value; i += 1) {
                newValue.push(PlanLogic.returnEmptySession());
            }
            newFormFields = _.update(state, 'sessions', () => newValue);
            newFormFields = _.update(state, name, () => value);
        } else if(name === 'soreness' && bodyPart) {
            let newSorenessFields = _.cloneDeep(state.soreness);
            if(_.findIndex(state.soreness, (o) => o.body_part === bodyPart && o.side === side) > -1) {
                // body part already exists
                let sorenessIndex = [_.findIndex(state.soreness, (o) => o.body_part === bodyPart && o.side === side)];
                newSorenessFields[sorenessIndex].pain = isPain;
                if(isMovementValue) {
                    newSorenessFields[sorenessIndex].movement = value;
                } else {
                    newSorenessFields[sorenessIndex].severity = value;
                }
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.pain = isPain;
                if(isMovementValue) {
                    newSorenessPart.movement = value;
                } else {
                    newSorenessPart.severity = value;
                }
                newSorenessPart.side = side ? side : 0;
                newSorenessPart.isClearCandidate = isClearCandidate;
                newSorenessFields.push(newSorenessPart);
            }
            newFormFields = _.update( state, 'soreness', () => newSorenessFields);
        } else {
            newFormFields = _.update( state, name, () => value);
        }
        // return
        return newFormFields;
    },

    /**
      * Helper function to return an empty session
      * - PlanLogic
      */
    returnEmptySession: () => {
        let postSessionSurvey = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            RPE:        -1,
            soreness:   [],
        };
        return {
            description:                    '',
            deleted:                        false,
            duration:                       0,
            event_date:                     null,
            ignored:                        false,
            post_session_survey:            postSessionSurvey,
            session_type:                   null,
            sport_name:                     null, // this exists for session_type = 0,2,3,6
            strength_and_conditioning_type: null, // this only exists for session_type=1
        };
    },

    /**
      * Updates to the state when the area of soreness is clicked on daily readiness & post session forms
      * - MyPlan
      */
    handleAreaOfSorenessClick: (stateObject, areaClicked, isAllGood, soreBodyPartsPlan, resetSections) => {
        // setup varibles
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        // logic
        if(resetSections) {
            // do nothing...
        } else if(!areaClicked && isAllGood) {
            let combinedSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyPartsPlan);
            let soreBodyParts = _.filter(stateObject.soreness, stateObjectSoreBodyPart => {
                let isPrev = _.filter(combinedSoreBodyParts, o => o.body_part === stateObjectSoreBodyPart.body_part && o.side === stateObjectSoreBodyPart.side).length > 0;
                return isPrev;
            });
            newSorenessFields = soreBodyParts;
        } else {
            if(_.findIndex(stateObject.soreness, o => o.body_part === areaClicked.index) > -1) {
                // body part already exists
                if(areaClicked.bilateral) {
                    // add other side
                    let currentSelectedSide = _.filter(newSorenessFields, o => o.body_part === areaClicked.index);
                    if(currentSelectedSide.length === 1) {
                        currentSelectedSide = currentSelectedSide[0].side;
                        let newMissingSideSorenessPart = {};
                        newMissingSideSorenessPart.body_part = areaClicked.index;
                        newMissingSideSorenessPart.pain = false;
                        newMissingSideSorenessPart.severity = null;
                        newMissingSideSorenessPart.side = currentSelectedSide === 1 ? 2 : 1;
                        newSorenessFields.push(newMissingSideSorenessPart);
                    } else {
                        newSorenessFields = _.filter(newSorenessFields, o => o.body_part !== areaClicked.index);
                    }
                } else {
                    newSorenessFields = _.filter(newSorenessFields, o => o.body_part !== areaClicked.index);
                }
            } else {
                // doesn't exist, create new object
                if(areaClicked.bilateral) {
                    let newLeftSorenessPart = {};
                    newLeftSorenessPart.body_part = areaClicked.index;
                    newLeftSorenessPart.pain = areaClicked.group === 'joint';
                    newLeftSorenessPart.severity = null;
                    newLeftSorenessPart.side = 1;
                    newSorenessFields.push(newLeftSorenessPart);
                    let newRightSorenessPart = {};
                    newRightSorenessPart.body_part = areaClicked.index;
                    newRightSorenessPart.pain = areaClicked.group === 'joint';
                    newRightSorenessPart.severity = null;
                    newRightSorenessPart.side = 2;
                    newSorenessFields.push(newRightSorenessPart);
                } else {
                    let newSorenessPart = {};
                    newSorenessPart.body_part = areaClicked.index;
                    newSorenessPart.pain = areaClicked.group === 'joint';
                    newSorenessPart.severity = null;
                    newSorenessPart.side = 0;
                    newSorenessFields.push(newSorenessPart);
                }
            }
        }
        // return
        return newSorenessFields;
    },

    /**
      * Cleaning of Functional Strength clickable options
      * - ReadinessSurvey
      */
    handleFunctionalStrengthOptions: session => {
        let isSport = session.sport_name > 0 || session.sport_name === 0 ? true : false;
        let isStrengthConditioning = session.strength_and_conditioning_type > 0 || session.strength_and_conditioning_type === 0;
        let sessionName = isSport ?
            _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name)
            : isStrengthConditioning ?
                _.find(MyPlanConstants.strengthConditioningTypes, o => o.index === session.strength_and_conditioning_type)
                :
                '';
        sessionName = sessionName.label && isSport ?
            sessionName.label
            : sessionName.label && isStrengthConditioning ?
                `${sessionName.label.replace(' Training', '')} TRAINING`
                :
                '';
        return {
            isSport,
            isStrengthConditioning,
            sessionName,
        };
    },

    /**
      * Cleaning of Date and Time Duration from State
      * - SportScheduleBuilder
      */
    handleGetDateTimeDurationFromState: (durationValueGroups, isFormValid, timeValueGroups) => {
        if(!isFormValid) {
            return {
                duration:   '',
                event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            }
        }
        let now = moment();
        now = now.set('second', 0);
        now = now.set('millisecond', 0);
        let hoursIn24 = timeValueGroups.amPM === 0 ? (timeValueGroups.hours + 1) : ((timeValueGroups.hours + 1) + 12);
        hoursIn24 = hoursIn24 === 12 ? 0 : hoursIn24;
        hoursIn24 = hoursIn24 === 24 ? 12 : hoursIn24;
        now = now.set('hour', hoursIn24);
        now = now.set('minute', Number(MyPlanConstants.timeOptionGroups.minutes[timeValueGroups.minutes]));
        let hoursToMinutes = (Number(MyPlanConstants.durationOptionGroups.hours[durationValueGroups.hours]) * 60);
        let duration = (Number(MyPlanConstants.durationOptionGroups.minutes[durationValueGroups.minutes]) + hoursToMinutes);
        return {
            duration,
            event_date: now,
        };
    },

    /**
      * Data for Areas of Soreness Body Part
      * - AreasOfSoreness
      */
    handleAreasOfSorenessBodyPart: (areaOfSorenessClicked, body, soreBodyParts) => {
        let isSelected = false;
        _.map(areaOfSorenessClicked, area => {
            if(area.body_part === body.index) {
                isSelected = true;
            }
        });
        let bodyImage = body.image[0] || body.image[2];
        let combinedSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
        let bodyIndexInState = _.findIndex(combinedSoreBodyParts, a => a.body_part === body.index);
        if(body.bilateral && bodyIndexInState > -1) {
            let newBodyImageIndex = combinedSoreBodyParts[bodyIndexInState].side === 1 ? 2 : 1;
            bodyImage = body.image[newBodyImageIndex];
        }
        let mainBodyPartName = (
            body.label.slice(-1) === 's' && body.bilateral
        ) ?
            body.label === 'Achilles' ?
                body.label.toUpperCase()
                : body.label === 'Calves' ?
                    'CALF'
                    :
                    body.label.slice(0, -1).toUpperCase()
            :
            body.label.toUpperCase();
        return {
            bodyImage,
            isSelected,
            mainBodyPartName,
        };
    },

    /**
      * Areas of Soreness Render Logic
      * - AreasOfSoreness
      */
    handleAreaOfSorenessRenderLogic: (soreBodyParts, soreBodyPartsState) => {
        let combinedSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
        let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, (u, i) => _.findIndex(soreBodyParts, o => o.body_part === i) === -1);
        let newBodyPartMap = _.filter(filteredBodyPartMap, o => {
            let itemStateFiltered = _.filter(combinedSoreBodyParts, {body_part: o.index});
            return o.order &&
                _.findIndex(combinedSoreBodyParts, u => u.body_part === o.index && u.side === 0) === -1 &&
                (itemStateFiltered.length === 1 || itemStateFiltered.length === 0);
        });
        let areaOfSorenessClicked = _.filter(soreBodyPartsState, bodyPartState => _.findIndex(combinedSoreBodyParts, bodyPartProp => bodyPartProp.body_part === bodyPartState.body_part && bodyPartProp.side === bodyPartState.side) === -1);
        let groupedNewBodyPartMap = _.groupBy(newBodyPartMap, 'location');
        return {
            areaOfSorenessClicked,
            groupedNewBodyPartMap,
        };
    },

    /**
      * Post Session Survey Render Logic
      * - PostSessionSurvey
      */
    handlePostSessionSurveyRenderLogic: (postSession, soreBodyParts, areasOfSorenessRef) => {
        let combinedSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
        let filteredAreasOfSoreness = _.filter(postSession.soreness, o => {
            let doesItInclude = _.filter(combinedSoreBodyParts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length === 0;
        });
        let filteredSoreBodyParts = _.filter(postSession.soreness, o => {
            let doesItInclude = _.filter(combinedSoreBodyParts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length > 0;
        });
        let areQuestionsValid = postSession.RPE >= 0 && postSession.event_date ? true : false;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => (o.severity === 0 && o.movement === null) || (o.severity > 0 && o.movement > 0)).length === combinedSoreBodyParts.length : true;
        let areAreasOfSorenessValid = _.filter(filteredAreasOfSoreness, o => (o.severity === 0 && o.movement === null) || (o.severity > 0 && o.movement > 0)).length > 0;
        let isFormValid = areQuestionsValid && (areSoreBodyPartsValid || postSession.soreness.length === 0) && areAreasOfSorenessValid;
        let isFormValidItems = {
            areAreasOfSorenessValid,
            areQuestionsValid,
            isPrevSorenessValid:        (areSoreBodyPartsValid || postSession.soreness.length === 0),
            selectAreasOfSorenessValid: areasOfSorenessRef && areasOfSorenessRef.state ? filteredAreasOfSoreness.length > 0 || areasOfSorenessRef.state.isAllGood : false,
            willTrainLaterValid:        postSession.sessions_planned !== null,
        };
        let newSoreBodyParts = combinedSoreBodyParts;
        return {
            isFormValid,
            isFormValidItems,
            newSoreBodyParts,
        };
    },

    /**
      * Readiness Survey Render Logic
      * - ReadinessSurvey
      */
    handleReadinessSurveyRenderLogic: (dailyReadiness, soreBodyParts, areasOfSorenessRef, hourOfDay = moment().get('hour')) => {
        let split_afternoon = 12; // 24hr time to split the afternoon
        let split_evening = 17; // 24hr time to split the evening
        let cutoffForNewDay = 3;
        let partOfDay = hourOfDay >= split_afternoon && hourOfDay <= split_evening ? 'AFTERNOON' : hourOfDay >= split_evening || hourOfDay < cutoffForNewDay ? 'EVENING' : 'MORNING';
        let combinedSoreBodyParts = PlanLogic.handleNewSoreBodyPartLogic(soreBodyParts);
        let filteredAreasOfSoreness = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(combinedSoreBodyParts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length === 0;
        });
        let filteredSoreBodyParts = _.filter(dailyReadiness.soreness, o => {
            let doesItInclude = _.filter(combinedSoreBodyParts, a => a.body_part === o.body_part && a.side === o.side);
            return doesItInclude.length > 0;
        });
        let areQuestionsValid = dailyReadiness.readiness > 0 && dailyReadiness.sleep_quality > 0;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ?
            _.filter(filteredSoreBodyParts, o =>
                (o.severity === 0 && o.movement === null) || (o.severity > 0 && o.movement > 0)
            ).length === combinedSoreBodyParts.length
            :
            true;
        let areAreasOfSorenessValid = _.filter(filteredAreasOfSoreness, o =>
            (o.severity === 0 && o.movement === null) || (o.severity > 0 && o.movement > 0)
        ).length > 0;
        let foundSport = _.find(MyPlanConstants.teamSports, o => o.index === dailyReadiness.current_sport_name);
        let selectedSportPositions = dailyReadiness.current_sport_name !== null && foundSport ? foundSport.positions : [];
        const isFunctionalStrengthEligible = soreBodyParts.functional_strength_eligible;
        const isFirstFunctionalStrength = isFunctionalStrengthEligible &&
            (!soreBodyParts.current_sport_name && soreBodyParts.current_sport_name !== 0) &&
            (!soreBodyParts.current_position && soreBodyParts.current_position !== 0);
        const isSecondFunctionalStrength = isFunctionalStrengthEligible &&
            (
                soreBodyParts.current_position === 0 || soreBodyParts.current_position > 0 ||
                soreBodyParts.current_sport_name === 0 || soreBodyParts.current_sport_name > 0
            ) &&
            (soreBodyParts.completed_functional_strength_sessions === 0 || soreBodyParts.completed_functional_strength_sessions <= 2);
        let isFunctionalStrengthTargetValid = dailyReadiness.current_sport_name !== null ?
            dailyReadiness.current_sport_name !== null && (dailyReadiness.current_position !== null || !selectedSportPositions)
            : dailyReadiness.current_sport_name === null ?
                dailyReadiness.current_position !== null
                :
                false;
        let isFunctionalStrengthValid = isFunctionalStrengthEligible && isFirstFunctionalStrength ?
            dailyReadiness.wants_functional_strength !== null && isFunctionalStrengthTargetValid
            : isFunctionalStrengthEligible && isSecondFunctionalStrength ?
                dailyReadiness.wants_functional_strength !== null
                :
                true;
        let functionalStrengthTodaySubtext = isFunctionalStrengthEligible ?
            `(${soreBodyParts.completed_functional_strength_sessions}/2 completed in last 7 days${soreBodyParts.completed_functional_strength_sessions === 2 ? ', but you can go for 3!': ''})`
            :
            '';
        let isTrainedTodayValid = dailyReadiness.already_trained_number === 0 || dailyReadiness.already_trained_number === false || dailyReadiness.already_trained_number >= 1;
        let isFormValid = isFunctionalStrengthValid && areQuestionsValid && (areSoreBodyPartsValid || dailyReadiness.soreness.length === 0) && areAreasOfSorenessValid;
        let isFormValidItems = {
            areAreasOfSorenessValid,
            areQuestionsValid,
            isFunctionalStrengthValid,
            isPrevSorenessValid:             (areSoreBodyPartsValid || dailyReadiness.soreness.length === 0),
            isSecondFunctionalStrengthValid: dailyReadiness.wants_functional_strength !== null,
            isTrainedTodayValid,
            selectAreasOfSorenessValid:      areasOfSorenessRef && areasOfSorenessRef.state ? filteredAreasOfSoreness.length > 0 || areasOfSorenessRef.state.isAllGood : false,
            willTrainLaterValid:             dailyReadiness.sessions_planned !== null,
        };
        let newSoreBodyParts = combinedSoreBodyParts;
        return {
            functionalStrengthTodaySubtext,
            isFirstFunctionalStrength,
            isFormValid,
            isFormValidItems,
            isSecondFunctionalStrength,
            newSoreBodyParts,
            partOfDay,
            selectedSportPositions,
        };
    },

    /**
      * New Combination of Sore Body Parts Logic
      * - ReadinessSurvey & PostSessionSurvey
      */
    handleNewSoreBodyPartLogic: (soreBodyParts) => {
        let bodyParts = soreBodyParts && soreBodyParts.body_parts && soreBodyParts.body_parts.length > 0 ? _.cloneDeep(soreBodyParts.body_parts) : [];
        let histSoreStatus = soreBodyParts && soreBodyParts.hist_sore_status && soreBodyParts.hist_sore_status.length > 0 ? _.cloneDeep(soreBodyParts.hist_sore_status) : [];
        let clearCandidates = soreBodyParts && soreBodyParts.clear_candidates && soreBodyParts.clear_candidates.length > 0 ? _.cloneDeep(soreBodyParts.clear_candidates) : [];
        clearCandidates = _.map(clearCandidates, candidate => {
            let newCandidate = _.cloneDeep(candidate);
            newCandidate.isClearCandidate = true;
            return newCandidate;
        });
        let combinedSoreBodyParts = _.concat(clearCandidates, histSoreStatus, bodyParts);
        return combinedSoreBodyParts;
    },

    /**
      * Sore Body Part Render Logic
      * - SoreBodyPart
      */
    handleSoreBodyPartRenderLogic: (bodyPart, bodyPartSide, pageStateType) => {
        let bodyPartMap = bodyPart.body_part ?
            _.filter(MyPlanConstants.bodyPartMapping, ['index', bodyPart.body_part])[0]
            :
            _.filter(MyPlanConstants.bodyPartMapping, ['index', bodyPart.index])[0];
        let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
        let sorenessPainMapping = MyPlanConstants.muscleJointLevels;
        let helpingVerb = bodyPartMap ? bodyPartMap.helping_verb : '';
        let mainBodyPartName = bodyPartMap ? bodyPartMap.label : '';
        if (mainBodyPartName.slice(-1) === 's' && bodyPartMap.bilateral && !!bodyPartSide) {
            if (mainBodyPartName === 'Achilles') {
                // do nothing
            } else if (mainBodyPartName === 'Calves') {
                mainBodyPartName = 'Calf';
            } else {
                mainBodyPartName = mainBodyPartName.slice(0, -1);
            }
            helpingVerb = 'has';
        }
        let bodyPartName = `${bodyPartMap.bilateral && bodyPartSide === 1 ? 'Left ' : bodyPartMap.bilateral && bodyPartSide === 2 ? 'Right ' : ''}${mainBodyPartName}`;
        return {
            bodyPartGroup,
            bodyPartMap,
            bodyPartName,
            helpingVerb,
            sorenessPainMapping,
        };
    },

    /**
      * Sport Schedule Builder Render Logic
      * - SportScheduleBuilder
      */
    handleSportScheduleBuilderRenderLogic: (postSession, pageState) => {
        let filteredSport = postSession.sport_name || postSession.sport_name === 0 ?
            _.filter(MyPlanConstants.teamSports, ['index', postSession.sport_name])
            : postSession.strength_and_conditioning_type || postSession.strength_and_conditioning_type === 0 ?
                _.filter(MyPlanConstants.strengthConditioningTypes, ['index', postSession.strength_and_conditioning_type])
                :
                null;
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0] : false;
        let sportText = pageState.step === 1 && selectedSport ? selectedSport.label.toLowerCase() : '';
        let sportImage = pageState.step === 1 && selectedSport ? selectedSport.imagePath : '';
        if(selectedSport && selectedSport.label === 'High Intensity Interval Training') {
            sportText = 'HIIT';
        }
        return {
            sportImage,
            sportText,
        };
    },

    /**
      * Today & This Week Render Logic
      * - CoachesDashboard
      * -- returns an array of RN 'display' code
      */
    handleRenderTodayAndThisWeek: (isToday, insights, athletes, filter, compliance, renderSection) => {
        let insightsLength = 0;
        _.map(insights, (value, key) => {
            insightsLength += value.length;
        });
        let doWeHaveInsights = insightsLength > 0;
        let coachesDashboardCardsData = MyPlanConstants.coachesDashboardCardsData(isToday);
        let sections = [];
        _.map(insights, (insight, ind) => {
            let newValue = filter === 'not_cleared_to_play' ?
                _.filter(insight, ['cleared_to_train', false])
                : filter === 'cleared_to_play' ?
                    _.filter(insight, ['cleared_to_train', true])
                    :
                    insight;
            let description = _.filter(coachesDashboardCardsData, ['value', ind])[0];
            sections.push(renderSection(description, newValue, athletes, ind, compliance));
        });
        return {
            doWeHaveInsights,
            sections,
        };
    },

    /**
      * Athlete Card Modal Render Logic
      * - CoachesDashboard
      */
    handleAthleteCardModalRenderLogic: selectedAthlete => {
        let athleteName = `${selectedAthlete.didUserCompleteReadinessSurvey ? '' : '*'}${selectedAthlete.first_name.toUpperCase()} ${selectedAthlete.last_name.toUpperCase()}`;
        let mainColor = selectedAthlete.color === 0 ? AppColors.zeplin.successLight : selectedAthlete.color === 1 ? AppColors.zeplin.warningLight : AppColors.zeplin.errorLight;
        let subHeader = selectedAthlete.color === 0 ? 'Train as normal' : selectedAthlete.color === 1 ? 'Consider altering training plan' : 'Consider not training today';
        return {
            athleteName,
            mainColor,
            subHeader,
        };
    },

    /**
      * Coaches Dashboard Render Logic
      * - CoachesDashboard
      */
    handleCoachesDashboardRenderLogic: (coachesDashboardData, selectedTeamIndex) => {
        // team information data
        let coachesTeams = [];
        _.map(coachesDashboardData, (team, index) => {
            let teamObj = team;
            teamObj.label = team.name.toUpperCase();
            teamObj.value = index;
            coachesTeams.push(teamObj);
        });
        let selectedTeam = coachesTeams[selectedTeamIndex];
        // compliance modal data
        let complianceObj = selectedTeam ? selectedTeam.compliance : {completed: [], incomplete: [], training_compliance: {no_response: [], rest_day: [], sessions_logged: [],}};
        let numOfCompletedAthletes = complianceObj && complianceObj.complete ? complianceObj.complete.length : 0;
        let numOfIncompletedAthletes = complianceObj ? complianceObj.incomplete.length : 0;
        let numOfTotalAthletes = numOfCompletedAthletes + numOfIncompletedAthletes;
        let incompleteAthletes = complianceObj ? complianceObj.incomplete : [];
        let completedAthletes = complianceObj && complianceObj.complete ? complianceObj.complete : [];
        let completedPercent = (numOfCompletedAthletes / numOfTotalAthletes) * 100;
        let complianceColor = completedPercent <= 49 ?
            AppColors.zeplin.errorLight
            : completedPercent >= 50 && completedPercent <= 74 ?
                AppColors.zeplin.warningLight
                :
                AppColors.zeplin.successLight;
        complianceColor = numOfTotalAthletes === 0 ? AppColors.zeplin.errorLight : complianceColor;
        let trainingCompliance = complianceObj ? complianceObj.training_compliance : [];
        return {
            coachesTeams,
            completedAthletes,
            complianceColor,
            incompleteAthletes,
            numOfCompletedAthletes,
            numOfIncompletedAthletes,
            numOfTotalAthletes,
            selectedTeam,
            trainingCompliance,
        };
    },

    /**
      * Coaches Dashboard Section Render Logic
      * - CoachesDashboard
      */
    handleRenderCoachesDashboardSection: (athletes, item, compliance) => {
        let didUserCompleteReadinessSurvey = compliance && compliance.complete ?
            _.filter(compliance.complete, ['user_id', item.user_id]).length > 0 && !item.insufficient_data
            :
            false;
        let athleteName = `${didUserCompleteReadinessSurvey ? '' : '*'}${item.first_name.toUpperCase()}\n${item.last_name.charAt(0).toUpperCase()}.`;
        let backgroundColor = item.color === 0 ? AppColors.zeplin.successLight : item.color === 1 ? AppColors.zeplin.warningLight : AppColors.zeplin.errorLight;
        let filteredAthlete = _.filter(athletes, ['user_id', item.user_id])[0];
        filteredAthlete.didUserCompleteReadinessSurvey = didUserCompleteReadinessSurvey;
        return {
            athleteName,
            backgroundColor,
            filteredAthlete,
        }
    },

    /**
      * Coaches Dashboard GOT IT button clicked
      * - CoachesDashboard
      */
    gotItButtonLogic: coachesDashboardData => {
        let numberOfTotalAthletes = 0;
        _.map(coachesDashboardData, team => {
            numberOfTotalAthletes += team.athletes.length;
        });
        return {
            numberOfTotalAthletes,
        };
    },

    /**
      * Coaches Dashboard Search Area Render Logic
      * - CoachesDashboard
      */
    coachesDashboardSearchAreaRenderLogic: weeklyInsights => {
        let weeklyInsightsLength = 0;
        _.map(weeklyInsights, (value, key) => {
            weeklyInsightsLength += value.length;
        });
        let doWeHaveWeeklyInsights = weeklyInsightsLength > 0;
        return {
            doWeHaveWeeklyInsights,
        };
    },

    /**
      * Single Session Validation in Render Logic
      * - ReadinessSurvey & PostSessionSurvey
      */
    handleSingleSessionValidation: (session, sportScheduleBuilderRef) => {
        let isRPEValid = false;
        let isSportValid = false;
        if(!sportScheduleBuilderRef) {
            return {
                isRPEValid,
                isSportValid,
            };
        }
        let { sportText, } = PlanLogic.handleSportScheduleBuilderRenderLogic(session, sportScheduleBuilderRef.state ? sportScheduleBuilderRef.state : {});
        return {
            isRPEValid:   session.post_session_survey ? session.post_session_survey.RPE === 0 || session.post_session_survey.RPE > 0 : session.RPE === 0 || session.RPE > 0,
            isSportValid: sportScheduleBuilderRef.state ? sportScheduleBuilderRef.state.isFormValid : false,
            sportText,
        };
    },

    /**
      * Next Page & Validation Logic
      * - ReadinessSurvey
      */
    // TODO: UNIT TEST ME
    handleReadinessSurveyNextPage: (pageState, dailyReadiness, currentPage, isFormValidItems, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked, healthKitWorkouts, isHealthKitValid, isHKNextStep) => {
        let pageNum = 0;
        let isValid = false;
        if(currentPage === 0) { // 0. Begin
            pageNum = healthKitWorkouts && healthKitWorkouts.length > 0 ? 1 : 2;
            isValid = true;
        } else if(currentPage === 1) { // 1. Apple HealthKit (xN)
            let numberOfNonDeletedWorkouts = _.filter(healthKitWorkouts, ['deleted', false]);
            pageNum = numberOfNonDeletedWorkouts.length === 0 ?
                2
                : isHKNextStep === 'continue' ?
                    4
                    : isHKNextStep === 'add_session' ?
                        3
                        :
                        4;
            isValid = isHealthKitValid;
        } else if(currentPage === 2) { // 2. trained already
            pageNum = dailyReadiness.already_trained_number === false ? 4 : 3;
            isValid = isFormValidItems.isTrainedTodayValid;
        } else if(currentPage === 3) { // 3. SportScheduleBuilder & RPE (xN)
            pageNum = (pageState.pageIndex + 1);
            isValid = true; // can only click if form is valid
        } else if(currentPage === 4) { // 4. train later?
            pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ?
                (pageState.pageIndex + 1)
                :
                (pageState.pageIndex + 2);
            isValid = isFormValidItems.willTrainLaterValid;
        } else if(currentPage === 5) { // 5. Follow Up Pain & Soreness
            pageNum = (pageState.pageIndex + 1);
            isValid = isFormValidItems.isPrevSorenessValid;
        } else if(currentPage === 6) { // 6. Areas of Soreness
            pageNum = (pageState.pageIndex + 1);
            isValid = isFormValidItems.selectAreasOfSorenessValid;
        } else if(currentPage === 7) { // 7. Areas of Soreness Selected
            pageNum = (pageState.pageIndex);
            isValid = isFormValidItems.areAreasOfSorenessValid;
        }
        return {
            isValid,
            pageNum,
        };
    },

    /**
      * Previous Page & Validation Logic
      * - ReadinessSurvey
      */
    // TODO: UNIT TEST ME
    handleReadinessSurveyPreviousPage: (pageState, currentPage, newSoreBodyParts, healthKitWorkouts, dailyReadiness) => {
        let pageNum = 0;
        let isTrainLater = false;
        if(currentPage === 2) { // 2. trained already
            pageNum = 1;
        } else if(currentPage === 3) { // 3. SportScheduleBuilder & RPE (xN)
            pageNum = 2;
        } else if(currentPage === 4) { // 4. train later?
            pageNum = !healthKitWorkouts && dailyReadiness.already_trained_number ?
                (pageState.pageIndex - 1)
                :
                2;
        } else if(currentPage === 5) { // 5. Follow Up Pain & Soreness
            pageNum = (pageState.pageIndex - 1);
            isTrainLater = true;
        } else if(currentPage === 6) { // 6. Areas of Soreness
            pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ?
                (pageState.pageIndex - 1)
                :
                (pageState.pageIndex - 2);
            isTrainLater = !(newSoreBodyParts && newSoreBodyParts.length > 0);
        } else if(currentPage === 7) { // 7. Areas of Soreness Selected
            pageNum = 6;
        } else {
            pageNum = currentPage;
        }
        return {
            isTrainLater,
            pageNum,
        };
    },

    /**
      * Next Page & Validation Logic
      * - PostSessionSurvey
      */
    handlePostSessionSurveyNextPage: (pageState, currentPage, isFormValidItems, newSoreBodyParts, areaOfSorenessClicked, isHealthKitValid, isHKNextStep) => {
        let isValid = false;
        let pageNum = 0;
        if(currentPage === 0) { // 0. Apple HealthKit (xN)
            pageNum = isHKNextStep === 'continue' && (newSoreBodyParts && newSoreBodyParts.length > 0 || newSoreBodyParts.length === 0) ?
                2
                : isHKNextStep === 'add_session' ?
                    1
                    :
                    1;
            isValid = isHealthKitValid;
        } else if(currentPage === 1) { // 1. Session + RPE/Duration
            pageNum = (pageState.pageIndex + 1);
            isValid = true; // can only click if form is valid
        } else if(currentPage === 2) { // 2. train later?
            pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ? (pageState.pageIndex + 1) : (pageState.pageIndex + 2);
            isValid = isFormValidItems.willTrainLaterValid;
        } else if(currentPage === 3) { // 3. Follow Up Pain & Soreness
            pageNum = (pageState.pageIndex + 1);
            isValid = isFormValidItems.isPrevSorenessValid;
        } else if(currentPage === 4) { // 4. Areas of Soreness
            pageNum = (pageState.pageIndex + 1);
            isValid = isFormValidItems.selectAreasOfSorenessValid;
        } else if(currentPage === 5) { // 5. Areas of Soreness Selected
            pageNum = (pageState.pageIndex);
            isValid = isFormValidItems.areAreasOfSorenessValid;
        }
        return {
            isValid,
            pageNum,
        };
    },

    /**
      * Previous Page & Validation Logic
      * - PostSessionSurvey
      */
    handlePostSessionSurveyPreviousPage: (pageState, currentPage, newSoreBodyParts, postSessionSessions, healthKitWorkouts) => {
        let pageNum = 0;
        if(currentPage === 0) { // 0. Apple HealthKit (xN)
            pageNum = 0;
        } else if(currentPage === 1) { // 1. Session + RPE/Duration
            pageNum = 0;
        } else if(currentPage === 2) { // 2. train later?
            pageNum = (healthKitWorkouts && healthKitWorkouts.length > 0) ?
                (pageState.pageIndex - 2)
                : (postSessionSessions && postSessionSessions.length > 0) ?
                    (pageState.pageIndex - 1)
                    :
                    0;
        } else if(currentPage === 3) { // 3. Follow Up Pain & Soreness
            pageNum = (pageState.pageIndex - 1);
        } else if(currentPage === 4) { // 4. Areas of Soreness
            pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ?
                (pageState.pageIndex - 1)
                :
                (pageState.pageIndex - 2);
        } else if(currentPage === 5) { // 5. Areas of Soreness Selected
            pageNum = (pageState.pageIndex - 1);
        }
        return {
            pageNum,
        };
    },

    /**
      * Exercises Render Logic
      * - Exercises
      */
    handleExercisesRenderLogic: (exerciseList, selectedExercise, modality = 'prepare') => {
        const cleanedExerciseList = exerciseList.cleanedExerciseList;
        /*eslint dot-notation: 0*/
        let isStaticExercise = _.find(cleanedExerciseList['STATIC STRETCH'], { library_id: selectedExercise.library_id, });
        let flatListExercises = [];
        if(modality === 'prepare') {
            let foamRollExercises = cleanedExerciseList['FOAM ROLL'] ? cleanedExerciseList['FOAM ROLL'] : [];
            let staticStretchExercises = cleanedExerciseList['STATIC STRETCH'] ? cleanedExerciseList['STATIC STRETCH'] : [];
            let activeStretchExercises = cleanedExerciseList['ACTIVE STRETCH'] ? cleanedExerciseList['ACTIVE STRETCH'] : [];
            let activateExercises = cleanedExerciseList['ACTIVATE'] ? cleanedExerciseList['ACTIVATE'] : [];
            let integrateExercises = cleanedExerciseList['INTEGRATE'] ? cleanedExerciseList['INTEGRATE'] : [];
            flatListExercises = _.concat(foamRollExercises, staticStretchExercises, activeStretchExercises, activateExercises, integrateExercises);
        } else if(modality === 'recover') {
            let foamRollExercises = cleanedExerciseList['FOAM ROLL'] ? cleanedExerciseList['FOAM ROLL'] : [];
            let staticStretchExercises = cleanedExerciseList['STATIC STRETCH'] ? cleanedExerciseList['STATIC STRETCH'] : [];
            let activateExercises = cleanedExerciseList['ACTIVATE'] ? cleanedExerciseList['ACTIVATE'] : [];
            let integrateExercises = cleanedExerciseList['INTEGRATE'] ? cleanedExerciseList['INTEGRATE'] : [];
            flatListExercises = _.concat(foamRollExercises, staticStretchExercises, activateExercises, integrateExercises);
        } else if(modality === 'warmUp') {
            flatListExercises = [];
        } else if(modality === 'coolDown') {
            let stretchExercises = cleanedExerciseList['DYNAMIC STRETCH'] ? cleanedExerciseList['DYNAMIC STRETCH'] : [];
            let integrateExercises = cleanedExerciseList['INTEGRATE'] ? cleanedExerciseList['INTEGRATE'] : [];
            flatListExercises = _.concat(stretchExercises,integrateExercises);
        }
        let availableSectionsCount = 0;
        let totalLength = 0;
        let firstItemIndex = _.findIndex(flatListExercises, o => o.library_id+'-'+o.set_number === selectedExercise.library_id+'-'+selectedExercise.set_number);
        _.map(exerciseList.cleanedExerciseList, (exerciseArray, index) => {
            if(exerciseArray.length > 0) {
                availableSectionsCount = availableSectionsCount + 1;
                totalLength += exerciseArray.length;
            }
        });
        return {
            availableSectionsCount,
            cleanedExerciseList,
            flatListExercises,
            firstItemIndex,
            isStaticExercise,
            totalLength,
        };
    },

    /**
      * Exercises Timer Logic
      * - Exercises
      */
    handleExercisesTimerLogic: exercise => {
        return {
            number_of_sets:    exercise.bilateral ? 2 : 1,
            pre_start_time:    5,
            seconds_per_set:   exercise.seconds_per_set || null,
            switch_sides_time: 5,
            up_next_interval:  10,
        };
    },

    /**
      * HealthKit Workout Page Render Logic
      * - HealthKitWorkouts
      */
    handleHealthKitWorkoutPageRenderLogic: workout => {
        let hourOfDay = workout && workout.event_date ? moment(workout.event_date).utc().get('hour') : moment().utc().get('hour');
        let split_afternoon = 12; // 24hr time to split the afternoon
        let split_evening = 17; // 24hr time to split the evening
        let cutoffForNewDay = 3;
        let partOfDay = hourOfDay >= split_afternoon && hourOfDay <= split_evening ? 'afternoon' : hourOfDay >= split_evening || hourOfDay < cutoffForNewDay ? 'evening' : 'morning';
        let filteredSport = _.filter(MyPlanConstants.teamSports, ['index', workout.sport_name]);
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0] : false;
        let sportDuration = workout.duration ? workout.duration : 0;
        let sportName = selectedSport ? selectedSport.label : '';
        let sportStartTime = workout && workout.event_date ? moment(workout.event_date).utc().format('h:mma') : moment().format('hh:mma');
        let sportText = selectedSport ? `${sportStartTime} ${selectedSport.label.toLowerCase()} workout` : '';
        let sportImage = selectedSport ? selectedSport.imagePath : '';
        if(selectedSport && sportName === 'High Intensity Interval Training') {
            sportName = 'HIIT';
            sportText = `${sportStartTime} ${sportName} workout`;
        }
        return {
            partOfDay,
            sportDuration,
            sportImage,
            sportName,
            sportStartTime,
            sportText,
        };
    },

    // TODO: UNIT TEST ME - lines 1890-1940
    handleHealthKitWorkoutPageRenderLogicNEW: workout => {
        let filteredSport = _.filter(MyPlanConstants.teamSports, ['index', workout.sport_name]);
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0] : false;
        let sportName = selectedSport ?
            workout.source === 0 ?
                `Fathom ${selectedSport.label}`
                : workout.source === 3 ?
                    selectedSport.label
                    :
                    `${workout.apple_health_kit_source_names[0]} ${selectedSport.label}`
            :
            '';
        let sportStartTime = workout && workout.event_date ? moment(workout.event_date).utc().format('h:mma') : moment().format('hh:mma');
        if(selectedSport && selectedSport.label === 'High Intensity Interval Training') {
            sportName = workout.source === 0 ? 'Fathom HIIT' : workout.source === 3 ? 'HIIT' : `${workout.apple_health_kit_source_names[0]} HIIT`;
        }
        return {
            sportName,
            sportStartTime,
        };
    },

    /**
      * HealthKit Single Workout Page Render Logic
      * - HealthKitWorkouts
      */
    // TODO: UNIT TEST ME
    handleSingleHealthKitWorkoutPageRenderLogic: workouts => {
        if(workouts.length > 1) {
            return {
                sportImage: '',
                sportText:  '',
            }
        }
        let workout = workouts[0];
        let filteredSport = _.filter(MyPlanConstants.teamSports, ['index', workout.sport_name]);
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0] : false;
        let sportStartTime = workout && workout.event_date ? moment(workout.event_date).utc().format('h:mma') : moment().format('hh:mma');
        let sportText = workout.apple_health_kit_source_names && workout.apple_health_kit_source_names[0] ?
            [
                `How was your ${sportStartTime} `,
                `${workout.apple_health_kit_source_names[0]} workout?`,
                ''
            ]
            :
            [
                'How was your ',
                'Run with Fathom Pro',
                ` at ${sportStartTime}?`
            ];
        let sportImage = selectedSport ? selectedSport.imagePath : '';
        return {
            sportImage,
            sportStartTime,
            sportText,
        };
    },

    /**
      * Function Strength Modal Render Logic
      * - FunctionalStrengthModal
      */
    fsModalRenderLogic: (functionalStrength, typicalSession) => {
        let foundSport = _.find(MyPlanConstants.teamSports, o => o.index === functionalStrength.current_sport_name);
        let selectedSportPositions = functionalStrength.current_sport_name !== null && foundSport && foundSport.positions ? foundSport.positions : [];
        let hasPositions = (functionalStrength.current_sport_name !== null || functionalStrength.current_sport_name === 0) && selectedSportPositions && selectedSportPositions.length > 0;
        let isValid = (functionalStrength.current_sport_name === 0 || functionalStrength.current_sport_name > 0) &&
            (
                selectedSportPositions.length === 0 ||
                (functionalStrength.current_position === 0 || functionalStrength.current_position > 0)
            );
        return {
            hasPositions,
            isValid,
            selectedSportPositions,
        }
    },

    /**
      * Handle Readiness Survey Submit Objects
      * - MyPlan
      */
    // TODO: UNIT TEST ME
    handleReadinessSurveySubmitLogic: (dailyReadiness, prepare, recover, healthData, user, eventDate = `${moment().toISOString(true).split('.')[0]}Z`) => {
        let newPrepareObject = Object.assign({}, prepare, {
            isActiveRecoveryCollapsed: dailyReadiness.sessions_planned ? false : true,
        });
        let newRecoverObject = Object.assign({}, recover, {
            isActiveRecoveryCollapsed: dailyReadiness.sessions_planned ? true : false,
        });
        let newDailyReadiness = {
            clear_candidates:          _.filter(dailyReadiness.soreness, {isClearCandidate: true}),
            date_time:                 eventDate,
            readiness:                 dailyReadiness.readiness,
            sessions_planned:          dailyReadiness.sessions_planned,
            sleep_quality:             dailyReadiness.sleep_quality,
            soreness:                  _.filter(dailyReadiness.soreness, u => u.severity && u.severity > 0 && !u.isClearCandidate),
            user_age:                  moment().diff(moment(user.personal_data.birth_date, ['YYYY-MM-DD', 'YYYY/MM/DD', 'MM/DD/YYYY']), 'years'),
            wants_functional_strength: dailyReadiness.wants_functional_strength,
        };
        if(dailyReadiness.current_sport_name === 0 || dailyReadiness.current_sport_name > 0) {
            newDailyReadiness.current_sport_name = dailyReadiness.current_sport_name;
        }
        if(dailyReadiness.current_position === 0 || dailyReadiness.current_position > 0) {
            newDailyReadiness.current_position = dailyReadiness.current_position;
        }
        let healthDataWorkouts = healthData.workouts ? healthData.workouts : [];
        let healthDataIgnoredWorkouts = healthData.ignoredWorkouts ? healthData.ignoredWorkouts : [];
        let dailyReadinessSessions = dailyReadiness.sessions ?
            _.filter(dailyReadiness.sessions, session => session.sport_name && session.session_type && (session.post_session_survey.RPE === 0 || session.post_session_survey.RPE > 0))
            :
            [];
        newDailyReadiness.sessions = _.concat(healthDataWorkouts, dailyReadinessSessions, healthDataIgnoredWorkouts);
        newDailyReadiness.sleep_data = healthData.sleep;
        if(healthData.workouts && healthData.workouts.length > 0) {
            newDailyReadiness.health_sync_date = eventDate;
        }

        let filteredHealthDataWorkouts = healthDataWorkouts && healthDataWorkouts.length > 0 ?
            _.filter(healthDataWorkouts, o => !o.deleted)
            :
            [];
        let filteredDailyReadinessSessions = dailyReadinessSessions && dailyReadinessSessions.length > 0 ?
            _.filter(dailyReadinessSessions, o => !o.deleted)
            :
            [];
        let nonDeletedSessions = _.concat(filteredHealthDataWorkouts, filteredDailyReadinessSessions);
        let newDailyReadinessState = {
            current_position:          null,
            current_sport_name:        null,
            readiness:                 null,
            sessions:                  nonDeletedSessions,
            sessions_planned:          newDailyReadiness.sessions_planned,
            sleep_quality:             null,
            soreness:                  [],
            wants_functional_strength: null,
            // won't be submitted, help with UI
            already_trained_number:    null,
        };
        return {
            newDailyReadiness,
            newDailyReadinessState,
            newPrepareObject,
            newRecoverObject,
            nonDeletedSessions,
        };
    },

    /**
      * Handle Post Session Survey Submit Objects
      * - MyPlan
      */
    // TODO: UNIT TEST ME
    handlePostSessionSurveySubmitLogic: (postSession, train, recover, healthData, user, eventDate = `${moment().toISOString(true).split('.')[0]}Z`) => {
        let newPostSession = {
            event_date:       eventDate,
            sessions:         [],
            sessions_planned: postSession.sessions_planned,
            user_age:         moment().diff(moment(user.personal_data.birth_date, ['YYYY-MM-DD', 'YYYY/MM/DD', 'MM/DD/YYYY']), 'years'),
        };
        let landingScreen = postSession.sessions_planned ? 0 : 2;
        let healthDataWorkouts = healthData.workouts && healthData.workouts.length > 0 ? healthData.workouts : [];
        let loggedSessions = postSession.sessions ?
            _.filter(postSession.sessions, session => session.sport_name && session.session_type && (session.post_session_survey.RPE === 0 || session.post_session_survey.RPE > 0))
            :
            [];
        if(healthData.workouts && healthData.workouts.length > 0) {
            newPostSession.health_sync_date = eventDate;
        }
        newPostSession.sessions = _.concat(healthDataWorkouts, loggedSessions);
        let lastNonDeletedIndex = _.findLastIndex(newPostSession.sessions, ['deleted', false]);
        if(newPostSession.sessions[lastNonDeletedIndex]) {
            newPostSession.sessions[lastNonDeletedIndex].post_session_survey = {
                clear_candidates: _.filter(postSession.soreness, {isClearCandidate: true}),
                event_date:       eventDate,
                RPE:              newPostSession.sessions[lastNonDeletedIndex].post_session_survey.RPE,
                soreness:         _.filter(postSession.soreness, u => u.severity && u.severity > 0 && !u.isClearCandidate),
            };
        }
        let clonedPostPracticeSurveys = _.cloneDeep(train.postPracticeSurveys);
        let newSurvey = {};
        newSurvey.isPostPracticeSurveyCollapsed = true;
        newSurvey.isPostPracticeSurveyCompleted = true;
        clonedPostPracticeSurveys.push(newSurvey);
        let newTrainObject = Object.assign({}, train, {
            postPracticeSurveys: clonedPostPracticeSurveys,
        });
        let postPracticeSurveysLastIndex = _.findLastIndex(newTrainObject.postPracticeSurveys);
        newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCompleted = true;
        newTrainObject.postPracticeSurveys[postPracticeSurveysLastIndex].isPostPracticeSurveyCollapsed = true;
        let newPostSessionSessions = newPostSession && newPostSession.sessions && newPostSession.sessions.length > 0 ?
            _.filter(newPostSession.sessions, o => !o.deleted && !o.ignored)
            :
            [PlanLogic.returnEmptySession()];
        let newRecoverObject = Object.assign({}, recover, {
            isActiveRecoveryCollapsed: false,
        });
        return {
            landingScreen,
            newPostSession,
            newPostSessionSessions,
            newRecoverObject,
            newTrainObject,
        };
    },

    /**
      * Handle Completed Exercises
      * - MyPlan
      */
    handleCompletedExercises: completedExercises => {
        let newCompletedExercises = _.cloneDeep(completedExercises);
        newCompletedExercises = _.filter(newCompletedExercises);
        newCompletedExercises = _.map(newCompletedExercises, exId => {
            let newExerciseId = _.cloneDeep(exId);
            newExerciseId = newExerciseId.substring(0, newExerciseId.indexOf('-'));
            return newExerciseId;
        });
        newCompletedExercises = _.uniq(newCompletedExercises);
        return { newCompletedExercises, };
    },

    /**
      * Helper Function for Completed Modalities
      * - PlanLogic
      */
    addTitleToCompletedModalitiesHelper: (array, title, subtitle, filterOutActive, exerciseListOrder) => {
        if(!array || !array[0]) {
            return [];
        }
        if(filterOutActive) {
            array = _.filter(array, o => o.completed || (!o.active && !o.completed));
        }
        return _.map(array, activity => {
            let newCompletedActivity = _.cloneDeep(activity);
            let newTitle = title;
            if(activity.sport_name) {
                newTitle = `${_.filter(MyPlanConstants.teamSports, ['index', activity.sport_name])[0].label}`;
            }
            newCompletedActivity.title = newTitle;
            if(subtitle) {
                let goals = PlanLogic.handleFindGoals(newCompletedActivity, exerciseListOrder);
                if(goals && goals.length > 0) {
                    newCompletedActivity.subtitle = _.map(goals, g => g.text).join(', ');
                }
            }
            newCompletedActivity.isCompleted = (activity && (activity.sport_name || activity.completed));
            newCompletedActivity.isLocked = activity && !activity.active && !activity.completed;
            newCompletedActivity.created_date = activity.created_date || activity.completed_date_time;
            if(newCompletedActivity.isLocked && !activity.sport_name) {
                newCompletedActivity.subtitle = `Sorry, you missed the optimal window for ${_.startCase(_.toLower(newCompletedActivity.title))} today.`;
            }
            return newCompletedActivity;
        });
    },

    /**
      * Helper Function for Completed Cool Downs
      * - PlanLogic
      */
    addTitleToActiveModalitiesHelper: (dailyPlanObj, title, timingAddOn, exerciseListOrder, modality, backgroundImage) => {
        if(!dailyPlanObj || !dailyPlanObj[0]) {
            return [];
        }
        let newDailyPlanObj = _.cloneDeep(dailyPlanObj);
        newDailyPlanObj = _.filter(newDailyPlanObj, o => o.active && !o.completed);
        return _.map(newDailyPlanObj, activity => {
            let newCompletedActivity = _.cloneDeep(activity);
            let goals = PlanLogic.handleFindGoals(newCompletedActivity, exerciseListOrder);
            if(goals && goals.length > 0) {
                newCompletedActivity.subtitle = _.map(goals, g => g.text).join(', ');
            }
            newCompletedActivity.title = title;
            let timingTime = '0 min, ';
            if(newCompletedActivity.minutes) {
                timingTime = `${newCompletedActivity.minutes} min, `;
            } else {
                let priority = newCompletedActivity.default_plan === 'Efficient' ? 0 : newCompletedActivity.default_plan === 'Complete' ? 1 : 2;
                timingTime = `${(_.round(MyPlanConstants.cleanExerciseList(newCompletedActivity, priority, goals, modality).totalSeconds / 60))} min, `;
            }
            newCompletedActivity.timing = [timingTime, timingAddOn];
            newCompletedActivity.modality = modality;
            newCompletedActivity.isBodyModality = modality === 'heat' || modality === 'ice' || modality === 'cwi';
            if(backgroundImage) {
                newCompletedActivity.backgroundImage = backgroundImage;
            }
            return newCompletedActivity;
        });
    },

    /**
      * Handle Find Goals Logic
      * - /actions/plan.js
      */
    handleFindGoals: (object, exerciseListOrder) => {
        // setup variables
        let tmpGoals = [];
        let goals = [];
        // return empty if we don't have an *_active_rest
        if(!object) {
            return goals;
        }
        if(exerciseListOrder) {
            // loop through our exercise order and sections
            _.map(exerciseListOrder, list => {
                _.map(object[list.index], exercise => {
                    _.map(exercise.dosages, dosage => {
                        tmpGoals = _.concat(tmpGoals, dosage.goal);
                    });
                });
            });
        } else if(object.triggers) {
            _.map(object.triggers, o => {
                tmpGoals = _.concat(o);
            });
        } else {
            _.map(object.body_parts, o => {
                tmpGoals = _.concat(o.goals);
            });
        }
        // filter unique goal object(s)
        tmpGoals = _.uniqBy(tmpGoals, 'goal_type');
        // run through all goals to make sure if its selected or not
        _.map(tmpGoals, goal => {
            let newGoal = _.cloneDeep(goal);
            let goalsIndex = object.default_plan === 'Efficient' ?
                'efficient_active'
                : object.default_plan === 'Complete' ?
                    'complete_active'
                    :
                    'comprehensive_active';
            if(object.goals) {
                let goalStatus = object.goals && object.goals[newGoal.goal_type] ? object.goals[newGoal.goal_type][goalsIndex] : false;
                newGoal.isSelected = goalStatus;
            } else {
                newGoal.isSelected = true;
            }
            goals.push(newGoal);
        });
        // return array of object(s)
        return goals;
    },

    /**
      * Handle Exercises Progress Pills Logic
      * - Exercises
      */
    handleExercisesProgressPillsLogic: (availableSectionsCount, cleanedExerciseList, completedExercises, exerciseList, index, selectedExercise, totalLength) => {
        let usableScreenWidth = (AppSizes.screen.width - (AppSizes.padding * 2));
        let currentIndex = Object.keys(cleanedExerciseList).indexOf(index);
        let isSelectedExerciseInCurrentIndex = _.find(exerciseList, ['library_id', selectedExercise.library_id]);
        let progressLength = (_.filter(exerciseList, o => completedExercises.indexOf(`${o.library_id}-${o.set_number}`) > -1).length / exerciseList.length);
        let progressWidth = progressLength ? parseInt(progressLength * 100, 10) : 0;
        let itemWidth = ((exerciseList.length / totalLength) * usableScreenWidth);
        let activeScale = 1; //1.5;
        let remainingScale = 1; //(activeScale - 1) * (1 + (activeScale - 1) / (availableSectionsCount - 1));
        let scaledItemWidth = isSelectedExerciseInCurrentIndex ? (itemWidth * activeScale) : (itemWidth * remainingScale);
        return {
            currentIndex,
            isSelectedExerciseInCurrentIndex,
            progressWidth,
            scaledItemWidth,
        };
    },

    /**
      * Handle Exercises Modality Render Logic
      * - ExerciseModality
      */
    handleExerciseModalityRenderLogic: (dailyPlanObj, plan, priority, modality, index = 0) => {
        let goals = plan.activeRestGoals;
        let imageId = 'prepareCareActivate';
        let imageSource = require('../../assets/images/standard/mobilize.png');
        let pageSubtitle = 'Anytime before training';
        let pageTitle = 'Mobilize';
        let recoveryObj = dailyPlanObj.pre_active_rest ? dailyPlanObj.pre_active_rest[index] : {};
        let recoveryType = 'pre_active_rest';
        let sceneId = 'prepareScene';
        let textId = 'prepareCareActivate';
        if(dailyPlanObj.post_active_rest && dailyPlanObj.post_active_rest[index] && dailyPlanObj.post_active_rest[index].active && modality === 'recover') {
            goals = plan.activeRestGoals;
            imageId = 'recoverCareActivate';
            pageSubtitle = 'Anytime';
            pageTitle = 'Mobilize';
            recoveryObj = dailyPlanObj.post_active_rest[index];
            recoveryType = 'post_active_rest';
            sceneId = 'recoverScene';
            textId = 'recoverCareActivate';
        } else if(dailyPlanObj.warm_up && dailyPlanObj.warm_up[index] && dailyPlanObj.warm_up[index].active && modality === 'warmUp') {
            goals = plan.warmUpGoals;
            imageId = 'warmUp';
            // imageSource = require('../../assets/images/standard/warm_up.png');
            pageSubtitle = 'Anytime before training';
            pageTitle = 'Warm Up';
            recoveryObj = dailyPlanObj.warm_up[index];
            recoveryType = 'warm_up';
            sceneId = 'warmUpScene';
            textId = 'warmUp';
        } else if(dailyPlanObj.cool_down && dailyPlanObj.cool_down[index] && dailyPlanObj.cool_down[index].active && modality === 'coolDown') {
            goals = plan.coolDownGoals;
            imageId = 'coolDown';
            imageSource = require('../../assets/images/standard/active_recovery.png');
            pageSubtitle = 'Immediately after training';
            pageTitle = 'Active Recovery';
            recoveryObj = dailyPlanObj.cool_down[index];
            recoveryType = 'cool_down';
            sceneId = 'coolDownScene';
            textId = 'coolDown';
        }
        let buttons = [
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 0, goals, modality).totalSeconds / 60))} minutes`,
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 1, goals, modality).totalSeconds / 60))} minutes`,
            `${(_.round(MyPlanConstants.cleanExerciseList(recoveryObj, 2, goals, modality).totalSeconds / 60))} minutes`
        ];
        let exerciseList = MyPlanConstants.cleanExerciseList(recoveryObj, priority, goals, modality);
        let firstExerciseFound = false;
        _.map(exerciseList.cleanedExerciseList, exerciseIndex => {
            if(exerciseIndex && exerciseIndex.length > 0 && !firstExerciseFound) {
                firstExerciseFound = exerciseIndex[0];
                return exerciseIndex;
            }
            return false;
        });
        let priorityText = priority === 0 ? 'Efficient' : priority === 1 ? 'Complete' : 'Comprehensive';
        let goalsHeader = `${priorityText} routine to reduce effects of:`;
        return {
            buttons,
            exerciseList,
            firstExerciseFound,
            goals,
            goalsHeader,
            imageId,
            imageSource,
            pageSubtitle,
            pageTitle,
            priorityText,
            recoveryObj,
            recoveryType,
            sceneId,
            textId,
        };
    },

    /**
      * Handle Body Modality Render Logic
      * - BodyModality
      */
    handleBodyModalityRenderLogic: (dailyPlanObj, modality) => {
        let equipmentRequired = 'Heating Pad, Wet Towel';
        let extraTimeText = 'per body part';
        let imageId = 'heat';
        let imageSource = require('../../assets/images/standard/heat.png');
        let pageSubtitle = '30 minutes before training';
        let pageText = 'Heat increases circulation & loosens up soft tissues to improve the benefits of foam rolling, stretching, & dynamic warmup.';
        let pageTitle = 'Heat';
        let recoveryObj = dailyPlanObj.heat;
        let sceneId = 'heatScene';
        let textId = 'heat';
        let time = recoveryObj ? recoveryObj.minutes : 0;
        if(dailyPlanObj.ice && dailyPlanObj.ice.active && modality === 'ice') {
            equipmentRequired = 'Ice, Towel';
            extraTimeText = 'per body part';
            imageId = 'ice';
            imageSource = require('../../assets/images/standard/ice.png');
            pageSubtitle = 'After all training is complete';
            pageText = 'Ice can help minimize swelling due to a minor injury & reduce inflammation in your tissues, muscle spasms, & pain.';
            pageTitle = 'Ice';
            recoveryObj = dailyPlanObj.ice;
            sceneId = 'iceScene';
            textId = 'ice';
            time = dailyPlanObj.ice.minutes;
        } else if(dailyPlanObj.cold_water_immersion && dailyPlanObj.cold_water_immersion.active && modality === 'cwi') {
            equipmentRequired = 'Tub, Cold Water';
            extraTimeText = false;
            imageId = 'cwi';
            imageSource = require('../../assets/images/standard/cwi.png');
            pageSubtitle = 'After all training is complete';
            pageText = 'A Cold Water Bath (CWB) after exercise can help reduce exercise-induced inflammation and muscle damage that causes discomfort.';
            pageTitle = 'Cold Water Bath';
            recoveryObj = dailyPlanObj.cold_water_immersion;
            sceneId = 'cwiScene';
            textId = 'cwi';
            time = dailyPlanObj.cold_water_immersion.minutes;
        }
        return {
            equipmentRequired,
            extraTimeText,
            imageId,
            imageSource,
            pageSubtitle,
            pageText,
            pageTitle,
            recoveryObj,
            sceneId,
            textId,
            time,
        };
    },

    /**
      * BodyModality Body Part
      * - BodyModality
      */
    handleBodyModalityBodyPart: body => {
        let isSelected = body.active;
        let filteredBodyPartMap = _.filter(MyPlanConstants.bodyPartMapping, ['index', body.body_part_location]);
        let bodyImage = filteredBodyPartMap[0].image[body.side];
        let mainBodyPartName = (
            filteredBodyPartMap[0].label.slice(-1) === 's' && filteredBodyPartMap[0].bilateral
        ) ?
            filteredBodyPartMap[0].label === 'Achilles' ?
                filteredBodyPartMap[0].label.toUpperCase()
                : filteredBodyPartMap[0].label === 'Calves' ?
                    'CALF'
                    :
                    filteredBodyPartMap[0].label.slice(0, -1).toUpperCase()
            :
            filteredBodyPartMap[0].label.toUpperCase();
        if(body.side === 1 || body.side === 2) {
            let sideText = body.side === 1 ? 'LEFT' : 'RIGHT';
            mainBodyPartName = `${sideText}\n${mainBodyPartName}`;
        }
        return {
            bodyImage,
            isSelected,
            mainBodyPartName,
        };
    },

    /**
      * Handle MyPlan Single Page Render Logic
      * - MyPlan
      */
    // TODO: UNIT TEST ME
    handleMyPlanRenderLogic: (dailyPlanObj, userObj) => {
        let completedHeat = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_heat, 'Heat', PlanLogic.handleFindGoals(dailyPlanObj.completed_heat));
        let completedPreActiveRest = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_pre_active_rest, 'Mobilize', PlanLogic.handleFindGoals(dailyPlanObj.completed_pre_active_rest, MyPlanConstants.preExerciseListOrder), false, MyPlanConstants.preExerciseListOrder);
        let completedWarmUp = []; // PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_warm_up, '');
        let filteredTrainingSessions = dailyPlanObj.training_sessions && dailyPlanObj.training_sessions.length > 0 ?
            _.filter(dailyPlanObj.training_sessions, o => !o.deleted && !o.ignored && (o.sport_name !== null || o.strength_and_conditioning_type !== null))
            :
            [];
        if(dailyPlanObj.training_sessions && dailyPlanObj.training_sessions.length > 0 && filteredTrainingSessions.length > 0) {
            filteredTrainingSessions = _.map(filteredTrainingSessions, o =>
                o.source === 3 && (!o.asymmetry || (o.asymmetry && o.last_updated && o.last_updated > dailyPlanObj.last_updated)) ?
                    null
                    :
                    o
            );
            filteredTrainingSessions = _.filter(filteredTrainingSessions, o => o && o.event_date);
        }
        let completedTrainingSessions = PlanLogic.addTitleToCompletedModalitiesHelper(filteredTrainingSessions, 'Active Recovery');
        let completedCurrentHeat = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.heat], 'Heat', PlanLogic.handleFindGoals([dailyPlanObj.heat]), true);
        let completedCurrentPreActiveRest = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.pre_active_rest, 'Mobilize', PlanLogic.handleFindGoals(dailyPlanObj.pre_active_rest, MyPlanConstants.preExerciseListOrder), true, MyPlanConstants.preExerciseListOrder);
        let completedCurrentWarmUp = []; // PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.pre_active_rest, 'Mobilize', '', true);
        let completedCWI = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_cold_water_immersion, 'Cold Water Bath', PlanLogic.handleFindGoals(dailyPlanObj.completed_cold_water_immersion));
        let completedCoolDown = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_cool_down, 'Active Recovery', PlanLogic.handleFindGoals(dailyPlanObj.completed_cool_down, MyPlanConstants.coolDownExerciseListOrder), false, MyPlanConstants.coolDownExerciseListOrder);
        let completedIce = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_ice, 'Ice', PlanLogic.handleFindGoals(dailyPlanObj.completed_ice));
        let completedPostActiveRest = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_post_active_rest, 'Mobilize', PlanLogic.handleFindGoals(dailyPlanObj.completed_post_active_rest, MyPlanConstants.postExerciseListOrder), false, MyPlanConstants.postExerciseListOrder);
        let completedCurrentCWI = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.cold_water_immersion], 'Cold Water Bath', PlanLogic.handleFindGoals([dailyPlanObj.cold_water_immersion]), true);
        let completedCurrentCoolDown = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.cool_down, 'Active Recovery', PlanLogic.handleFindGoals(dailyPlanObj.cool_down, MyPlanConstants.coolDownExerciseListOrder), true, MyPlanConstants.coolDownExerciseListOrder);
        let completedCurrentIce = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.ice], 'Ice', PlanLogic.handleFindGoals([dailyPlanObj.ice]), true);
        let completedCurrentPostActiveRest = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.post_active_rest, 'Mobilize', PlanLogic.handleFindGoals(dailyPlanObj.post_active_rest, MyPlanConstants.postExerciseListOrder), true, MyPlanConstants.postExerciseListOrder);
        let beforeCompletedLockedModalities = _.concat(
            completedCWI,
            completedCoolDown,
            completedCurrentCWI,
            completedCurrentCoolDown,
            completedCurrentHeat,
            completedCurrentIce,
            completedCurrentPostActiveRest,
            completedCurrentPreActiveRest,
            completedCurrentWarmUp,
            completedHeat,
            completedIce,
            completedPostActiveRest,
            completedPreActiveRest,
            completedTrainingSessions,
            completedWarmUp,
        );
        beforeCompletedLockedModalities = _.orderBy(beforeCompletedLockedModalities, ['completed_date_time'], ['asc']);
        let activePreActiveRest = PlanLogic.addTitleToActiveModalitiesHelper(dailyPlanObj.pre_active_rest, 'Mobilize', 'within 4 hrs of training', MyPlanConstants.preExerciseListOrder, 'prepare', require('../../assets/images/standard/mobilize_tab.png'));
        let activeHeat = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.heat], 'Heat', 'within 30 min of training', false, 'heat', require('../../assets/images/standard/heat_tab.png'));
        let activeBeforeModalities = _.concat(activePreActiveRest, activeHeat);
        let activeCoolDown = PlanLogic.addTitleToActiveModalitiesHelper(dailyPlanObj.cool_down, 'Active Recovery', 'within 6 hrs of training', MyPlanConstants.coolDownExerciseListOrder, 'coolDown', require('../../assets/images/standard/active_recovery_tab.png'));
        let activePostActiveRest = PlanLogic.addTitleToActiveModalitiesHelper(dailyPlanObj.post_active_rest, 'Mobilize', 'anytime', MyPlanConstants.postExerciseListOrder, 'recover', require('../../assets/images/standard/mobilize_tab.png'));
        let activeIce = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.ice], 'Ice', 'after all training is complete', false, 'ice', require('../../assets/images/standard/ice_tab.png'));
        let activeCWI = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.cold_water_immersion], 'Cold Water Bath', 'after all training is complete', false, 'cwi', require('../../assets/images/standard/cwi_tab.png'));
        let activeAfterModalities = _.concat(activeCoolDown, activePostActiveRest, activeIce, activeCWI);
        let isReadinessSurveyCompleted = dailyPlanObj.daily_readiness_survey_completed;
        let offDaySelected = !dailyPlanObj.sessions_planned;
        let askForNewMobilize = (dailyPlanObj.train_later && (!dailyPlanObj.pre_active_rest[0] || dailyPlanObj.pre_active_rest[0].completed)) || (!dailyPlanObj.train_later && (!dailyPlanObj.post_active_rest[0] || dailyPlanObj.post_active_rest[0].completed));
        let noTriggerCoreLogic = !dailyPlanObj.heat && !dailyPlanObj.ice && !dailyPlanObj.cold_water_immersion && dailyPlanObj.cool_down.length === 0 && dailyPlanObj.pre_active_rest.length === 0 && dailyPlanObj.post_active_rest.length === 0;
        let firstTrigger = offDaySelected && noTriggerCoreLogic && filteredTrainingSessions.length === 0;
        let secondTrigger = noTriggerCoreLogic && filteredTrainingSessions.length > 0;
        let thirdTrigger = dailyPlanObj.train_later && noTriggerCoreLogic && filteredTrainingSessions.length === 0;
        let triggerStep = firstTrigger ?
            'Recovery isn\'t high priority today, but you can tap the "+" below for a recovery-focused Mobilize on demand.\n\nEnjoy your off day!'
            : secondTrigger ?
                'You should recover from this workout naturally, but you can tap the "+" for a recovery-focused Mobilize to go the extra mile!'
                : thirdTrigger ?
                    'You\'re well recovered so a Mobilize before you train isn\'t high priority, but you can tap the "+" below to add a recovery-focused Mobilize on demand!\n\nOtherwise tap the "+" to log your workout & we\'ll update your recovery recommendations accordingly!'
                    :
                    false;
        // logic to 'hide' before mobilize if after is active
        let indexOfLockedBeforeModality = _.findIndex(beforeCompletedLockedModalities, { isLocked: true, title: 'Mobilize', });
        let indexOfActiveAfterModality = _.findIndex(activeAfterModalities, { active: true, title: 'Mobilize', });
        if(indexOfLockedBeforeModality !== -1 && indexOfActiveAfterModality !== -1) {
            beforeCompletedLockedModalities = _.filter(beforeCompletedLockedModalities, (o, key) => key !== indexOfLockedBeforeModality);
        }
        let newInsights = [];
        if(dailyPlanObj.trends) {
            _.map(dailyPlanObj.trends.trend_categories, (alert, i) => {
                _.map(alert.plan_alerts, planAlert => {
                    if(alert.insight_type === planAlert.category) {
                        let newPlanAlert = _.cloneDeep(planAlert);
                        newPlanAlert.insight_type = planAlert.category;
                        newInsights.push(newPlanAlert);
                    }
                });
            });
        }
        let trendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.trend_categories ? dailyPlanObj.trends.trend_categories : [];
        let trendDashboardCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.dashboard && dailyPlanObj.trends.dashboard.trend_categories ? dailyPlanObj.trends.dashboard.trend_categories : [];
        let trainingSessionsIds = _.map(completedTrainingSessions, o => o.session_id);
        let sensorSessions = userObj && userObj.sensor_data && userObj.sensor_data.sessions ?
            userObj.sensor_data.sessions
            :
            [];
        sensorSessions = _.orderBy(sensorSessions, ['event_date'], ['asc']);
        sensorSessions = _.filter(sensorSessions, u => !trainingSessionsIds.includes(u.id) && (u.event_date && moment(u.event_date).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')));
        return {
            activeAfterModalities,
            activeBeforeModalities,
            askForNewMobilize,
            beforeCompletedLockedModalities,
            filteredTrainingSessions,
            isReadinessSurveyCompleted,
            newInsights,
            offDaySelected,
            sensorSessions,
            trendCategories,
            trendDashboardCategories,
            triggerStep,
        };
    },

    /**
      * Handle Bar Chart Render Logic
      * - Trends & TrendChild
      */
    // TODO: UNIT TEST ME
    handleBarChartRenderLogic: (plan, startSliceValue) => {
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : [];
        let trainingVolumeData = _.slice(trends.dashboard.training_volume_data, startSliceValue, trends.dashboard.training_volume_data.length);
        let data = [];
        _.map(trainingVolumeData, (tv, key) => {
            let obj = {};
            obj.label = tv.day_of_week;
            obj.svg = { fill: AppColors.zeplin.slateXLight, };
            obj.value = tv.training_volume;
            obj.sport_names = tv.sport_names;
            let filteredSport = tv.sport_names.length === 1 && _.filter(MyPlanConstants.teamSports, s => s.index === tv.sport_names[0])[0] ? _.filter(MyPlanConstants.teamSports, s => s.index === tv.sport_names[0])[0] : false;
            let hasMultipleSports = tv.sport_names.length > 1;
            obj.filteredSport = filteredSport;
            obj.hasMultipleSports = hasMultipleSports;
            data.push(obj);
        });
        return data;
    },

    /**
      * Handle Chart Title Render Logic
      * - Trends & TrendChild
      */
    // TODO: UNIT TEST ME
    handleChartTitleRenderLogic: (currentAlert, cardSubtitle, isToolTipOpen = false) => {
        let currentAlertText = false;
        if(currentAlert && currentAlert.visualization_title) {
            let visualizationTitle = currentAlert.visualization_title;
            if(!visualizationTitle.body_part_text[0] || visualizationTitle.body_part_text.length === 0) {
                return (<Text robotoRegular style={[cardSubtitle, isToolTipOpen && currentAlert.visualization_type === 5 ? {color: AppColors.white,} : {}]}>{visualizationTitle.text}</Text>);
            } else if(visualizationTitle.body_part_text[0] && visualizationTitle.body_part_text[0].length > 0 && visualizationTitle.text.length > 0) {
                let textRegEx = new RegExp(visualizationTitle.body_part_text.join('|'), 'g');
                let textMatchedArray = visualizationTitle.text.match(textRegEx);
                let splitTextArray = _.split(visualizationTitle.text, textRegEx);
                splitTextArray = _.remove(splitTextArray, o => o.length > 0);
                let stressMatchedColor = visualizationTitle.color === 0 ?
                    AppColors.zeplin.successLight
                    : visualizationTitle.color === 1 ?
                        AppColors.zeplin.warningLight
                        : visualizationTitle.color === 2 ?
                            AppColors.zeplin.errorLight
                            :
                            AppColors.zeplin.errorLight;
                if(!textMatchedArray) {
                    return (<Text robotoRegular style={[cardSubtitle, isToolTipOpen && currentAlert.visualization_type === 5 ? {color: AppColors.white,} : {}]}>{visualizationTitle.text}</Text>);
                }
                return (
                    <Text robotoRegular style={[cardSubtitle, isToolTipOpen && currentAlert.visualization_type === 5 ? {color: AppColors.white,} : {}]}>
                        {splitTextArray[0]}
                        <Text robotoBold style={[cardSubtitle, isToolTipOpen && currentAlert.visualization_type === 5 ? {color: AppColors.white,} : {color: stressMatchedColor,}]}>{textMatchedArray[0]}</Text>
                    </Text>
                );
            }

        }
        return currentAlertText;
    },

    /**
      * Handle Bar Chart Render Logic
      * - Trends
      */
    // TODO: UNIT TEST ME
    handleTrendsRenderLogic: (plan, os) => {
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : {};
        let currentStressAlert = trends && trends.stress && trends.stress.alerts && trends.stress.alerts.length > 0 ? trends.stress.alerts[0] : {};
        let currentResponseAlert = trends && trends.response && trends.response.alerts && trends.response.alerts.length > 0 ? trends.response.alerts[0] : {};
        let currentBiomechanicsAlert = trends && trends.biomechanics && trends.biomechanics.alerts && trends.biomechanics.alerts.length > 0 ? trends.biomechanics.alerts[0] : {};
        let bodyResponse = trends && trends.body_response ? trends.body_response : [];
        let currentBodyResponseAlert = trends && trends.body_response && trends.body_response.data && trends.body_response.data.length > 0 ? _.last(trends.body_response.data) : {};
        let workload = trends && trends.workload ? trends.workload : [];
        let biomechanicsAnklePitch = trends && trends.biomechanics_ankle_pitch ? trends.biomechanics_ankle_pitch : {};
        let biomechanicsApt = trends && trends.biomechanics_apt ? trends.biomechanics_apt : {};
        let currentWorkloadAlert = trends && trends.workload && trends.workload.data && trends.workload.data.length > 0 ? _.last(trends.workload.data) : {};
        let extraBottomPadding = os === 'android' ? AppSizes.paddingMed : AppSizes.iphoneXBottomBarPadding;
        let isBiomechanicsAnklePitchLocked = biomechanicsAnklePitch && biomechanicsAnklePitch.sessions && biomechanicsAnklePitch.sessions.length > 0 ? false : true;
        let isBiomechanicsAptLocked = biomechanicsApt && biomechanicsApt.sessions && biomechanicsApt.sessions.length > 0 ? false : true;
        let isBodyResponseLocked = trends && trends.body_response ? trends.body_response.lockout : true;
        let isResponseLocked = (currentResponseAlert.trigger_type || currentResponseAlert.trigger_type === 0) && currentResponseAlert.trigger_type >= 200;
        let isStressLocked = (currentStressAlert.trigger_type || currentStressAlert.trigger_type === 0) && (currentStressAlert.trigger_type === 25 || currentStressAlert.trigger_type >= 200);
        let isWorkloadLocked = trends && trends.workload ? trends.workload.lockout : true;
        let trendCategories = trends && trends.dashboard && trends.dashboard.trend_categories && trends.dashboard.trend_categories.length > 0 ? _.cloneDeep(trends.dashboard.trend_categories) : [];
        trendCategories.push({});
        return {
            biomechanicsAnklePitch,
            biomechanicsApt,
            bodyResponse,
            currentBiomechanicsAlert,
            currentBodyResponseAlert,
            currentResponseAlert,
            currentStressAlert,
            currentWorkloadAlert,
            extraBottomPadding,
            isBiomechanicsAnklePitchLocked,
            isBiomechanicsAptLocked,
            isBodyResponseLocked,
            isResponseLocked,
            isStressLocked,
            isWorkloadLocked,
            trendCategories,
            workload,
        };
    },

    /**
      * Handle Trend Child Render Logic
      * - TrendChild
      */
    // TODO: UNIT TEST ME
    handleTrendChildRenderLogic: (insightType, plan) => {
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.trend_categories ? dailyPlanObj.trends.trend_categories : [];
        let selectedTrendCategory = _.filter(trendCategories, ['insight_type', insightType]);
        let selectedTrends = _.map(selectedTrendCategory[0].trends, (trend, i) => {
            let newTrend = _.cloneDeep(trend);
            newTrend.key = i.toString();
            return newTrend;
        });
        selectedTrends = _.filter(selectedTrends, ['visible', true]);
        let dashboardTrendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.dashboard && dailyPlanObj.trends.dashboard.trend_categories && dailyPlanObj.trends.dashboard.trend_categories.length > 0 ? _.cloneDeep(dailyPlanObj.trends.dashboard.trend_categories) : [];
        let trendContextState = [];
        _.map(selectedTrends, trend => {
            let newObj = {};
            newObj.isCollapsed = true;
            newObj.isPaused = true;
            newObj.isVideoMuted = false;
            trendContextState.push(newObj);
        });
        let isFTECategoryModalOpen = (selectedTrendCategory && selectedTrendCategory[0] && selectedTrendCategory[0].first_time_experience && selectedTrendCategory[0].first_time_experience_modal) ? true : false;
        let fteModalData = {
            body:       isFTECategoryModalOpen ? selectedTrendCategory[0].first_time_experience_modal.body : '',
            categories: isFTECategoryModalOpen ? selectedTrendCategory[0].first_time_experience_modal.categories : [],
            title:      isFTECategoryModalOpen ? selectedTrendCategory[0].first_time_experience_modal.title : '',
            subtext:    isFTECategoryModalOpen ? selectedTrendCategory[0].first_time_experience_modal.subtext : '',
        };
        return {
            dashboardTrendCategories,
            fteModalData,
            isFTECategoryModalOpen,
            selectedTrendCategory,
            selectedTrends,
            trendContextState,
        };
    },

    /**
      * Handle Bar Chart Render Logic
      * - TrendChild
      */
    // TODO: UNIT TEST ME
    handleTrendChildItemRenderLogic: (props, selectedTrendCategory, selectedTrends, dashboardTrendCategories, trendContext, styles) => {
        let bodyParts = [];
        if(props && props.trend_data) {
            _.map(props.trend_data.visualization_data.plot_legends, plot => {
                let newPlotSeries = props.trend_data.data[0][plot.series] ?
                    _.map(props.trend_data.data[0][plot.series], plotSeries => {
                        let newObj = _.cloneDeep(plotSeries);
                        newObj.color = plot.color;
                        return newObj;
                    })
                    :
                    [];
                bodyParts = _.concat(bodyParts, newPlotSeries);
            });
        }
        let iconImage = require('../../assets/images/standard/view1icon.png');
        switch (props.icon) {
        case 'view1icon.png':
            iconImage = require('../../assets/images/standard/view1icon.png');
            break;
        case 'view3icon.png':
            iconImage = iconImage = require('../../assets/images/standard/view3icon.png');
            break;
        default:
            iconImage = require('../../assets/images/standard/view1icon.png');
        }
        const basePaddingBottom = Platform.OS === 'ios' ? (AppSizes.iphoneXBottomBarPadding + AppSizes.padding + AppSizes.padding) : AppSizes.padding;
        const dotHeight = 10;
        const dotsWrapperHeight = 16;
        const libraryPaginationSize = selectedTrends.length > 1 ? (16 + (AppSizes.isIphoneX ? 34 : 20) + dotHeight + dotsWrapperHeight) : 0;
        const style = {
            backgroundColor: AppColors.white,
            flexGrow:        1,
        };
        let parsedData = [];
        if(props && props.trend_data) {
            _.map(props.trend_data.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, styles.cardText, { color: PlanLogic.returnInsightColorString(prop.color), }];
                parsedData.push(newParsedData);
            });
        }
        let isCollapsed = trendContext[props.key].isCollapsed;
        let isPaused = trendContext[props.key].isPaused;
        let isVideoMuted = trendContext[props.key].isVideoMuted;
        let animatedValue = new Animated.Value(isCollapsed ? 1 : 0);
        Animated.timing(animatedValue, {
            duration: 300,
            toValue:  isCollapsed ? 0 : 1,
        }).start();
        const interpolateRotation = animatedValue.interpolate({
            inputRange:  [0, 1],
            outputRange: ['0deg', '180deg'],
        });
        const animatedStyle = {transform: [{rotate: interpolateRotation,}]};
        let trendContextProps = {
            animatedStyle,
            isCollapsed,
            isPaused,
            isVideoMuted,
        };
        let trendCategory = _.find(dashboardTrendCategories, ['insight_type', selectedTrendCategory.insight_type]);
        let trendCategoryTitle = trendCategory ? trendCategory.title : '';
        return {
            bodyParts,
            bottomPadding: (basePaddingBottom + libraryPaginationSize),
            iconImage,
            parsedData,
            style,
            trendCategoryTitle,
            trendContextProps,
        };
    },

    /**
      * Helper function to return chart data object when looking at DOMS
      * - PlanLogic
      */
    getDOMSBarChartData: (key, daysToAdd) => {
        return {
            fillColor:         AppColors.zeplin.slateXLight,
            filteredSport:     false,
            hasMultipleSports: false,
            key:               key,
            sport_names:       [],
            svg:               { fill: AppColors.zeplin.slateXLight, },
            value:             0,
            x:                 moment().add(daysToAdd, 'd').format('ddd'),
            y:                 0,
        };
    },

    /**
      * Handle Bar Chart Render Logic
      * - FathomCharts
      */
    // TODO: UNIT TEST ME
    handleFathomChartsRenderLogic: (currentAlertData, barData, type, legends, startSliceValue, visualizationData, containerWidth) => {
        // line data
        let fillColor = legends[0] && legends[0].color === 0 ?
            AppColors.zeplin.successLight
            : legends[0] && legends[0].color === 1 ?
                AppColors.zeplin.warningLight
                : legends[0] && legends[0].color === 2 ?
                    AppColors.zeplin.errorLight
                    :
                    AppColors.zeplin.slateXLight;
        let newLineData = _.slice(currentAlertData, startSliceValue, currentAlertData.length);
        let largestTVValue = _.maxBy(barData, 'value');
        largestTVValue = type === 4 ?
            largestTVValue && largestTVValue.value === 0 ?
                null
                : largestTVValue ?
                    largestTVValue.value
                    :
                    1
            :
            largestTVValue.value;
        // bar data
        let newBarData = _.map(barData, (data, key) => {
            let newObj = _.cloneDeep(data);
            newObj.svg = { fill: fillColor, };
            newObj.fillColor = fillColor;
            newObj.key = type === 4 ? (key - 3) : key;
            newObj.y = data.value;
            newObj.x = data.label;
            delete newObj.label;
            return newObj;
        });
        // custom cleanup
        let hasLeftAxis = (visualizationData && visualizationData.y_axis_1.length > 0);
        let hasRightAxis = (visualizationData && visualizationData.y_axis_2.length > 0);
        if(type === 4) {
            newBarData.push(PlanLogic.getDOMSBarChartData(4, 1));
            newBarData.push(PlanLogic.getDOMSBarChartData(5, 2));
            newBarData.push(PlanLogic.getDOMSBarChartData(6, 3));
            newBarData = _.slice(newBarData, 3, newBarData.length);
        }
        if(type === 5) {
            newLineData = _.map(newLineData, (data, key) => {
                let newObj = _.cloneDeep(data);
                let value = _.round(newObj.value);
                newObj.label = value;
                newObj.fillColor = value >= 50 ? AppColors.zeplin.successLight : value >= 25 && value <= 49 ? AppColors.zeplin.warningLight : AppColors.zeplin.errorLight;
                newObj.displayValue = value || null;
                newObj.value = _.round(((largestTVValue * value) / 100));
                return newObj;
            });
        }
        newLineData = _.map(newLineData, (data, key) => {
            let newObj = _.cloneDeep(data);
            let newValue = data.value && data.value > 0 ?
                type === 3 || type === 4 ?
                    largestTVValue ?
                        _.round(((largestTVValue * data.value) / 5))
                        :
                        data.value
                    :
                    data.value
                :
                null;
            newObj.key = key;
            newObj.y = newValue;
            newObj.x = data.day_of_week;
            delete newObj.label;
            return newObj;
        });
        // custom DOMs logic
        if(type === 4 &&newLineData[4].value === 0 && newLineData[4].y === null && newLineData[3].value === 1) {
            newLineData[4].y = 0;
        } else if(type === 4 &&newLineData[5].value === 0 && newLineData[5].y === null && newLineData[4].value === 1.6) {
            newLineData[5].y = 0;
        } else if(type === 4 &&newLineData[6].value === 0 && newLineData[6].y === null && newLineData[5].value === 1.75) {
            newLineData[6].y = 0;
        }
        let barWidth = newBarData.length === 14 ? AppSizes.paddingMed : AppSizes.padding;
        // return values
        return {
            barWidth,
            hasLeftAxis,
            hasRightAxis,
            lineChartData:  type === 3 || type === 4 || type === 5 ? newLineData : [],
            lineChartColor: fillColor,
            updatedBarData: newBarData,
        };
    },

    /**
      * Handle Workload Session Render Logic
      * - Insights
      */
    // TODO: UNIT TEST ME
    handleWorkloadSessionRenderLogic: session => {
        let source = session.source;
        let sessionName = _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name);
        let distance = session.distance;
        let duration = source === 1 ?
            `${moment(session.event_date.replace('Z', '')).format('hh:mma')}, ${SensorLogic.convertMinutesToHrsMins(session.duration, true)}`
            :
            `${SensorLogic.convertMinutesToHrsMins(session.duration, true)}`;
        let rpe = _.filter(MyPlanConstants.postSessionFeel, scale => scale.value === session.RPE)[0] ?
            _.filter(MyPlanConstants.postSessionFeel, scale => scale.value === session.RPE)[0].workoutLabel
            :
            '';
        let trainingVolume = `${_.round(session.training_volume, 1)} Load Units`;
        return {
            distance,
            duration,
            imageSource: sessionName.imagePath,
            rpe,
            source,
            sportTitle:  sessionName.label.toUpperCase(),
            trainingVolume,
        }
    },

    /**
      * Handle Trends Title Render Logic
      * - Trends & Insights
      */
    // TODO: UNIT TEST ME
    handleTrendsTitleRenderLogic: (subtitleBoldedText, subtitleText) => {
        let cleanedText = false;
        if(subtitleBoldedText.length > 0 && subtitleText.length > 0) {
            let textRegEx = new RegExp(subtitleBoldedText.join('|'), 'g');
            let textMatchedArray = subtitleText.match(textRegEx);
            let splitTextArray = _.split(subtitleText, textRegEx);
            splitTextArray = _.remove(splitTextArray, o => o.length > 0);
            if(!textMatchedArray) {
                cleanedText = (<Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{subtitleText}</Text>);
            } else {
                if(splitTextArray.length === 2 && textMatchedArray.length === 1) {
                    cleanedText = (
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                            {splitTextArray[0]}
                            <Text robotoBold style={{color: AppColors.zeplin.splashLight,}}>{textMatchedArray[0]}</Text>
                            {splitTextArray[1]}
                        </Text>
                    );
                } else if(splitTextArray.length === 3 && textMatchedArray.length === 2) {
                    cleanedText = (
                        <Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>
                            {splitTextArray[0]}
                            <Text robotoBold style={{color: AppColors.zeplin.splashLight,}}>{textMatchedArray[0]}</Text>
                            {splitTextArray[1]}
                            <Text robotoBold style={{color: AppColors.zeplin.splashLight,}}>{textMatchedArray[1]}</Text>
                            {splitTextArray[2]}
                        </Text>
                    );
                } else {
                    cleanedText = (<Text robotoRegular style={{color: AppColors.zeplin.slateLight, fontSize: AppFonts.scaleFont(12),}}>{subtitleText}</Text>);
                }
            }
        }
        return cleanedText;
    },

    /**
      * Handle Trend Render Logic
      * - Trends & Insights
      */
    handleTrendRenderLogic: currentAlert => {
        if(!currentAlert || !currentAlert.status) {
            return {
                icon:          false,
                iconType:      false,
                subtitleColor: AppColors.zeplin.errorLight,
                sportName:     false,
            };
        }
        let subtitleColor = PlanLogic.returnInsightColorString(currentAlert.status.color);
        let icon = currentAlert.status.icon;
        let iconType = currentAlert.status.icon_type;
        let sessionName = _.find(MyPlanConstants.teamSports, o => o.index === currentAlert.status.sport_name);
        let imageSource = sessionName ? sessionName.imagePath : false;
        let sportName =  sessionName ? sessionName.label.toUpperCase() : false;
        return {
            icon,
            iconType,
            imageSource,
            subtitleColor,
            sportName,
        };
    },

    /**
      * Handle Insights Charts Render Logic
      * - InsightsCharts
      */
    // TODO: UNIT TEST ME
    handleInsightsChartsRenderLogic: (currentAlert, data) => {
        let barWidth = data.length === 14 ? AppSizes.paddingMed : AppSizes.padding;
        let hasLeftAxis = (currentAlert.visualization_data && currentAlert.visualization_data.y_axis_1.length > 0);
        let hasRightAxis = (currentAlert.visualization_data && currentAlert.visualization_data.y_axis_2.length > 0);
        let updatedBarData = [];
        let currentLineGraphData = { pain: [], soreness: [], };
        if(currentAlert.visualization_type === 8 || currentAlert.visualization_type === 9) {
            updatedBarData = _.map(data, (d, i) => {
                let filteredSport = d.sessions.length === 1 ? _.filter(MyPlanConstants.teamSports, s => s.index === d.sessions[0].sport_name)[0] : false;
                let hasMultipleSports = d.sessions.length > 1;
                let newObj = {};
                newObj.fillColor = PlanLogic.returnInsightColorString(currentAlert.status ? currentAlert.status.color : d.status.color);
                newObj.filteredSport = filteredSport;
                newObj.hasMultipleSports = hasMultipleSports;
                newObj.key = i;
                newObj.sessions = d.sessions;
                newObj.x = d.day_of_week;
                newObj.y = d.value;
                return newObj;
            });
            updatedBarData = currentAlert.visualization_type === 8  && updatedBarData.length === 14 ?
                _.slice(updatedBarData, 7, updatedBarData.length)
                :
                updatedBarData;
        } else {
            let painLineGraphData = _.map(data, (d, i) => {
                let newObj = {};
                newObj.color = PlanLogic.returnInsightColorString(6);
                newObj.key = i;
                newObj.x = d.day_of_week;
                newObj.y = d.pain_value && d.pain_value > 0 ? d.pain_value : null;
                // Platform.OS === 'ios' ?
                //     d.pain_value && d.pain_value > 0 ? d.pain_value : null
                //     :
                //     d.pain_value;
                return newObj;
            });
            let sorenessLineGraphData = _.map(data, (d, i) => {
                let newObj = {};
                newObj.color = PlanLogic.returnInsightColorString(5);
                newObj.key = i;
                newObj.x = d.day_of_week;
                newObj.y = d.soreness_value && d.soreness_value > 0 ? d.soreness_value : null;
                // Platform.OS === 'ios' ?
                //     d.soreness_value && d.soreness_value > 0 ? d.soreness_value : null
                //     :
                //     d.soreness_value;
                return newObj;
            });
            currentLineGraphData.pain = painLineGraphData;
            currentLineGraphData.soreness = sorenessLineGraphData;
        }
        updatedBarData = updatedBarData.length > 7 ? _.slice(updatedBarData, 7, updatedBarData.length) : updatedBarData;
        currentLineGraphData.pain = currentLineGraphData.pain.length > 7 ? _.slice(currentLineGraphData.pain, 7, currentLineGraphData.pain.length) : currentLineGraphData.pain;
        currentLineGraphData.soreness = currentLineGraphData.soreness.length > 7 ? _.slice(currentLineGraphData.soreness, 7, currentLineGraphData.soreness.length) : currentLineGraphData.soreness;
        return {
            barWidth,
            currentLineGraphData,
            hasLeftAxis,
            hasRightAxis,
            updatedBarData,
        };
    },

    /**
      * Handle Insight Render Logic
      * - Insight
      */
    handleInsightRenderLogic: (currentAlert, currentDataIndex, insightType) => {
        let insightTitle = insightType === 7 ? 'BODY RESPONSE' : insightType === 8 ? 'WORKOUTS' : 'BIOMECHANICS';
        let showRightDateButton = currentDataIndex !== (currentAlert.data.length - 1);
        let showLeftDateButton = currentDataIndex > 0 && currentDataIndex < 7;
        let selectedDate = currentAlert.data[currentDataIndex] ? moment(currentAlert.data[currentDataIndex].date, 'YYYY-MM-DD').format('ddd. MMM Do') : '';
        let sessions = currentAlert.data[currentDataIndex] ? currentAlert.data[currentDataIndex].sessions : [];
        let cardTitle = insightType === 7 ? 'DAILY SUMMARY' : insightType === 8 ? 'DAILY SUMMARY' : '';
        return {
            cardTitle,
            insightTitle,
            selectedDate,
            sessions,
            showLeftDateButton,
            showRightDateButton,
        };
    },

    /**
      * Handle Body Overlay Render Logic
      * - BodyOverlay
      */
    handleBodyOverlayRenderLogic: (bodyParts, _getImageString) => {
        let frontBodyParts = _.filter(MyPlanConstants.bodyPartMapping, o => o.front === true);
        let backBodyParts = _.filter(MyPlanConstants.bodyPartMapping, o => o.front === false);
        let filteredFrontBodyParts = _.flatten(
            _.map(bodyParts, bodyPart => {
                let filteredBodyPart = _.filter(frontBodyParts, o => bodyPart.body_part ? o.index === bodyPart.body_part : o.index === bodyPart.body_part_location);
                if(filteredBodyPart.length > 0) {
                    let updatedBodyPart = _.cloneDeep(filteredBodyPart[0]);
                    updatedBodyPart.imageSource = _getImageString(updatedBodyPart.image[bodyPart.side]);
                    updatedBodyPart.tintColor = PlanLogic.returnBodyOverlayColorString(bodyPart.value, bodyPart.pain, bodyPart.color);
                    return updatedBodyPart;
                }
                return [];
            })
        );
        let filteredBackBodyParts = _.flatten(
            _.map(bodyParts, bodyPart => {
                let filteredBodyPart = _.filter(backBodyParts, o => bodyPart.body_part ? o.index === bodyPart.body_part : o.index === bodyPart.body_part_location);
                if(filteredBodyPart.length > 0) {
                    let updatedBodyPart = _.cloneDeep(filteredBodyPart[0]);
                    updatedBodyPart.imageSource = _getImageString(updatedBodyPart.image[bodyPart.side]);
                    updatedBodyPart.tintColor = PlanLogic.returnBodyOverlayColorString(bodyPart.value, bodyPart.pain, bodyPart.color);
                    return updatedBodyPart;
                }
                return [];
            })
        );
        return {
            filteredBackBodyParts,
            filteredFrontBodyParts,
        };
    },

    /**
      * Handle Biomechanics APT Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsAptRenderLogic: (plan, currentIndex, step) => {
        let pieWrapperWidth = (AppSizes.screen.width - (AppSizes.paddingMed * 2));
        let pieLeftWrapperWidth = (pieWrapperWidth * 0.55);
        let pieRightWrapperWidth = (pieWrapperWidth * 0.45);
        let leftPieWidth = (pieLeftWrapperWidth - 35);
        let leftPieInnerRadius = ((leftPieWidth * 99) / 350);
        let rightPieWidth = pieLeftWrapperWidth;
        let rightPieInnerRadius = ((rightPieWidth * 125) / 400);
        let extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : 20;
        rightPieInnerRadius = (rightPieInnerRadius - extraInnerRadiusToRemove);
        if(currentIndex === -1) {
            return {
                leftPieInnerRadius,
                leftPieWidth,
                pieData:            { right_y: 0, right_start_angle: 0, left_y: 0, left_start_angle: 0, },
                pieLeftWrapperWidth,
                pieRightWrapperWidth,
                rightPieInnerRadius,
                rightPieWidth,
                selectedAptSession: {},
            };
        }
        let dailyPlan = plan && plan.dailyPlan && plan.dailyPlan[0] ? plan.dailyPlan[0] : false;
        let biomechanicsAptSummary = dailyPlan ? dailyPlan.trends.biomechanics_apt : {};
        let selectedAptSession = biomechanicsAptSummary.sessions[currentIndex];
        let sessionSportName = selectedAptSession ? _.find(MyPlanConstants.teamSports, o => o.index === selectedAptSession.sport_name).label : '';
        let sessionHours = _.floor(selectedAptSession.duration / 3600);
        let updatedTime = selectedAptSession.duration - sessionHours * 3600;
        let sessionMinutes = _.floor(updatedTime / 60);
        let sessionSeconds = (new Array(2 + 1).join('0') + (updatedTime - sessionMinutes * 60)).slice(-2);
        let sessionStartTimeDuration = selectedAptSession ? `${moment(selectedAptSession.event_date_time.replace('Z', '')).format('h:mma')}, ${sessionHours > 0 ? `${sessionHours}hr ` : ''}${sessionMinutes}min` : '';
        let sessionDuration = `${sessionHours > 0 ? `${sessionHours}:` : ''}${sessionMinutes === 0 ? '00' : sessionHours > 0 && sessionMinutes < 10 ? `0${sessionMinutes}` : sessionMinutes}:${sessionSeconds === 0 ? '00' : sessionSeconds}`;
        let pieData = selectedAptSession.asymmetry.apt.summary_data;
        let chartData = selectedAptSession.asymmetry.apt.detail_data;
        let updatedChartData = _.map(chartData, (data, index) => {
            let newDataObjLeft = {};
            newDataObjLeft.x = data.x;
            newDataObjLeft.y = data.y1;
            newDataObjLeft.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 8 : 10);
            let newDataObjRight = {};
            newDataObjRight.x = data.x;
            newDataObjRight.y = data.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 9 : 4);
            return [newDataObjLeft, newDataObjRight];
        });
        let parsedData = [];
        if(
            selectedAptSession &&
            selectedAptSession.asymmetry &&
            selectedAptSession.asymmetry.apt &&
            selectedAptSession.asymmetry.apt.detail_text
        ) {
            _.map(selectedAptSession.asymmetry.apt.detail_bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(` ${prop.text} `, 'i');
                let sessionColor = _.toInteger(selectedAptSession.asymmetry.apt.detail_bold_side) === 1 ?
                    10
                    : _.toInteger(selectedAptSession.asymmetry.apt.detail_bold_side) === 2 ?
                        4
                        :
                        13;
                newParsedData.style = [AppStyles.robotoBold, { color: PlanLogic.returnInsightColorString(sessionColor), }];
                parsedData.push(newParsedData);
            });
        }
        return {
            leftPieInnerRadius,
            leftPieWidth,
            parsedData,
            pieData,
            pieLeftWrapperWidth,
            pieRightWrapperWidth,
            rightPieInnerRadius,
            rightPieWidth,
            selectedAptSession,
            sessionDuration,
            sessionSportName,
            sessionStartTimeDuration,
            sessions:         biomechanicsAptSummary.sessions,
            updatedChartData: _.flatten(updatedChartData),
        };
    },

    /**
      * Handle Biomechanics Ankle Pitch Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsAnklePitchRenderLogic: (plan, currentIndex, step) => {
        let pieWrapperWidth = (AppSizes.screen.width - (AppSizes.paddingMed * 2));
        let pieLeftWrapperWidth = (pieWrapperWidth * 0.55);
        let pieRightWrapperWidth = (pieWrapperWidth * 0.45);
        let leftPieWidth = (pieLeftWrapperWidth - 35);
        let leftPieInnerRadius = ((leftPieWidth * 99) / 350);
        let rightPieWidth = pieLeftWrapperWidth;
        let rightPieInnerRadius = ((rightPieWidth * 125) / 400);
        let extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : 20;
        rightPieInnerRadius = (rightPieInnerRadius - extraInnerRadiusToRemove);
        if(currentIndex === -1) {
            return {
                leftPieInnerRadius,
                leftPieWidth,
                pieLeftWrapperWidth,
                pieRightWrapperWidth,
                rightPieInnerRadius,
                rightPieWidth,
                selectedAnklePitchSession: {},
            };
        }
        let dailyPlan = plan && plan.dailyPlan && plan.dailyPlan[0] ? plan.dailyPlan[0] : false;
        let biomechanicsAnklePitchSummary = dailyPlan ? dailyPlan.trends.biomechanics_ankle_pitch : {};
        let selectedAnklePitchSession = biomechanicsAnklePitchSummary && biomechanicsAnklePitchSummary.sessions[currentIndex];
        let sessionSportName = selectedAnklePitchSession ? _.find(MyPlanConstants.teamSports, o => o.index === selectedAnklePitchSession.sport_name).label : '';
        let sessionHours = _.floor(selectedAnklePitchSession.duration / 3600);
        let updatedTime = selectedAnklePitchSession.duration - sessionHours * 3600;
        let sessionMinutes = _.floor(updatedTime / 60);
        let sessionSeconds = (new Array(2 + 1).join('0') + (updatedTime - sessionMinutes * 60)).slice(-2);
        let sessionStartTimeDuration = selectedAnklePitchSession ? `${moment(selectedAnklePitchSession.event_date_time.replace('Z', '')).format('h:mma')}, ${sessionHours > 0 ? `${sessionHours}hr ` : ''}${sessionMinutes}min` : '';
        let sessionDuration = `${sessionHours > 0 ? `${sessionHours}:` : ''}${sessionMinutes === 0 ? '00' : sessionHours > 0 && sessionMinutes < 10 ? `0${sessionMinutes}` : sessionMinutes}:${sessionSeconds === 0 ? '00' : sessionSeconds}`;
        let pieData = selectedAnklePitchSession.asymmetry.ankle_pitch.summary_data;
        let chartData = selectedAnklePitchSession.asymmetry.ankle_pitch.detail_data;
        let updatedChartData = _.map(chartData, (data, index) => {
            let newDataObjLeft = {};
            newDataObjLeft.x = data.x;
            newDataObjLeft.y = data.y1;
            newDataObjLeft.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 8 : 10);
            let newDataObjRight = {};
            newDataObjRight.x = data.x;
            newDataObjRight.y = data.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 9 : 4);
            return [newDataObjLeft, newDataObjRight];
        });
        let parsedData = [];
        if(
            selectedAnklePitchSession &&
            selectedAnklePitchSession.asymmetry &&
            selectedAnklePitchSession.asymmetry.ankle_pitch &&
            selectedAnklePitchSession.asymmetry.ankle_pitch.detail_text
        ) {
            _.map(selectedAnklePitchSession.asymmetry.ankle_pitch.detail_bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(` ${prop.text} `, 'i');
                let sessionColor = _.toInteger(selectedAnklePitchSession.asymmetry.ankle_pitch.detail_bold_side) === 1 ?
                    10
                    : _.toInteger(selectedAnklePitchSession.asymmetry.ankle_pitch.detail_bold_side) === 2 ?
                        4
                        :
                        13;
                newParsedData.style = [AppStyles.robotoBold, { color: PlanLogic.returnInsightColorString(sessionColor), }];
                parsedData.push(newParsedData);
            });
        }
        return {
            leftPieInnerRadius,
            leftPieWidth,
            parsedData,
            pieData,
            pieLeftWrapperWidth,
            pieRightWrapperWidth,
            rightPieInnerRadius,
            rightPieWidth,
            sessionDuration,
            sessionSportName,
            sessionStartTimeDuration,
            selectedAnklePitchSession,
            sessions:         biomechanicsAnklePitchSummary.sessions,
            updatedChartData: _.flatten(updatedChartData),
        };
    },

    /**
      * Handle Biomechanics Selected Session Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsSelectedSessionRenderLogic: (selectedSession, dataType) => {
        let biomechanicsAlertText = '';
        let parsedBiomechanicsData = [];
        let sessionSport = false;
        let sessionColor = 11;
        if(
            selectedSession &&
            selectedSession.asymmetry &&
            (
                (dataType === 0 && selectedSession.asymmetry.apt) ||
                (dataType === 1 && selectedSession.asymmetry.ankle_pitch)
            )
        ) {
            sessionColor = _.toInteger(dataType === 0 ? selectedSession.asymmetry.apt.summary_side : selectedSession.asymmetry.ankle_pitch.summary_side) === 1 ?
                10
                : _.toInteger(dataType === 0 ? selectedSession.asymmetry.apt.summary_side : selectedSession.asymmetry.ankle_pitch.summary_side) === 2 ?
                    4
                    :
                    11;
            sessionSport = selectedSession && _.find(MyPlanConstants.teamSports, o => o.index === selectedSession.sport_name);
            biomechanicsAlertText = dataType === 0 ? `${selectedSession.asymmetry.apt.summary_percentage === '' ? '' : `${selectedSession.asymmetry.apt.summary_percentage}%`} ${selectedSession.asymmetry.apt.summary_text}` : `${selectedSession.asymmetry.ankle_pitch.summary_percentage === '' ? '' : `${selectedSession.asymmetry.ankle_pitch.summary_percentage}%`} ${selectedSession.asymmetry.ankle_pitch.summary_text}`;
            let boldedText = dataType === 0 ? selectedSession.asymmetry.apt.summary_bold_text : selectedSession.asymmetry.ankle_pitch.summary_bold_text;
            boldedText.push({color: null, text: `${dataType === 0 ? selectedSession.asymmetry.apt.summary_percentage : selectedSession.asymmetry.ankle_pitch.summary_percentage}% more`});
            _.map(boldedText, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, { color: PlanLogic.returnInsightColorString(sessionColor), }];
                parsedBiomechanicsData.push(newParsedData);
            });
        }
        return {
            biomechanicsAlertText,
            parsedBiomechanicsData,
            sessionColor,
            sessionSport,
        };
    },

    /**
      * Handle Biomechanics Charts Render Logic
      * - BiomechanicsCharts
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsChartsRenderLogic: (pieData, selectedSession, isRichDataView, chartData, dataType) => {
        const asymmetryIndex = dataType === 0 ? 'apt' : 'ankle_pitch';
        const APT_CHART_TOTAL = 60;
        let newPieData = _.cloneDeep(pieData);
        const emptyPieData = [
            {color: AppColors.transparent, x: 0, y: 0,},
            {color: AppColors.transparent, x: 0, y: 0,},
        ];
        let largerPieData = emptyPieData;
        let smallerPieData = emptyPieData;
        let rotateDeg = '0deg';
        let richDataYDomain = [-10, 10];
        if(isRichDataView) {
            let maxChartObj = _.maxBy(chartData, o => o.y < 0 ? (o.y * -1) : o.y);
            let maxDomain = maxChartObj ?
                maxChartObj.y < 0 ? (maxChartObj.y * -1) : maxChartObj.y
                :
                10;
            maxDomain = _.round(maxDomain % 2 === 0 ? maxDomain : (maxDomain + 1));
            maxDomain = maxDomain % 2 === 0 ? maxDomain : (maxDomain + 1);
            return {
                asymmetryIndex,
                largerPieData,
                richDataYDomain: [-maxDomain, maxDomain],
                rotateDeg,
                smallerPieData,
            };
        }
        const isLeftDataEmpty = newPieData.left_y === 0;
        const isRightDataEmpty = newPieData.right_y === 0;
        if(!isLeftDataEmpty && !isRightDataEmpty) {
            if(dataType === 0) {
                if(_.toInteger(selectedSession.asymmetry[asymmetryIndex].summary_side) === 0 || (newPieData.right_y === newPieData.left_y)) {
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(newPieData.right_y, newPieData.left_y, false, APT_CHART_TOTAL, true);
                    smallerPieData = emptyPieData;
                    rotateDeg = `${(100 - (3 * newPieData.right_y))}deg`;
                } else if(newPieData.left_y > newPieData.right_y) {
                    let ratio = (newPieData.left_y / newPieData.right_y);
                    newPieData.right_y = 5;
                    newPieData.left_y  = (5 * ratio);
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(newPieData.left_y, newPieData.right_y, true, APT_CHART_TOTAL);
                    smallerPieData = PlanLogic.returnPieChartAptCleanedData(newPieData.right_y, newPieData.left_y, false, APT_CHART_TOTAL);
                    rotateDeg = `${(100 - (3 * newPieData.left_y))}deg`;
                } else if((newPieData.right_y === newPieData.left_y) || (newPieData.right_y > newPieData.left_y)) {
                    let ratio = (newPieData.right_y / newPieData.left_y);
                    newPieData.left_y = 5;
                    newPieData.right_y = (5 * ratio);
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(newPieData.right_y, newPieData.left_y, false, APT_CHART_TOTAL);
                    smallerPieData = PlanLogic.returnPieChartAptCleanedData(newPieData.left_y, newPieData.right_y, true, APT_CHART_TOTAL);
                    rotateDeg = `${(100 - (3 * newPieData.right_y))}deg`;
                }
            } else {
                const ANKLE_PITCH_CHART_RATIO = _.toInteger(selectedSession.asymmetry[asymmetryIndex].summary_side) === 0 || (newPieData.right_y === newPieData.left_y) ?
                    40
                    :
                    360;
                if(_.toInteger(selectedSession.asymmetry[asymmetryIndex].summary_side) === 0 || (newPieData.right_y === newPieData.left_y)) {
                    let largerValue = ((100 * newPieData.right_y) / ANKLE_PITCH_CHART_RATIO);
                    largerPieData = [
                        { color: AppColors.zeplin.successLight, x: 0, y: newPieData.right_y, },
                        { color: AppColors.transparent, x: 1, y: largerValue, },
                    ];
                    smallerPieData = emptyPieData;
                } else if(newPieData.left_y > newPieData.right_y) {
                    let largerValue = newPieData.left_y;
                    let smallerValue = newPieData.right_y;
                    let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                    let smallerFullValue = (ANKLE_PITCH_CHART_RATIO - smallerValue);
                    largerPieData = [
                        { color: AppColors.zeplin.purpleLight, x: 0, y: largerValue, },
                        { color: AppColors.transparent, x: 1, y: largerFullValue, },
                    ];
                    smallerPieData = [
                        { color: AppColors.zeplin.splashLight, x: 0, y: smallerValue, },
                        { color: AppColors.transparent, x: 1, y: smallerFullValue, },
                    ];
                } else if((newPieData.right_y === newPieData.left_y) || (newPieData.right_y > newPieData.left_y)) {
                    let largerValue = newPieData.right_y;
                    let smallerValue = newPieData.left_y;
                    let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                    let smallerFullValue = (ANKLE_PITCH_CHART_RATIO - smallerValue);
                    largerPieData = [
                        { color: AppColors.zeplin.splashLight, x: 0, y: largerValue, },
                        { color: AppColors.transparent, x: 1, y: largerFullValue, },
                    ];
                    smallerPieData = [
                        { color: AppColors.zeplin.purpleLight, x: 0, y: smallerValue, },
                        { color: AppColors.transparent, x: 1, y: smallerFullValue, },
                    ];
                }
            }
        }
        let parsedSummaryData = [];
        if(selectedSession && selectedSession.asymmetry && selectedSession.asymmetry[asymmetryIndex]) {
            _.map(selectedSession.asymmetry[asymmetryIndex].summary_bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                let sessionColor = _.toInteger(selectedSession.asymmetry[asymmetryIndex].summary_side) === 1 ?
                    10
                    : _.toInteger(selectedSession.asymmetry[asymmetryIndex].summary_side) === 2 ?
                        4
                        :
                        null;
                newParsedData.style = [AppStyles.robotoBold, { color: PlanLogic.returnInsightColorString(sessionColor), }];
                parsedSummaryData.push(newParsedData);
            });
        }
        return {
            asymmetryIndex,
            largerPieData,
            parsedSummaryData,
            richDataYDomain,
            rotateDeg: dataType === 0 ? rotateDeg : '150deg',
            smallerPieData,
        };
    },

    returnPieChartAptCleanedData: (y, otherY, isLeft, total, isSymmetry) => {
        let color = isSymmetry ?
            AppColors.zeplin.successLight
            :
            isLeft ?
                AppColors.zeplin.purpleLight
                :
                AppColors.zeplin.splashLight;
        if(y < otherY) {
            return [
                {color: AppColors.transparent, x: 0, y: ((otherY - y) / 2),},
                {color: color, x: 1, y: y,},
                {color: AppColors.transparent, x: 2, y: (total - (y + ((otherY - y) / 2))),},
            ];
        }
        return [
            {color: color, x: 0, y: y,},
            {color: AppColors.transparent, x: 1, y: (total - y),},
        ];
    },

    returnBodyOverlayColorString: (value, isPain, color) => {
        if(color) {
            return PlanLogic.returnInsightColorString(color);
        }
        return isPain === true ?
            value === 3 ?
                AppColors.bodyOverlay.painSevere
                : value === 2 ?
                    AppColors.bodyOverlay.painMod
                    :
                    AppColors.bodyOverlay.painMild
            :
            value === 3 ?
                AppColors.bodyOverlay.sorenessSevere
                : value === 2 ?
                    AppColors.bodyOverlay.sorenessMod
                    :
                    AppColors.bodyOverlay.sorenessMild;
    },

    returnInsightColorString: color => {
        return color === 1 ?
            AppColors.zeplin.warningLight
            : color === 2 ?
                AppColors.zeplin.errorLight
                : color === 3 ?
                    AppColors.zeplin.slateXLight
                    : color === 4 ?
                        AppColors.zeplin.splashLight
                        : color === 5 ?
                            AppColors.zeplin.warningLight
                            : color === 6 ?
                                AppColors.zeplin.errorLight
                                : color === 7 ?
                                    AppColors.zeplin.splashXLight
                                    : color === 8 ?
                                        `${AppColors.zeplin.purpleLight}${PlanLogic.returnHexOpacity(0.3)}`
                                        : color === 9 ?
                                            `${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.3)}`
                                            : color === 10 ?
                                                AppColors.zeplin.purpleLight
                                                : color === 11 ?
                                                    AppColors.zeplin.slateLight
                                                    : color === 12 ?
                                                        AppColors.zeplin.slate
                                                        : color === 13 ?
                                                            AppColors.zeplin.successLight
                                                            : color === 14 ?
                                                                `${AppColors.zeplin.splash}${PlanLogic.returnHexOpacity(0.5)}`
                                                                :
                                                                AppColors.zeplin.errorLight;
    },

    returnStubBiomechanicsTrend: () => {
        let biomechanics = {};
        biomechanics.visualization_type = 9;
        biomechanics.visualization_data = { plot_legends: [], y_axis_1: '', y_axis_2: '', };
        let dataArray = [];
        for (let i = 0; i < 14; i += 1) {
            let dayOfWeek = moment().subtract((14 - i), 'days').format('ddd');
            dataArray.push({
                status:      {bolded_text: [], color: 4, icon: null, icon_type: null, sport_name: null, text: ''},
                sessions:    [],
                day_of_week: dayOfWeek,
                value:       0,
            });
        }
        biomechanics.data = dataArray;
        return biomechanics;
    },

    returnHexOpacity: (opacity = 1) => {
        let alpha = Math.round(opacity * 255);
        let hex = (alpha + 0x10000).toString(16).substr(-2).toUpperCase();
        return hex;
    },

    /**
      * Handle Single Sensor Session Card Render Logic
      * - MyPlan
      */
    // TODO: UNIT TEST ME
    handleSingleSensorSessionCardRenderLogic: (activity, userSesnorData) => {
        let networkName = userSesnorData && userSesnorData.sensor_networks && userSesnorData.sensor_networks[0] ? userSesnorData.sensor_networks[0] : false;
        let activityStatus =  activity.status === 'CREATE_COMPLETE' && !activity.end_date ?
            activity.status
            : networkName ?
                activity.status
                :
                'NO_WIFI_SETUP';
        let title =  activityStatus === 'PROCESSING_COMPLETE' ?
            'Analysis Complete'
            : activityStatus === 'UPLOAD_IN_PROGRESS' ?
                'Uploading Workout...'
                : activityStatus === 'UPLOAD_PAUSED' ?
                    'Upload paused'
                    : activityStatus === 'PROCESSING_IN_PROGRESS' ?
                        'Analyzing Workout...'
                        : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'CALIBRATION' ?
                            'Calibration error'
                            : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'PLACEMENT' ?
                                'Placement error'
                                : activityStatus === 'CREATE_COMPLETE' && !activity.end_date ?
                                    false
                                    : activityStatus === 'NO_WIFI_SETUP' ?
                                        'Finish PRO Kit Setup'
                                        : activityStatus === 'CREATE_COMPLETE' && activity.end_date ?
                                            'Workout Complete'
                                            : activityStatus === 'NO_DATA' ?
                                                'No workout data found'
                                                : activityStatus === 'TOO_SHORT' ?
                                                    'Workout too short'
                                                    :
                                                    'Analysis failed';
        let iconName = (activityStatus === 'PROCESSING_COMPLETE') || ( activityStatus === 'CREATE_COMPLETE' && !activity.end_date) ?
            false
            : activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'PROCESSING_IN_PROGRESS' ?
                'sync'
                :
                'alert-circle-outline';
        let iconType = (activityStatus === 'PROCESSING_COMPLETE') || ( activityStatus === 'CREATE_COMPLETE' && !activity.end_date) ?
            false
            : activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'PROCESSING_IN_PROGRESS' ?
                'material'
                :
                'material-community';
        let iconColor = activityStatus === 'PROCESSING_COMPLETE' ? AppColors.zeplin.splashLight : AppColors.zeplin.slateXLight;
        let actionText = activityStatus === 'UPLOAD_IN_PROGRESS' || activityStatus === 'UPLOAD_PAUSED' || activityStatus === 'PROCESSING_IN_PROGRESS' ?
            'Tap to refresh'
            : activityStatus === 'PROCESSING_FAILED' && (activity.cause_of_failure === 'CALIBRATION' || activity.cause_of_failure === 'PLACEMENT') ?
                'Tap to access tutorial'
                : activityStatus === 'NO_DATA' ?
                    false // 'Tap to Contact Fathom'
                    : (activityStatus === 'CREATE_COMPLETE' && activity.end_date) ?
                        'Tap to refresh'
                        :
                        false;
        let subtext = activityStatus === 'UPLOAD_PAUSED' ?
            ['Return your Kit to wifi network ', networkName, ' to finish uploading.']
            : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'CALIBRATION' ?
                'We can\'t analyze this data because you may have missed a step in calibration. Tap to review calibration for next time.'
                : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'PLACEMENT' ?
                    'We can\'t analyze this data because your sensors were in the wrong position. Tap to review placement for next time.'
                    : activityStatus === 'PROCESSING_FAILED' && activity.cause_of_failure === 'ERROR' ?
                        'Something went wrong in analyzing this workout. Our team will take a look and will try to fix the problem!'
                        : activityStatus === 'NO_WIFI_SETUP' ?
                            'Bring your Fathom PRO kit in range of your home wifi network to connect wifi and upload your workout.'
                            : activityStatus === 'TOO_SHORT' ?
                                'Unfortunately, workouts less than 5 min long don\'t have enough data to properly process.'
                                : activityStatus === 'NO_DATA' ?
                                    'We did not find data on your Fathom PRO Kit. Be sure to keep your kit charged, and wear your sensors while running.'
                                    : activityStatus === 'CREATE_COMPLETE' && activity.end_date ?
                                        `Return your sensors to your kit and bring the kit in range of wifi network ${networkName || ''} to upload.`
                                        :
                                        false;
        let eventDate = activity && activity.event_date ? moment(activity.event_date.replace('Z', '')).format('M/D, h:mma') : false;
        return {
            actionText,
            activityStatus,
            eventDate,
            iconColor,
            iconName,
            iconType,
            subtext,
            title,
        };
    }

};

/* Export ==================================================================== */
export default PlanLogic;
