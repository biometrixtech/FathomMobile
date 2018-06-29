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
        { label: 'Baseball / Softball', value: 'baseball-softball', },
        { label: 'Cross Country', value: 'cross-country', },
        { label: 'Cycling', value: 'cycling', },
        { label: 'Field-hockey', value: 'field-hockey', },
        { label: 'General Fitness', value: 'general-fitness', },
        { label: 'Golf', value: 'golf', },
        { label: 'Gymnastics', value: 'gymnastics', },
        { label: 'Ice Hockey', value: 'ice-hockey', },
        { label: 'Lacrosse', value: 'lacrosse', },
        { label: 'Rowing', value: 'rowing', },
        { label: 'Rugby', value: 'rugby', },
        { label: 'Running', value: 'running', },
        { label: 'Soccer', value: 'soccer', },
        { label: 'Swimming / Diving', value: 'swimming-diving', },
        { label: 'Tennis', value: 'tennis', },
        { label: 'Track & Field', value: 'track-field', },
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
        ['baseball-softball']: [
            { label: 'Catcher', value: 'catcher', },
            { label: 'Infielder', value: 'infielder', },
            { label: 'Outfielder', value: 'outfielder', },
            { label: 'Pitcher', value: 'pitcher', },
        ],
        ['cross-country']: [
            { label: 'Distance Runner', value: 'distance-runner', }
        ],
        ['cycling']:      [],
        ['field-hockey']: [
            { label: 'Forward', value: 'forward', },
            { label: 'Fullback', value: 'fullback', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        ['general-fitness']: [],
        ['golf']:            [
            { label: 'Golfer', value: 'golfer', },
        ],
        ['gymnastics']: [
            { label: 'Gymnast', value: 'gymnast', },
        ],
        ['ice-hockey']: [
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
        ['swimming-diving']: [
            { label: 'Distance', value: 'distance', },
            { label: 'Diver', value: 'diver', },
            { label: 'Sprint', value: 'sprint', },
        ],
        ['tennis']:      [],
        ['track-field']: [
            { label: 'Jumping', value: 'jumping', },
            { label: 'Long Distance', value: 'long-distance', },
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
        { label: 'Recreational/Challenge', value: 'recreational-challenge', },
        { label: 'High School', value: 'high-school', },
        { label: 'Club / Travel', value: 'club-travel', },
        { label: 'Development League', value: 'development-league', },
        { label: 'NCAA Division III', value: 'ncaa-division-iii', },
        { label: 'NCAA Division II', value: 'ncaa-division-ii', },
        { label: 'NCAA Division I', value: 'ncaa-division-i', },
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
        value: 'healthy-chronically-injured',
    },
    {
        label: 'Returning from Injury',
        value: 'returning-from-injury',
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

export default {
    ...HEIGHT_SECTIONS,
    ...LEVELS_OF_PLAY,
    ...SPORTS_POSITIONS,
    possibleSystemTypes,
    possibleInjuryStatuses,
    missedDueToInjuryOptions,
};
