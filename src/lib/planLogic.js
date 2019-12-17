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
                    // newSorenessFields[sorenessIndex].severity = value;
                    newSorenessFields[sorenessIndex].tight = value[0].isSelected ? value[0].value : null;
                    newSorenessFields[sorenessIndex].sore = value[1].isSelected ? value[1].value : null;
                    newSorenessFields[sorenessIndex].tender = value[2].isSelected ? value[2].value : null;
                    newSorenessFields[sorenessIndex].knots = value[3].isSelected ? value[3].value : null;
                    newSorenessFields[sorenessIndex].ache = value[4].isSelected ? value[4].value : null;
                    newSorenessFields[sorenessIndex].sharp = value[5].isSelected ? value[5].value : null;
                }
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.pain = isPain;
                if(isMovementValue) {
                    newSorenessPart.movement = value;
                } else {
                    // newSorenessPart.severity = value;
                    newSorenessPart.tight = value[0].isSelected ? value[0].value : null;
                    newSorenessPart.sore = value[1].isSelected ? value[1].value : null;
                    newSorenessPart.tender = value[2].isSelected ? value[2].value : null;
                    newSorenessPart.knots = value[3].isSelected ? value[3].value : null;
                    newSorenessPart.ache = value[4].isSelected ? value[4].value : null;
                    newSorenessPart.sharp = value[5].isSelected ? value[5].value : null;
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
    handleAreaOfSorenessClick: (stateObject, areaClicked, isAllGood, soreBodyPartsPlan, resetSections, side) => {
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
                    if(currentSelectedSide.length === 1 && currentSelectedSide[0].side !== side) {
                        currentSelectedSide = currentSelectedSide[0].side;
                        let newMissingSideSorenessPart = {};
                        newMissingSideSorenessPart.body_part = areaClicked.index;
                        newMissingSideSorenessPart.pain = false;
                        // newMissingSideSorenessPart.severity = null;
                        newMissingSideSorenessPart.tight = null;
                        newMissingSideSorenessPart.sore = null;
                        newMissingSideSorenessPart.tender = null;
                        newMissingSideSorenessPart.knots = null;
                        newMissingSideSorenessPart.ache = null;
                        newMissingSideSorenessPart.sharp = null;
                        newMissingSideSorenessPart.side = currentSelectedSide === 1 ? 2 : 1;
                        newSorenessFields.push(newMissingSideSorenessPart);
                    } else {
                        newSorenessFields = _.filter(newSorenessFields, o => o.body_part !== areaClicked.index || (o.body_part === areaClicked.index && o.side !== side));
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
                    // newLeftSorenessPart.severity = null;
                    newLeftSorenessPart.tight = null;
                    newLeftSorenessPart.sore = null;
                    newLeftSorenessPart.tender = null;
                    newLeftSorenessPart.knots = null;
                    newLeftSorenessPart.ache = null;
                    newLeftSorenessPart.sharp = null;
                    newLeftSorenessPart.side = 1;
                    if(side && side === 1) {
                        newSorenessFields.push(newLeftSorenessPart);
                    }
                    let newRightSorenessPart = {};
                    newRightSorenessPart.body_part = areaClicked.index;
                    newRightSorenessPart.pain = areaClicked.group === 'joint';
                    // newRightSorenessPart.severity = null;
                    newRightSorenessPart.tight = null;
                    newRightSorenessPart.sore = null;
                    newRightSorenessPart.tender = null;
                    newRightSorenessPart.knots = null;
                    newRightSorenessPart.ache = null;
                    newRightSorenessPart.sharp = null;
                    newRightSorenessPart.side = 2;
                    if(side && side === 2) {
                        newSorenessFields.push(newRightSorenessPart);
                    }
                } else {
                    let newSorenessPart = {};
                    newSorenessPart.body_part = areaClicked.index;
                    newSorenessPart.pain = areaClicked.group === 'joint';
                    // newSorenessPart.severity = null;
                    newSorenessPart.tight = null;
                    newSorenessPart.sore = null;
                    newSorenessPart.tender = null;
                    newSorenessPart.knots = null;
                    newSorenessPart.ache = null;
                    newSorenessPart.sharp = null;
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
        _.map(cleanedExerciseList, (exList, index) => {
            flatListExercises = _.concat(flatListExercises, exList);
        });
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
        let sportStartTime = workout && workout.event_date ? moment(workout.event_date).format('h:mma') : moment().format('hh:mma');
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
        let updatedSoreness = _.filter(dailyReadiness.soreness, s => s.tight || s.ache || s.sore || s.tender || s.knots || s.sharp);
        updatedSoreness = _.map(updatedSoreness, s => {
            let newSoreness = _.cloneDeep(s);
            newSoreness.ache = newSoreness.sore && newSoreness.sore > 0 ?
                newSoreness.sore
                : newSoreness.tender && newSoreness.tender > 0 ?
                    newSoreness.tender
                    :
                    newSoreness.ache;
            return newSoreness;
        });
        let newDailyReadiness = {
            clear_candidates:          _.filter(updatedSoreness, {isClearCandidate: true}),
            date_time:                 eventDate,
            readiness:                 dailyReadiness.readiness,
            sessions_planned:          dailyReadiness.sessions_planned,
            sleep_quality:             dailyReadiness.sleep_quality,
            soreness:                  _.filter(updatedSoreness, u => !u.isClearCandidate),
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
            let updatedSoreness = _.filter(postSession.soreness, s => s.tight || s.ache || s.sore || s.tender || s.knots || s.sharp);
            updatedSoreness = _.map(updatedSoreness, s => {
                let newSoreness = _.cloneDeep(s);
                newSoreness.ache = newSoreness.sore && newSoreness.sore > 0 ?
                    newSoreness.sore
                    : newSoreness.tender && newSoreness.tender > 0 ?
                        newSoreness.tender
                        :
                        newSoreness.ache;
                return newSoreness;
            });
            newPostSession.sessions[lastNonDeletedIndex].post_session_survey = {
                clear_candidates: _.filter(updatedSoreness, {isClearCandidate: true}),
                event_date:       eventDate,
                RPE:              newPostSession.sessions[lastNonDeletedIndex].post_session_survey.RPE,
                soreness:         _.filter(updatedSoreness, u => !u.isClearCandidate),
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
    addTitleToCompletedModalitiesHelper: (array, title, subtitle, filterOutActive, exerciseListOrder, modality) => {
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
                let goals = PlanLogic.handleFindGoals(newCompletedActivity, exerciseListOrder, modality);
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
            newCompletedActivity.isBodyModality = modality === 'heat' || modality === 'ice' || modality === 'cwi';
            let goals = PlanLogic.handleFindGoals(newCompletedActivity, exerciseListOrder, modality);
            const goalsId = newCompletedActivity.isBodyModality ? modality : newCompletedActivity.id;
            if(goals && goals[goalsId] && goals[goalsId].length > 0) {
                newCompletedActivity.subtitle = _.map(goals[goalsId], g => g.text).join(', ');
            }
            newCompletedActivity.title = newCompletedActivity.isBodyModality ? title : _.startCase(_.toLower(newCompletedActivity.title));
            let timingTime = '0 min, ';
            if(newCompletedActivity.minutes) {
                timingTime = `${newCompletedActivity.minutes} min, `;
            } else {
                let priority = newCompletedActivity.default_plan === 'Efficient' ? 0 : newCompletedActivity.default_plan === 'Complete' ? 1 : 2;
                timingTime = `${(_.round(MyPlanConstants.cleanExerciseList(newCompletedActivity, priority, goals, modality).totalSeconds / 60))} min, `;
            }
            newCompletedActivity.timing = [timingTime, newCompletedActivity.isBodyModality ? timingAddOn : newCompletedActivity.when_card];
            newCompletedActivity.modality = modality;
            if(!newCompletedActivity.isBodyModality && newCompletedActivity.display_image && newCompletedActivity.display_image.length > 0) {
                newCompletedActivity.backgroundImage = PlanLogic.returnModalitiesDisplayImage(newCompletedActivity.display_image, true);
            } else if(backgroundImage) {
                newCompletedActivity.backgroundImage = backgroundImage;
            }
            return newCompletedActivity;
        });
    },

    /**
      * Handle Find Goals Logic
      * - /actions/plan.js
      */
    handleFindGoals: (object, exerciseListOrder, modality) => {
        if(!modality && object && object.title) {
            let cleanedTitle = _.toLower(object.title);
            modality = cleanedTitle === 'cold water bath' ? 'cwi' : cleanedTitle === 'heat' ? 'heat' : cleanedTitle === 'ice' ? 'ice' : 'prepare';
        }
        // setup variables
        let tmpGoals = {};
        let goals = {};
        let isBodyModality = modality === 'heat' || modality === 'ice' || modality === 'cwi';
        // return empty if we don't have an *_active_rest
        if(!object) {
            return goals;
        }
        // loop through our exercise order and sections
        if(!_.isArray(object)) {
            object = [object];
        }
        _.map(object, obj => {
            if(obj.exercise_phases) { // NOTE: exercise modality
                _.map(obj.exercise_phases, exercisePhase =>
                    _.map(exercisePhase.exercises, exercise =>
                        _.map(exercise.dosages, dosage => {
                            tmpGoals[obj.id] = _.concat(tmpGoals[obj.id], dosage.goal);
                        })
                    )
                );
            } else if(obj.goals) { // NOTE: body modality
                _.map(obj.goals, dosage => {
                    tmpGoals[modality] = _.concat(tmpGoals[modality], dosage);
                });
            }  else if(obj.body_parts) { // NOTE: body modality
                _.map(obj.body_parts, bodyPart =>
                    _.map(bodyPart.goals, goal => {
                        tmpGoals[modality] = _.concat(tmpGoals[modality], goal);
                    })
                );
            }
        });
        // run through all goals: filter unique goal object(s) & to make sure if its selected or not
        _.map(tmpGoals, (goal, i) => {
            let newGoal = _.cloneDeep(goal);
            newGoal = _.filter(newGoal);
            newGoal = _.uniqBy(newGoal, 'text');
            if(!isBodyModality) {
                let selectedObject = _.find(object, ['id', i]);
                let goalsIndex = selectedObject && selectedObject.default_plan === 'Efficient' ?
                    'efficient_active'
                    : selectedObject && selectedObject.default_plan === 'Complete' ?
                        'complete_active'
                        :
                        'comprehensive_active';
                newGoal = _.map(newGoal, (g, key) => {
                    let newG = _.cloneDeep(g);
                    let foundGoal = selectedObject.goals ? _.find(selectedObject.goals, (selectedGoal, index) => index === g.text) : false;
                    newG.isSelected = foundGoal ? foundGoal[goalsIndex] : true;
                    return newG;
                });
            }
            goals[i] = newGoal;
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
    handleExerciseModalityRenderLogic: (dailyPlanObj, plan, priority, modality, index) => {
        let goals = plan.activeRestGoals;
        let recoveryObj = _.find(dailyPlanObj.modalities, ['id', index]) || {};
        let imageId = `${_.toLower(recoveryObj.title) || index}CareActivate`;
        let imageSource = PlanLogic.returnModalitiesDisplayImage(recoveryObj.display_image, false);
        let pageSubtitle = recoveryObj.when;
        let pageTitle = _.startCase(_.toLower(recoveryObj.title));
        let recoveryType = '';
        let sceneId = `${_.toLower(recoveryObj.title) || index}Scene`;
        let textId = `${_.toLower(recoveryObj.title) || index}CareActivate`;
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
        let goalsHeader = `${priorityText} routine to:`;
        goals = _.find(plan.activeRestGoals, (g, key) => key === index) || [];
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
        const completedHeat = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_heat, 'Heat', true, false, false, 'heat');
        const completedCWI = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_cold_water_immersion, 'Cold Water Bath', true, false, false, 'cwi');
        const completedIce = PlanLogic.addTitleToCompletedModalitiesHelper(dailyPlanObj.completed_ice, 'Ice', true, false, false, 'ice');
        const completedCurrentHeat = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.heat], 'Heat', true, true, false, 'heat');
        const completedCurrentCWI = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.cold_water_immersion], 'Cold Water Bath', true, true, false, 'cwi');
        const completedCurrentIce = PlanLogic.addTitleToCompletedModalitiesHelper([dailyPlanObj.ice], 'Ice', true, true, false, 'ice');
        const completedBodyModalities = _.concat(completedHeat, completedCWI, completedIce, completedCurrentHeat, completedCurrentCWI, completedCurrentIce);
        const activeHeat = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.heat], 'Heat', 'within 30 min of training', false, 'heat', require('../../assets/images/standard/heat_tab.png'));
        const activeIce = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.ice], 'Ice', 'after all training is complete', false, 'ice', require('../../assets/images/standard/ice_tab.png'));
        const activeCWI = PlanLogic.addTitleToActiveModalitiesHelper([dailyPlanObj.cold_water_immersion], 'Cold Water Bath', 'after all training is complete', false, 'cwi', require('../../assets/images/standard/cwi_tab.png'));
        const activeBodyModalities = _.concat(activeHeat, activeIce, activeCWI);
        const completedExerciseModalities = _.filter(dailyPlanObj.modalities, modality => modality.completed);
        const completedModalities = _.concat(dailyPlanObj.completed_modalities, completedBodyModalities, completedExerciseModalities);
        const activeExerciseModalities = PlanLogic.addTitleToActiveModalitiesHelper(dailyPlanObj.modalities, 'Mobilize', 'within 4 hrs of training', MyPlanConstants.preExerciseListOrder, 'prepare', require('../../assets/images/standard/mobilize_tab.png'));
        const mergedActiveModalities = _.concat(activeExerciseModalities, activeBodyModalities);
        const cleanedModalities = _.map(mergedActiveModalities, activeModality => {
            let newModality = _.cloneDeep(activeModality);
            newModality.sort_date_time = newModality.completed_date_time ?
                moment(newModality.completed_date_time.replace('Z', ''))
                : newModality.event_date_time ?
                    moment(newModality.event_date_time.replace('Z', ''))
                    : newModality.event_date ?
                        moment(newModality.event_date.replace('Z', ''))
                        :
                        moment();
            return newModality;
        });
        const cleanedCompletedModalities = _.map(completedModalities, modality => {
            let newModality = _.cloneDeep(modality);
            newModality.title = _.upperFirst(_.lowerCase(newModality.title));
            let isLocked = modality && !modality.active && !modality.completed;
            if(isLocked && !modality.sport_name) {
                newModality.subtitle = `Sorry, you missed the optimal window for ${_.startCase(_.toLower(newModality.title))} today.`;
            }
            return newModality;
        });
        const trainingSessions = _.map(filteredTrainingSessions, trainingSession => {
            let newTrainingSession = _.cloneDeep(trainingSession);
            newTrainingSession.active = true;
            newTrainingSession.completed = true;
            newTrainingSession.title = trainingSession.sport_name ?
                `${_.filter(MyPlanConstants.teamSports, ['index', trainingSession.sport_name])[0].label}`
                :
                'Distance Run';
            return newTrainingSession;
        });
        const missedModalities = _.filter(cleanedModalities, modality => !modality.active && !modality.completed);
        const filteredCompletedModalities = _.filter(cleanedModalities, modality => modality.completed);
        let completedLockedModalities = _.concat(trainingSessions, cleanedCompletedModalities, missedModalities, filteredCompletedModalities);
        completedLockedModalities = _.map(completedLockedModalities, modality => {
            let newModality = _.cloneDeep(modality);
            let isLocked = newModality && !newModality.active && !newModality.completed;
            newModality.sort_date_time = newModality.completed_date_time ?
                moment(newModality.completed_date_time.replace('Z', ''))
                : newModality.event_date_time ?
                    moment(newModality.event_date_time.replace('Z', ''))
                    : newModality.event_date ?
                        moment(newModality.event_date.replace('Z', ''))
                        :
                        moment();
            if(isLocked && newModality.locked_text && newModality.locked_text.length > 0) {
                newModality.subtitle = newModality.locked_text;
            } else if(newModality.goals) {
                newModality.subtitle = _.map(newModality.goals, (goal, index) => _.isArray(newModality.goals) ? goal.text : index).join(', ');
            }
            newModality.title = _.startCase(_.toLower(newModality.title));
            return newModality;
        });
        completedLockedModalities = _.orderBy(completedLockedModalities, ['sort_date_time'], ['asc']);
        let activeModalities = _.filter(cleanedModalities, modality => modality.active && !modality.completed);
        activeModalities = _.orderBy(activeModalities, ['sort_date_time'], ['asc']);
        let isReadinessSurveyCompleted = dailyPlanObj.daily_readiness_survey_completed;
        let offDaySelected = !dailyPlanObj.sessions_planned;
        let askForNewMobilize = dailyPlanObj.modalities_available_on_demand.length > 0 ? true : false;
        let onDemandModalities = dailyPlanObj.modalities_available_on_demand;
        let noTriggerCoreLogic = !dailyPlanObj.heat && !dailyPlanObj.ice && !dailyPlanObj.cold_water_immersion && dailyPlanObj.cool_down.length === 0 && activeModalities.length === 0;
        let firstTrigger = isReadinessSurveyCompleted && offDaySelected && noTriggerCoreLogic && filteredTrainingSessions.length === 0;
        let secondTrigger = isReadinessSurveyCompleted && noTriggerCoreLogic && filteredTrainingSessions.length > 0;
        let thirdTrigger = isReadinessSurveyCompleted && dailyPlanObj.train_later && noTriggerCoreLogic && filteredTrainingSessions.length === 0;
        let triggerStep = firstTrigger ?
            'Recovery isn\'t high priority today, but you can tap the "+" below for a recovery-focused Mobilize on demand.\n\nEnjoy your off day!'
            : secondTrigger ?
                'You should recover from this workout naturally, but you can tap the "+" for a recovery-focused Mobilize to go the extra mile!'
                : thirdTrigger ?
                    'You\'re well recovered so a Mobilize before you train isn\'t high priority, but you can tap the "+" below to add a recovery-focused Mobilize on demand!\n\nOtherwise tap the "+" to log your workout & we\'ll update your recovery recommendations accordingly!'
                    :
                    false;
        let newInsights = [];
        if(dailyPlanObj.trends) {
            _.map(dailyPlanObj.trends.insight_categories, (alert, i) => {
                _.map(alert.plan_alerts, planAlert => {
                    if(alert.insight_type === planAlert.category) {
                        let newPlanAlert = _.cloneDeep(planAlert);
                        newPlanAlert.insight_type = planAlert.category;
                        newInsights.push(newPlanAlert);
                    }
                });
            });
        }
        let trendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.insight_categories ? dailyPlanObj.trends.insight_categories : [];
        let trendDashboardCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.dashboard && dailyPlanObj.trends.dashboard.insight_categories ? dailyPlanObj.trends.dashboard.insight_categories : [];
        let trainingSessionsIds = _.map(trainingSessions, o => o.session_id);
        let sensorSessions = userObj && userObj.sensor_data && userObj.sensor_data.sessions ?
            userObj.sensor_data.sessions
            :
            [];
        sensorSessions = _.orderBy(sensorSessions, ['event_date'], ['asc']);
        sensorSessions = _.filter(sensorSessions, u => !trainingSessionsIds.includes(u.id) && (u.event_date && moment(u.event_date.replace('Z', '')).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD')));
        const hasActive3SensorSession = _.filter(sensorSessions, o => o.status === 'CREATE_COMPLETE' && !o.end_date).length > 0;
        const userHas3SensorSystem = userObj && userObj.sensor_data && userObj.sensor_data.system_type && userObj.sensor_data.system_type === '3-sensor' && userObj.sensor_data.mobile_udid && userObj.sensor_data.sensor_pid ? true : false;
        const networkName = userObj && userObj.sensor_data && userObj.sensor_data.sensor_networks && userObj.sensor_data.sensor_networks[0] ? userObj.sensor_data.sensor_networks[0] : false;
        return {
            activeAfterModalities:           [],
            activeBeforeModalities:          activeModalities,
            askForNewMobilize,
            beforeCompletedLockedModalities: completedLockedModalities,
            filteredTrainingSessions,
            hasActive3SensorSession,
            isReadinessSurveyCompleted,
            networkName,
            newInsights,
            offDaySelected,
            onDemandModalities,
            sensorSessions,
            trendCategories,
            trendDashboardCategories,
            triggerStep,
            userHas3SensorSystem,
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
    handleTrendsRenderLogic: (plan, user, dates, sessionDateIndex, selectedTimeIndex) => {
        const dailyPlanObj = plan.dailyPlan[0] || false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : false;
        let biomechanicsSummary = trends && trends.biomechanics_summary ? trends.biomechanics_summary : { active: false, };
        let recoveryQuality = trends && trends.recovery_quality ? trends.recovery_quality : { active: false, };
        let bodyResponse = trends && trends.body_response ? trends.body_response : [];
        let workload = trends && trends.workload ? trends.workload : [];
        let isBodyResponseLocked = trends && trends.body_response ? trends.body_response.lockout : true;
        let isWorkloadLocked = trends && trends.workload ? trends.workload.lockout : true;
        let currentBodyResponseAlertText = PlanLogic.handleTrendsTitleRenderLogic(bodyResponse && bodyResponse.status ? bodyResponse.status.bolded_text : [], bodyResponse && bodyResponse.status ? bodyResponse.status.text : '');
        let currentWorkloadAlertText = PlanLogic.handleTrendsTitleRenderLogic(workload && workload.status ? workload.status.bolded_text : [], workload && workload.status ? workload.status.text : '');
        let {
            icon: workloadIcon,
            iconType: workloadIconType,
            imageSource: workloadImageSource,
            subtitleColor: workloadSubtitleColor,
            sportName: workloadSportName,
        } = PlanLogic.handleTrendRenderLogic(workload);
        let {
            icon: bodyResponseIcon,
            iconType: bodyResponseIconType,
            imageSource: bodyResponseImageSource,
            subtitleColor: bodyResponseSubtitleColor,
            sportName: bodyResponseSportName,
        } = PlanLogic.handleTrendRenderLogic(bodyResponse);
        let parsedSummaryTextData = [];
        if(recoveryQuality.summary_text.active) {
            parsedSummaryTextData = _.map(recoveryQuality.summary_text.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold];
                return newParsedData;
            });
        }
        let times = sessionDateIndex && dates && dates[sessionDateIndex] && dates[sessionDateIndex].length > 0 ?
            _.map(dates[sessionDateIndex], (date, i) => date)
            :
            [];
        let selectedBiomechanicsSession = sessionDateIndex && dates && dates[sessionDateIndex] && dates[sessionDateIndex].data.length > 0 ?
            _.filter(biomechanicsSummary.sessions, s => s.id === dates[sessionDateIndex].data[selectedTimeIndex].sessionId)
            :
            [];
        const userHas3SensorSystem = user && user.sensor_data && user.sensor_data.system_type && user.sensor_data.sensor_pid ? true : false;
        return {
            biomechanicsSummary,
            bodyResponse,
            bodyResponseIcon,
            bodyResponseIconType,
            bodyResponseImageSource,
            bodyResponseSportName,
            bodyResponseSubtitleColor,
            currentBodyResponseAlertText,
            currentWorkloadAlertText,
            isBodyResponseLocked,
            isWorkloadLocked,
            parsedSummaryTextData,
            recoveryQuality,
            selectedBiomechanicsSession,
            times,
            userHas3SensorSystem,
            workload,
            workloadIcon,
            workloadIconType,
            workloadImageSource,
            workloadSportName,
            workloadSubtitleColor,
        };
    },

    /**
      * Handle Trend Child Render Logic
      * - TrendChild
      */
    // TODO: UNIT TEST ME
    handleTrendChildRenderLogic: (insightType, plan) => {
        let dailyPlanObj = plan ? plan.dailyPlan[0] : false;
        let trendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.insight_categories ? dailyPlanObj.trends.insight_categories : [];
        let selectedTrendCategory = _.filter(trendCategories, ['insight_type', insightType]);
        let selectedTrends = _.map(selectedTrendCategory[0].trends, (trend, i) => {
            let newTrend = _.cloneDeep(trend);
            newTrend.key = i.toString();
            return newTrend;
        });
        selectedTrends = _.filter(selectedTrends, ['visible', true]);
        let dashboardTrendCategories = dailyPlanObj && dailyPlanObj.trends && dailyPlanObj.trends.dashboard && dailyPlanObj.trends.dashboard.insight_categories && dailyPlanObj.trends.dashboard.insight_categories.length > 0 ? _.cloneDeep(dailyPlanObj.trends.dashboard.insight_categories) : [];
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
                newObj.y = Platform.OS === 'ios' ?
                    d.pain_value && d.pain_value > 0 ? d.pain_value : null
                    :
                    d.pain_value;
                return newObj;
            });
            let sorenessLineGraphData = _.map(data, (d, i) => {
                let newObj = {};
                newObj.color = PlanLogic.returnInsightColorString(5);
                newObj.key = i;
                newObj.x = d.day_of_week;
                newObj.y = Platform.OS === 'ios' ?
                    d.soreness_value && d.soreness_value > 0 ? d.soreness_value : null
                    :
                    d.soreness_value;
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
                    if(!updatedBodyPart.imageSource) {
                        return {};
                    }
                    updatedBodyPart.tintColor = PlanLogic.returnBodyOverlayColorString(bodyPart.value, bodyPart.pain, bodyPart.color, bodyPart.customOpacity);
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
                    if(!updatedBodyPart.imageSource) {
                        return {};
                    }
                    updatedBodyPart.tintColor = PlanLogic.returnBodyOverlayColorString(bodyPart.value, bodyPart.pain, bodyPart.color, bodyPart.customOpacity);
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
            newDataObjLeft.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 10 : 8);
            let newDataObjRight = {};
            newDataObjRight.x = data.x;
            newDataObjRight.y = data.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 4 : 9);
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
            newDataObjLeft.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 10 : 8);
            let newDataObjRight = {};
            newDataObjRight.x = data.x;
            newDataObjRight.y = data.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 4 : 9);
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
      * Handle Biomechanics Ankle Pitch Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsHipDropRenderLogic: (plan, currentIndex, step) => {
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
                selectedHipDropSession: {},
            };
        }
        let dailyPlan = plan && plan.dailyPlan && plan.dailyPlan[0] ? plan.dailyPlan[0] : false;
        let biomechanicsHipDropSummary = dailyPlan ? dailyPlan.trends.biomechanics_hip_drop : {};
        let selectedHipDropSession = biomechanicsHipDropSummary && biomechanicsHipDropSummary.sessions[currentIndex];
        let sessionSportName = selectedHipDropSession ? _.find(MyPlanConstants.teamSports, o => o.index === selectedHipDropSession.sport_name).label : '';
        let sessionHours = _.floor(selectedHipDropSession.duration / 3600);
        let updatedTime = selectedHipDropSession.duration - sessionHours * 3600;
        let sessionMinutes = _.floor(updatedTime / 60);
        let sessionSeconds = (new Array(2 + 1).join('0') + (updatedTime - sessionMinutes * 60)).slice(-2);
        let sessionStartTimeDuration = selectedHipDropSession ? `${moment(selectedHipDropSession.event_date_time.replace('Z', '')).format('h:mma')}, ${sessionHours > 0 ? `${sessionHours}hr ` : ''}${sessionMinutes}min` : '';
        let sessionDuration = `${sessionHours > 0 ? `${sessionHours}:` : ''}${sessionMinutes === 0 ? '00' : sessionHours > 0 && sessionMinutes < 10 ? `0${sessionMinutes}` : sessionMinutes}:${sessionSeconds === 0 ? '00' : sessionSeconds}`;
        let pieData = selectedHipDropSession.asymmetry.hip_drop.summary_data;
        let chartData = selectedHipDropSession.asymmetry.hip_drop.detail_data;
        let updatedChartData = _.map(chartData, (data, index) => {
            let newDataObjLeft = {};
            newDataObjLeft.x = data.x;
            newDataObjLeft.y = data.y1;
            newDataObjLeft.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 10 : 8);
            let newDataObjRight = {};
            newDataObjRight.x = data.x;
            newDataObjRight.y = data.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(data.flag === 1 ? 4 : 9);
            return [newDataObjLeft, newDataObjRight];
        });
        let parsedData = [];
        if(
            selectedHipDropSession &&
            selectedHipDropSession.asymmetry &&
            selectedHipDropSession.asymmetry.hip_drop &&
            selectedHipDropSession.asymmetry.hip_drop.detail_text
        ) {
            _.map(selectedHipDropSession.asymmetry.hip_drop.detail_bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(` ${prop.text} `, 'i');
                let sessionColor = _.toInteger(selectedHipDropSession.asymmetry.hip_drop.detail_bold_side) === 1 ?
                    10
                    : _.toInteger(selectedHipDropSession.asymmetry.hip_drop.detail_bold_side) === 2 ?
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
            selectedHipDropSession,
            sessions:         biomechanicsHipDropSummary.sessions,
            updatedChartData: _.flatten(updatedChartData),
        };
    },

    /**
      * Handle Biomechanics Selected Session Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsSelectedSessionRenderLogic: (plan, session) => {
        let sportName = _.find(MyPlanConstants.teamSports, o => o.index === session.sport_name).label || '';
        const sessionDateMoment = moment(session.event_date_time.replace('Z', ''));
        let isToday = moment().isSame(sessionDateMoment, 'day');
        let sessionDateTime = isToday ? `Today, ${sessionDateMoment.format('hh:mma')}` : sessionDateMoment.format('MMM DD, hh:mma');
        let sessionDuration = SensorLogic.convertMinutesToHrsMins(session.duration, true);
        const dailyPlanObj = plan.dailyPlan[0] || false;
        let trends = dailyPlanObj ? dailyPlanObj.trends : false;
        let biomechanicsSummary = trends && trends.biomechanics_summary ? trends.biomechanics_summary : false;
        let sessionDetails = biomechanicsSummary && _.find(biomechanicsSummary.sessions, s => s.id === session.id) || {};
        return {
            sessionDateTime,
            sessionDetails,
        };
    },

    /**
      * Handle Biomechanics Charts Render Logic
      * - BiomechanicsCharts
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsChartsRenderLogic: (pieData, selectedSession, isRichDataView, chartData, dataType) => {
        const asymmetryIndex = dataType === 0 ?
            'apt'
            : dataType === 1 ?
                'ankle_pitch'
                : dataType === 2 ?
                    'hip_drop'
                    : dataType === 3 ?
                        'knee_valgus'
                        :
                        'hip_rotation';
        const APT_CHART_TOTAL = (360 / 6);
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
            let chartLegend = (selectedSession && selectedSession[asymmetryIndex] && selectedSession[asymmetryIndex].asymmetry && selectedSession[asymmetryIndex].asymmetry.detail_legend) || [];
            let chartActiveLegend = _.find(chartLegend, legend => legend.active);
            return {
                asymmetryIndex,
                chartActiveLegend,
                largerPieData,
                richDataYDomain: [-maxDomain, maxDomain],
                rotateDeg,
                smallerPieData,
            };
        }
        const isLeftDataEmpty = newPieData.left_y === 0;
        const isRightDataEmpty = newPieData.right_y === 0;
        if(!isLeftDataEmpty || !isRightDataEmpty) {
            if(dataType === 0 || dataType === 3) {
                let newMultiplier = newPieData.multiplier;
                let roundedRightY = _.round(newPieData.right_y * newMultiplier);
                let roundedLeftY = _.round(newPieData.left_y * newMultiplier);
                if((selectedSession && _.toInteger(selectedSession.body_side) === 0) || (newPieData.right_y === newPieData.left_y)) {
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(roundedRightY, roundedLeftY, APT_CHART_TOTAL, PlanLogic.returnInsightColorString(pieData.left_y_legend_color));
                    smallerPieData = emptyPieData;
                    rotateDeg = `${(100 - (3 * roundedRightY))}deg`;
                } else if(newPieData.left_y > newPieData.right_y) {
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(roundedLeftY, roundedRightY, APT_CHART_TOTAL, PlanLogic.returnInsightColorString(pieData.left_y_legend_color));
                    smallerPieData = PlanLogic.returnPieChartAptCleanedData(roundedRightY, roundedLeftY, APT_CHART_TOTAL, PlanLogic.returnInsightColorString(pieData.right_y_legend_color));
                    rotateDeg = `${(100 - (3 * roundedLeftY))}deg`;
                } else if((newPieData.right_y === newPieData.left_y) || (newPieData.right_y > newPieData.left_y)) {
                    largerPieData = PlanLogic.returnPieChartAptCleanedData(roundedRightY, roundedLeftY, APT_CHART_TOTAL, PlanLogic.returnInsightColorString(pieData.right_y_legend_color));
                    smallerPieData = PlanLogic.returnPieChartAptCleanedData(roundedLeftY, roundedRightY, APT_CHART_TOTAL, PlanLogic.returnInsightColorString(pieData.left_y_legend_color));
                    rotateDeg = `${(100 - (3 * roundedRightY))}deg`;
                }
                if(dataType === 3) {
                    rotateDeg = '-190deg';
                    smallerPieData = _.map(smallerPieData, (data, key) => {
                        let newData = _.cloneDeep(data);
                        newData.y = key === 0 ?
                            (newData.y * 2)
                            : key === 1 ?
                                newData.y
                                :
                                (newData.y - smallerPieData[0].y);
                        return newData;
                    });
                }
            } else if(dataType === 1) {
                const ANKLE_PITCH_CHART_RATIO = 360;
                if((selectedSession && _.toInteger(selectedSession.body_side) === 0) || (newPieData.right_y === newPieData.left_y)) {
                    let largerValue = newPieData.right_y;
                    let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                    largerPieData = [
                        // backend sends the same color in L and R for symmetric cases
                        { color: PlanLogic.returnInsightColorString(pieData.left_y_legend_color), x: 0, y: largerValue, },
                        { color: AppColors.transparent, x: 1, y: largerFullValue, },
                    ];
                    smallerPieData = emptyPieData;
                } else if(newPieData.left_y > newPieData.right_y) {
                    let largerValue = newPieData.left_y;
                    let smallerValue = newPieData.right_y;
                    let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                    let smallerFullValue = (ANKLE_PITCH_CHART_RATIO - smallerValue);
                    largerPieData = [
                        { color: PlanLogic.returnInsightColorString(newPieData.left_y_legend_color), x: 0, y: largerValue, },
                        { color: AppColors.transparent, x: 1, y: largerFullValue, },
                    ];
                    smallerPieData = [
                        { color: PlanLogic.returnInsightColorString(newPieData.right_y_legend_color), x: 0, y: smallerValue, },
                        { color: AppColors.transparent, x: 1, y: smallerFullValue, },
                    ];
                } else if((newPieData.right_y === newPieData.left_y) || (newPieData.right_y > newPieData.left_y)) {
                    let largerValue = newPieData.right_y;
                    let smallerValue = newPieData.left_y;
                    let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                    let smallerFullValue = (ANKLE_PITCH_CHART_RATIO - smallerValue);
                    largerPieData = [
                        { color: PlanLogic.returnInsightColorString(newPieData.right_y_legend_color), x: 0, y: largerValue, },
                        { color: AppColors.transparent, x: 1, y: largerFullValue, },
                    ];
                    smallerPieData = [
                        { color: PlanLogic.returnInsightColorString(newPieData.left_y_legend_color), x: 0, y: smallerValue, },
                        { color: AppColors.transparent, x: 1, y: smallerFullValue, },
                    ];
                }
            } else if(dataType === 2 || dataType === 4) {
                rotateDeg = '75deg';
                let leftColor = PlanLogic.returnInsightColorString(newPieData.left_y_legend_color);
                let rightColor = PlanLogic.returnInsightColorString(newPieData.right_y_legend_color);
                const ANKLE_PITCH_CHART_RATIO = (360 / 6);
                let largerValue = _.round(newPieData.right_y * newPieData.multiplier);
                let smallerValue = _.round(newPieData.left_y * newPieData.multiplier);
                let largerFullValue = (ANKLE_PITCH_CHART_RATIO - largerValue);
                let smallerFullValue = (ANKLE_PITCH_CHART_RATIO - smallerValue);
                largerPieData = [
                    { color: leftColor, x: 0, y: largerValue, },
                    { color: AppColors.transparent, x: 1, y: largerFullValue, },
                ];
                smallerPieData = [
                    { color: AppColors.transparent, x: 0, y: smallerFullValue, },
                    { color: rightColor, x: 1, y: smallerValue, },
                ];
                if(dataType === 4) {
                    rotateDeg = '255deg';
                }
            }
        }
        const specificSessionAsymmetryData = selectedSession;
        let parsedSummaryTextData = [];
        if(specificSessionAsymmetryData && specificSessionAsymmetryData.summary_text && specificSessionAsymmetryData.summary_text.active) {
            parsedSummaryTextData = _.map(specificSessionAsymmetryData.summary_text.bold_text, (prop, i) => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold];
                return newParsedData;
            });
        }
        return {
            asymmetryIndex,
            largerPieData,
            parsedSummaryTextData,
            richDataYDomain,
            rotateDeg: dataType === 1 ? '150deg' : rotateDeg,
            smallerPieData,
            specificSessionAsymmetryData,
        };
    },

    returnPieChartAptCleanedData: (y, otherY, total, chartColor) => {
        if(y < otherY) {
            return [
                {color: AppColors.transparent, x: 0, y: ((otherY - y) / 2),},
                {color: chartColor, x: 1, y: y,},
                {color: AppColors.transparent, x: 2, y: (total - (y + ((otherY - y) / 2))),},
            ];
        }
        return [
            {color: chartColor, x: 0, y: y,},
            {color: AppColors.transparent, x: 1, y: (total - y),},
        ];
    },

    returnBodyOverlayColorString: (value, isPain, color, customOpacity) => {
        if(color) {
            return PlanLogic.returnInsightColorString(color, customOpacity);
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

    returnInsightColorString: (color, customOpacity) => {
        let newColor = color === 1 ?
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
                                        `${AppColors.zeplin.purpleLight}${PlanLogic.returnHexOpacity(0.4)}`
                                        : color === 9 ?
                                            `${AppColors.zeplin.splashLight}${PlanLogic.returnHexOpacity(0.4)}`
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
                                                                : color === 15 ?
                                                                    AppColors.zeplin.splashXXLight
                                                                    : color === 16 ?
                                                                        AppColors.zeplin.warningXLight
                                                                        : color === 17 ?
                                                                            AppColors.zeplin.errorXLight
                                                                            : color === 18 ?
                                                                                AppColors.zeplin.errorXXLight
                                                                                : color === 19 ?
                                                                                    AppColors.zeplin.splashMLight
                                                                                    : color === 20 ?
                                                                                        AppColors.zeplin.successXLight
                                                                                        : color === 21 ?
                                                                                            AppColors.zeplin.successXXLight
                                                                                            : color === 22 ?
                                                                                                AppColors.zeplin.warningXXLight
                                                                                                : color === 23 ?
                                                                                                    AppColors.zeplin.yellowLight
                                                                                                    : color === 24 ?
                                                                                                        AppColors.zeplin.yellowXLight
                                                                                                        : color === 25 ?
                                                                                                            AppColors.zeplin.yellowXXLight
                                                                                                            : color === 26 ?
                                                                                                                AppColors.zeplin.splash
                                                                                                                : color === 27 ?
                                                                                                                    AppColors.zeplin.error
                                                                                                                    : color === 28 ?
                                                                                                                        AppColors.zeplin.superLight
                                                                                                                        :
                                                                                                                        AppColors.zeplin.errorLight;
        if(customOpacity && customOpacity !== 1) {
            newColor = [2, 6, 17, 18].includes(color) ?
                AppColors.zeplin.errorSuperLight
                : [4, 7, 15, 19].includes(color) ?
                    AppColors.zeplin.splashSuperLight
                    : [1, 5, 16, 22].includes(color) ?
                        AppColors.zeplin.warningSuperLight
                        : [13, 20, 21].includes(color) ?
                            AppColors.zeplin.successSuperLight
                            : [23, 24, 25].includes(color) ?
                                AppColors.zeplin.yellowSuperLight
                                :
                                AppColors.zeplin.errorLight;
        }
        return newColor;
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
    handleSingleSensorSessionCardRenderLogic: (activity, userSesnorData, activityIdLoading) => {
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
                                            'Waiting to Upload'
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
                        : activityStatus === 'NO_WIFI_SETUP' && activity.isNoWifiOrSessionsState ?
                            'Bring your Fathom PRO Kit in range of your home wifi network to connect to wifi and enable data uploading.'
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
        let calculatingStatuses = ['UPLOAD_IN_PROGRESS', 'UPLOAD_PAUSED', 'PROCESSING_IN_PROGRESS', 'PROCESSING_COMPLETE', 'CREATE_COMPLETE'];
        let isCalculating = calculatingStatuses.includes(activityStatus) && (activityIdLoading === activity.id);
        return {
            actionText,
            activityStatus,
            eventDate,
            iconColor,
            iconName,
            iconType,
            isCalculating,
            subtext,
            title,
        };
    },

    returnBodyOverlapMapping: newSoreBodyParts => {
        // setup our mapping per click
        let bodyPartMapping = [
            { cleanedKey: 2, index: [111, 112, 113, 114, 131, 132, 133, 134, 151, 152, 153, 154], isFront: true, side: 1, },
            { cleanedKey: 2, index: [108, 109, 110, 127, 128, 129, 130, 147, 148, 149, 150], isFront: true, side: 2, },
            { cleanedKey: 3, index: [168, 169, 170, 171, 172, 173, 188, 189, 190, 191, 192, 193, 208, 209, 210, 211, 212, 213, 227, 228, 229, 230, 231, 232, 233, 234, 249, 250, 251, 252], isFront: true, side: 0, },
            { cleanedKey: 5, index: [271, 272, 291, 292, 293, 311, 312, 331, 332], isFront: true, side: 1, },
            { cleanedKey: 5, index: [269, 270, 288, 289, 290, 309, 310, 329, 330], isFront: true, side: 2, },
            { cleanedKey: 6, index: [313, 314, 333, 334, 351, 352, 353, 354, 371, 372, 373, 391, 392, 393], isFront: true, side: 1, },
            { cleanedKey: 6, index: [307, 308, 327, 328, 347, 348, 349, 350, 368, 369, 370, 388, 389, 390], isFront: true, side: 2, },
            { cleanedKey: 7, index: [411, 412, 413, 431, 432, 433, 451, 452, 453], isFront: true, side: 1, },
            { cleanedKey: 7, index: [408, 409, 410, 428, 429, 430, 448, 449, 450], isFront: true, side: 2, },
            { cleanedKey: 8, index: [471, 472, 473, 474, 475, 491, 492, 493, 494, 495, 511, 512, 513, 514, 515], isFront: true, side: 1, },
            { cleanedKey: 8, index: [466, 467, 468, 469, 470, 486, 487, 488, 489, 490, 506, 507, 508, 509, 510], isFront: true, side: 2, },
            { cleanedKey: 9, index: [551, 552, 553, 554, 531, 532, 533, 534, 535, 555], isFront: true, side: 1, },
            { cleanedKey: 9, index: [547, 548, 549, 550, 526, 527, 528, 529, 530, 546], isFront: true, side: 2, },
            { cleanedKey: 10, index: [571, 572, 573, 574, 575, 591, 592, 593, 594, 595], isFront: true, side: 1, },
            { cleanedKey: 10, index: [566, 567, 568, 569, 570, 587, 586, 588, 589, 590], isFront: true, side: 2, },
            { cleanedKey: 11, index: [294, 295, 296, 315, 316, 335, 336, 337, 355, 356, 357, 374, 375, 376, 394, 395, 396], isFront: true, side: 1, },
            { cleanedKey: 11, index: [285, 286, 287, 305, 306, 307, 324, 325, 326, 344, 345, 346, 365, 366, 367, 385, 386, 387], isFront: true, side: 2, },
            { cleanedKey: 12, index: [210, 211, 227, 228, 229, 230, 231, 232, 233, 247, 248, 249, 250, 251, 252, 253, 254], isFront: false, side: 0, },
            { cleanedKey: 14, index: [266, 267, 268, 269, 270, 286, 287, 288, 289, 290, 306, 307, 308, 309, 310], isFront: false, side: 1, },
            { cleanedKey: 14, index: [271, 272, 273, 274, 275, 291, 291, 293, 294, 295, 311, 312, 313, 314, 315], isFront: false, side: 2, },
            { cleanedKey: 15, index: [326, 327, 328, 329, 330, 346, 347, 348, 349, 350, 366, 367, 368, 369, 370, 386, 387, 388, 389, 390, 407, 408, 409, 410], isFront: false, side: 1, },
            { cleanedKey: 15, index: [331, 332, 333, 334, 335, 351, 352, 353, 354, 355, 371, 372, 373, 374, 375, 391, 392, 393, 394, 395, 411, 412, 413, 414], isFront: false, side: 2, },
            { cleanedKey: 16, index: [427, 428, 429, 430, 447, 448, 449, 450, 467, 468, 469, 470, 487, 488, 489, 490, 508, 509, 510, 528, 529, 530, 548, 549, 550], isFront: false, side: 1, },
            { cleanedKey: 16, index: [431, 432, 433, 343, 452, 452, 453, 454, 471, 472, 473, 474, 491, 492, 493, 493, 511, 512, 513, 531, 532, 533, 551, 552, 553], isFront: false, side: 2, },
            { cleanedKey: 17, index: [567, 568, 569, 570, 587, 588, 589, 590], isFront: false, side: 1, },
            { cleanedKey: 17, index: [571, 572, 573, 574, 591, 592, 593, 594], isFront: false, side: 2, },
            { cleanedKey: 18, index: [69, 70, 71, 72, 88, 89, 90, 91, 92, 93, 109, 110, 111, 112, 129, 130, 131, 132, 150, 151], isFront: false, side: 0, },
            { cleanedKey: 18, index: [68, 69, 70, 71, 72, 73, 87, 88, 89, 90, 91, 92, 93, 94], isFront: true, side: 0, },
            { cleanedKey: 19, index: [204, 205, 206, 224, 225, 226], isFront: false, side: 1, },
            { cleanedKey: 19, index: [215, 216, 217, 235, 236, 237], isFront: false, side: 2, },
            { cleanedKey: 20, index: [277, 278, 279, 297, 298, 299], isFront: true, side: 1, },
            { cleanedKey: 20, index: [262, 263, 264, 282, 283, 284], isFront: true, side: 2, },
            { cleanedKey: 21, index: [147, 148, 149, 167, 168, 169, 170, 187, 188, 189, 190, 208, 209], isFront: false, side: 1, },
            { cleanedKey: 21, index: [152, 153, 154, 171, 172, 173, 174, 191, 192, 193, 194, 212, 213], isFront: false, side: 2, },
            { cleanedKey: 22, index: [155, 156, 156, 175, 176, 177, 195, 196, 197], isFront: true, side: 1, },
            { cleanedKey: 22, index: [144, 145, 146, 164, 165, 166, 184, 185, 186], isFront: true, side: 2, },
            { cleanedKey: 23, index: [144, 145, 146, 164, 165, 166, 184, 185, 186], isFront: false, side: 1, },
            { cleanedKey: 23, index: [155, 156, 156, 175, 176, 177, 195, 196, 197], isFront: false, side: 2, },
            { cleanedKey: 24, index: [223, 242, 243, 244, 245, 262, 263, 264], isFront: false, side: 1, },
            { cleanedKey: 24, index: [238, 256, 257, 258, 259, 277, 278, 279], isFront: false, side: 2, },
            { cleanedKey: 24, index: [215, 216, 217, 235, 236, 237, 238, 256, 257, 258], isFront: true, side: 1, },
            { cleanedKey: 24, index: [204, 205, 206, 223, 224, 225, 226, 243, 244, 245], isFront: true, side: 2, },
            { cleanedKey: 27, index: [414, 415, 416, 434, 435, 436, 454, 455, 456], isFront: true, side: 1, },
            { cleanedKey: 27, index: [405, 406, 407, 425, 426, 427, 445, 446, 447], isFront: true, side: 2, },
            { cleanedKey: 28, index: [253, 254, 255, 273, 274, 275], isFront: true, side: 1, },
            { cleanedKey: 28, index: [246, 247, 248, 266, 267, 268], isFront: true, side: 2, },
            { cleanedKey: 29, index: [95, 96, 97, 114, 115, 116, 117, 135, 136, 137], isFront: true, side: 1, },
            { cleanedKey: 29, index: [84, 85, 86, 104, 105, 106, 107, 124, 125, 126], isFront: true, side: 2, },
            { cleanedKey: 29, index: [85, 86, 87, 105, 106, 107, 108, 125, 126, 127, 128], isFront: false, side: 1, },
            { cleanedKey: 29, index: [94, 95, 96, 113, 114, 115, 116, 133, 134, 135, 136], isFront: false, side: 2, },
        ];
        // filter out previous soreness
        let updatedBodyPartMapping = _.filter(bodyPartMapping, o => _.find(newSoreBodyParts, p => o.cleanedKey === p.body_part && o.side === p.side) ? null : o);
        // return cleaned array
        return updatedBodyPartMapping;
    },

    /**
      * Handle Body Part Selector Render Logic
      * - BodyPartSelector
      */
    // TODO: UNIT TEST ME
    handleBodyPartSelectorRenderLogic: (areaOfSorenessClicked, backInterpolate, frontInterpolate, BODY_PART_MAPPING, NUMBER_OF_OVERLAY_GRIDS_HEIGHT = 30, NUMBER_OF_OVERLAY_GRIDS_WIDTH = 20) => {
        let gridRange = _.range(1, ((NUMBER_OF_OVERLAY_GRIDS_HEIGHT * NUMBER_OF_OVERLAY_GRIDS_WIDTH) + 1));
        const backAnimatedStyle = { transform: [{ rotateY: backInterpolate, }], };
        const frontAnimatedStyle = { transform: [{ rotateY: frontInterpolate, }], };
        let mergedBodyParts = _.concat(areaOfSorenessClicked);
        let backBodyParts = _.filter(mergedBodyParts, o => _.find(BODY_PART_MAPPING, { cleanedKey: o.body_part, isFront: false, }));
        let frontBodyParts = _.filter(mergedBodyParts, o => _.find(BODY_PART_MAPPING, { cleanedKey: o.body_part, isFront: true, }));
        return {
            backAnimatedStyle,
            backBodyParts,
            frontAnimatedStyle,
            frontBodyParts,
            gridRange,
        };
    },

    /**
      * Handle Single Body Part Selector Render Logic
      * - BodyPartSelector
      */
    // TODO: UNIT TEST ME
    handleSingleBodyPartSelectorRenderLogic: (areaOfSorenessClicked, selectedBodyPart, body, isBack, _getImageString) => {
        let areasOfSorenessBodyPart = PlanLogic.handleAreasOfSorenessBodyPart(areaOfSorenessClicked, selectedBodyPart, []);
        let backSpecificImageStrings = ['Shoulder.svg', 'Forearm.svg', 'UpperBackNeck.svg'];
        let cleanedImageString = backSpecificImageStrings.includes(areasOfSorenessBodyPart.bodyImage) && isBack ?
            `${body.side === 2 ? 'R_' : body.side === 1 ? 'L_' : ''}${areasOfSorenessBodyPart.bodyImage.replace('.svg', '')}_Back.svg`
            :
            `${body.side === 2 ? 'R_' : body.side === 1 ? 'L_' : ''}${areasOfSorenessBodyPart.bodyImage}`;
        let bodyImage = _getImageString(cleanedImageString);
        let severityValue = body.ache && body.ache > 0 ?
            body.ache
            : body.sore && body.sore > 0 ?
                body.sore
                : body.tender && body.tender > 0 ?
                    body.tender
                    : body.knots && body.knots > 0 ?
                        body.knots
                        : body.sharp && body.sharp > 0 ?
                            body.sharp
                            : body.tight && body.tight > 0 ?
                                body.tight
                                :
                                10;
        let tintColor = severityValue > 0 && severityValue <= 3 ?
            '#F7E3AB'
            : severityValue > 3 && severityValue <= 6 ?
                '#F1CF6C'
                :
                AppColors.zeplin.yellow;
        return {
            bodyImage,
            tintColor,
        };
    },

    returnTrendsTabs: () => [
        {
            dataType: 0,
            index:    'apt',
            page:     0,
        },
        {
            dataType: 2,
            index:    'hip_drop',
            page:     1,
        },
        {
            dataType: 1,
            index:    'ankle_pitch',
            page:     2,
        },
        {
            dataType: 3,
            index:    'knee_valgus',
            page:     4,
        },
        {
            dataType: 4,
            index:    'hip_rotation',
            page:     5,
        }
    ],

    returnModalitiesDisplayImage: (displayName, isTab) => {
        /* eslint-disable indent */
        let image = displayName === 'dynamic_flexibility' && isTab ?
            require('../../assets/images/standard/dynamic_flexibility_tab.png')
            : displayName === 'dynamic_flexibility' && !isTab ?
            require('../../assets/images/standard/dynamic_flexibility_activity.png')
            : displayName === 'weighted_static_integrate' && isTab ?
            require('../../assets/images/standard/weighted_static_integrate_tab.png')
            : displayName === 'weighted_static_integrate' && !isTab ?
            require('../../assets/images/standard/weighted_static_integrate_activity.png')
            : displayName === 'dynamic_stretch' && isTab ?
            require('../../assets/images/standard/dynamic_stretch_tab.png')
            : displayName === 'dynamic_stretch' && !isTab ?
            require('../../assets/images/standard/dynamic_stretch_activity.png')
            : displayName === 'integrate_power' && isTab ?
            require('../../assets/images/standard/integrate_power_tab.png')
            : displayName === 'integrate_power' && !isTab ?
            require('../../assets/images/standard/integrate_power_activity.png')
            : displayName === 'integreate_speed' && isTab ?
            require('../../assets/images/standard/integreate_speed_tab.png')
            : displayName === 'integreate_speed' && !isTab ?
            require('../../assets/images/standard/integreate_speed_activity.png')
            : displayName === 'isolated_activation' && isTab ?
            require('../../assets/images/standard/isolated_activation_tab.png')
            : displayName === 'isolated_activation' && !isTab ?
            require('../../assets/images/standard/isolated_activation_activity.png')
            : displayName === 'static_integrate' && isTab ?
            require('../../assets/images/standard/static_integrate_tab.png')
            : displayName === 'static_integrate' && !isTab ?
            require('../../assets/images/standard/static_integrate_activity.png')
            : displayName === 'static_stretch' && isTab ?
            require('../../assets/images/standard/static_stretch_tab.png')
            : displayName === 'static_stretch' && !isTab ?
            require('../../assets/images/standard/static_stretch_activity.png')
            : displayName === 'inhibit' && isTab ?
            require('../../assets/images/standard/inhibit_tab.png')
            :
            require('../../assets/images/standard/inhibit_activity.png');
        return image;
    },

    returnOnDemandModalitiesImage: imageString => {
        /* eslint-disable indent */
        let image = imageString === 'pre_active_rest' ?
            require('../../assets/images/sports_images/pre_active_rest.png')
            : imageString === 'post_active_rest' ?
                require('../../assets/images/sports_images/post_active_rest.png')
            : imageString === 'warm_up' ?
                require('../../assets/images/sports_images/warm_up.png')
            : imageString === 'cool_down' ?
                require('../../assets/images/sports_images/cool_down.png')
            : imageString === 'functional_strength' ?
                require('../../assets/images/sports_images/functional_strength.png')
            :
            require('../../assets/images/sports_images/pre_active_rest.png');
        return image;
    },

    /**
      * Handle Biomechanics Tab View Render Logic
      * - Biomechanics
      */
    // TODO: UNIT TEST ME
    handleBiomechanicsTabViewRenderLogic: (session, data) => {
        let sessionData = session[data.index];
        let parsedDescriptionTextData = [];
        if(sessionData.description.active) {
            parsedDescriptionTextData = _.map(sessionData.description.bold_text, prop => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold];
                return newParsedData;
            });
        }
        let parsedAsymmetryDetailTextData = [];
        if(sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_text && sessionData.asymmetry.detail_text.length > 0) {
            parsedAsymmetryDetailTextData = _.map(sessionData.asymmetry.detail_bold_text, prop => {
                let newParsedData = {};
                newParsedData.pattern = new RegExp(prop.text, 'i');
                newParsedData.style = [AppStyles.robotoBold, {color: PlanLogic.returnInsightColorString(prop.color),}];
                return newParsedData;
            });
        }
        const extraInnerRadiusToRemove = Platform.OS === 'ios' ? 0 : AppSizes.padding;
        const pieWrapperWidth = (AppSizes.screen.widthHalf);
        const platformRadiusAddOn = Platform.OS === 'ios' ? 0 : AppSizes.padding;
        const pieInnerRadiusMultiplier = 4;
        let pieInnerRadius = (AppSizes.padding * pieInnerRadiusMultiplier);
        pieInnerRadius = data.data_type === 3 ? (AppSizes.padding + AppSizes.paddingXSml) : pieInnerRadius;
        const piePadding = data.data_type === 3 ? AppSizes.paddingXSml : AppSizes.paddingSml;
        const pieDetails = {
            pieData:        sessionData.summary_data,
            pieHeight:      pieWrapperWidth,
            pieInnerRadius: data.data_type === 3 ? ((pieInnerRadius - extraInnerRadiusToRemove) + platformRadiusAddOn) : (piePadding + (pieWrapperWidth * 0.35)),
            piePadding:     piePadding,
            pieWidth:       pieWrapperWidth,
        };
        let chartLegend = (sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_legend) || [];
        let chartActiveLegend = _.find(chartLegend, legend => legend.active);
        let chartInactiveLegend = _.find(chartLegend, legend => !legend.active);
        let chartData = (sessionData && sessionData.asymmetry && sessionData.asymmetry.detail_data) || [];
        let updatedChartData = _.map(chartData, (chartDetails, index) => {
            let newDataObjLeft = {};
            newDataObjLeft.x = chartDetails.x;
            newDataObjLeft.y = chartDetails.y1;
            newDataObjLeft.color = PlanLogic.returnInsightColorString(chartDetails.flag === 1 ? chartActiveLegend.color[0] : chartInactiveLegend.color[0]);
            let newDataObjRight = {};
            newDataObjRight.x = chartDetails.x;
            newDataObjRight.y = chartDetails.y2;
            newDataObjRight.color = PlanLogic.returnInsightColorString(chartDetails.flag === 1 ? chartActiveLegend.color[1] : chartInactiveLegend.color[1]);
            return [newDataObjLeft, newDataObjRight];
        });
        let sessionHours = _.floor(session.duration / 3600);
        let updatedTime = session.duration - sessionHours * 3600;
        let sessionMinutes = _.floor(updatedTime / 60);
        let sessionSeconds = (new Array(2 + 1).join('0') + (updatedTime - sessionMinutes * 60)).slice(-2);
        let sessionDuration = `${sessionHours > 0 ? `${sessionHours}:` : ''}${sessionMinutes === 0 ? '00' : sessionHours > 0 && sessionMinutes < 10 ? `0${sessionMinutes}` : sessionMinutes}:${sessionSeconds === 0 ? '00' : sessionSeconds}`;
        return {
            parsedAsymmetryDetailTextData,
            parsedDescriptionTextData,
            pieDetails,
            sessionData,
            sessionDuration,
            updatedChartData,
        };
    },

};

/* Export ==================================================================== */
export default PlanLogic;
