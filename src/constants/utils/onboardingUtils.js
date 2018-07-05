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
        // Email Validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        // Password Validation
        // - 8-16 characters
        // - Must include uppercase letter, lowercase letter, and a number
        const numbersRegex = /[0-9]/g;
        const upperCaseLettersRegex = /[A-Z]/g;
        const lowerCaseLettersRegex = /[a-z]/g;
        if(
            user.personal_data.first_name.length === 0
            || user.personal_data.last_name.length === 0
        ) {
            const newError = 'Your First and Last Name are required';
            errorsArray.push(newError);
            isValid = false;
        } else if(
            user.password.length < 8
            || user.password.length > 16
            || !numbersRegex.test(user.password)
            || !upperCaseLettersRegex.test(user.password)
            || !lowerCaseLettersRegex.test(user.password)
        ) {
            const newError = 'Your password must be 8-16 characters, include an uppercase letter, a lowercase letter, and a number';
            errorsArray.push(newError);
            isValid = false;
        } else if( !emailRegex.test(user.email) ) {
            const newError = 'Your Email must be a valid email format';
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
        const possibleSystemTypes = ['1-sensor', '3-sensor'];
        const possibleInjuryStatuses = ['healthy', 'healthy_chronically_injured', 'returning_from_injury'];
        const possibleGenders = ['male', 'female', 'other'];
        if(
            user.personal_data.birth_date.length > 0
            && user.biometric_data.height.in.length > 0
            && user.biometric_data.mass.lb.length > 0
            && possibleInjuryStatuses.includes(user.injury_status)
            && possibleSystemTypes.includes(user.system_type)
            && user.sports.length > 0
            && possibleGenders.includes(user.biometric_data.gender)
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
        const possibleSports = ['basketball', 'baseball_softball', 'cross_country', 'cycling', 'field_hockey', 'general_fitness', 'golf', 'gymnastics', 'ice_hockey', 'lacrosse', 'rowing', 'rugby', 'running', 'soccer', 'swimming_diving', 'tennis', 'track_and_field', 'volleyball', 'wrestling', 'weightlifting'];
        const possiblePositions = ['forward', 'guard', 'center', 'pitcher', 'catcher', 'infielder', 'outfielder', 'distance-runner', 'goalie', 'fullback', 'golfer', 'gymnast', 'defensemen', 'wing', 'defender', 'attackers', 'rower', 'midfielder', 'distance', 'sprint', 'diver', 'long-distance', 'jumping', 'throwing', 'hitter', 'setter', 'libero', 'blocker', 'wrestler'];
        const possibleCompetitionLevels = ['recreational_challenge', 'high_school', 'club_travel', 'development_league', 'ncaa_division_iii', 'ncaa_division_ii', 'ncaa_division_i', 'professional'];
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

    capitalizeFirstLetter(str) {
        return str.replace(/^\w/, s => s.toUpperCase());
    },

}

export default onboardingUtils;
