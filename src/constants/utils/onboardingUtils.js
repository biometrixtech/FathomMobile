import _ from 'lodash';
import { AppColors, AppFonts, AppSizes, AppStyles, UserAccount, } from '../';

const onboardingUtils = {

    isUserRoleValid(role) {
        let errorsArray = [];
        let isValid;
        const possibleRoles = ['athlete', 'manager', 'subject', 'consumer']; // , 'admin', 'super_admin', 'biometrix_admin'
        if(
            !possibleRoles.includes(role)
        ) {
            const newError = 'Please select a valid item from the list below!';
            errorsArray.push(newError);
            isValid = false;
        } else {
            isValid = true;
        }
        return {
            errorsArray,
            isValid,
        }
    },

    isUserAccountInformationValid(user) {
        let errorsArray = [];
        let isValid;

        if(
            user.personal_data.first_name.length === 0
            || user.personal_data.last_name.length === 0
        ) {
            let newError = 'Your First and Last Name are required';
            errorsArray.push(newError);
            isValid = false;
        } else if( !this.isEmailValid(user.personal_data.email).isValid ) {
            let newError = 'Your Email must be a valid email format';
            errorsArray.push(newError);
            isValid = false;
        } else if( !this.isPasswordValid(user.password).isValid && user.id ) {
            let newError = this.getPasswordRules();
            errorsArray.push(newError);
            isValid = false;
        } else {
            errorsArray = [];
            isValid = true;
        }
        return {
            errorsArray,
            isValid,
        }
    },

    isUserAboutValid(user) {
        let errorsArray = [];
        let isValid;
        // possible array strings
        const possibleSystemTypes =  UserAccount.possibleSystemTypes.map(systemTypes => systemTypes.value); // ['1-sensor', '3-sensor'];
        const possibleInjuryStatuses = UserAccount.possibleInjuryStatuses.map(injuryStatus => injuryStatus.value); // ['healthy', 'healthy_chronically_injured', 'returning_from_injury'];
        const possibleGenders = UserAccount.possibleGenders.map(gender => gender.value); // ['male', 'female', 'other'];
        if(
            user.personal_data.birth_date.length > 0
            // && user.personal_data.phone_number.length === 10
            && user.personal_data.zip_code.length > 0
            && (user.biometric_data.height.in.length > 0 || user.biometric_data.height.in > 0)
            && (user.biometric_data.mass.lb.length > 0 || user.biometric_data.mass.lb > 0)
            && possibleInjuryStatuses.includes(user.injury_status)
            && (possibleSystemTypes.includes(user.system_type) || !user.system_type)
            && possibleGenders.includes(user.biometric_data.sex)
        ) {
            errorsArray = [];
            isValid = true;
        } else {
            const newError = 'You\'re still missing some required fields. Please check your inputs and try again';
            errorsArray.push(newError);
            isValid = false;
        }
        return {
            errorsArray,
            isValid,
        }
    },

    areSportsValid(sports) {
        let errorsArray = [];
        let isValid;
        sports.map((sport, index) => {
            const sportValidation = this.isSportValid(sport);
            isValid = sportValidation.isValid;
            if(sportValidation.error.length > 0) {
                errorsArray.push(sportValidation.error);
            }
        });
        return {
            errorsArray,
            isValid,
        }
    },

    isSportValid(sport) {
        const possibleSports = UserAccount.sports.map(sportConst => sportConst.value); // ['basketball', 'baseball_softball', 'cross_country', 'cycling', 'field_hockey', 'general_fitness', 'golf', 'gymnastics', 'ice_hockey', 'lacrosse', 'rowing', 'rugby', 'running', 'soccer', 'swimming_diving', 'tennis', 'track_and_field', 'volleyball', 'wrestling', 'weightlifting'];
        // unsure if we want all of the positions from all sports from UserAccount constants or not
        const possiblePositions = possibleSports.reduce((totalPositions, currentSport) => {
            return _.union(totalPositions, UserAccount.positions[currentSport] ? UserAccount.positions[currentSport].map(position => position.value) : []);
        },[]); // ['forward', 'guard', 'center', 'pitcher', 'catcher', 'infielder', 'outfielder', 'distance-runner', 'goalie', 'fullback', 'golfer', 'gymnast', 'defensemen', 'wing', 'defender', 'attackers', 'rower', 'midfielder', 'distance', 'sprint', 'diver', 'long-distance', 'jumping', 'throwing', 'hitter', 'setter', 'libero', 'blocker', 'wrestler'];
        const possibleCompetitionLevels  = UserAccount.levelsOfPlay.map(levelOfPlay => levelOfPlay.value) // ['recreational_challenge', 'high_school', 'club_travel', 'development_league', 'ncaa_division_iii', 'ncaa_division_ii', 'ncaa_division_i', 'professional'];
        let error = '';
        let isValid;
        if(
            possibleSports.includes(sport.name)
            && sport.positions.length > 0
            && sport.positions.map(position => possiblePositions.includes(position))
            && possibleCompetitionLevels.includes(sport.competition_level)
            && sport.end_date.length > 0
            && sport.season_end_month.length > 0
            && sport.season_start_month.length > 0
            && sport.start_date.length > 0
        ) {
            error = '';
            isValid = true;
        } else {
            error = 'You\'re still missing some required fields in your Sport(s) section. Please check your inputs and try again';
            isValid = false;
        }
        return {
            error,
            isValid,
        }
    },

    areTrainingSchedulesValid(training_schedule) {
        let errorsArray = [];
        let isValid;
        Object.keys(training_schedule).map((sport, index) => {
            let sportSchedule = training_schedule[sport];
            if(
                sportSchedule.competition.days_of_week.length > 0
                && sportSchedule.practice.days_of_week.length > 0
                && sportSchedule.practice.duration_minutes > 0
            ) {
                isValid = true;
            } else {
                errorsArray.push('You\'re still missing some information. Please check your inputs and try again');
            }
        });
        isValid = errorsArray.length > 0 ? false : true;
        return {
            errorsArray,
            isValid,
        }
    },

    isWorkoutOutsidePracticeValid(value) {
        let errorsArray = [];
        let isValid;
        if(value === true || value === false) {
            isValid = true;
        } else {
            isValid = false;
            errorsArray.push('You\'re still missing some information. Please check your inputs and try again');
        }
        return {
            errorsArray,
            isValid,
        }
    },

    isActivitiesValid(training_strength_conditioning) {
        let errorsArray = [];
        let isValid;
        if(
            training_strength_conditioning.activities.length > 0
            && training_strength_conditioning.days.length > 0
            && training_strength_conditioning.durations > 0
            && training_strength_conditioning.totalDurations.length > 0
        ) {
            isValid = true;
        } else {
            isValid = false;
            errorsArray.push('You\'re still missing some information. Please check your inputs and try again');
        }
        return {
            errorsArray,
            isValid,
        }
    },

    isUserClearedValid(user) {
        let errorsArray = [];
        let isValid;
        if(
            user.agreed_terms_of_use
            && user.agreed_privacy_policy
        ) {
            isValid = true;
        } else {
            isValid = false;
            errorsArray.push('You\'re still missing some information. Please check your inputs and try again');
        }
        return {
            errorsArray,
            isValid,
        }
    },

    formatPhoneNumber(s) {
        let s2 = (''+s).replace(/\D/g, '');
        let m = s2.match(/^(\d{3})(\d{3})(\d{4})$/);
        return (!m) ? null : '(' + m[1] + ') ' + m[2] + '-' + m[3];
    },

    /**
     * Converts an integer into words.
     * If number is decimal, the decimals will be removed.
     * @example toWords(12) => 'twelve'
     * @param {number|string} number
     * @param {boolean} [asOrdinal] - Deprecated, use toWordsOrdinal() instead!
     * @returns {string}
     */
    numToWords(number) {
        let words;
        let num = parseInt(number, 10);
        if (!isFinite(num)) {
            throw new TypeError('Not a finite number: ' + number + ' (' + typeof number + ')');
        }
        words = this.generateWords(num);
        return words;
    },

    generateWords(number) {
        const LESS_THAN_TWENTY = [
            'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
            'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'
        ];
        let remainder,word;
        let words = arguments[1];
        // We’re done
        if (number === 0) {
            return !words ? 'zero' : words.join(' ').replace(/,$/, '');
        }
        // First run
        if (!words) {
            words = [];
        }
        // If negative, prepend “minus”
        if (number < 0) {
            words.push('minus');
            number = Math.abs(number);
        }
        if (number < 20) {
            remainder = 0;
            word = LESS_THAN_TWENTY[number];

        }
        words.push(word);
        return this.generateWords(remainder, words);
    },

    inchesToMeters(inches) {
        return (parseFloat(inches) * 0.0254).toFixed(2);
    },

    lbsToKgs(lbs) {
        return (parseFloat(lbs) / 2.20462).toFixed(2);
    },

    metersToInches(meters) {
        return (parseFloat(meters) * 39.3701).toFixed(2);
    },

    kgsToLbs(kgs) {
        return (parseFloat(kgs) * 2.20462).toFixed(2);
    },

    getCurrentStep(user) {
        // all the different RegEx and arrays needed
        const numbersRegex = /[0-9]/g;
        const upperCaseLettersRegex = /[A-Z]/g;
        const lowerCaseLettersRegex = /[a-z]/g;
        const possibleSystemTypes =  UserAccount.possibleSystemTypes.map(systemTypes => systemTypes.value);
        const possibleInjuryStatuses = UserAccount.possibleInjuryStatuses.map(injuryStatus => injuryStatus.value);
        const possibleGenders = UserAccount.possibleGenders.map(gender => gender.value);
        // setup variable
        let count = 1; // start at one for each optional items (right now only user.personal_data.phone_number)
        // count each valid REQUIRED field
        if(user.personal_data.first_name.length > 0) { count = count + 1; }
        if(user.personal_data.last_name.length > 0) { count = count + 1; }
        if(
            user.password.length >= 8
            && user.password.length <= 16
            && numbersRegex.test(user.password)
            && upperCaseLettersRegex.test(user.password)
            && lowerCaseLettersRegex.test(user.password)
        ) { count = count + 1; }
        if( this.isEmailValid(user.personal_data.email) ) { count = count + 1; }
        if(user.personal_data.zip_code.length > 0) { count = count + 1; }
        if(user.personal_data.birth_date.length > 0) { count = count + 1; }
        if(user.biometric_data.height.in.length > 0 || user.biometric_data.height.in > 0) { count = count + 1; }
        if(user.biometric_data.mass.lb.length > 0 || user.biometric_data.mass.lb > 0) { count = count + 1; }
        if(possibleInjuryStatuses.includes(user.injury_status)) { count = count + 1; }
        if(possibleSystemTypes.includes(user.system_type)) { count = count + 1; }
        if(possibleGenders.includes(user.biometric_data.sex)) { count = count + 1; }
        // return count
        return count;
    },

    getTotalSteps(user) {
        return 12;
    },

    isEmailValid(email) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = emailRegex.test(email);
        let errorsArray = []
        if(!isValid)
        {
            errorsArray.push('Your email must be a valid email format')
        }
        return {
            errorsArray,
            isValid
        };
    },

    isPasswordValid(password){
        // Password Validation
        // - 8-16 characters
        // - Must include uppercase letter, lowercase letter, and a number
        const numbersRegex = /[0-9]/g;
        const upperCaseLettersRegex = /[A-Z]/g;
        const lowerCaseLettersRegex = /[a-z]/g;
        let isValid = true;
        let errorsArray = []
        if (!password || password.length < 8
            || password.length > 16
            || !numbersRegex.test(password)
            || !upperCaseLettersRegex.test(password)
            || !lowerCaseLettersRegex.test(password))
        {
            isValid = false;
            errorsArray.push('Your password must be 8-16 characters, include an uppercase letter, a lowercase letter, and a number')
        }
        return {
            errorsArray,
            isValid
        };
    },

    getPasswordRules() {
        return 'Your password must be 8-16 characters, include an uppercase letter, a lowercase letter, and a number';
    },

    getTutorialSlides(page) {
        /* Slides ==================================================================== */
        const SINGLE_SENSOR_SLIDES = {
            showSkipButton: true,
            slides:         [
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-0',
                    subtext:         'Here is a short intro into how it works.',
                    text:            'monitors your workload for in-field and on court activity.',
                    title:           'Your Fathom Sensor',
                },
                {
                    backgroundColor: AppColors.white,
                    image:           require('../../../assets/images/sensor/kitSingleSensor.png'),
                    key:             'tutorial-1',
                    subtext:         'Open it up and inside you’ll find your sensor and adhesives.',
                    text:            'a smart charging hub for your sensor.',
                    title:           'Your Base',
                },
                {
                    backgroundColor:         AppColors.white,
                    image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
                    imageRight:              require('../../../assets/images/sensor/sensorInPractice.png'),
                    imageRightStyles:        {flex: 1, width: AppSizes.screen.widthQuarter,},
                    imageRightWrapperStyles: {alignItems: 'center', width: AppSizes.screen.widthHalf,},
                    key:                     'tutorial-2',
                    subtext:                 'A detailed tutorial for how and where to place the sensor will be provided later.',
                    text:                    'Wear your sensor during all in-field, court and running activities.',
                    title:                   'Your Sensor',
                },
                {
                    backgroundColor:         AppColors.white,
                    image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
                    imageRight:              require('../../../assets/images/sensor/iPhone.png'),
                    imageRightStyles:        {flex: 1, width: AppSizes.screen.widthThreeQuarters,},
                    imageRightWrapperStyles: {alignItems: 'flex-start', width: AppSizes.screen.widthHalf,},
                    key:                     'tutorial-3',
                    subtext:                 'Sync the sensor with your mobile app to update your recovery plan.',
                    text:                    'Return the sensor to your base after activity to recharge.',
                    title:                   'Your Activity',
                },
                {
                    backgroundColor:         AppColors.white,
                    image:                   require('../../../assets/images/sensor/kitSingleSensor.png'),
                    imageLeftWrapperStyles:  {alignItems: 'flex-end', width: AppSizes.screen.widthTwoThirds,},
                    imageRight:              require('../../../assets/images/sensor/usb.png'),
                    imageRightStyles:        {flex: 1, width: AppSizes.screen.widthQuarter,},
                    imageRightWrapperStyles: {alignItems: 'flex-end', width: AppSizes.screen.widthThird,},
                    key:                     'tutorial-4',
                    text:                    'Plan to refill adhesives and recharge your base every few days.',
                    title:                   'Prepare',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-5',
                    linkStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoMedium, color: AppColors.primary.yellow.hundredPercent, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',},
                    linkText:        'No, I\'ll do it later in Settings.',
                    subtext:         'This will only take 1min and must be completed to sync your activity.',
                    subtextStyle:    {...AppStyles.textCenterAligned, ...AppStyles.robotoRegular, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(14),},
                    text:            'Are you ready to connect your sensor to your account?',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoBold, color: AppColors.zeplin.darkGrey, fontSize: AppFonts.scaleFont(20),},
                },
            ],
        };
        const TUTORIAL_SLIDES = {
            showSkipButton: false,
            slides:         [
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-0',
                    title:           'App Tutorial',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-1',
                    text:            'Every morning tell us how you feel so we can design your daily recovery plan',
                    title:           'Readiness Survey',
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/readiness.mp4',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-2',
                    text:            'Access your recovery plan before and after training',
                    title:           'Prep & Recover',
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/prep.mp4',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-3',
                    text:            'Log your activity & soreness so we canupdate your recovery plan',
                    title:           'Train',
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/train.mp4',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-4',
                    text:            'Recover well and often to unlock functional strength',
                    title:           'Functional Strength',
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/fs.mp4',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-5',
                    title:           'You\'re ready to use the app!',
                },
            ],
        };
        const VALUE_EDUCATION_SLIDES = {
            showSkipButton: true,
            slides:         [
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-0',
                    title:           'Welcome to Sustainable Training',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-1',
                    text:            'Fathom is designed to perfectly supplement your sport and support your body.',
                    title:           'Curated to You',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-2',
                    text:            'Your recovery plan adapts every day to your workouts, soreness, injuries, and goals.',
                    title:           'Adapts Daily',
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-3',
                    text:            'We implement clinical knowledge to optimize your work and reduce soreness.',
                    title:           'Validated In Practice',
                },
            ],
        };
        const EMPTY_SLIDES = {
            showSkipButton: true,
            slides:         [],
        };
        return page === 'single-sensor' ?
            SINGLE_SENSOR_SLIDES
            : page === 'educational' ?
                VALUE_EDUCATION_SLIDES
                : page === 'tutorial' ?
                    TUTORIAL_SLIDES
                    :
                    EMPTY_SLIDES;
    },

}

export default onboardingUtils;
