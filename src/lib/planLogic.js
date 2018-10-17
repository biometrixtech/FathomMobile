// import third-party libraries
import _ from 'lodash';

// Consts and Libs
import { AppUtil, } from './';

const PlanLogic = {

    /**
      * Takes care of the different possible PNs that can come in
      */
    handlePushNotification: (props, state) => {
        // setup varibles
        let dailyPlan = props.plan.dailyPlan[0];
        const validNotifs = ['COMPLETE_ACTIVE_PREP', 'COMPLETE_ACTIVE_RECOVERY', 'COMPLETE_DAILY_READINESS', 'VIEW_PLAN',];
        let returnObj = {
            newStateFields:             '',
            page:                       0,
            stateName:                  '',
            updateExerciseList:         false,
            updatePushNotificationFlag: false,
        }
        // logic
        if(props.notification === 'COMPLETE_ACTIVE_PREP' && !dailyPlan.pre_recovery_completed) {
            // go to screen 0 & open active prep
            returnObj.newStateFields = _.update( state.prepare, 'isActiveRecoveryCollapsed', () => false);
            returnObj.stateName = 'prepare';
            returnObj.updatePushNotificationFlag = true;
        } else if(props.notification === 'COMPLETE_ACTIVE_RECOVERY' && !dailyPlan.post_recovery.completed) {
            // go to screen 2 & open active recovery
            returnObj.page = 2;
            returnObj.newStateFields = _.update( state.recover, 'isActiveRecoveryCollapsed', () => false);
            returnObj.stateName = 'recover';
            returnObj.updatePushNotificationFlag = true;
        } else if(props.notification === 'COMPLETE_DAILY_READINESS' && !dailyPlan.daily_readiness_survey_completed) {
            // go to screen 0 & open daily_readiness
            returnObj.newStateFields = true;
            returnObj.stateName = 'isReadinessSurveyModalOpen';
            returnObj.updatePushNotificationFlag = true;
        } else if(props.notification === 'VIEW_PLAN' || !validNotifs.includes(props.notification)) {
            // added catch in case of view plan or other message, do what we did in the past
            returnObj.updateExerciseList = true;
            returnObj.updatePushNotificationFlag = true;
        }
        // return
        return returnObj;
    },

};

/* Export ==================================================================== */
export default PlanLogic;
