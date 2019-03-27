// import third-party libraries
import moment from 'moment';

export default {
    // Defaults
    default:     'Hmm, an unknown error occured.',
    systemError: 'Something went wrong. Please try again.',
    timeout:     'Server Timed Out. Please try again.',

    // network errors
    connectingToNetwork:            'CONNECTING',
    noInternetConnection:           'INTERNET CONNECTION LOST. PLEASE TRY AGAIN...',
    serverUnavailable:              'SERVER UNAVAILABLE. PLEASE TRY AGAIN...',
    getScheduledMaintenanceMessage: maintenanceWindowObj => {
        if(maintenanceWindowObj.start_date && maintenanceWindowObj.end_date) {
            const currentLocalDateTime = moment();
            const localStartDate = moment.utc(maintenanceWindowObj.start_date).toDate();
            const localEndDate = moment.utc(maintenanceWindowObj.end_date).toDate();
            let message = '';
            let displayAlert = true;
            let startTime = moment(localStartDate);
            let endTime = moment(localEndDate);
            if(endTime < currentLocalDateTime) {
                displayAlert = false;
            } else if(currentLocalDateTime.isBetween(startTime, endTime)) {
                message = `We are currently in a scheduled maintenance window until ${endTime.format('h:mm A')} ${endTime.format('dddd, MMMM DD, YYYY')}. We apologize for the inconvenience.`;
            } else {
                if(startTime.format('DD') === endTime.format('DD')) {
                    message = `Service will be interrupted from ${startTime.format('h:mm A')} - ${endTime.format('h:mm A')} on ${startTime.format('dddd, MMMM DD, YYYY')}. We apologize for the inconvenience.`;
                } else {
                    message = `Service will be interrupted from ${startTime.format('h:mm A dddd, MMMM DD')} to ${endTime.format('h:mm A dddd, MMMM DD, YYYY')}. We apologize for the inconvenience.`;
                }
            }
            return {
                displayAlert: displayAlert,
                header:       'Scheduled Maintenance',
                message:      message,
            }
        }
        return { displayAlert: false, header: null, message: null, };
    },

    // sensor error messages
    sensor: {
        connectionError: 'BRING SENSOR IN RANGE TO SYNC',
        retreivalError:  'BRING SENSOR BACK IN RANGE TO CONTINUE SYNCING',
        serverError:     'SYNC SUCCESSFUL, CONNECT TO INTERNET TO COMPLETE',
    },

    // API errors
    coachesDashboardData:    'There was an error fetching your Team data. Please try again.',
    getMyPlan:               'There was an error getting your plan. Please try again.',
    getSoreBodyParts:        'There was an error getting your plan. Please try again.',
    postReadinessSurvey:     'There was an error saving your plan. Please try again.',
    postSessionSurvey:       'There was an error saving your plan. Please try again.',
    patchFunctionalStrength: 'There was an error saving your plan. Please try again.',
    patchActiveRecovery:     'There was an error saving your plan. Please try again.',
    noSessions:              'There was an error saving your plan. Please try again.',

};
