/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:14 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-16 17:26:37
 */

/**
 * App Error Messages
 */

export default {
    // Defaults
    default:     'Hmm, an unknown error occurred',
    timeout:     'Server Timed Out. Check your internet connection',
    invalidJson: 'Response returned is not valid JSON',

    ATHLETE_PREPROCESSING_UPLOADING:  'Your session is still uploading - make sure your kit has wifi access and check back soon.',
    ATHLETE_PREPROCESSING_PROCESSING: 'We\'re processing your session now - check back soon.',
    ATHLETE_PREPROCESSING_ERROR:      'Uh Oh! One of your sessions was an odd ball. We\'re on it and will get you your results soon.',

    SINGLE_PREPROCESSING_UPLOADING:  '1 athlete is still uploading sessions - make sure their kit has wifi access and check back soon.',
    SINGLE_PREPROCESSING_PROCESSING: '1 athlete\'s session is still processing - check back soon.',
    SINGLE_PREPROCESSING_ERROR:      'Uh Oh! 1 of your sessions was an odd ball. We\'re on it and will get you your results soon.',

    MULTIPLE_PREPROCESSING_UPLOADING:  'X athletes are still uploading sessions - make sure their kits have wifi access and check back soon.',
    MULTIPLE_PREPROCESSING_PROCESSING: 'X athletes\' session are still processing - check back soon.',
    MULTIPLE_PREPROCESSING_ERROR:      'Uh Oh! X of your sessions were odd balls. We\'re on it and will get you your results soon.',
};
