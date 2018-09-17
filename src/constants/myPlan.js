/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 12:28:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-03 04:40:43
 */

// import RN components
import { Image } from 'react-native';

// const & libs
import { Actions } from './';
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

function cleanExercise(exercise) {
    let cleanedExercise = _.cloneDeep(exercise);
    cleanedExercise.library_id = exercise.library_id;
    cleanedExercise.description = exercise.description;
    cleanedExercise.displayName = `${exercise.display_name.length ? exercise.display_name.toUpperCase() : exercise.name.toUpperCase()}`;
    cleanedExercise.dosage = `${exercise.sets_assigned}x ${exercise.reps_assigned}${exercise.unit_of_measure === 'seconds' ? 's' : exercise.unit_of_measure === 'yards' ? 'yards' : ''}`;
    cleanedExercise.imageUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.gif`;
    cleanedExercise.thumbnailUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.png`;
    cleanedExercise.videoUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.mp4`;
    cleanedExercise.localImageUrl = exercise.localImageUrl;
    cleanedExercise.youtubeId = exercise.youtube_id && exercise.youtube_id.length > 0 ? `https://www.youtube.com/embed/${exercise.youtube_id}?version=3&playlist=${exercise.youtube_id}&rel=0&autoplay=1&showinfo=0&playsinline=1&loop=1&controls=0&modestbranding=1` : false;
    return cleanedExercise;
}

function scrollableTabViewPage(dailyPlanObj, disabled, index) {
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
    { index: 0, order: 1, label: 'Practice', },
    { index: 2, order: 2, label: 'Competition', },
    { index: 6, order: 3, label: 'Training', },
];

const strengthConditioningTypes = [
    { index: 0, order: 1, label: 'Endurance', },
    { index: 1, order: 2, label: 'Power', },
    { index: 2, order: 3, label: 'Speed', },
    { index: 3, order: 4, label: 'Strength', },
    { index: 4, order: 5, label: 'Cross Training', },
];

const teamSports = [
    { index: 0, order: 1, label: 'Basketball', },
    { index: 1, order: 2, label: 'Baseball', },
    { index: 2, order: null, label: 'Softball', },
    { index: 3, order: null, label: 'Cycling', },
    { index: 4, order: null, label: 'Field Hockey', },
    { index: 5, order: 6, label: 'Football', },
    { index: 6, order: null, label: 'General Fitness', },
    { index: 7, order: null, label: 'Golf', },
    { index: 8, order: null, label: 'Gymnastics', },
    { index: 9, order: null, label: 'Ice Hockey', },
    { index: 10, order: 11, label: 'Lacrosse', },
    { index: 11, order: null, label: 'Rowing', },
    { index: 12, order: null, label: 'Rugby', },
    { index: 13, order: null, label: 'Running', },
    { index: 14, order: 15, label: 'Soccer', },
    { index: 15, order: null, label: 'Swimming / Diving', },
    { index: 16, order: 17, label: 'Tennis', },
    { index: 17, order: null, label: 'Cross Country / Distance Running', },
    { index: 18, order: null, label: 'Sprints', },
    { index: 19, order: null, label: 'Jumps', },
    { index: 20, order: null, label: 'Throws', },
    { index: 21, order: null, label: 'Volleyball', },
    { index: 22, order: null, label: 'Wrestling', },
    { index: 23, order: null, label: 'Weightlifting', },
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

export default {
    availableSessionTypes,
    bodyPartMapping,
    cleanExercise,
    cleanExerciseList,
    durationOptionGroups,
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
