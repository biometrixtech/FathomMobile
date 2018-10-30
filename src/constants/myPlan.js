/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 12:28:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-03 04:40:43
 */

// import RN components
import { Image } from 'react-native';

// const & libs
import { Actions , AppColors, } from './';
import { store } from '../store';

// import third-party libraries
import _ from 'lodash';

/**
 * MyPlan Config
 */

const bodyPartMapping = [
    {index: 0, order: null, label: 'Head', location: '', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 1, order: null, label: 'Shoulder', location: '', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 2, order: null, label: 'Chest', location: '', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 3, order: 1, label: 'Abdominals', location: 'front', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'are'},
    {index: 4, order: 3, label: 'Hip', location: 'front', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 5, order: 2, label: 'Groin', location: 'front', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 6, order: 5, label: 'Quads', location: 'front', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 7, order: 7, label: 'Knee', location: 'front', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 8, order: 4, label: 'Shin', location: 'front', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 9, order: 8, label: 'Ankle', location: 'front', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 10, order: 9, label: 'Foot', location: 'front', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 11, order: 6, label: 'IT Band', location: 'front', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 12, order: 11, label: 'Lower Back', location: 'back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'is'},
    {index: 13, order: null, label: 'General', location: '', group: '', image: {}, bilateral: false, helping_verb: ''},
    {index: 14, order: 12, label: 'Glutes', location: 'back', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 15, order: 13, label: 'Hamstrings', location: 'back', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 16, order: 14, label: 'Calves', location: 'back', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 17, order: 15, label: 'Achilles', location: 'back', group: 'joint', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 18, order: 10, label: 'Upper Back', location: 'back', group: 'muscle', image: {0: 'UpperBackNeck.svg'}, bilateral: false, helping_verb: 'is'},
];

const overallReadiness = [
    '',
    'Not At All Ready',
    'Not Ready',
    'Ready',
    'Very Ready',
    'Max Ready',
];

const sleepQuality = [
    '',
    'Terribly',
    'Poor',
    'Well',
    'Very well',
    'Max well',
];

const muscleLevels = {
    soreness: [
        '',
        'Tight',
        'Sore',
        'Movement Limited',
        'Struggling to Move',
        'Cannot Move',
    ],
    pain: [
        '',
        'Barely Noticeable',
        'Dull Pain',
        'Sharp Pain',
        'Pain Limits Movement ',
        'Too Painful to Move',
    ],
};

const jointLevels = [
    '',
    'Ache',
    'Dull Pain',
    'Sharp Pain',
    'Pain Limits Movement',
    'Too Painful to Move',
];

function sorenessPainScaleMapping(type, value, isJoint) {
    let newValue = 0;
    if(type === 'soreness') {
        switch (value) {
        case 1:
            newValue = 1;
            break;
        case 2:
            newValue = 2;
            break;
        case 3:
            newValue = 3;
            break;
        case 4:
            newValue = 4;
            break;
        case 5:
            newValue = 5;
            break;
        default:
            newValue = 0;
        }
    } else if(type === 'pain') {
        switch (value) {
        case 1:
            newValue = 1;
            break;
        case 2:
            newValue = 2;
            break;
        case 3:
            newValue = 3;
            break;
        case 4:
            newValue = 4;
            break;
        case 5:
            newValue = 5;
            break;
        default:
            newValue = 0;
        }
    } else if(!type && isJoint) {
        switch (value) {
        case 1:
            newValue = 1;
            break;
        case 2:
            newValue = 2;
            break;
        case 3:
            newValue = 3;
            break;
        case 4:
            newValue = 4;
            break;
        case 5:
            newValue = 5;
            break;
        default:
            newValue = 0;
        }
    }
    return newValue;
}

const exerciseListOrder = [
    {
        index: 'inhibit_exercises',
        title: 'INHIBIT',
    },
    {
        index: 'lengthen_exercises',
        title: 'LENGTHEN',
    },
    {
        index: 'activate_exercises',
        title: 'ACTIVATE',
    },
    {
        index: 'integrate_exercises',
        title: 'INTEGRATE',
    },
];

const postSessionFeel = [
    '',
    'Effortless',
    '',
    'Light',
    '',
    'Moderate',
    '',
    'Vigorous',
    '',
    'Very Hard',
    'Max effort',
];

function cleanExerciseList(recoveryObj) {
    let totalLength = 0;
    let cleanedExerciseList = {};
    _.map(exerciseListOrder, list => {
        let exerciseArray = _.orderBy(recoveryObj[list.index], ['position_order'], ['asc']);
        totalLength += exerciseArray.length;
        cleanedExerciseList[list.title] = exerciseArray;
    });
    return {
        cleanedExerciseList,
        totalLength,
    };
}



const fsExerciseListOrder = [
    {
        index: 'warm_up',
        title: 'WARM UP',
    },
    {
        index: 'dynamic_movement',
        title: 'DYNAMIC MOVEMENTS',
    },
    {
        index: 'stability_work',
        title: 'STABILITY',
    },
    {
        index: 'victory_lap',
        title: 'VICTORY LAP',
    },
];

function cleanFSExerciseList(recoveryObj) {
    let totalLength = 0;
    let cleanedExerciseList = {};
    _.map(fsExerciseListOrder, list => {
        let exerciseArray = _.orderBy(recoveryObj[list.index], ['position_order'], ['asc']);
        totalLength += exerciseArray.length;
        cleanedExerciseList[list.title] = exerciseArray;
    });
    return {
        cleanedExerciseList,
        totalLength,
    };
}

function isFSCompletedValid(functionalStrength, exerciseList) {
    let warmUpExerciseList = functionalStrength.warm_up;
    let intersectingWarmUpExercises = _.filter(warmUpExerciseList, o => exerciseList.includes(o.library_id));
    let isWarmUpValid = intersectingWarmUpExercises.length === warmUpExerciseList.length;
    let dynamicMovementExerciseList = functionalStrength.dynamic_movement;
    let intersectingDynamicMovementExercises = _.filter(dynamicMovementExerciseList, o => exerciseList.includes(o.library_id));
    let isDynamicMovementValid = intersectingDynamicMovementExercises.length === dynamicMovementExerciseList.length;
    let stabilityExerciseList = functionalStrength.stability_work;
    let intersectingStabilityExercises = _.filter(stabilityExerciseList, o => exerciseList.includes(o.library_id));
    let isStabilityValid = intersectingStabilityExercises.length === stabilityExerciseList.length;
    return isWarmUpValid && isDynamicMovementValid && isStabilityValid;
}

function cleanExercise(exercise) {
    let cleanedExercise = _.cloneDeep(exercise);
    cleanedExercise.library_id = exercise.library_id;
    cleanedExercise.description = exercise.description;
    cleanedExercise.displayName = `${exercise.display_name.length ? exercise.display_name.toUpperCase() : exercise.name.toUpperCase()}`;
    cleanedExercise.dosage = `${exercise.sets_assigned}x${exercise.reps_assigned}${exercise.unit_of_measure === 'seconds' ? 's' : exercise.unit_of_measure === 'yards' ? 'yards' : ''}${exercise.bilateral ? ' per side' : ''}`;
    cleanedExercise.imageUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.gif`;
    cleanedExercise.thumbnailUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.png`;
    cleanedExercise.videoUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.mp4`;
    cleanedExercise.localImageUrl = exercise.localImageUrl;
    cleanedExercise.youtubeId = exercise.youtube_id && exercise.youtube_id.length > 0 ? `https://www.youtube.com/embed/${exercise.youtube_id}?version=3&playlist=${exercise.youtube_id}&rel=0&autoplay=1&showinfo=0&playsinline=1&loop=1&controls=0&modestbranding=1` : false;
    return cleanedExercise;
}

function scrollableTabViewPage(dailyPlanObj) {
    return Math.floor(dailyPlanObj.landing_screen);
}

const sessionTypes = {
    practice:                  0,
    strength_and_conditioning: 1,
    game:                      2,
    tournament:                3,
    bump_up:                   4,
    corrective:                5,
    sport_training:            6,
};

const availableSessionTypes = [
    { index: 0, order: 1, label: 'Practice', ignoreSelection: true, },
    { index: 2, order: 2, label: 'Competition', ignoreSelection: false, },
    { index: 6, order: 3, label: 'Training', ignoreSelection: false, },
];

const strengthConditioningTypes = [
    { index: 0, order: 1, label: 'Endurance', },
    { index: 1, order: 2, label: 'Power', },
    { index: 2, order: 3, label: 'Speed & Agility', },
    { index: 3, order: 4, label: 'Strength', },
    { index: 4, order: 5, label: 'Cross Training', },
];

const teamSports = [
    { index: 0, order: 1, label: 'Basketball', positions: ['Center', 'Forward', 'Guard'], },
    { index: 1, order: 2, label: 'Baseball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], },
    { index: 2, order: 12, label: 'Softball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], },
    { index: 3, order: 3, label: 'Cycling', positions: false, },
    { index: 4, order: 5, label: 'Field Hockey', positions: ['Goalie', 'Fullback', 'Midfielder', 'Forward'], },
    { index: 5, order: 6, label: 'Football', positions: ['Defensive Back', 'Kicker', 'Linebacker', 'Lineman', 'Quarterback', 'Receiver', 'Running Back'], },
    { index: 6, order: null, label: 'General Fitness', positions: false, },
    { index: 7, order: null, label: 'Golf', positions: false, },
    { index: 8, order: null, label: 'Gymnastics', positions: false, },
    { index: 9, order: 10, label: 'Skate Sports', positions: false, },
    { index: 10, order: 7, label: 'Lacrosse', positions: ['Attacker', 'Defender', 'Goalie', 'Midfielder'], },
    { index: 11, order: 9, label: 'Rowing', positions: false, },
    { index: 12, order: null, label: 'Rugby', positions: false, },
    { index: 13, order: null, label: 'Diving', positions: false, },
    { index: 14, order: 11, label: 'Soccer', positions: ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker'], },
    { index: 15, order: 8, label: 'Pool Sports', positions: false, },
    { index: 16, order: 13, label: 'Tennis', positions: false, },
    { index: 17, order: 4, label: 'Distance Running', positions: false, },
    { index: 18, order: null, label: 'Sprints', positions: false, },
    { index: 19, order: null, label: 'Jumps', positions: false, },
    { index: 20, order: null, label: 'Throws', positions: false, },
    { index: 21, order: null, label: 'Volleyball', positions: false, },
    { index: 22, order: null, label: 'Wrestling', positions: false, },
    { index: 23, order: null, label: 'Weightlifting', positions: false, },
    { index: 24, order: 14, label: 'Track & Field', positions: ['Sprinter', 'Jumper', 'Thrower', 'Distance'], },
];

const getTimeHours = () => {
    let hoursList = [];
    for (let hour = 1; hour <= 12; hour += 1) {
        hoursList.push(hour.toString());
    }
    return hoursList;
};

const getTimeMinutes = () => {
    let minutesList = [];
    for (let min = 0; min <= 45; min += 15) {
        let minString = min.toString() === '0' ? '00' : min.toString();
        minutesList.push(minString);
    }
    return minutesList;
};

const timeOptionGroups = {
    hours:   getTimeHours(),
    minutes: getTimeMinutes(),
    amPM:    ['AM', 'PM'],
};

const getDurationMinutes = () => {
    let minutesList = [];
    for (let min = 5; min <= 120; min += 5) {
        let minString = min.toString() === '5' ? '05' : min.toString();
        minutesList.push(minString);
    }
    return minutesList;
};

const durationOptionGroups = {
    minutes: getDurationMinutes(),
    label:   [' ', 'MIN', ' '],
};

const cleanedPostSessionName = (postPracticeSurvey) => {
    if(postPracticeSurvey.isFunctionalStrength) {
        return {
            fullName: 'FUNCTIONAL STRENGTH',
        }
    }
    let filteredSessionTypes = _.filter(availableSessionTypes, o => o.index === postPracticeSurvey.session_type);
    let selectedSessionType = filteredSessionTypes.length === 0 ? 'TRAINING' : filteredSessionTypes[0].label.toUpperCase();
    let filteredStrengthConditioningTypes = _.filter(strengthConditioningTypes, o => o.index === postPracticeSurvey.strength_and_conditioning_type);
    let filteredSportTypes = _.filter(teamSports, o => o.index === postPracticeSurvey.sport_name);
    let selectedSport = filteredSportTypes.length > 0 ? filteredSportTypes[0].label.toUpperCase() : filteredStrengthConditioningTypes.length > 0 ? filteredStrengthConditioningTypes[0].label.toUpperCase() : '';
    return {
        fullName: `${selectedSport.replace(' TRAINING', '')} ${selectedSessionType}`,
        selectedSessionType,
        selectedSport,
    }
};

const exerciseListButtonStyles = (isPrep, completedExercises, isFSCompleteValid, isFunctionalStrength) => {
    let buttonTitle = completedExercises.length > 0 ? `${isPrep ? 'Prep ' : 'Recovery '}Complete` : `Check Boxes to Complete${isPrep ? ' Prep' : ' Recovery'}`;
    let isButtonDisabled = completedExercises.length > 0 ? false : true;
    let isButtonOutlined = isButtonDisabled || completedExercises.length === 0 ? true : false;
    let buttonDisabledStyle = {backgroundColor: AppColors.white,};
    let buttonColor = completedExercises.length > 0 ? AppColors.white : AppColors.primary.yellow.hundredPercent;
    let buttonBackgroundColor = completedExercises.length > 0 ? AppColors.primary.yellow.hundredPercent : AppColors.white;
    if(isFunctionalStrength) {
        buttonTitle = completedExercises.length > 0 ? 'Complete' : 'Check Boxes to Complete';
        isButtonOutlined = isFSCompleteValid ? false : true;
        buttonColor = isFSCompleteValid ? AppColors.white : AppColors.primary.yellow.hundredPercent;
        buttonBackgroundColor = isFSCompleteValid ? AppColors.primary.yellow.hundredPercent : AppColors.white;
    }
    return { buttonTitle, isButtonDisabled, isButtonOutlined, buttonDisabledStyle, buttonColor, buttonBackgroundColor, }
};

export default {
    availableSessionTypes,
    bodyPartMapping,
    cleanExercise,
    cleanExerciseList,
    cleanFSExerciseList,
    cleanedPostSessionName,
    durationOptionGroups,
    exerciseListButtonStyles,
    isFSCompletedValid,
    jointLevels,
    muscleLevels,
    overallReadiness,
    postSessionFeel,
    scrollableTabViewPage,
    sessionTypes,
    sleepQuality,
    sorenessPainScaleMapping,
    strengthConditioningTypes,
    teamSports,
    timeOptionGroups,
};
