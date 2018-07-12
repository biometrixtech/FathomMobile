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
    {label: 'Head', group: '', image: {}},
    {label: 'Shoulder', group: '', image: {}},
    {label: 'Chest', group: '', image: {}},
    {label: 'Abdominals', group: 'muscle', image: {0: 'Abs.svg'}},
    {label: 'Hip', group: 'joint', image: {1: 'L_Hip.svg', 2: 'R_Hip.svg'}},
    {label: 'Groin', group: 'muscle', image: {1: 'L_Groin.svg', 2: 'R_Groin.svg'}},
    {label: 'Quads', group: 'muscle', image: {1: 'L_Quad.svg', 2: 'R_Quad.svg'}},
    {label: 'Knee', group: 'joint', image: {1: 'L_Knee.svg', 2: 'R_Knee.svg'}},
    {label: 'Shin', group: 'muscle', image: {1: 'L_Shin.svg', 2: 'R_Shin.svg'}},
    {label: 'Ankle', group: 'joint', image: {1: 'L_Ankle.svg', 2: 'R_Ankle.svg'}},
    {label: 'Foot', group: 'joint', image: {1: 'L_Foot.svg', 2: 'R_Foot.svg'}},
    {label: 'IT Band', group: 'muscle', image: {1: 'L_ITBand.svg', 2: 'R_ITBand.svg'}},
    {label: 'Lower Back', group: 'joint', image: {0: 'LowBack.svg'}},
    {label: '', group: '', image: {}},
    {label: 'Glutes', group: 'muscle', image: {1: 'L_Glute.svg', 2: 'R_Glute.svg'}},
    {label: 'Hamstrings', group: 'muscle', image: {1: 'L_Hamstring.svg', 2: 'R_Hamstring.svg'}},
    {label: 'Calves', group: 'muscle', image: {1: 'L_Calf.svg', 2: 'R_Calf.svg'}},
    {label: 'Achilles', group: 'muscle', image: {1: 'L_Achilles.svg', 2: 'R_Achilles.svg'}},
];
// 0 = None
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
