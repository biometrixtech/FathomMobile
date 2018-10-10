/*
 * @Author: Vir Desai
 * @Date: 2018-04-30 13:24:02
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-06-29 01:24:17
 */

// import third-party libraries
import moment from 'moment';

export default {
    // Defaults
    default:          'Hmm, an unknown error occured',
    timeout:          'Server Timed Out. Check your internet connection',
    invalidJson:      'Response returned is not valid JSON',
    deviceRegistered: 'Device already registered',

    // User
    userExists:         'user already exists',
    missingFirstName:   'First name is missing',
    missingLastName:    'Last name is missing',
    missingEmail:       'Email is missing',
    missingPassword:    'Password is missing',
    passwordsDontMatch: 'Passwords do not match',

    // Stats errors
    ATHLETE_PREPROCESSING_UPLOADING:  'Your session is still uploading - make sure your kit has wifi access and check back soon.',
    ATHLETE_PREPROCESSING_PROCESSING: 'We\'re processing your session now - check back soon.',
    ATHLETE_PREPROCESSING_ERROR:      'Uh Oh! One of your sessions was an odd ball. We\'re on it and will get you your results soon.',

    SINGLE_PREPROCESSING_UPLOADING:  '1 athlete is still uploading sessions - make sure their kit has wifi access and check back soon.',
    SINGLE_PREPROCESSING_PROCESSING: '1 athlete\'s session is still processing - check back soon.',
    SINGLE_PREPROCESSING_ERROR:      'Uh Oh! 1 of your sessions was an odd ball. We\'re on it and will get you your results soon.',

    MULTIPLE_PREPROCESSING_UPLOADING:  'X athletes are still uploading sessions - make sure their kits have wifi access and check back soon.',
    MULTIPLE_PREPROCESSING_PROCESSING: 'X athletes\' session are still processing - check back soon.',
    MULTIPLE_PREPROCESSING_ERROR:      'Uh Oh! X of your sessions were odd balls. We\'re on it and will get you your results soon.',

    // network errors
    noInternetConnection:           'INTERNET CONNECTION LOST. TRYING TO RECONNECT...',
    serverUnavailable:              'SERVER UNAVAILABLE. TRYING TO RECONNECT...',
    connectingToNetwork:            'CONNECTING',
    getScheduledMaintenanceMessage: (maintenanceWindowObj) => {
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
        return { displayAlert: false, header: null, message: null }
    },

    // sensor error messages
    sensor: {
        connectionError: 'BRING SENSOR IN RANGE TO SYNC',
        retreivalError:  'BRING SENSOR BACK IN RANGE TO CONTINUE SYNCING',
        serverError:     'SYNC SUCCESSFUL, CONNECT TO INTERNET TO COMPLETE',
    },

    // API errors
    getMyPlan:               'There was an error getting your plan specific data. Please try again!',
    getSoreBodyParts:        'There was an error getting your plan specific data. Please try again!',
    postReadinessSurvey:     'There was an error saving your plan specific data. Please try again!',
    postSessionSurvey:       'There was an error saving your plan specific data. Please try again!',
    preReadiness:            'There was an error getting your plan specific data. Please try again!',
    patchFunctionalStrength: 'There was an error saving your plan specific data. Please try again!',
    patchActiveRecovery:     'There was an error saving your plan specific data. Please try again!',
    noSessions:              'There was an error saving your plan specific data. Please try again!',

};
