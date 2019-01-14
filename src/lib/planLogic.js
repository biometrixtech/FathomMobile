// import third-party libraries
import _ from 'lodash';
import moment from 'moment';

// Consts and Libs
import { AppColors, MyPlan as MyPlanConstants, } from '../constants';

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
        if(props.notification === 'COMPLETE_ACTIVE_PREP' && !dailyPlan.pre_recovery_completed) {
            // go to screen 0 & open active prep
            pushNotificationUpdate.newStateFields = _.update( state.prepare, 'isActiveRecoveryCollapsed', () => false);
            pushNotificationUpdate.stateName = 'prepare';
            pushNotificationUpdate.updatePushNotificationFlag = true;
        } else if(props.notification === 'COMPLETE_ACTIVE_RECOVERY' && !dailyPlan.post_recovery.completed) {
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
    handleDailyReadinessAndPostSessionFormChange: (name, value, isPain, bodyPart, side, state) => {
        // setup varibles
        let newFormFields;
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
                newSorenessFields[sorenessIndex].severity = value;
            } else {
                // doesn't exist, create new object
                let newSorenessPart = {};
                newSorenessPart.body_part = bodyPart;
                newSorenessPart.pain = isPain;
                newSorenessPart.severity = value;
                newSorenessPart.side = side ? side : 0;
                newSorenessFields.push(newSorenessPart);
            }
            newFormFields = _.update( state, 'soreness', () => newSorenessFields);
        } else {
            newFormFields = _.update( state, name, () => value);
        }
        // return
        return newFormFields;
    },

    returnEmptySession: () => {
        let postSessionSurvey = {
            event_date: `${moment().toISOString(true).split('.')[0]}Z`,
            RPE:        -1,
            soreness:   [],
        };
        return {
            description:                    '',
            duration:                       0,
            event_date:                     null,
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
    handleAreaOfSorenessClick: (stateObject, areaClicked, isAllGood, soreBodyPartsPlan) => {
        // setup varibles
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        // logic
        if(!areaClicked && isAllGood) {
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
      * Cleaning of Sport Text String
      * - SportScheduleBuilder
      */
    handleGetFinalSportTextString: (selectedSport, filteredSessionType, postSession, isFormValid, step, selectedStartTime, selectedDuration) => {
        let selectedSessionType = filteredSessionType && filteredSessionType.length > 0 ? filteredSessionType[0].label.toLowerCase() : postSession.session_type === 1 ? 'training' : '';
        let sportText = step === 0 || step === 1 ? 'activity type' : step === 2 ? `${selectedSport} ` : `${selectedSport} ${selectedSessionType}`;
        let startTimeText = (step === 3 || step === 4) && !isFormValid ? 'time' : (step === 3 || step === 4) && isFormValid ? `${selectedStartTime.format('h:mm')}` : '';
        let durationText = step === 3 && !isFormValid ? 'duration' : `${selectedDuration}`;
        return {
            durationText,
            sportText,
            startTimeText,
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
        let areQuestionsValid = postSession.RPE > 0 && postSession.event_date;
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => o.severity > 0 || o.severity === 0).length === filteredSoreBodyParts.length : true;
        let areAreasOfSorenessValid = (
            _.filter(filteredAreasOfSoreness, o => o.severity > 0 || o.severity === 0).length > 0
        );
        let isFormValid = areQuestionsValid && (areSoreBodyPartsValid || postSession.soreness.length === 0) && areAreasOfSorenessValid;
        let isFormValidItems = {
            areAreasOfSorenessValid,
            isPrevSorenessValid:        (areSoreBodyPartsValid || postSession.soreness.length === 0),
            selectAreasOfSorenessValid: areasOfSorenessRef && areasOfSorenessRef.state ? filteredAreasOfSoreness.length > 0 || areasOfSorenessRef.state.isAllGood : false,
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
        let areSoreBodyPartsValid = filteredSoreBodyParts.length > 0 ? _.filter(filteredSoreBodyParts, o => o.severity > 0 || o.severity === 0).length === filteredSoreBodyParts.length : true;
        let areAreasOfSorenessValid = (
            _.filter(filteredAreasOfSoreness, o => o.severity > 0 || o.severity === 0).length > 0
        );
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
        let bodyParts = soreBodyParts && soreBodyParts.body_parts ? _.cloneDeep(soreBodyParts.body_parts) : [];
        let histSoreStatus = soreBodyParts && soreBodyParts.hist_sore_status ? _.cloneDeep(soreBodyParts.hist_sore_status) : [];
        let clearCandidates = soreBodyParts && soreBodyParts.clear_candidates ? _.cloneDeep(soreBodyParts.clear_candidates) : [];
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
        let bodyPartMap = bodyPart.body_part ? MyPlanConstants.bodyPartMapping[bodyPart.body_part] : MyPlanConstants.bodyPartMapping[bodyPart.index];
        let bodyPartGroup = bodyPartMap ? bodyPartMap.group : false;
        let sorenessPainMapping =
            bodyPartGroup && bodyPartGroup === 'muscle' && pageStateType.length > 0 ?
                MyPlanConstants.muscleLevels[pageStateType]
                : bodyPartGroup && bodyPartGroup === 'joint' ?
                    MyPlanConstants.jointLevels
                    :
                    [];
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
            bodyPartMap,
            bodyPartName,
            bodyPartGroup,
            helpingVerb,
            sorenessPainMapping,
        };
    },

    /**
      * Sport Schedule Builder Render Logic
      * - SportScheduleBuilder
      */
    handleSportScheduleBuilderRenderLogic: (postSession, pageState) => {
        let filteredTeamSports = _.filter(MyPlanConstants.teamSports, o => o.order && o.order > 0);
        let teamSports = _.orderBy(filteredTeamSports, ['order'], ['asc']);
        let filteredStrengthConditioningTypes = _.filter(MyPlanConstants.strengthConditioningTypes, o => o.order && o.order > 0);
        let strengthConditioningTypes = _.orderBy(filteredStrengthConditioningTypes, ['order'], ['asc']);
        let filteredSessionTypes = _.filter(MyPlanConstants.availableSessionTypes, o => o.order && o.order > 0);
        let sessionTypes = _.orderBy(filteredSessionTypes, ['order'], ['asc']);
        let filteredSport = postSession.sport_name || postSession.sport_name === 0 ? _.filter(teamSports, ['index', postSession.sport_name]) : postSession.strength_and_conditioning_type || postSession.strength_and_conditioning_type === 0 ? _.filter(strengthConditioningTypes, ['index', postSession.strength_and_conditioning_type]) : null;
        let selectedSport = filteredSport && filteredSport.length > 0 ? filteredSport[0].label.toLowerCase().replace(' training', '') : '';
        let filteredSessionType = postSession.session_type || postSession.session_type === 0 ? _.filter(sessionTypes, ['index', postSession.session_type]) : null;
        let dateTimeDurationFromState = PlanLogic.handleGetDateTimeDurationFromState(pageState.durationValueGroups, pageState.isFormValid, pageState.timeValueGroups);
        let selectedStartTime = dateTimeDurationFromState.event_date;
        let selectedDuration = dateTimeDurationFromState.duration;
        let getFinalSportTextString = PlanLogic.handleGetFinalSportTextString(selectedSport, filteredSessionType, postSession, pageState.isFormValid, pageState.step, selectedStartTime, selectedDuration);
        let sportText = getFinalSportTextString.sportText;
        let startTimeText = getFinalSportTextString.startTimeText;
        let durationText = getFinalSportTextString.durationText;
        let isSport = postSession.sport_name > 0 || postSession.sport_name === 0 ? true : false;
        let filteredSportSessionTypes = isSport ? _.filter(sessionTypes, type => !type.ignoreSelection) : sessionTypes;
        return {
            durationText,
            filteredSportSessionTypes,
            selectedSport,
            sportText,
            startTimeText,
            strengthConditioningTypes,
            teamSports,
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
        let mainColor = selectedAthlete.color === 0 ? AppColors.zeplin.success : selectedAthlete.color === 1 ? AppColors.zeplin.warning : AppColors.zeplin.error;
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
        let complianceObj = selectedTeam ? selectedTeam.compliance : {completed: [], incomplete: [], training_compliance: {}};
        let numOfCompletedAthletes = complianceObj && complianceObj.complete ? complianceObj.complete.length : 0;
        let numOfIncompletedAthletes = complianceObj ? complianceObj.incomplete.length : 0;
        let numOfTotalAthletes = numOfCompletedAthletes + numOfIncompletedAthletes;
        let incompleteAtheltes = complianceObj ? complianceObj.incomplete : [];
        let completedAtheltes = complianceObj && complianceObj.complete ? complianceObj.complete : [];
        let completedPercent = (numOfCompletedAthletes / numOfTotalAthletes) * 100;
        let complianceColor = completedPercent <= 49 ?
            AppColors.zeplin.error
            : completedPercent >= 50 && completedPercent <= 74 ?
                AppColors.zeplin.warning
                :
                AppColors.zeplin.success;
        complianceColor = numOfTotalAthletes === 0 ? AppColors.zeplin.error : complianceColor;
        let trainingCompliance = complianceObj ? complianceObj.training_compliance : [];
        return {
            coachesTeams,
            completedAtheltes,
            complianceColor,
            incompleteAtheltes,
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
            _.filter(compliance.complete, ['user_id', item.user_id]).length > 0
            :
            false;
        let athleteName = `${didUserCompleteReadinessSurvey ? '' : '*'}${item.first_name.toUpperCase()}\n${item.last_name.charAt(0).toUpperCase()}.`;
        let backgroundColor = item.color === 0 ? AppColors.zeplin.success : item.color === 1 ? AppColors.zeplin.warning : AppColors.zeplin.error;
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
    handleReadinessSurveyNextPage: (pageState, dailyReadiness, currentPage, isFormValidItems, isBackBtn, isFirstFunctionalStrength, isSecondFunctionalStrength, newSoreBodyParts, sportBuilderRPEIndex, areaOfSorenessClicked) => {
        let pageNum = 0;
        let isValid = false;
        if(currentPage === 0) { // 0. GOOD [TIME OF DAY], MAZEN!
            pageNum = isFirstFunctionalStrength ? 1 : 2;
            isValid = true;
        } else if(currentPage === 1) { // 1. first FS
            pageNum = isBackBtn ? 0 : 2;
            isValid = isFormValidItems.isFunctionalStrengthValid;
        } else if(currentPage === 2) { // 2. questions
            pageNum = isBackBtn && isFirstFunctionalStrength ? 1 : isBackBtn && !isFirstFunctionalStrength ? 0 : 3;
            isValid = isFormValidItems.areQuestionsValid;
        } else if(currentPage === 3) { // 3. trained already?
            if(isBackBtn) {
                pageNum = 2;
            } else {
                pageNum = dailyReadiness.already_trained_number === false && (newSoreBodyParts && newSoreBodyParts.length === 0) ?
                    (pageState.pageIndex + 3)
                    : dailyReadiness.already_trained_number === false && (newSoreBodyParts && newSoreBodyParts.length > 0) ?
                        (pageState.pageIndex + 2)
                        :
                        (pageState.pageIndex + 1);
            }
            isValid = isFormValidItems.isTrainedTodayValid;
        } else if(currentPage === 4) { // 4. SportScheduleBuilder & RPE
            if(isBackBtn) {
                pageNum = pageState.pageIndex - 1;
            } else {
                pageNum = (newSoreBodyParts && newSoreBodyParts.length === 0) && (sportBuilderRPEIndex + 1) === dailyReadiness.sessions.length ?
                    (pageState.pageIndex + 2)
                    :
                    (pageState.pageIndex + 1);
            }
            isValid = true; // can only click if form is valid
        } else if(currentPage === 5) { // 5. previous soreness
            if(isBackBtn) {
                pageNum = dailyReadiness.sessions.length === 0 ?
                    (pageState.pageIndex - 2)
                    :
                    (pageState.pageIndex - 1);
            } else {
                pageNum = pageState.pageIndex + 1;
            }
            isValid = isFormValidItems.isPrevSorenessValid;
        } else if(currentPage === 6) { // 6. areas of soreness - body parts
            if(isBackBtn) {
                pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ?
                    (pageState.pageIndex - 1)
                    : (newSoreBodyParts && newSoreBodyParts.length === 0) && dailyReadiness.sessions.length === 0 ?
                        (pageState.pageIndex - 3)
                        :
                        (pageState.pageIndex - 2);
            } else {
                pageNum = areaOfSorenessClicked.length > 0 ? (pageState.pageIndex + 1) : (pageState.pageIndex + 2);
            }
            isValid = isFormValidItems.selectAreasOfSorenessValid;
        } else if(currentPage === 7) { // 7. areas of soreness - selected body parts
            pageNum = isBackBtn ? (pageState.pageIndex - 1) : (pageState.pageIndex + 1);
            isValid = isFormValidItems.areAreasOfSorenessValid;
        } else if(currentPage === 8) { // 8. train later today?
            if(isBackBtn) {
                pageNum = areaOfSorenessClicked.length > 0 ? (pageState.pageIndex - 1) : (pageState.pageIndex - 2);
            } else {
                pageNum = pageState.pageIndex + 1;
            }
            isValid = isFormValidItems.willTrainLaterValid;
        } else if(currentPage === 9) { // 9. second FS
            pageNum = isBackBtn ? (pageState.pageIndex - 1) : pageState.pageIndex;
            isValid = isFormValidItems.isSecondFunctionalStrengthValid;
        }
        return {
            isValid,
            pageNum,
        };
    },

    /**
      * Next Page & Validation Logic
      * - PostSessionSurvey
      */
    handlePostSessionSurveyNextPage: (postSession, currentPage, isFormValidItems, isBackBtn, newSoreBodyParts, areaOfSorenessClicked) => {
        let isValid = false;
        let pageNum = 0;
        if(currentPage === 0) { // Sport Builder
            pageNum = 1;
            isValid = isFormValidItems.isSportValid;
        } else if(currentPage === 1) { // RPE
            pageNum = isBackBtn ? 0 : (newSoreBodyParts && newSoreBodyParts.length > 0) ? 2 : 3;
            isValid = isFormValidItems.isRPEValid;
        } else if(currentPage === 2) { // Previous Soreness
            pageNum = isBackBtn ? 1 : 3;
            isValid = isFormValidItems.isPrevSorenessValid;
        } else if(currentPage === 3) { // Areas of Soreness
            if(isBackBtn) {
                pageNum = (newSoreBodyParts && newSoreBodyParts.length > 0) ? 2 : 1;
            } else {
                pageNum = areaOfSorenessClicked.length > 0 ? 4 : 3;
            }
            isValid = isFormValidItems.selectAreasOfSorenessValid;
        } else if(currentPage === 4) { // Areas of Soreness Selected
            pageNum = isBackBtn ? 3 : 4;
            isValid = isFormValidItems.areAreasOfSorenessValid;
        }
        return {
            isValid,
            pageNum,
        };
    }

};

/* Export ==================================================================== */
export default PlanLogic;
