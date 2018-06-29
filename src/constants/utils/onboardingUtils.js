const onboardingUtils = {

    isUserTypeValid(type) {
        let errorsArray = [];
        let isValid;
        const possibleTypes = ['athlete', 'parent', 'coach'];
        if(
            !possibleTypes.includes(type)
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
        const possibleInjuryStatuses = ['healthy', 'healthy-chronically-injured', 'returning-from-injury'];
        if(
            user.dob
            && user.height > 0
            && user.weight.length > 0
            && possibleInjuryStatuses.includes(user.injuryStatus)
            && possibleSystemTypes.includes(user.systemType)
            && user.sports.length > 0
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
        const possibleSports = ['basketball', 'baseball-softball', 'cross-country', 'cycling', 'field-hockey', 'general-fitness', 'golf', 'gymnastics', 'ice-hockey', 'lacrosse', 'rowing', 'rugby', 'running', 'soccer', 'swimming-diving', 'tennis', 'track-field', 'volleyball', 'wrestling', 'weightlifting'];
        let error = '';
        let isValid;
        if(
            possibleSports.includes(sport.sport)
            && sport.yearsInSport
        ) {
            error = '';
            isValid = true;
        } else {
            error = 'You\'re still missing some required fields in your Sport(s) section. Please check your inputs and try again';
            isValid = false;
        }
        sport.seasons.map((season, index) => {
            if(!this.isSeasonValid(season)) {
                isValid = false;
                error = 'You\'re still missing some required fields in your Sport(s) section. Please check your inputs and try again';
            }
        });
        return {
            error,
            isValid,
        }
    },

    isSeasonValid(season) {
        const possiblePositions = ['forward', 'guard', 'center', 'pitcher', 'catcher', 'infielder', 'outfielder', 'distance-runner', 'goalie', 'fullback', 'golfer', 'gymnast', 'defensemen', 'wing', 'defender', 'attackers', 'rower', 'midfielder', 'distance', 'sprint', 'diver', 'long-distance', 'jumping', 'throwing', 'hitter', 'setter', 'libero', 'blocker', 'wrestler'];
        if(
            season.positions.length > 0
            && season.positions.map(position => possiblePositions.includes(position))
            && season.seasonEndDate
            && season.seasonStartDate
            && season.levelOfPlay.length > 0
        ) {
            return true;
        }
        return false
    },

}

export default onboardingUtils;
