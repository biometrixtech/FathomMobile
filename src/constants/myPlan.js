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
    {index: 12, order: 10, label: 'Lower Back', location: 'back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'is'},
    {index: 13, order: null, label: '', location: '', group: '', image: {}, bilateral: false, helping_verb: ''},
    {index: 14, order: 11, label: 'Glutes', location: 'back', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 15, order: 12, label: 'Hamstrings', location: 'back', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 16, order: 13, label: 'Calves', location: 'back', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 17, order: 14, label: 'Achilles', location: 'back', group: 'muscle', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'are'},
];

const overallReadiness = [
    'Not At All',
    'Not Ready',
    'Mostly Not Ready',
    'Somewhat Ready',
    'Ready',
    'Totally Ready',
    'Very Ready',
    'Bringing my A-Game',
    'Top of my Game',
    'Max Readiness',
];

const sleepQuality = [
    'I didn\'t sleep',
    'Terribly- I’m a zombie',
    'Poorly- feeling exhausted',
    'Not Well- feeling tired',
    'OK',
    'Enough to operate normally',
    'Good- feeling rested!',
    'Well- focused and energetic!',
    'Very well!',
    'Maximal- top mental state!',
];

const muscleLevels = {
    soreness: [
        '',
        'Tight',
        'Sore',
        'Feel Limited',
        'Struggling to Move',
        'Cannot Move',
    ],
    pain: [
        '',
        'Barely Noticeable',
        'Dull/Widespread Pain',
        'Sharp Pain',
        'Pain Limits Movement ',
        'Too Painful to Move',
    ],
};

const jointLevels = {
    soreness: [
        '',
        'Ache',
        'Dull Pain',
        'Sharp Pain',
        'Pain Limits Movement',
        'Too Painful to Move',
    ],
    pain: [
        '',
        'Ache',
        'Dull Pain',
        'Sharp Pain',
        'Pain Limits Movement',
        'Too Painful to Move',
    ],
};

function sorenessPainScaleMapping(type, value) {
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
            newValue = 3;
            break;
        case 5:
            newValue = 4;
            break;
        default:
            newValue = 0;
        }
    } else if(type === 'pain') {
        switch (value) {
        case 1:
            newValue = 2;
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

const sessionTypes = {
    practice_sessions:              0,
    strength_conditioning_sessions: 1,
    games:                          2,
    tournaments:                    3,
    bump_up_sessions:               4,
    corrective_sessions:            5,
};

const postSessionFeel = [
    'Resting, like nothing',
    'Very Easy, I could do that all day!',
    'Light, I could do that for a few hours!',
    'Moderate, but notable',
    'Considerable, but could still hold a conversation',
    'Hard, Breathing heavily',
    'Challenging, could only speak a sentence at a time',
    'Vigorous, borderline uncomfortable',
    'Very Hard, could only say a word at a time',
    'Maximum, carry me off the field',
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
    cleanedExercise.dosage = `${exercise.sets_assigned}x ${exercise.reps_assigned}${exercise.unit_of_measure === 'seconds' ? 's' : ''}`;
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

export default {
    bodyPartMapping,
    cleanExercise,
    cleanExerciseList,
    jointLevels,
    muscleLevels,
    overallReadiness,
    postSessionFeel,
    scrollableTabViewPage,
    sessionTypes,
    sleepQuality,
    sorenessPainScaleMapping,
};
