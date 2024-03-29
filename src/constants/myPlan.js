/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 12:28:00
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-03 04:40:43
 */

// import RN components
import { Image, Platform, } from 'react-native';

// const & libs
import { Actions , AppColors, } from './';
import { store } from '../store';

// import third-party libraries
import _ from 'lodash';

/**
 * MyPlan Config
 */

const bodyPartMapping = [
    {index: 0, order: null, label: 'Head', front: false, location: '', group: '', image: {}, bilateral: false, helping_verb: ''},
    {index: 1, order: 3, label: 'Shoulder', front: false, location: 'upper body', group: 'muscle', image: {0: 'Shoulder.svg', 1: 'L_Shoulder.svg', 2: 'R_Shoulder.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 2, order: 1, label: 'Pec', front: true, location: 'upper body', group: 'muscle', image: {0: 'Pec.svg', 1: 'L_Pec.svg', 2: 'R_Pec.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 3, order: 2, label: 'Abdominals', front: true, location: 'upper body', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false, helping_verb: 'have'},
    {index: 4, order: 9, label: 'Hip', front: true, location: 'lower body', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 5, order: 10, label: 'Groin', front: true, location: 'lower body', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 6, order: 12, label: 'Quad', front: true, location: 'lower body', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 7, order: 15, label: 'Knee', front: true, location: 'lower body', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 8, order: 16, label: 'Shin', front: true, location: 'lower body', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 9, order: 18, label: 'Ankle', front: true, location: 'lower body', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 10, order: 19, label: 'Foot', front: true, location: 'lower body', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 10, order: 19, label: 'Foot', front: false, location: 'lower body', group: 'joint', image: {0: 'Foot_Back.svg', 1: 'L_Foot_Back.svg', 2: 'R_Foot_Back.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 11, order: 13, label: 'Outer Thigh', front: true, location: 'lower body', group: 'joint', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 11, order: 13, label: 'Outer Thigh', front: false, location: 'lower body', group: 'joint', image: {0: 'ITBand_Back.svg', 1: 'L_ITBand_Back.svg', 2: 'R_ITBand_Back.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 12, order: 6, label: 'Lower Back', front: false, location: 'upper body', group: 'muscle', image: {0: 'LowBack.svg'}, bilateral: false, helping_verb: 'has'},
    {index: 13, order: null, label: 'General', front: false, location: '', group: '', image: {}, bilateral: false, helping_verb: ''},
    {index: 14, order: 11, label: 'Glutes', front: false, location: 'lower body', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 15, order: 14, label: 'Hamstring', front: false, location: 'lower body', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 16, order: 17, label: 'Calf', front: false, location: 'lower body', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 17, order: 20, label: 'Achilles', front: false, location: 'lower body', group: 'joint', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 18, order: 4, label: 'Upper Back', front: false, location: 'upper body', group: 'muscle', image: {0: 'UpperBackNeck.svg'}, bilateral: false, helping_verb: 'has'},
    {index: 19, order: 8, label: 'Elbow', front: false, location: 'upper body', group: 'joint', image: {0: 'Elbow.svg', 1: 'L_Elbow.svg', 2: 'R_Elbow.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 20, order: 7, label: 'Wrist', front: true, location: 'upper body', group: 'joint', image: {0: 'Wrist.svg', 1: 'L_Wrist.svg', 2: 'R_Wrist.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 21, order: 5, label: 'Lat', front: false, location: 'upper body', group: 'muscle', image: {0: 'Lats.svg', 1: 'L_Lats.svg', 2: 'R_Lats.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 22, order: null, label: 'Bicep', front: true, location: 'upper body', group: 'muscle', image: {0: 'Bicep.svg', 1: 'L_Bicep.svg', 2: 'R_Bicep.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 23, order: null, label: 'Tricep', front: false, location: 'upper body', group: 'muscle', image: {0: 'Tricep.svg', 1: 'L_Tricep.svg', 2: 'R_Tricep.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 24, order: null, label: 'Forearm', front: true, location: 'upper body', group: 'muscle', image: {0: 'Forearm.svg', 1: 'L_Forearm.svg', 2: 'R_Forearm.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 24, order: null, label: 'Forearm', front: false, location: 'upper body', group: 'muscle', image: {0: 'Forearm_Back.svg', 1: 'L_Forearm_Back.svg', 2: 'R_Forearm_Back.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 25, order: null, label: 'Core Stabilizers', front: true, location: 'upper body', group: 'muscle', image: {0: 'CoreStabilizers.svg', 1: 'L_CoreStabilizers.svg', 2: 'R_CoreStabilizers.svg',}, bilateral: false, helping_verb: 'has'},
    {index: 26, order: null, label: 'Erector Spinae', front: false, location: 'upper body', group: 'muscle', image: {0: 'ErectorSpinae.svg', 1: 'L_ErectorSpinae.svg', 2: 'R_ErectorSpinae.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 27, order: null, label: 'Outer Knee', front: true, location: 'lower body', group: 'joint', image: {0: 'OutsideKnee.svg', 1: 'L_OutsideKnee.svg', 2: 'R_OutsideKnee.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 28, order: null, label: 'Hip Flexor', front: true, location: 'lower body', group: 'muscle', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 29, order: null, label: 'Deltoid', front: false, location: 'upper body', group: 'muscle', image: {0: 'Shoulder.svg', 1: 'L_Shoulder.svg', 2: 'R_Shoulder.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 31, order: null, label: 'Oblique', front: true, location: 'upper body', group: 'muscle', image: {0: 'Obliques.svg', 1: 'L_Obliques.svg', 2: 'R_Obliques.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 40, order: null, label: 'Anterior Tibialis', front: true, location: 'lower body', group: 'muscle', image: {0: 'AntTib.svg', 1: 'L_AntTib.svg', 2: 'R_AntTib.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 41, order: null, label: 'Peroneals Longus', front: true, location: 'lower body', group: 'muscle', image: {0: 'Peroneals.svg', 1: 'L_Peroneals.svg', 2: 'R_Peroneals.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 42, order: null, label: 'Posterior Tibialis', front: false, location: 'lower body', group: 'muscle', image: {0: 'PostTib.svg', 1: 'L_PostTib.svg', 2: 'R_PostTib.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 43, order: null, label: 'Soleus', front: false, location: 'lower body', group: 'muscle', image: {0: 'Soleus.svg', 1: 'L_Soleus.svg', 2: 'R_Soleus.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 44, order: null, label: 'Gastrocnemius Medial', front: false, location: 'lower body', group: 'muscle', image: {0: 'MedialGastroc.svg', 1: 'L_MedialGastroc.svg', 2: 'R_MedialGastroc.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 45, order: null, label: 'Bicep Femoris Long Head', front: false, location: 'lower body', group: 'muscle', image: {0: 'BicepFemorisLong.svg', 1: 'L_BicepFemorisLong.svg', 2: 'R_BicepFemorisLong.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 46, order: null, label: 'Bicep Femoris Short Head', front: false, location: 'lower body', group: 'muscle', image: {0: 'BicepFemorisShort.svg', 1: 'L_BicepFemorisShort.svg', 2: 'R_BicepFemorisShort.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 53, order: null, label: 'Gracilis', front: true, location: 'lower body', group: 'muscle', image: {0: 'Gracilis.svg', 1: 'L_Gracilis.svg', 2: 'R_Gracilis.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 53, order: null, label: 'Gracilis', front: false, location: 'lower body', group: 'muscle', image: {0: 'Gracilis_Back.svg', 1: 'L_Gracilis_Back.svg', 2: 'R_Gracilis_Back.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 54, order: null, label: 'Pectineus', front: true, location: 'lower body', group: 'muscle', image: {0: 'Pectineus.svg', 1: 'L_Pectineus.svg', 2: 'R_Pectineus.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 55, order: null, label: 'Vastus Lateralis', front: true, location: 'lower body', group: 'muscle', image: {0: 'VastusLateralis.svg', 1: 'L_VastusLateralis.svg', 2: 'R_VastusLateralis.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 56, order: null, label: 'Vastus Medialis', front: true, location: 'lower body', group: 'muscle', image: {0: 'VastusMedialis.svg', 1: 'L_VastusMedialis.svg', 2: 'R_VastusMedialis.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 59, order: null, label: 'Tensor Fascia Latae', front: true, location: 'lower body', group: 'muscle', image: {0: 'TFL.svg', 1: 'L_TFL.svg', 2: 'R_TFL.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 61, order: null, label: 'Gastrocnemius Lateral', front: false, location: 'lower body', group: 'muscle', image: {0: 'LateralGastroc.svg', 1: 'L_LateralGastroc.svg', 2: 'R_LateralGastroc.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 66, order: null, label: 'Gluteus Maximus', front: false, location: 'lower body', group: 'muscle', image: {0: 'GluteMax.svg', 1: 'L_GluteMax.svg', 2: 'R_GluteMax.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 67, order: null, label: 'Quadratus Femoris', front: false, location: 'lower body', group: 'muscle', image: {0: 'HipRotator.svg', 1: 'L_HipRotator.svg', 2: 'R_HipRotator.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 70, order: null, label: 'Quadratus Lumborum', front: false, location: 'upper body', group: 'muscle', image: {0: 'QuadLumb.svg', 1: 'L_QuadLumb.svg', 2: 'R_QuadLumb.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 73, order: null, label: 'Transverse Abdominis', front: true, location: 'upper body', group: 'muscle', image: {0: 'Transverse.svg', 1: 'L_Transverse.svg', 2: 'R_Transverse.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 75, order: null, label: 'Rectus Abdominis', front: true, location: 'upper body', group: 'muscle', image: {0: 'RectusAbs.svg'}, bilateral: false, helping_verb: 'has'},
    {index: 79, order: null, label: 'Lower Trapezius', front: false, location: 'upper body', group: 'muscle', image: {0: 'LowerTraps.svg', 1: 'L_LowerTraps.svg', 2: 'R_LowerTraps.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 83, order: null, label: 'Anterior Deltoid', front: true, location: 'upper body', group: 'muscle', image: {0: 'AntDeltoid.svg', 1: 'L_AntDeltoid.svg', 2: 'R_AntDeltoid.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 84, order: null, label: 'Lateral Deltoid', front: true, location: 'upper body', group: 'muscle', image: {0: 'LatDeltoid.svg', 1: 'L_LatDeltoid.svg', 2: 'R_LatDeltoid.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 85, order: null, label: 'Lateral Deltoid', front: false, location: 'upper body', group: 'muscle', image: {0: 'PostDeltoid.svg', 1: 'L_PostDeltoid.svg', 2: 'R_PostDeltoid.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 100, order: null, label: 'SMT & SMT', front: false, location: 'lower body', group: 'muscle', image: {0: 'Semi.svg', 1: 'L_Semi.svg', 2: 'R_Semi.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 101, order: null, label: 'Anterior Adductors', front: true, location: 'lower body', group: 'muscle', image: {0: 'AntAdductor.svg', 1: 'L_AntAdductor.svg', 2: 'R_AntAdductor.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 102, order: null, label: 'Rectus Femoris & Vastus Intermedius', front: true, location: 'lower body', group: 'muscle', image: {0: 'RectusFemoris.svg', 1: 'L_RectusFemoris.svg', 2: 'R_RectusFemoris.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 103, order: null, label: 'Glute Med', front: false, location: 'lower body', group: 'muscle', image: {0: 'GluteMed.svg', 1: 'L_GluteMed.svg', 2: 'R_GluteMed.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 105, order: null, label: 'Upper Traps Levator Scapulae', front: true, location: 'upper body', group: 'muscle', image: {0: 'UpperBackNeck.svg', 1: 'L_UpperBackNeck.svg', 2: 'R_UpperBackNeck.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 105, order: null, label: 'Upper Traps Levator Scapulae', front: false, location: 'upper body', group: 'muscle', image: {0: 'UpperBackNeck_Back.svg', 1: 'L_UpperBackNeck_Back.svg', 2: 'R_UpperBackNeck_Back.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 106, order: null, label: 'Middle Traps Rhomboids', front: false, location: 'upper body', group: 'muscle', image: {0: 'MiddleTraps.svg', 1: 'L_MiddleTraps.svg', 2: 'R_MiddleTraps.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 107, order: null, label: 'Pecs', front: true, location: 'upper body', group: 'muscle', image: {0: 'Pec.svg', 1: 'L_Pec.svg', 2: 'R_Pec.svg'}, bilateral: true, helping_verb: 'has'},
    {index: 108, order: null, label: 'Hip Flexor', front: true, location: 'lower body', group: 'muscle', image: {0: 'HipFlexor.svg', 1: 'L_HipFlexor.svg', 2: 'R_HipFlexor.svg'}, bilateral: true, helping_verb: 'has'},
];

const overallReadiness = [
    '',
    'Not At All Ready',
    ' ',
    'Somewhat Ready',
    ' ',
    'Very Ready',
];

const sleepQuality = [
    '',
    'Not At All Rested',
    ' ',
    'Somewhat Rested',
    ' ',
    'Very Rested',
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

const muscleJointLevels = {
    soreness: [
        { label: 'MILD', value: 1,},
        { label: 'MODERATE', value: 3,},
        { label: 'SEVERE', value: 5,},
    ],
    movement: [
        { label: 'NOT\nLIMITED', value: 1,},
        { label: 'LIMITED', value: 3,},
        { label: 'VERY\nLIMITED', value: 5,},
    ],
};

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

const preExerciseListOrder = [
    {
        index: 'inhibit_exercises',
        title: 'FOAM ROLL',
    },
    {
        index: 'static_stretch_exercises',
        title: 'STATIC STRETCH',
    },
    {
        index: 'active_stretch_exercises',
        title: 'ACTIVE STRETCH',
    },
    {
        index: 'isolated_activate_exercises',
        title: 'ACTIVATE',
    },
    {
        index: 'static_integrate_exercises',
        title: 'INTEGRATE',
    },
];

const postExerciseListOrder = [
    {
        index: 'inhibit_exercises',
        title: 'FOAM ROLL',
    },
    {
        index: 'static_stretch_exercises',
        title: 'STATIC STRETCH',
    },
    {
        index: 'isolated_activate_exercises',
        title: 'ACTIVATE',
    },
    {
        index: 'static_integrate_exercises',
        title: 'INTEGRATE',
    },
];

const coolDownExerciseListOrder = [
    {
        index: 'dynamic_stretch_exercises',
        title: 'DYNAMIC STRETCH',
    },
    {
        index: 'dynamic_integrate_exercises',
        title: 'INTEGRATE',
    },
];

// TODO: UPDATE TITLES
const warmUpExerciseListOrder = [
    {
        index: 'inhibit_exercises',
        title: 'FOAM ROLL',
    },
    {
        index: 'static_stretch_exercises',
        title: 'STATIC STRETCH',
    },
    {
        index: 'active_or_dynamic_stretch_exercises',
        title: 'INTEGRATE',
    },
    {
        index: 'isolated_activate_exercises',
        title: 'STATIC STRETCH',
    },
    {
        index: 'dynamic_integrate_exercises',
        title: 'ACTIVATE',
    },
    {
        index: 'dynamic_integrate_with_speed_exercises',
        title: 'INTEGRATE',
    },
];

const postSessionFeel = [
    { index: 1, label: 'Rest', subtitle: 'effortless, helps recovery', value: 1, workoutLabel: 'Rest', },
    { index: 2, label: 'Easy', subtitle: 'can hold a conversation', value: 3, workoutLabel: 'Easy', },
    { index: 3, label: 'Moderate', subtitle: 'can speak a sentence at a time', value: 5, workoutLabel: 'Moderate Intensity', },
    { index: 4, label: 'High Intensity', subtitle: 'can only speak a few words', value: 7, workoutLabel: 'High Intensity', },
    { index: 5, label: 'Maximal', subtitle: 'unable to talk', value: 10, workoutLabel: 'Maximal Intensity', },
];

function cleanExerciseList(recoveryObj, planSelection = 1, goals, modality) {
    // setup variables
    let totalLength = 0;
    let cleanedExerciseList = {};
    let equipmentRequired = [];
    let totalSeconds = 0;
    // loop through our exercise order and sections
    _.map(recoveryObj.exercise_phases, exercisePhase => {
        // setup our variable
        cleanedExerciseList[exercisePhase.title] = [];
        let updatedCurrentExerciseArray = [];
        let currentExercisesBySet = {};
        // loop through exercises to setup specific important values
        _.map(exercisePhase.exercises, (exercise, key) => {
            // setup variables
            let newExercise = _.cloneDeep(exercise);
            equipmentRequired = _.concat(equipmentRequired, newExercise.equipment_required);
            let filteredReducerGoals = _.filter(goals[recoveryObj.id], ['isSelected', true]);
            let goalTypes = _.map(filteredReducerGoals, y => y.text);
            let dosage = _.filter(newExercise.dosages, o => goalTypes.includes(o.goal.text));
            dosage = _.orderBy(dosage, ['ranking'], ['asc']);
            // calculate exercise sets
            let exerciseSetsAssigned = 0;
            if(dosage.length > 0 && planSelection === 0) {
                exerciseSetsAssigned = dosage[0].efficient_sets_assigned > 0 ? dosage[0].efficient_sets_assigned : dosage[0].default_efficient_sets_assigned;
            } else if(dosage.length > 0 && planSelection === 1) {
                exerciseSetsAssigned = dosage[0].complete_sets_assigned > 0 ? dosage[0].complete_sets_assigned : dosage[0].default_complete_sets_assigned;
            } else if(dosage.length > 0 && planSelection === 2) {
                exerciseSetsAssigned = dosage[0].comprehensive_sets_assigned > 0 ? dosage[0].comprehensive_sets_assigned : dosage[0].default_comprehensive_sets_assigned;
            }
            // calculate exercise reps
            let exerciseRepsAssigned = 0;
            if(dosage.length > 0 && planSelection === 0) {
                exerciseRepsAssigned = dosage[0].efficient_reps_assigned > 0 ? dosage[0].efficient_reps_assigned : dosage[0].default_efficient_reps_assigned;
            } else if(dosage.length > 0 && planSelection === 1) {
                exerciseRepsAssigned = dosage[0].complete_reps_assigned > 0 ? dosage[0].complete_reps_assigned : dosage[0].default_complete_reps_assigned;
            } else if(dosage.length > 0 && planSelection === 2) {
                exerciseRepsAssigned = dosage[0].comprehensive_reps_assigned > 0 ? dosage[0].comprehensive_reps_assigned : dosage[0].default_comprehensive_reps_assigned;
            }
            // calculate exercise duration
            let exerciseDuration = 0;
            if(newExercise.unit_of_measure === 'count')  {
                exerciseDuration = newExercise.bilateral ? ((newExercise.seconds_per_rep * exerciseRepsAssigned) * 2) : (newExercise.seconds_per_rep * exerciseRepsAssigned);
            } else if(newExercise.unit_of_measure === 'seconds' || newExercise.unit_of_measure === 'yards') {
                exerciseDuration = newExercise.bilateral ? (newExercise.seconds_per_set * 2) : (newExercise.seconds_per_set);
            }
            newExercise.calculated_duration = exerciseDuration;
            for (let i = 1; i <= exerciseSetsAssigned; i += 1) {
                currentExercisesBySet[i] = currentExercisesBySet[i] && currentExercisesBySet[i].length > 0 ? currentExercisesBySet[i] : [];
                currentExercisesBySet[i].push(newExercise);
            }
        });
        // loop through our exercises organzied my set
        _.map(currentExercisesBySet, (exerciseList, index) => {
            _.map(exerciseList, (exercise, key) => {
                let newExercise = _.cloneDeep(exercise);
                newExercise.set_number = index;
                updatedCurrentExerciseArray.push(newExercise);
            });
        });
        // loop through our specific exercise to update our variables
        _.map(updatedCurrentExerciseArray, (exercise, key) => {
            // if a duration - update our main variables
            if(exercise.calculated_duration > 0) {
                totalSeconds += exercise.calculated_duration;
                cleanedExerciseList[exercisePhase.title].push(exercise);
                totalLength += 1;
            }
        });
    });
    // clean variables as needed
    equipmentRequired = _.uniq(equipmentRequired);
    equipmentRequired = _.filter(equipmentRequired, o => o !== 'None');
    // return variables
    return {
        cleanedExerciseList,
        equipmentRequired,
        totalLength,
        totalSeconds,
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

function cleanExercise(exercise, planSelection, goals, parentId) {
    planSelection = planSelection === 'Efficient' ? 0 : planSelection === 'Complete' ? 1 : 2
    let filteredReducerGoals = _.filter(parentId ? goals[parentId] : exercise.parentId ? goals[exercise.parentId] : goals, ['isSelected', true]);
    let goalTypes = _.map(filteredReducerGoals, y => y.text);
    let dosage = _.filter(exercise.dosages, o => goalTypes.includes(o.goal.text));
    dosage = _.orderBy(dosage, ['ranking'], ['asc']);
    let cleanedExercise = _.cloneDeep(exercise);
    cleanedExercise.library_id = exercise.library_id;
    cleanedExercise.description = exercise.description;
    cleanedExercise.displayName = `${exercise && exercise.display_name && exercise.display_name.length ? exercise.display_name.toUpperCase() : exercise && exercise.name ? exercise.name.toUpperCase() : ''}`;
    if(cleanedExercise && dosage.length > 0 && planSelection === 0) {
        cleanedExercise.repsAssigned = dosage[0].efficient_reps_assigned > 0 ? dosage[0].efficient_reps_assigned : dosage[0].default_efficient_reps_assigned;
    } else if(cleanedExercise && dosage.length > 0 && planSelection === 1) {
        cleanedExercise.repsAssigned = dosage[0].complete_reps_assigned > 0 ? dosage[0].complete_reps_assigned : dosage[0].default_complete_reps_assigned;
    } else if(cleanedExercise && dosage.length > 0 && planSelection === 2) {
        cleanedExercise.repsAssigned = dosage[0].comprehensive_reps_assigned > 0 ? dosage[0].comprehensive_reps_assigned : dosage[0].default_comprehensive_reps_assigned;
    } else {
        cleanedExercise.repsAssigned = 0;
    }
    let cleanedDosage = `${cleanedExercise.repsAssigned}${cleanedExercise.unit_of_measure === 'seconds' ? 's' : cleanedExercise.unit_of_measure === 'yards' ? ' yds' : cleanedExercise.unit_of_measure === 'count' ? ' reps' : ''}`;
    let cleanedLongDosage = `${cleanedExercise.repsAssigned}${cleanedExercise.unit_of_measure === 'seconds' ? ' seconds' : cleanedExercise.unit_of_measure === 'yards' ? ' yards' : cleanedExercise.unit_of_measure === 'count' ? ' reps' : ''}`;
    cleanedExercise.dosage = `${cleanedDosage}${cleanedExercise.bilateral ? ' | Each Side' : ''}`;
    cleanedExercise.longDosage = `${cleanedLongDosage}${cleanedExercise.bilateral ? ' | Each Side' : ''}`;
    cleanedExercise.imageUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.gif`;
    cleanedExercise.thumbnailUrl = `https://dd4o7zw7l62dt.cloudfront.net/${exercise.library_id}.png`;
    // cleanedExercise.thumbnailUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.png`;
    cleanedExercise.videoUrl = `https://dd4o7zw7l62dt.cloudfront.net/${exercise.library_id}.mp4`;
    // cleanedExercise.videoUrl = `https://s3-us-west-2.amazonaws.com/biometrix-excercises/${exercise.library_id}.mp4`;
    cleanedExercise.localImageUrl = exercise.localImageUrl;
    cleanedExercise.youtubeId = exercise && exercise.youtube_id && exercise.youtube_id.length > 0 ? `https://www.youtube.com/embed/${exercise.youtube_id}?version=3&playlist=${exercise.youtube_id}&rel=0&autoplay=1&showinfo=0&playsinline=1&loop=1&controls=0&modestbranding=1` : false;
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
    { index: 0, order: 1, label: 'Endurance', icon: 'run', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
    { index: 1, order: 2, label: 'Power', icon: `${Platform.OS === 'android' ? 'md' : 'ios'}-fitness`, iconType: 'ionicon', activitySection: 'exercise_and_fitness', },
    { index: 2, order: 3, label: 'Speed & Agility', icon: 'run-fast', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
    { index: 3, order: 4, label: 'Strength', icon: `${Platform.OS === 'android' ? 'md' : 'ios'}-fitness`, iconType: 'ionicon', activitySection: '', },
    { index: 4, order: 5, label: 'Cross Training', icon: 'checkbox-multiple-marked-outline', iconType: 'material-community', activitySection: 'exercise_and_fitness', },
];

const teamSports = [
    { index: 0, label: 'Basketball', positions: ['Center', 'Forward', 'Guard'], imagePath: require('../../assets/images/sports_images/icons8-basketball-player-200.png'), activitySection: 'team_sports', },
    { index: 1, label: 'Baseball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], imagePath: require('../../assets/images/sports_images/icons8-baseball-player-200.png'), activitySection: 'team_sports', },
    { index: 2, label: 'Softball', positions: ['Catcher', 'Infielder', 'Pitcher', 'Outfielder'], imagePath: require('../../assets/images/sports_images/icons8-baseball-player-200.png'), activitySection: 'team_sports', },
    { index: 3, label: 'Cycling', positions: false, imagePath: require('../../assets/images/sports_images/icons8-cycling-200.png'), activitySection: ['exercise_and_fitness', 'outdoor_activities'], },
    { index: 4, label: 'Field Hockey', positions: ['Goalie', 'Fullback', 'Midfielder', 'Forward'], imagePath: require('../../assets/images/sports_images/icons8-field-hockey-200.png'), activitySection: 'team_sports', },
    { index: 5, label: 'Football', positions: ['Defensive Back', 'Kicker', 'Linebacker', 'Lineman', 'Quarterback', 'Receiver', 'Running Back'], imagePath: require('../../assets/images/sports_images/icons8-american-football-200.png'), activitySection: 'team_sports', },
    { index: 6, label: 'General Fitness', positions: false, imagePath: require('../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: '', },
    { index: 7, label: 'Golf', positions: false, imagePath: require('../../assets/images/sports_images/icons8-golf-200.png'), activitySection: ['individual_sports', 'outdoor_activities'], },
    { index: 8, label: 'Gymnastics', positions: false, imagePath: require('../../assets/images/sports_images/icons8-gymnastics-200.png'), activitySection: 'individual_sports', },
    { index: 9, label: 'Skating Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-speed-skating-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 10, label: 'Lacrosse', positions: ['Attacker', 'Defender', 'Goalie', 'Midfielder'], imagePath: require('../../assets/images/sports_images/icons8-lacrosse-stick-200.png'), activitySection: 'team_sports', },
    { index: 11, label: 'Rowing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-row-boat-200.png'), activitySection: 'water_activities', },
    { index: 12, label: 'Rugby', positions: false, imagePath: require('../../assets/images/sports_images/icons8-rugby-sevens-200.png'), activitySection: 'team_sports', },
    { index: 13, label: 'Diving', positions: false, imagePath: null, activitySection: '', },
    { index: 14, label: 'Soccer', positions: ['Defender', 'Forward', 'Goalkeeper', 'Midfielder', 'Striker'], imagePath: require('../../assets/images/sports_images/icons8-soccer-200.png'), activitySection: 'team_sports', },
    { index: 15, label: 'Water Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-swimming-200.png'), activitySection: ['individual_sports', 'water_activities'], },
    { index: 16, label: 'Tennis', positions: false, imagePath: require('../../assets/images/sports_images/icons8-tennis-player-200.png'), activitySection: ['individual_sports', 'racket_sports'], },
    { index: 17, label: 'Running', positions: false, imagePath: require('../../assets/images/sports_images/icons8-running-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 18, label: 'Sprints', positions: false, imagePath: null, activitySection: '', },
    { index: 19, label: 'Jumps', positions: false, imagePath: null, activitySection: '', },
    { index: 20, label: 'Throws', positions: false, imagePath: null, activitySection: '', },
    { index: 21, label: 'Volleyball', positions: ['Hitter', 'Setter', 'Middle Blocker', 'Libero'], imagePath: require('../../assets/images/sports_images/icons8-volleyball-player-200.png'), activitySection: 'team_sports', },
    { index: 22, label: 'Wrestling', positions: false, imagePath: require('../../assets/images/sports_images/icons8-wrestling-200.png'), activitySection: ['martial_arts', 'individual_sports'], },
    { index: 23, label: 'Weightlifting', positions: false, imagePath: require('../../assets/images/sports_images/icons8-weightlifting-200.png'), activitySection: 'individual_sports', },
    { index: 24, label: 'Track & Field', positions: ['Sprinter', 'Jumper', 'Thrower', 'Distance'], imagePath: require('../../assets/images/sports_images/icons8-track-and-field-200.png'), activitySection: 'individual_sports', },
    { index: 25, label: 'Archery', positions: false, imagePath: require('../../assets/images/sports_images/icons8-archery-200.png'), activitySection: 'individual_sports', },
    { index: 26, label: 'Australian Football', positions: false, imagePath: require('../../assets/images/sports_images/icons8-rugby-sevens-200.png'), activitySection: 'team_sports', },
    { index: 27, label: 'Badminton', positions: false, imagePath: require('../../assets/images/sports_images/icons8-badminton-player-200.png'), activitySection: 'racket_sports', },
    { index: 28, label: 'Bowling', positions: false, imagePath: require('../../assets/images/sports_images/icons8-bowling-200.png'), activitySection: 'individual_sports', },
    { index: 29, label: 'Boxing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-boxing-200.png'), activitySection: 'martial_arts', },
    { index: 30, label: 'Cricket', positions: false, imagePath: require('../../assets/images/sports_images/icons8-cricketer-200.png'), activitySection: 'team_sports', },
    { index: 31, label: 'Curling', positions: false, imagePath: require('../../assets/images/sports_images/icons8-curling-stone-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 32, label: 'Dance', positions: false, imagePath: require('../../assets/images/sports_images/icons8-dancing-200.png'), activitySection: 'studio_activities', },
    { index: 33, label: 'Equestrian Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-horseback-riding-200.png'), activitySection: 'outdoor_activities', },
    { index: 34, label: 'Fencing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-fencing-200.png'), activitySection: 'individual_sports', },
    { index: 35, label: 'Fishing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-sports-fishing-200.png'), activitySection: 'outdoor_activities', },
    { index: 36, label: 'Handball', positions: false, imagePath: require('../../assets/images/sports_images/icons8-handball-200.png'), activitySection: 'team_sports', },
    { index: 37, label: 'Hockey', positions: false, imagePath: require('../../assets/images/sports_images/icons8-ice-hockey-200.png'), activitySection: 'team_sports', },
    { index: 38, label: 'Martial Arts', positions: false, imagePath: require('../../assets/images/sports_images/icons8-judo-200.png'), activitySection: 'martial_arts', },
    { index: 39, label: 'Paddle Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-sup-200.png'), activitySection: 'water_activities', },
    { index: 40, label: 'Racquetball', positions: false, imagePath: require('../../assets/images/sports_images/icons8-racquetball-200.png'), activitySection: 'racket_sports', },
    { index: 41, label: 'Sailing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-sailing-200.png'), activitySection: 'water_activities', },
    { index: 42, label: 'Snow Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-nordic-combined-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 43, label: 'Squash', positions: false, imagePath: require('../../assets/images/sports_images/icons8-squash-racquet-200.png'), activitySection: 'racket_sports', },
    { index: 44, label: 'Surfing Sports', positions: false, imagePath: require('../../assets/images/sports_images/icons8-surfing-200.png'), activitySection: 'water_activities', },
    { index: 45, label: 'Swimming', positions: false, imagePath: require('../../assets/images/sports_images/icons8-swimming-200.png'), activitySection: 'water_activities', },
    { index: 46, label: 'Table Tennis', positions: false, imagePath: require('../../assets/images/sports_images/icons8-table-tennis-200.png'), activitySection: 'racket_sports', },
    { index: 47, label: 'Water Polo', positions: false, imagePath: require('../../assets/images/sports_images/icons8-water-polo-200.png'), activitySection: 'water_activities', },
    { index: 48, label: 'Cross Country Skiing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-cross-country-skiing-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 49, label: 'Downhill Skiing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-alpine-skiing-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 50, label: 'Kick Boxing', positions: false, imagePath: require('../../assets/images/sports_images/icons8-fight-200.png'), activitySection: 'martial_arts', },
    { index: 51, label: 'Snowboarding', positions: false, imagePath: require('../../assets/images/sports_images/icons8-snowboarding-200.png'), activitySection: 'snow_and_ice_sports', },
    { index: 52, label: 'Endurance', imagePath: require('../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 53, label: 'Power', imagePath: require('../../assets/images/sports_images/icons8-bench-press-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 54, label: 'Speed & Agility', imagePath: require('../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 55, label: 'Strength', imagePath: require('../../assets/images/sports_images/icons8-bench-press-200.png'), activitySection: '', },
    { index: 56, label: 'Cross Training', imagePath: require('../../assets/images/sports_images/icons8-crossfit-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 57, label: 'Elliptical', imagePath: require('../../assets/images/sports_images/icons8-treadmill-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 58, label: 'Functional Strength Training', imagePath: require('../../assets/images/sports_images/icons8-deadlift-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 59, label: 'Hiking', imagePath: require('../../assets/images/sports_images/icons8-trekking-200.png'), activitySection: 'outdoor_activities', },
    { index: 60, label: 'Hunting', imagePath: require('../../assets/images/sports_images/icons8-shooting-200.png'), activitySection: 'outdoor_activities', },
    { index: 61, label: 'Mind & Body', imagePath: require('../../assets/images/sports_images/icons8-meditation-200.png'), activitySection: 'studio_activities', },
    { index: 62, label: 'Play', imagePath: require('../../assets/images/sports_images/icons8-frisbee-200.png'), activitySection: 'outdoor_activities', },
    { index: 63, label: 'Preparation & Recovery', imagePath: require('../../assets/images/sports_images/icons8-warm-up-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 64, label: 'Stair Climbing', imagePath: require('../../assets/images/sports_images/icons8-staircase-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 65, label: 'Traditional Strength Training', imagePath: require('../../assets/images/sports_images/icons8-deadlift-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 66, label: 'Walking', imagePath: require('../../assets/images/sports_images/icons8-walking-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 67, label: 'Water Fitness', imagePath: require('../../assets/images/sports_images/icons8-swim-200.png'), activitySection: 'water_activities', },
    { index: 68, label: 'Yoga', imagePath: require('../../assets/images/sports_images/icons8-yoga-200.png'), activitySection: 'studio_activities', },
    { index: 69, label: 'Barre', imagePath: require('../../assets/images/sports_images/icons8-pullups-200.png'), activitySection: 'studio_activities', },
    { index: 70, label: 'Core Training', imagePath: require('../../assets/images/sports_images/icons8-sit-ups-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 71, label: 'Flexibility', imagePath: require('../../assets/images/sports_images/icons8-warm-up-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 72, label: 'High Intensity Interval Training', imagePath: require('../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 73, label: 'Jump Rope', imagePath: require('../../assets/images/sports_images/icons8-jump-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 74, label: 'Pilates', imagePath: require('../../assets/images/sports_images/icons8-pilates-200.png'), activitySection: 'studio_activities', },
    { index: 75, label: 'Stairs', imagePath: require('../../assets/images/sports_images/icons8-staircase-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 76, label: 'Step Training', imagePath: require('../../assets/images/sports_images/icons8-stepper-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 77, label: 'Wheelchair Walk Pace', imagePath: require('../../assets/images/sports_images/icons8-handicapped-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 78, label: 'Wheelchair Run Pace', imagePath: require('../../assets/images/sports_images/icons8-handicapped-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 79, label: 'Tai Chi', imagePath: require('../../assets/images/sports_images/icons8-taekwondo-200.png'), activitySection: 'martial_arts', },
    { index: 80, label: 'Mixed Cardio', imagePath: require('../../assets/images/sports_images/icons8-exercise-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 81, label: 'Hand Cycling', imagePath: require('../../assets/images/sports_images/icons8-rowing-machine-200.png'), activitySection: 'exercise_and_fitness', },
    { index: 82, label: 'Climbing', imagePath: require('../../assets/images/sports_images/icons8-climbing-200.png'), activitySection: 'outdoor_activities', },
    { index: 83, label: 'Other', imagePath: require('../../assets/images/sports_images/icons8-netball-200.png'), activitySection: 'other_activities', },
];

const activitiesListOrder = [
    {
        index: 'exercise_and_fitness',
        title: 'Exercise and Fitness',
    },
    {
        index: 'team_sports',
        title: 'Team Sports',
    },
    {
        index: 'individual_sports',
        title: 'Individual Sports',
    },
    {
        index: 'outdoor_activities',
        title: 'Outdoor Activities',
    },
    {
        index: 'water_activities',
        title: 'Water Activities',
    },
    {
        index: 'studio_activities',
        title: 'Studio Activities',
    },
    {
        index: 'racket_sports',
        title: 'Racket Sports',
    },
    {
        index: 'snow_and_ice_sports',
        title: 'Snow and Ice Sports',
    },
    {
        index: 'martial_arts',
        title: 'Martial Arts',
    },
    {
        index: 'other_activities',
        title: 'Other Activities',
    },
];

function translateStrengthConditioningTypeToSport(sportName, strengthAndConditioningType) {
    let newSportName = sportName;
    if(sportName === null) {
        let strengthConditioningObj = _.filter(strengthConditioningTypes, o => o.index === strengthAndConditioningType);
        newSportName = strengthConditioningObj[0] ?
            _.filter(teamSports, o => o.label === strengthConditioningObj[0].label)
            :
            83; // set to 'Other' if we don't have a match
        newSportName = newSportName[0] ?
            newSportName[0].index
            :
            83; // set to 'Other' if we don't have a match
    }
    return newSportName;
}

function cleanedActivitiesList() {
    let cleanedActivityList = [];
    _.map(activitiesListOrder, list => {
        let filteredSport = _.filter(teamSports, s => s.activitySection.includes(list.index));
        if(filteredSport.length > 0) {
            let cleanedActivitySection = {};
            cleanedActivitySection.title = list.title;
            cleanedActivitySection.data = _.orderBy(filteredSport, ['label', 'asc']);
            cleanedActivityList.push(cleanedActivitySection);
        }
    });
    return cleanedActivityList;
}

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
    for (let min = 0; min <= 55; min += 5) {
        let minString = min.toString();//min.toString() === '5' ? '05' : min.toString();
        minutesList.push(minString);
    }
    return minutesList;
};

const getDurationHours = () => {
    let hoursList = [];
    for (let hour = 0; hour <= 23; hour += 1) {
        let hourString = hour.toString();
        hoursList.push(hourString);
    }
    return hoursList;
};

const durationOptionGroups = {
    hourLabel: [' ', 'HR', ' '],
    hours:     getDurationHours(),
    minLabel:  [' ', 'MIN', ' '],
    minutes:   getDurationMinutes(),
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
        fullName: selectedSport,
        selectedSessionType,
        selectedSport,
    }
};

const exerciseListButtonStyles = (completedExercises, recoveryObj, isFSCompleteValid, isFunctionalStrength) => {
    if(!completedExercises) {
        completedExercises = [];
    }
    let buttonTitle = completedExercises.length > 0 ?
        `Complete ${_.startCase(_.toLower(recoveryObj.title))}`
        :
        `Check Boxes to Complete ${_.startCase(_.toLower(recoveryObj.title))}`;
    let isButtonDisabled = completedExercises.length > 0 ? false : true;
    let isButtonOutlined = isButtonDisabled || completedExercises.length === 0 ? true : false;
    let buttonDisabledStyle = {backgroundColor: AppColors.zeplin.slateXLight,};
    let buttonColor = completedExercises.length > 0 ? AppColors.white : AppColors.zeplin.yellow;
    let buttonBackgroundColor = completedExercises.length > 0 ? AppColors.zeplin.yellow : AppColors.zeplin.slateXLight;
    if(isFunctionalStrength) {
        buttonTitle = completedExercises.length > 0 ? 'Complete' : 'Check Boxes to Complete';
        isButtonOutlined = isFSCompleteValid ? false : true;
        buttonColor = isFSCompleteValid ? AppColors.white : AppColors.zeplin.yellow;
        buttonBackgroundColor = isFSCompleteValid ? AppColors.zeplin.yellow : AppColors.white;
    }
    return { buttonTitle, isButtonDisabled, isButtonOutlined, buttonDisabledStyle, buttonColor, buttonBackgroundColor, };
};

const allGoodBodyPartMessage = () => {
    return 'Issues that seem small, mean a lot to us. Always over-communicate so you receive a plan specifically for your body\'s needs.';
};

const painSorenessMessage = () => {
    return [
        'Soreness',
        ' is a normal response to training that can involve some discomfort. If something feels abnormal or unfamiliar, mark it as ',
        'Pain.',
    ];
};

const sorenessVSPainMessage = () => {
    return {
        header:   'SORENESS vs. PAIN:',
        lessText: 'Soreness is a normal response to training that can involve some discomfort.\n\nIf something feels abnormal or unfamiliar, mark it as pain.',
        moreText: [
            {
                boldText: 'Soreness is expected after training.',
                body:     'Levels of soreness can vary between mild and extreme but it usually isn\'t a sign of injury. If soreness persists beyond 3 days, improve your wellness practices: rest, refuel, recover.',
            },
            {
                boldText: 'Pain is a sign of something abnormal.',
                body:     'If you felt anything troubling that limited your training, has been lingering for some time, or just doesn\'t feel right, treat that as pain. In addition to improving your wellness practices, you may want to modify your activity levels as well.',
            },
        ],
    }
};

const coachesDashboardCardsData = isToday => {
    if(isToday) {
        return [
            {
                description: 'Significant pain or soreness reported: consult medical staff, consider not training',
                label:       'SEEK MED EVAL TO CLEAR FOR TRAINING',
                overlayText: 'When an athlete completes a survey, their status will update here',
                value:       'seek_med_eval_to_clear_for_training',
            },
            {
                description: 'Modify intensity, movements & drills to prevent severe pain & soreness from worsening',
                label:       'ADAPT TRAINING TO AVOID SYMPTOMS',
                value:       'adapt_training_to_avoid_symptoms',
            },
            {
                description: 'Modify training if pain increases, prioritize recovery to prevent development of injury',
                label:       'MONITOR, MODIFY IF NEEDED',
                value:       'monitor_modify_if_needed',
            },
            {
                description: 'Shorten training or limit intensity & to help facilitate recovery from spike in load',
                label:       'RECOVERY DAY RECOMMENDED',
                value:       'recovery_day_recommended',
            },
            {
                description: 'Survey responses indicate ready to train as normal if no other medical limitations',
                label:       'READY TO TRAIN BASED ON DATA',
                value:       'all_good',
            },
        ]
    }
    return [
        {
            description: 'Significant pain or soreness reported: consult medical staff, consider not training',
            label:       'SEEK MED EVAL TO CLEAR FOR TRAINING',
            overlayText: 'When an athlete has been identified as having a chronic issue, their status will update here',
            value:       'seek_med_eval_to_clear_for_training',
        },
        {
            description: 'Modify intensity, movements & drills to avoid aggravating areas of severe pain & soreness',
            label:       'AT RISK OF TIME-LOSS INJURY',
            value:       'at_risk_of_time_loss_injury',
        },
        {
            description: 'Consider decreasing workload this week or prioritizing holistic recovery',
            label:       'AT RISK OF OVERTRAINING',
            value:       'at_risk_of_overtraining',
        },
        {
            description: 'Increase variety in training duration & intensity, prioritize holistic recovery',
            label:       'LOW VARIABILITY INHIBITING RECOVERY',
            value:       'low_variability_inhibiting_recovery',
        },
        {
            description: 'Unless tapering, increase load with longer or higher intensity session or supplemental session',
            label:       'AT RISK OF UNDERTRAINING',
            value:       'at_risk_of_undertraining',
        },
    ]
};

const coachesDashboardSortBy = [
    {
        label: 'VIEW ALL',
        value: 'view_all',
    },
    {
        label: 'CLEARED TO TRAIN',
        value: 'cleared_to_play',
    },
    {
        label: 'NOT CLEARED TO TRAIN',
        value: 'not_cleared_to_play',
    },
];

const alreadyTrainedNumber = [
    {
        label: '0',
        value: false,
    },
    {
        label: '1',
        value: 1,
    },
    {
        label: '2',
        value: 2,
    },
    {
        label: '3',
        value: 3,
    },
    {
        label: '4',
        value: 4,
    },
    {
        label: '5',
        value: 5,
    },
];

const alreadyTrainedNumberAndroid = [
    {
        label: 'ONE TIME',
        value: 1,
    },
    {
        label: 'TWO TIMES',
        value: 2,
    },
    {
        label: 'THREE TIMES',
        value: 3,
    },
    {
        label: 'FOUR TIMES',
        value: 4,
    },
    {
        label: 'FIVE TIMES',
        value: 5,
    },
];

const fathomSliderText = [
    'Rest',
    'Very, Very Easy',
    'Easy',
    'Moderate',
    'Somewhat Hard',
    'Hard',
    ' ',
    'Very Hard',
    ' ',
    ' ',
    'Max effort',
];

const userSelectedActiveTimeMessage = () => {
    return 'Tap to adjust your active time to best fit your schedule.';
};

const randomizeSessionsCompletionModalText = () => {
    const header = [
        'NICE WORK!',
        'WAY TO GO!',
        'WAY TO WORK!',
    ];
    const subtext = [
        'Remember to vary your workout types to reduce over-use injuries!',
        'Try varying your training intensity to help you build resilience!',
        'Take time for yourself today and prioritize Recovery.',
    ];
    return {
        header:  _.shuffle(header)[0],
        subtext: _.shuffle(subtext)[0],
    };
};

const selectedActiveTimes = (selectedIndex = 2) => {
    let possibleActiveTimes = [5, 10, 15, 20, 25, 30];
    return {
        recommendedLabels:   [' ', ' ', 'Recommended', ' ', ' ', ' '],
        timeLabels:          ['5 minutes', '10 minutes', '15 minutes', '20 minutes', '25 minutes', '30 minutes'],
        possibleActiveTimes: possibleActiveTimes,
        selectedTime:        possibleActiveTimes[selectedIndex],
    }
}

const selectedPriorities = (selectedIndex = 0) => {
    return ['1', '2', '3'];
}

function completionModalExerciseList(exerciseList, completedExercises, isFS = false) {
    let cleanedExerciseList = {};
    _.map(exerciseList.cleanedExerciseList, (exerciseIndex, index) => {
        if(exerciseIndex.length > 0) {
            cleanedExerciseList[index] = {};
            cleanedExerciseList[index].completed = 0;
            cleanedExerciseList[index].total = exerciseIndex.length;
            _.map(exerciseIndex, (exercise, i) => {
                let exerciseId = isFS ?
                    exercise.library_id
                    :
                    `${exercise.library_id}-${exercise.set_number}`;
                if(completedExercises.includes(exerciseId)) {
                    cleanedExerciseList[index].completed += 1;
                }
            });
        }
    });
    return cleanedExerciseList;
}

export default {
    allGoodBodyPartMessage,
    alreadyTrainedNumber,
    alreadyTrainedNumberAndroid,
    availableSessionTypes,
    bodyPartMapping,
    cleanExercise,
    cleanExerciseList,
    cleanFSExerciseList,
    cleanedActivitiesList,
    cleanedPostSessionName,
    coachesDashboardSortBy,
    coachesDashboardCardsData,
    completionModalExerciseList,
    coolDownExerciseListOrder,
    durationOptionGroups,
    exerciseListButtonStyles,
    fathomSliderText,
    isFSCompletedValid,
    jointLevels,
    muscleJointLevels,
    muscleLevels,
    overallReadiness,
    painSorenessMessage,
    preExerciseListOrder,
    postExerciseListOrder,
    postSessionFeel,
    randomizeSessionsCompletionModalText,
    scrollableTabViewPage,
    selectedActiveTimes,
    selectedPriorities,
    sessionTypes,
    sleepQuality,
    sorenessPainScaleMapping,
    sorenessVSPainMessage,
    strengthConditioningTypes,
    teamSports,
    timeOptionGroups,
    translateStrengthConditioningTypeToSport,
    userSelectedActiveTimeMessage,
    warmUpExerciseListOrder,
};
