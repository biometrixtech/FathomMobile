/**
 * User Account Constantss
 */

const getHeights = () => {
    let heightList = [];
    for (let feet = 2; feet < 9; feet += 1) {
        if (feet === 8) {
            heightList.push({ title: `${feet}'0"` });
            break;
        }
        for (let inches = 0; inches < 12; inches += 1) {
            heightList.push({ title: `${feet}'${inches}"` });
        }
    }
    return heightList;
}

const HEIGHT_SECTIONS = {
    heights: getHeights()
};

const SPORTS_POSITIONS = {
    sports: [
        { label: 'Basketball', value: 'basketball', },
        { label: 'Baseball / Softball', value: 'baseball_softball', },
        { label: 'Cross Country', value: 'cross_country', },
        { label: 'Cycling', value: 'cycling', },
        { label: 'Field Hockey', value: 'field_hockey', },
        { label: 'General Fitness', value: 'general_fitness', },
        { label: 'Golf', value: 'golf', },
        { label: 'Gymnastics', value: 'gymnastics', },
        { label: 'Ice Hockey', value: 'ice_hockey', },
        { label: 'Lacrosse', value: 'lacrosse', },
        { label: 'Rowing', value: 'rowing', },
        { label: 'Rugby', value: 'rugby', },
        { label: 'Running', value: 'running', },
        { label: 'Soccer', value: 'soccer', },
        { label: 'Swimming / Diving', value: 'swimming_diving', },
        { label: 'Tennis', value: 'tennis', },
        { label: 'Track & Field', value: 'track_and_field', },
        { label: 'Volleyball', value: 'volleyball', },
        { label: 'Wrestling', value: 'wrestling', },
        { label: 'Weightlifting', value: 'weightlifting', },
    ],
    positions: {
        ['basketball']: [
            { label: 'Center', value: 'center', },
            { label: 'Forward', value: 'forward', },
            { label: 'Guard', value: 'guard', },
        ],
        ['baseball_softball']: [
            { label: 'Catcher', value: 'catcher', },
            { label: 'Infielder', value: 'infielder', },
            { label: 'Outfielder', value: 'outfielder', },
            { label: 'Pitcher', value: 'pitcher', },
        ],
        ['cross_country']: [
            { label: 'Distance Runner', value: 'distance_runner', }
        ],
        ['cycling']:      [],
        ['field_hockey']: [
            { label: 'Forward', value: 'forward', },
            { label: 'Fullback', value: 'fullback', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        ['general_fitness']: [],
        ['golf']:            [
            { label: 'Golfer', value: 'golfer', },
        ],
        ['gymnastics']: [
            { label: 'Gymnast', value: 'gymnast', },
        ],
        ['ice_hockey']: [
            { label: 'Center', value: 'center', },
            { label: 'Defensemen', value: 'defensemen', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Wing', value: 'wing', },
        ],
        ['lacrosse']: [
            { label: 'Attackers', value: 'attackers', },
            { label: 'Defender', value: 'defender', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        ['rowing']: [
            { label: 'Rower', value: 'rower', },
        ],
        ['rugby']:   [],
        ['running']: [],
        ['soccer']:  [
            { label: 'Defender', value: 'defender', },
            { label: 'Forward', value: 'forward', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        ['swimming_diving']: [
            { label: 'Distance', value: 'distance', },
            { label: 'Diver', value: 'diver', },
            { label: 'Sprint', value: 'sprint', },
        ],
        ['tennis']:      [],
        ['track_field']: [
            { label: 'Jumping', value: 'jumping', },
            { label: 'Long Distance', value: 'long_distance', },
            { label: 'Sprint', value: 'sprint', },
            { label: 'Throwing', value: 'throwing', },
        ],
        ['volleyball']: [
            { label: 'Blocker', value: 'blocker', },
            { label: 'Hitter', value: 'hitter', },
            { label: 'Libero', value: 'libero', },
            { label: 'Setter', value: 'setter', },
        ],
        ['wrestling']: [
            { label: 'Wrestler', value: 'wrestler', },
        ],
        ['weightlifting']: [],
    },
};

const LEVELS_OF_PLAY = {
    levelsOfPlay: [
        { label: 'Recreational/Challenge', value: 'recreational_challenge', },
        { label: 'High School', value: 'high_school', },
        { label: 'Club / Travel', value: 'club_travel', },
        { label: 'Development League', value: 'development_league', },
        { label: 'NCAA Division III', value: 'ncaa_division_iii', },
        { label: 'NCAA Division II', value: 'ncaa_division_ii', },
        { label: 'NCAA Division I', value: 'ncaa_division_i', },
        { label: 'Professional', value: 'professional', },
    ],
};

const possibleSystemTypes = [
    {
        label: '1 Sensor',
        value: '1-sensor',
    },
    {
        label: '3 Sensor',
        value: '3-sensor',
    },
];

const possibleInjuryStatuses = [
    {
        label: 'Healthy',
        value: 'healthy',
    },
    {
        label: 'Healthy but Chronically Injured',
        value: 'healthy_chronically_injured',
    },
    {
        label: 'Returning from Injury',
        value: 'returning_from_injury',
    },
];

const possibleGenders = [
    {
        label: 'Male',
        value: 'male',
    },
    {
        label: 'Female',
        value: 'female',
    },
    {
        label: 'Other',
        value: 'other',
    },
];

const missedDueToInjuryOptions = [
    {
        label: 'Yes',
        value: true,
    },
    {
        label: 'No',
        value: false,
    },
];

const seasonStartEndMonths = [
    { label: 'January', value: 'january', },
    { label: 'February', value: 'february', },
    { label: 'March', value: 'march', },
    { label: 'April', value: 'april', },
    { label: 'May', value: 'may', },
    { label: 'June', value: 'june', },
    { label: 'July', value: 'july', },
    { label: 'August', value: 'august', },
    { label: 'September', value: 'september', },
    { label: 'October', value: 'october', },
    { label: 'November', value: 'november', },
    { label: 'December', value: 'december', },
];

export default {
    ...HEIGHT_SECTIONS,
    ...LEVELS_OF_PLAY,
    ...SPORTS_POSITIONS,
    missedDueToInjuryOptions,
    possibleGenders,
    possibleSystemTypes,
    possibleInjuryStatuses,
    seasonStartEndMonths,
};
