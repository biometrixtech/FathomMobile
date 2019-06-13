// import third-party libraries
import _ from 'lodash';
import { AppColors, AppFonts, AppSizes, AppStyles, UserAccount, } from '../';

const onboardingUtils = {

    isUserAccountInformationValid(user, isUpdatingUser) {
        let errorsArray = [];
        let isValid;
        const firstLastNameRegex = /\d/g;
        if( user.personal_data.first_name.length === 0 || user.personal_data.last_name.length === 0 ) {
            let newError = 'Your First and Last Name are required';
            errorsArray.push(newError);
            isValid = false;
        } else if( user.personal_data.first_name.length > 0 && firstLastNameRegex.test(user.personal_data.first_name) ) {
            let newError = 'Please enter a valid First Name';
            errorsArray.push(newError);
            isValid = false;
        } else if( user.personal_data.last_name.length > 0 && firstLastNameRegex.test(user.personal_data.last_name) ) {
            let newError = 'Please enter a valid Last Name';
            errorsArray.push(newError);
            isValid = false;
        } else if( !this.isEmailValid(user.personal_data.email).isValid ) {
            let newError = 'Your Email must be a valid email format';
            errorsArray.push(newError);
            isValid = false;
        } else if( !isUpdatingUser && !this.isPasswordValid(user.password).isValid ) {
            let newError = this.getPasswordRules();
            errorsArray.push(newError);
            isValid = false;
        } else if( !isUpdatingUser && user.password !== user.confirm_password ) {
            let newError = this.getInvalidPasswordRules();
            errorsArray.push(newError);
            isValid = false;
        } else if( user.personal_data.phone_number.length > 0 && !this.isPhoneNumberValid(user.personal_data.phone_number) ) {
            let newError = 'Your Phone Number must be a valid format (1234567890)';
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
            user.personal_data.birth_date.length > 0 &&
            // (user.biometric_data.height.in.length > 0 || user.biometric_data.height.in > 0) &&
            // possibleInjuryStatuses.includes(user.injury_status) &&
            // (possibleSystemTypes.includes(user.system_type) || !user.system_type) &&
            possibleGenders.includes(user.biometric_data.sex)
        ) {
            errorsArray = [];
            isValid = true;
        } else {
            const newError = 'You\'re still missing some required fields. Please check your inputs and try again';
            errorsArray.push(newError);
            isValid = false;
        }
        /*if(user.personal_data.zip_code.length !== 5) {
            const newError = 'Please enter a valid Zip Code';
            errorsArray.push(newError);
            isValid = false;
        }*/
        if( _.toNumber(user.biometric_data.mass.lb) === 0 ) {
            const newError = 'Please enter a valid Weight';
            errorsArray.push(newError);
            isValid = false;
        }
        return {
            errorsArray,
            isValid,
        }
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
            user.password.length >= 8 &&
            user.password.length <= 16 &&
            numbersRegex.test(user.password) &&
            user.confirm_password.length >= 8 &&
            user.confirm_password.length <= 16 &&
            numbersRegex.test(user.confirm_password)
        ) { count = count + 1; }
        if( this.isEmailValid(user.personal_data.email) ) { count = count + 1; }
        // if(user.personal_data.zip_code.length > 0) { count = count + 1; }
        if(user.personal_data.birth_date.length > 0) { count = count + 1; }
        // if(user.biometric_data.height.in.length > 0 || user.biometric_data.height.in > 0) { count = count + 1; }
        if(user.biometric_data.mass.lb.length > 0 || user.biometric_data.mass.lb > 0) { count = count + 1; }
        // if(possibleInjuryStatuses.includes(user.injury_status)) { count = count + 1; }
        // if(possibleSystemTypes.includes(user.system_type)) { count = count + 1; }
        if(possibleGenders.includes(user.biometric_data.sex)) { count = count + 1; }
        // return count
        return count;
    },

    getTotalSteps(user) {
        return 7;
    },

    isPhoneNumberValid(phoneNumber) {
        const phoneNumberRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
        return phoneNumberRegex.test(phoneNumber);
    },

    isEmailValid(email) {
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = emailRegex.test(email.trim());
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

    isPasswordValid(password) {
        // Password Validation
        // - 8-16 characters
        // - Must include a number
        // - NOT include spaces
        const numbersRegex = /[0-9]/g;
        const upperCaseLettersRegex = /[A-Z]/g;
        const lowerCaseLettersRegex = /[a-z]/g;
        let isValid = true;
        let errorsArray = []
        if (
            !password ||
            password.length < 8 ||
            !numbersRegex.test(password)
        ) {
            isValid = false;
            errorsArray.push('Your password must be 8-16 characters and include a number.')
        }
        return {
            errorsArray,
            isValid
        };
    },

    getPasswordRules() {
        return 'Your password must be 8-16 characters and include a number.';
    },

    getInvalidPasswordRules() {
        return 'Passwords do not match.';
    },

    hasWhiteSpaces(str) {
        return str.indexOf(' ') >= 0;
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
                    subtext:         'Open it up and inside you\'ll find your sensor and adhesives.',
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
                    linkStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoMedium, color: AppColors.zeplin.yellow, fontSize: AppFonts.scaleFont(14), textDecorationLine: 'none',},
                    linkText:        'No, I\'ll do it later in Settings.',
                    subtext:         'This will only take 1min and must be completed to sync your activity.',
                    subtextStyle:    {...AppStyles.textCenterAligned, ...AppStyles.robotoRegular, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(14),},
                    text:            'Are you ready to connect your sensor to your account?',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoBold, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(20),},
                },
            ],
        };
        const TUTORIAL_SLIDES = {
            showSkipButton: false,
            slides:         [
                {
                    backgroundColor: AppColors.white,
                    icon:            {color: AppColors.zeplin.yellow, goToPage: 1, icon: 'arrow-right-circle', type: 'simple-line-icon',},
                    key:             'tutorial-0',
                    title:           'Welcome to Sustainable Training',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(40),},
                },
                {
                    backgroundColor: AppColors.zeplin.yellow,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-1',
                    text:            'Daily surveys help personalize prep & post-training recommendations.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(35),},
                },
                {
                    backgroundColor: AppColors.zeplin.slate,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-2',
                    text:            'Prep activities optimize your body\'s movement & mobilize tissues.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(35),},
                },
                {
                    backgroundColor: AppColors.zeplin.yellow,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-3',
                    text:            'Logging daily training allows us to analyze Trends & optimize your recovery rhythm.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(35),},
                },
                {
                    backgroundColor: AppColors.zeplin.slate,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-4',
                    text:            'Post-training activities improve circulation to rebuild muscle & speed up recovery.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(35),},
                },
                {
                    backgroundColor: AppColors.white,
                    icon:            {color: AppColors.zeplin.yellow, goToPage: false, icon: 'arrow-right-circle', type: 'simple-line-icon',},
                    key:             'tutorial-5',
                    title:           'You\'re ready to use the app!',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(40),},
                },
            ],
        };
        const COACH_TUTORIAL_SLIDES = {
            showSkipButton: false,
            slides:         [
                {
                    backgroundColor: AppColors.white,
                    icon:            {color: AppColors.zeplin.yellow, goToPage: 1, icon: 'arrow-right-circle', type: 'simple-line-icon',},
                    key:             'tutorial-0',
                    title:           'Let\'s Take a Tour of Fathom!',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(40),},
                },
                {
                    backgroundColor: AppColors.zeplin.yellow,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-1',
                    text:            'It\'s important that athletes do pre & post training surveys regularly to ensure your dashboard has the most accurate insights.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(28),},
                    title:           'Athlete App: Surveys',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.white, fontSize: AppFonts.scaleFont(40),},
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-2',
                    title:           'Athlete App: Surveys',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(30),},
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/athletesurvey.mp4',
                },
                {
                    backgroundColor: AppColors.zeplin.navy,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-3',
                    text:            'We synthesize athlete responses & provide simple recommendations to help reduce risk of injury and overtraining.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(28),},
                    title:           'Coach\'s App: Training Insights',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.white, fontSize: AppFonts.scaleFont(40),},
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-4',
                    title:           'Coach\'s App: Training Insights',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(25),},
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/coachinsight.mp4',
                },
                {
                    backgroundColor: AppColors.zeplin.yellow,
                    buttonTextStyle: {color: AppColors.white,},
                    key:             'tutorial-5',
                    text:            'Encourage athletes to complete Fathom\'s Active Recovery to improve their training readiness & reduce chronic soreness & injury risk.',
                    textStyle:       {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.white, fontSize: AppFonts.scaleFont(28),},
                    title:           'Athlete App: Active Recovery',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.white, fontSize: AppFonts.scaleFont(40),},
                },
                {
                    backgroundColor: AppColors.white,
                    key:             'tutorial-6',
                    title:           'Athlete App: Recovery',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.oswaldMedium, color: AppColors.zeplin.navy, fontSize: AppFonts.scaleFont(30),},
                    videoLink:       'https://s3.amazonaws.com/onboarding-content/athleterecovery.mp4',
                },
                {
                    backgroundColor: AppColors.white,
                    icon:            {color: AppColors.zeplin.yellow, goToPage: false, icon: 'arrow-right-circle', type: 'simple-line-icon',},
                    key:             'tutorial-9',
                    title:           'Now Let\'s Go To The Dashboard!',
                    titleStyle:      {...AppStyles.textCenterAligned, ...AppStyles.robotoLight, color: AppColors.zeplin.slate, fontSize: AppFonts.scaleFont(40),},
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
                : page === 'tutorial-tutorial' ?
                    TUTORIAL_SLIDES
                    : page === 'coach-tutorial' ?
                        COACH_TUTORIAL_SLIDES
                        :
                        EMPTY_SLIDES;
    },

}

export default onboardingUtils;
