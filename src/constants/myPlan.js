/*
 * @Author: Mazen Chami
 * @Date: 2018-07-12 12:28:00
 * @Last Modified by:   Mazen Chami
 * @Last Modified time: 2017-07-12 12:28:00
 */

/**
 * MyPlan Config
 */

const bodyPartMapping = [
    {index: 0, order: null, label: 'Head', group: '', image: {}, bilateral: false},
    {index: 1, order: null, label: 'Shoulder', group: '', image: {}, bilateral: false},
    {index: 2, order: null, label: 'Chest', group: '', image: {}, bilateral: false},
    {index: 3, order: 1, label: 'Abdominals', group: 'muscle', image: {0: 'Abs.svg'}, bilateral: false},
    {index: 4, order: 3, label: 'Hip', group: 'joint', image: {0: 'Hip.svg', 1: 'L_Hip.svg', 2: 'R_Hip.svg'}, bilateral: true},
    {index: 5, order: 5, label: 'Groin', group: 'muscle', image: {0: 'Groin.svg', 1: 'L_Groin.svg', 2: 'R_Groin.svg'}, bilateral: true},
    {index: 6, order: 7, label: 'Quads', group: 'muscle', image: {0: 'Quad.svg', 1: 'L_Quad.svg', 2: 'R_Quad.svg'}, bilateral: true},
    {index: 7, order: 9, label: 'Knee', group: 'joint', image: {0: 'Knee.svg', 1: 'L_Knee.svg', 2: 'R_Knee.svg'}, bilateral: true},
    {index: 8, order: 10, label: 'Shin', group: 'muscle', image: {0: 'Shin.svg', 1: 'L_Shin.svg', 2: 'R_Shin.svg'}, bilateral: true},
    {index: 9, order: 12, label: 'Ankle', group: 'joint', image: {0: 'Ankle.svg', 1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}, bilateral: true},
    {index: 10, order: 14, label: 'Foot', group: 'joint', image: {0: 'Foot.svg', 1: 'L_Foot.svg', 2: 'R_Foot.svg'}, bilateral: true},
    {index: 11, order: 6, label: 'IT Band', group: 'muscle', image: {0: 'ITBand.svg', 1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}, bilateral: true},
    {index: 12, order: 2, label: 'Lower Back', group: 'joint', image: {0: 'LowBack.svg'}, bilateral: false},
    {index: 13, order: null, label: '', group: '', image: {}, bilateral: false},
    {index: 14, order: 4, label: 'Glutes', group: 'muscle', image: {0: 'Glute.svg', 1: 'L_Glute.svg', 2: 'R_Glute.svg'}, bilateral: true},
    {index: 15, order: 8, label: 'Hamstrings', group: 'muscle', image: {0: 'Hamstring.svg', 1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}, bilateral: true},
    {index: 16, order: 11, label: 'Calves', group: 'muscle', image: {0: 'Calf.svg', 1: 'L_Calf.svg', 2: 'R_Calf.svg'}, bilateral: true},
    {index: 17, order: 13, label: 'Achilles', group: 'muscle', image: {0: 'Achilles.svg', 1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}, bilateral: true},
];
// 0 = None/both
// 1 = left
// 2 = right

const overallReadiness = [
    'Not At All',
    'Not ready',
    'Mostly not read',
    'Somewhat ready',
    'Ready',
    'Totally Ready',
    'Very ready',
    'Bringing my A-Game',
    'Top of my game',
    'Max Readiness',
];

const sleepQuality = [
    'None',
    'Terribly- I’m a zombie',
    'Poorly- Hard to staying awake',
    'Not Well- trouble focusing',
    'Descently',
    'Enough to operate normally',
    'Good- feeling rested!',
    'Well- focused and energetic!',
    'Very well!',
    'Maximal- top mental state!',
];

const muscleLevels = [
    '',
    'A little tight/sore',
    'Sore, can move ok',
    'Limits movement',
    'Struggling to move',
    'Painful to move',
];

const jointLevels = [
    '',
    'discomfort ',
    'dull ache',
    'severe ache',
    'sharp pain',
    'inability to move',
];

export default {
    bodyPartMapping,
    jointLevels,
    muscleLevels,
    overallReadiness,
    sleepQuality,
};
