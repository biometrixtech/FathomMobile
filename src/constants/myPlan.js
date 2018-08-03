/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 12:28:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-03 04:40:43
 */

// import RN components
import { Image } from 'react-native';

// import third-party libraries
import _ from 'lodash';

/**
 * MyPlan Config
 */

const bodyPartMapping = [
    {index: 0, order: null, label: 'Head', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 1, order: null, label: 'Shoulder', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 2, order: null, label: 'Chest', group: '', image: {}, bilateral: false, helping_verb: 'is'},
    {index: 3, order: 1, label: 'Abdominals', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'are'},
    {index: 4, order: 3, label: 'Hip', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 5, order: 5, label: 'Groin', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 6, order: 7, label: 'Quads', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 7, order: 9, label: 'Knee', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 8, order: 10, label: 'Shin', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 9, order: 12, label: 'Ankle', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 10, order: 14, label: 'Foot', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 11, order: 6, label: 'IT Band', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'is'},
    {index: 12, order: 2, label: 'Lower Back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'is'},
    {index: 13, order: null, label: '', group: '', image: {}, bilateral: false, helping_verb: ''},
    {index: 14, order: 4, label: 'Glutes', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 15, order: 8, label: 'Hamstrings', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 16, order: 11, label: 'Calves', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'are'},
    {index: 17, order: 13, label: 'Achilles', group: 'muscle', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'are'},
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

const muscleLevels = [
    '',
    'A little tight or sore',
    'Sore, can move OK',
    'Limits movement',
    'Struggling to move',
    'Painful to move',
];

const jointLevels = [
    '',
    'Some Discomfort ',
    'A Dull Ache',
    'Severe Ache',
    'Sharp Pain',
    'Unable to Move',
];

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

function cleanExercise(exercise) {
    let cleanedExercise = {};
    cleanedExercise.description = exercise.description;
    cleanedExercise.displayName = `${exercise.display_name.length ? exercise.display_name.toUpperCase() : exercise.name.toUpperCase()}`;
    cleanedExercise.dosage = `${exercise.sets_assigned}x ${exercise.reps_assigned}${exercise.unit_of_measure === 'seconds' ? 's' : ''}`;
    cleanedExercise.imageUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.gif`;
    cleanedExercise.youtubeId = exercise.youtube_id && exercise.youtube_id.length ? exercise.youtube_id : false;
    return cleanedExercise;
}

function scrollableTabViewPage(dailyPlanObj, disabled, index) {
    if(index) { return index; }
    let page = 0;
    if(disabled) {
        page = dailyPlanObj && dailyPlanObj.nav_bar_indicator === null && disabled ?
            1
            : dailyPlanObj ?
                Math.floor(dailyPlanObj.landing_screen)
                :
                0;
    } else {
        page = dailyPlanObj && dailyPlanObj.nav_bar_indicator === null ?
            1
            : dailyPlanObj ?
                Math.floor(dailyPlanObj.landing_screen)
                :
                0;
    }
    return page;
}

function prefetchGifs(exerciseList) {
    // _.map(exerciseList.cleanedExerciseList, exerciseIndex => {
    //     _.map(exerciseIndex, exercise => {
    //         Image.prefech(this.cleanExercise(exercise).imageUrl);
    //     })
    // });
    // Image.prefech(url);
}

export default {
    bodyPartMapping,
    cleanExercise,
    cleanExerciseList,
    jointLevels,
    muscleLevels,
    overallReadiness,
    postSessionFeel,
    prefetchGifs,
    scrollableTabViewPage,
    sessionTypes,
    sleepQuality,
};
