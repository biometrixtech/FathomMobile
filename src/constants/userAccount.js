/**
 * User Account Constantss
 */

const getHeights = () => {
    let heightList = [];
    for (let feet = 2; feet < 9; feet += 1) {
        if (feet === 8) {
            heightList.push({ label: `${feet}'0"`, value: feet * 12 });
            break;
        }
        for (let inches = 0; inches < 12; inches += 1) {
            heightList.push({ label: `${feet}'${inches}"`, value: ((feet * 12) + inches) });
        }
    }
    return heightList;
}

const HEIGHT_SECTIONS = {
    heights: getHeights()
};

const SPORTS_POSITIONS = {
    sports: [
        { index: 0, order: 1, label: 'Basketball', },
        { index: 1, order: 2, label: 'Baseball', },
        { index: 2, order: 3, label: 'Softball', },
        { index: 3, order: 4, label: 'Cycling', },
        { index: 4, order: 5, label: 'Field Hockey', },
        { index: 5, order: 6, label: 'Football', },
        { index: 6, order: 7, label: 'General Fitness', },
        { index: 7, order: 8, label: 'Golf', },
        { index: 8, order: 9, label: 'Gymnastics', },
        { index: 9, order: 10, label: 'Ice Hockey', },
        { index: 10, order: 11, label: 'Lacrosse', },
        { index: 11, order: 12, label: 'Rowing', },
        { index: 12, order: 13, label: 'Rugby', },
        { index: 13, order: 14, label: 'Running', },
        { index: 14, order: 15, label: 'Soccer', },
        { index: 15, order: 16, label: 'Swimming / Diving', },
        { index: 16, order: 17, label: 'Tennis', },
        { index: 17, order: 18, label: 'Cross Country / Distance Running', },
        { index: 18, order: 19, label: 'Sprints', },
        { index: 19, order: 20, label: 'Jumps', },
        { index: 20, order: 21, label: 'Throws', },
        { index: 21, order: 22, label: 'Volleyball', },
        { index: 22, order: 23, label: 'Wrestling', },
        { index: 23, order: 24, label: 'Weightlifting', },
    ],
    positions: {
        basketball: [
            { label: 'Center', value: 'center', },
            { label: 'Forward', value: 'forward', },
            { label: 'Guard', value: 'guard', },
        ],
        baseball_softball: [
            { label: 'Catcher', value: 'catcher', },
            { label: 'Infielder', value: 'infielder', },
            { label: 'Outfielder', value: 'outfielder', },
            { label: 'Pitcher', value: 'pitcher', },
        ],
        cross_country: [
            { label: 'Distance Runner', value: 'distance_runner', }
        ],
        cycling: [
            { label: 'Cyclist', value: 'cyclist', },
        ],
        field_hockey: [
            { label: 'Forward', value: 'forward', },
            { label: 'Fullback', value: 'fullback', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        football: [
            { label: 'Defensive Back', value: 'defensive_back', },
            { label: 'Kicker', value: 'kicker', },
            { label: 'Linebacker', value: 'linebacker', },
            { label: 'Lineman', value: 'lineman', },
            { label: 'Offensive Back', value: 'offensive_back', },
            { label: 'Quarterback', value: 'quarterback', },
            { label: 'Receiver', value: 'receiver', },
        ],
        general_fitness: [
            { label: 'Athlete', value: 'athlete', },
        ],
        golf: [
            { label: 'Golfer', value: 'golfer', },
        ],
        gymnastics: [
            { label: 'Gymnast', value: 'gymnast', },
        ],
        ice_hockey: [
            { label: 'Center', value: 'center', },
            { label: 'Defensemen', value: 'defensemen', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Wing', value: 'wing', },
        ],
        lacrosse: [
            { label: 'Attackers', value: 'attackers', },
            { label: 'Defender', value: 'defender', },
            { label: 'Goalie', value: 'goalie', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        rowing: [
            { label: 'Rower', value: 'rower', },
        ],
        rugby: [
            { label: 'Back', value: 'back', },
            { label: 'Forward', value: 'forward', },
        ],
        soccer: [
            { label: 'Defender', value: 'defender', },
            { label: 'Forward', value: 'forward', },
            { label: 'Goalkeeper', value: 'goalkeeper', },
            { label: 'Midfielder', value: 'midfielder', },
        ],
        swimming_diving: [
            { label: 'Distance', value: 'distance', },
            { label: 'Diver', value: 'diver', },
            { label: 'Sprint', value: 'sprint', },
        ],
        tennis: [
            { label: 'Athlete', value: 'athlete', },
        ],
        track_field: [
            { label: 'Jumping', value: 'jumping', },
            { label: 'Long Distance', value: 'long_distance', },
            { label: 'Sprint', value: 'sprint', },
            { label: 'Throwing', value: 'throwing', },
        ],
        volleyball: [
            { label: 'Blocker', value: 'blocker', },
            { label: 'Hitter', value: 'hitter', },
            { label: 'Libero', value: 'libero', },
            { label: 'Setter', value: 'setter', },
        ],
        wrestling: [
            { label: 'Wrestler', value: 'wrestler', },
        ],
        weightlifting: [
            { label: 'Athlete', value: 'athlete', },
        ],
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
    {
        label: 'Returning from Acute Injury',
        value: 'returning_from_acute_injury',
    },
];

const possibleGenders = [
    {
        color: 'black',
        label: 'Male',
        value: 'male',
    },
    {
        color: 'black',
        label: 'Female',
        value: 'female',
    },
    {
        color: 'black',
        label: 'Intersex',
        value: 'other',
    },
];

const activityLevels = [
    {
        color: 'black',
        label: '0-1 workouts/week',
        value: '0-1',
    },
    {
        color: 'black',
        label: '2-4 workouts/week',
        value: '2-4',
    },
    {
        color: 'black',
        label: '5+ workouts/week',
        value: '5+',
    },
];

const wearableDevices = [
    {
        color: 'black',
        label: 'None',
        value: 'None',
    },
    {
        color: 'black',
        label: 'Apple Watch',
        value: 'Apple Watch',
    },
    {
        color: 'black',
        label: 'Garmin',
        value: 'Garmin',
    },
    {
        color: 'black',
        label: 'Fitbit',
        value: 'Fitbit',
    },
    {
        color: 'black',
        label: 'Other',
        value: 'Other',
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

const possibleDaysOfWeek = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

const possibleShorthandDaysOfWeek = [
    'Mon',
    'Tues',
    'Wed',
    'Thurs',
    'Fri',
    'Sat',
    'Sun',
];

const getMinutesToTimeFormat = (minutes) => {
    let h = Math.floor(minutes / 60);
    let m = minutes % 60;
    h = h < 10 ? '0' + h : h;
    m = m < 10 ? '0' + m : m;
    return `${h}:${m}`;
};

const getTimes = (startValue, endValue, incrementValue) => {
    let timeList = [];
    for (let minutes = startValue; minutes <= endValue; minutes += incrementValue) {
        timeList.push({label: getMinutesToTimeFormat(minutes), value: minutes});
    }
    return timeList;
}

const COMPETITION_TIME = {
    competitionTimes: getTimes(5, 300, 5),
    activitiesTimes:  getTimes(15, 120, 15),
};

const workoutOutsidePracticeOptions = [
    {
        label: 'Yes',
        value: true,
    },
    {
        label: 'No',
        value: false,
    },
];

const possibleActivities = {
    label: [
        'Calisthenics',
        'Cardio',
        'Cycling',
        'Endurance Running',
        'Interval Training',
        'Rowing',
        'Sprinting',
        'Swimming',
        'Weightlifting',
        'Yoga',
    ],
    value: [
        'calisthenics',
        'cardio',
        'cycling',
        'endurance_running',
        'interval_training',
        'rowing',
        'sprinting',
        'swimming',
        'weightlifting',
        'yoga',
    ],
};

export default {
    ...COMPETITION_TIME,
    ...HEIGHT_SECTIONS,
    ...LEVELS_OF_PLAY,
    ...SPORTS_POSITIONS,
    activityLevels,
    possibleActivities,
    possibleDaysOfWeek,
    possibleGenders,
    possibleShorthandDaysOfWeek,
    possibleSystemTypes,
    possibleInjuryStatuses,
    seasonStartEndMonths,
    wearableDevices,
    workoutOutsidePracticeOptions,
};