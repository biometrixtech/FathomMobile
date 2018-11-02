// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { MyPlan as MyPlanConstants, } from '../constants';

const PlanLogic = {

    /**
      * Takes care of the different possible PNs that can come in
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
      */
    handleDailyReadinessAndPostSessionFormChange: (name, value, isPain, bodyPart, side, state) => {
        // setup varibles
        let newFormFields;
        // logic
        if(name === 'soreness' && bodyPart) {
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

    /**
      * Updates to the state when the area of soreness is clicked on daily readiness & post session forms
      */
    handleAreaOfSorenessClick: (stateObject, areaClicked, isAllGood, soreBodyPartsPlan) => {
        // setup varibles
        let newSorenessFields = _.cloneDeep(stateObject.soreness);
        // logic
        if(!areaClicked && isAllGood) {
            let soreBodyParts = _.intersectionBy(stateObject.soreness, soreBodyPartsPlan.body_parts, 'body_part');
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
                    newLeftSorenessPart.pain = false;
                    newLeftSorenessPart.severity = null;
                    newLeftSorenessPart.side = 1;
                    newSorenessFields.push(newLeftSorenessPart);
                    let newRightSorenessPart = {};
                    newRightSorenessPart.body_part = areaClicked.index;
                    newRightSorenessPart.pain = false;
                    newRightSorenessPart.severity = null;
                    newRightSorenessPart.side = 2;
                    newSorenessFields.push(newRightSorenessPart);
                } else {
                    let newSorenessPart = {};
                    newSorenessPart.body_part = areaClicked.index;
                    newSorenessPart.pain = false;
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

};

/* Export ==================================================================== */
export default PlanLogic;
