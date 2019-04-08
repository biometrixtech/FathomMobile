/**
 * @format
 */

/* global it jest describe */

// import required base libraries
import React from 'react';
import 'react-native';
import renderer from 'react-test-renderer'; // NOTE: test renderer must be required after react-native.

// import components to test
import AccountType from '../src/components/auth/AccountType';
import ForgotPassword from '../src/components/auth/ForgotPassword';
import InviteCode from '../src/components/auth/InviteCode';
import Login from '../src/components/auth/Login';
import ResetPassword from '../src/components/auth/ResetPassword';
import SignUp from '../src/components/auth/SignUp';
import Start from '../src/components/auth/Start';
// import CoachesDashboard from '../src/components/coachesDashboard/CoachesDashboard'; // NOTE: issue with 'new'
import { AthleteComplianceModal, } from '../src/components/coachesDashboard/pages';
import {
    Alerts,
    AnimatedProgressBar,
    Button,
    // CalendarStrip, // NOTE: not currently used...
    Card,
    Checkbox,
    Coach,
    CoachesDashboardTabBar,
    // CustomMyPlanNavBar, // NOTE: issue with react-native-router-flux Actions....
    // CustomNavBar, // NOTE: issue with react-native-router-flux Actions....
    FathomModal,
    FathomPicker,
    FathomSlider,
    FormInput,
    Indicator,
    ListItem,
    Pages,
    ProgressBar,
    ProgressCircle,
    RadioButton,
    Slider,
    Spacer,
    SVGImage,
    TabIcon,
    Text,
    Tooltip,
    WebViewPage,
    WheelScrollPicker,
} from '../src/components/custom';
import { EnableAppleHealthKit, Error, Loading, PrivacyPolicyModal, Placeholder, WebView, } from '../src/components/general';
// TODO: ../src/components/kit
import {
    ActiveRecoveryBlocks,
    ActiveTimeSlideUpPanel,
    AreasOfSoreness,
    BackNextButtons,
    DefaultListGap,
    ExerciseCompletionModal,
    ExerciseList,
    ExerciseListItem,
    // Exercises,
    ExercisesExercise,
    FunctionalStrengthModal,
    HealthKitWorkouts,
    PostSessionSurvey,
    ProgressPill,
    ReadinessSurvey,
    RenderMyPlanTab,
    ScaleButton,
    SessionsCompletionModal,
    SingleExerciseItem,
    SoreBodyPart,
    SoreBodyPartScaleButton,
    SportBlock,
    SportScheduleBuilder,
    SurveySlideUpPanel,
    // TimedExercise,
} from '../src/components/myPlan/pages';
// import MyPlan from '../src/components/myPlan/MyPlan';
import { UserAccount, UserAccountAbout, UserAccountInfo, } from '../src/components/onboarding/pages';
import AccountDetails from '../src/components/onboarding/AccountDetails';
import ChangeEmail from '../src/components/onboarding/ChangeEmail';
import Onboarding from '../src/components/onboarding/Onboarding';
import ResendEmail from '../src/components/onboarding/ResendEmail';
import Survey from '../src/components/onboarding/Survey';
import Tutorial from '../src/components/onboarding/Tutorial';
import Settings from '../src/components/settings/Settings';
import { JoinATeamModal, } from '../src/components/settings/pages';
// import CircularProgress from '../src/components/ui/CircularProgress'; // NOTE: react-native-svg isn't installed, not needed

// setup consts
let emptyUser = {
    biometric_data: {
        height: {
            ft_in: [6, 6],
        },
        mass: {
            kg: '',
            lb: '',
        },
        sex: '',
    },
    confirm_password:      '',
    first_time_experience: [],
    id:                    '',
    password:              '',
    personal_data:         {
        birth_date: '',
        email:      '',
        first_name: '',
        last_name:  ''
    },
};
let exerciseList = {
    cleanedExerciseList: {
        'ACTIVATE':  [],
        'FOAM ROLL': [{library_id: 0, set_number: 1,}, {library_id: 1, set_number: 1,}, {library_id: 2, set_number: 1,}, {library_id: 3, set_number: 1,}, {library_id: 4, set_number: 1,}],
        'STRETCH':   [{library_id: 5, set_number: 1,}, {library_id: 6, set_number: 1,}, {library_id: 7, set_number: 1,}, {library_id: 8, set_number: 1,}, {library_id: 9, set_number: 1,}],
    },
};

// setup tests
describe('Testing Render of Auth Pages', () => {
    it('Account Type', () => {
        renderer.create(<AccountType setAccountCode={jest.fn()} />);
    });
    it('Forgot Password', () => {
        renderer.create(<ForgotPassword onFormSubmit={jest.fn()} />);
    });
    it('Invite Code', () => {
        renderer.create(<InviteCode checkAccountCode={jest.fn()} setAccountCode={jest.fn()} />);
    });
    it('Login', () => {
        renderer.create(<Login authorizeUser={jest.fn()} finalizeLogin={jest.fn()} getMyPlan={jest.fn()} lastOpened={{}} network={{}} registerDevice={jest.fn()} setAppLogs={jest.fn()} user={{}} />);
    });
    it('Reset Password', () => {
        renderer.create(<ResetPassword finalizeLogin={jest.fn()} getMyPlan={jest.fn()} lastOpened={{}} onFormSubmit={jest.fn()} onSubmitSuccess={jest.fn()} registerDevice={jest.fn()} setAppLogs={jest.fn()} setEnvironment={jest.fn()} />);
    });
    it('Sign Up', () => {
        renderer.create(<SignUp onFormSubmit={jest.fn()} />);
    });
    it('Start', () => {
        renderer.create(<Start authorizeUser={jest.fn()} finalizeLogin={jest.fn()} getMyPlan={jest.fn()} getUser={jest.fn()} lastOpened={{}} network={{}} registerDevice={jest.fn()} setAppLogs={jest.fn()} user={{}} />);
    });
});

describe('Testing Render of CoachesDashboard Pages', () => {
    /*it('Coaches Dashboard', () => {
        renderer.create(<CoachesDashboard coachesDashboardData={[]} getCoachesDashboardData={jest.fn()} lastOpened={{}} network={{}} updateUser={jest.fn()} user={{}} />);
    });*/
    it('Athlete Compliance Modal', () => {
        renderer.create(<AthleteComplianceModal completedAthletes={[]} complianceColor={''} incompleteAthletes={[]} numOfCompletedAthletes={5} numOfIncompletedAthletes={5} numOfTotalAthletes={10} toggleComplianceModal={jest.fn()} trainingCompliance={{no_response: 5, rest_day: 2, sessions_logged: 3,}} />);
    });
});

describe('Testing Render of Custom Pages', () => {
    it('Alerts', () => {
        renderer.create(<Alerts />);
    });
    it('Animated Progress Bar', () => {
        renderer.create(<AnimatedProgressBar width={100} />);
    });
    it('Button', () => {
        renderer.create(<Button onPress={jest.fn()} title={''} />);
    });
    // it('Calendar Strip', () => {
    //     renderer.create(<CalendarStrip onDateSelected={jest.fn()} />);
    // });
    it('Card', () => {
        renderer.create(<Card />);
    });
    it('Checkbox', () => {
        renderer.create(<Checkbox checked={false} onPress={jest.fn()} />);
    });
    it('Coach', () => {
        renderer.create(<Coach text={''} />);
    });
    it('Coaches Dashboard Tab Bar', () => {
        renderer.create(<CoachesDashboardTabBar disabled={true} scrollValue={{interpolate: jest.fn(),}} tabs={[]} />);
    });
    // it('Custom My Plan Nav Bar', () => {
    //     renderer.create(<CustomMyPlanNavBar />);
    // });
    // it('Custom Nav Bar', () => {
    //     renderer.create(<CustomNavBar />);
    // });
    it('Fathom Modal', () => {
        renderer.create(<FathomModal><Spacer /></FathomModal>);
    });
    it('Fathom Picker', () => {
        renderer.create(<FathomPicker items={[]} onValueChange={jest.fn()} />);
    });
    it('Fathom Slider', () => {
        renderer.create(<FathomSlider handleFormChange={jest.fn()} maximumValue={9} minimumValue={0} name={''} value={5} />);
    });
    it('Form Input', () => {
        renderer.create(<FormInput />);
    });
    it('Indicator', () => {
        renderer.create(<Indicator pages={5} indicatorColor={''} indicatorOpacity={1} indicatorPosition={'bottom'} />);
    });
    it('List Item', () => {
        renderer.create(<ListItem />);
    });
    it('Pages', () => {
        renderer.create(<Pages />);
    });
    it('Progress Bar', () => {
        renderer.create(<ProgressBar currentStep={2} totalSteps={5} />);
    });
    it('Progress Circle', () => {
        renderer.create(<ProgressCircle />);
    });
    it('Radio Button', () => {
        renderer.create(<RadioButton label={''} onChange={jest.fn()} options={[]} />);
    });
    it('Slider', () => {
        renderer.create(<Slider />);
    });
    it('Spacer', () => {
        renderer.create(<Spacer />);
    });
    it('SVG Image', () => {
        renderer.create(<SVGImage firstTimeExperience={[]} handleUpdateFirstTimeExperience={jest.fn()} image={''} style={{}} />);
    });
    it('Tab Icon', () => {
        renderer.create(<TabIcon icon={'search'} />);
    });
    it('Text', () => {
        renderer.create(<Text />);
    });
    it('Tooltip', () => {
        renderer.create(<Tooltip />);
    });
    it('Web View Page', () => {
        renderer.create(<WebViewPage source={'https://www.fathomai.com/'} />);
    });
    it('Wheel Scroll Picker', () => {
        renderer.create(<WheelScrollPicker />);
    });
});

describe('Testing Render of General Pages', () => {
    it('Enable Apple HealthKit', () => {
        renderer.create(<EnableAppleHealthKit handleEnableAppleHealthKit={jest.fn()} handleSkip={jest.fn()} isModalOpen={false} />);
    });
    it('Error', () => {
        renderer.create(<Error />);
    });
    it('Loading', () => {
        renderer.create(<Loading />);
    });
    it('Privacy Policy Modal', () => {
        renderer.create(<PrivacyPolicyModal handleModalToggle={jest.fn()} isPrivacyPolicyOpen={false} />);
    });
    it('Placeholder', () => {
        renderer.create(<Placeholder />);
    });
    it('Web View', () => {
        renderer.create(<WebView url={'https://www.fathomai.com/'} />);
    });
});

/*describe('Testing Render of Kit Pages', () => {
    it('', () => {
        renderer.create(< />);
    });
});*/

describe('Testing Render of MyPlan Pages', () => {
    /*it('My Plan', () => {
        renderer.create(<MyPlan activateFunctionalStrength={jest.fn()} ble={{}} clearCompletedExercises={jest.fn()} clearCompletedFSExercises={jest.fn()} clearHealthKitWorkouts={jest.fn()} getSoreBodyParts={jest.fn()} healthData={{}} lastOpened={{}} markStartedFunctionalStrength={jest.fn()} markStartedRecovery={jest.fn()} network={{}} noSessions={jest.fn()} patchActiveRecovery={jest.fn()} patchActiveTime={jest.fn()} patchFunctionalStrength={jest.fn()} plan={{}} postReadinessSurvey={jest.fn()} postSessionSurvey={jest.fn()} setAppLogs={jest.fn()} setCompletedExercises={jest.fn()} setCompletedFSExercises={jest.fn()} updateUser={jest.fn()} user={emptyUser} />);
    });*/
    it('Active Recovery Blocks', () => {
        renderer.create(<ActiveRecoveryBlocks />);
    });
    it('Active Time Slide Up Panel', () => {
        renderer.create(<ActiveTimeSlideUpPanel changeSelectedActiveTime={jest.fn()} isSlideUpPanelOpen={false} selectedActiveTime={1} toggleSlideUpPanel={jest.fn()} />);
    });it('Areas Of Soreness', () => {
        renderer.create(<AreasOfSoreness handleAreaOfSorenessClick={jest.fn()} handleFormChange={jest.fn()} handleUpdateFirstTimeExperience={jest.fn()} headerTitle={''} scrollToArea={jest.fn()} scrollToTop={jest.fn()} soreBodyParts={{body_parts: [], hist_sore_status: [], clear_candidates: [],}} soreBodyPartsState={[]} surveyObject={{}} toggleSlideUpPanel={jest.fn()} user={emptyUser} />);
    });
    it('Back Next Buttons', () => {
        renderer.create(<BackNextButtons isValid={false} />);
    });

    it('Default List Gap', () => {
        renderer.create(<DefaultListGap />);
    });
    it('Exercise Completion Modal', () => {
        renderer.create(<ExerciseCompletionModal completedExercises={[]} exerciseList={{}} isModalOpen={false} onClose={jest.fn()} onComplete={jest.fn()} user={emptyUser} />);
    });
    it('Exercise List', () => {
        renderer.create(<ExerciseList completedExercises={[]} exerciseList={{}} handleCompleteExercise={jest.fn()} toggleCompletedAMPMRecoveryModal={jest.fn()} toggleSelectedExercise={jest.fn()} />);
    });
    it('Exercise List Item', () => {
        renderer.create(<ExerciseListItem completedExercises={[]} exercise={{}} handleCompleteExercise={jest.fn()} isLastItem={false} toggleSelectedExercise={jest.fn()} />);
    });
    /*it('Exercises', () => {
        renderer.create(<Exercises closeModal={jest.fn()} completedExercises={[]} exerciseList={exerciseList} handleCompleteExercise={jest.fn()} handleUpdateFirstTimeExperience={jest.fn()} selectedExercise={{library_id: 7, set_number: 1,}} user={emptyUser} />);
    });*/
    it('Exercises Exercise', () => {
        renderer.create(<ExercisesExercise completedExercises={[]} exercise={{longDosage: '',}} progressPillsHeight={0} />);
    });
    it('Functional Strength Modal', () => {
        renderer.create(<FunctionalStrengthModal functionalStrength={{}} handleFormChange={jest.fn()} handleFormSubmit={jest.fn()} toggleFSModal={jest.fn()} typicalSessions={[]} />);
    });
    it('HealthKit Workouts', () => {
        renderer.create(<HealthKitWorkouts handleHealthDataFormChange={jest.fn()} handleNextStep={jest.fn()} handleToggleSurvey={jest.fn()} workouts={[]} />);
    });
    it('Post Session Survey', () => {
        renderer.create(<PostSessionSurvey handleAreaOfSorenessClick={jest.fn()} handleFormChange={jest.fn()} handleFormSubmit={jest.fn()} handleTogglePostSessionSurvey={jest.fn()} postSession={{soreness: [],}} soreBodyParts={{}} typicalSessions={[]} user={emptyUser} />);
    });
    it('Progress Pill', () => {
        renderer.create(<ProgressPill currentStep={1} totalSteps={5} />);
    });
    it('Readiness Survey', () => {
        renderer.create(<ReadinessSurvey dailyReadiness={{soreness: [],}} handleAreaOfSorenessClick={jest.fn()} handleFormChange={jest.fn()} handleFormSubmit={jest.fn()} handleHealthDataFormChange={jest.fn()} handleUpdateFirstTimeExperience={jest.fn()} soreBodyParts={{}} user={emptyUser} />);
    });
    it('Render My Plan Tab', () => {
        renderer.create(<RenderMyPlanTab isPostSessionSurveyModalOpen={false} isReadinessSurveyModalOpen={false} isTabActive={false} loading={false} name={''} onLayoutHandler={jest.fn()} onPressHandler={jest.fn()} page={0} plan={{dailyPlan: [{nav_bar_indicator: 0,}],}} statePages={{}} updatePageState={jest.fn()} />);
    });
    it('Scale Button', () => {
        renderer.create(<ScaleButton isSelected={false} keyLabel={0} opacity={0} updateStateAndForm={jest.fn()} />);
    });
    it('Sessions Completion Modal', () => {
        renderer.create(<SessionsCompletionModal isModalOpen={false} onClose={jest.fn()} sessions={[]} />);
    });
    it('Single Exercise Item', () => {
        renderer.create(<SingleExerciseItem completedExercises={[]} exercise={{longDosage: '', videoUrl: '',}} handleCompleteExercise={jest.fn()} selectedExercise={''} />);
    });
    it('Sore Body Part', () => {
        renderer.create(<SoreBodyPart bodyPart={{body_part: 2,}} firstTimeExperience={[]} handleFormChange={jest.fn()} handleUpdateFirstTimeExperience={jest.fn()} toggleSlideUpPanel={jest.fn()} />);
    });
    it('Sore Body Part Scale Button', () => {
        renderer.create(<SoreBodyPartScaleButton isSelected={false} label={''} updateStateAndForm={jest.fn()} />);
    });
    it('Sport Block', () => {
        renderer.create(<SportBlock displayName={''} onPress={jest.fn()} />);
    });
    it('Sport Schedule Builder', () => {
        renderer.create(<SportScheduleBuilder backNextButtonOptions={{}} handleFormChange={jest.fn()} postSession={{}} typicalSessions={[]} />);
    });
    it('Survey Slide Up Panel', () => {
        renderer.create(<SurveySlideUpPanel expandSlideUpPanel={jest.fn()} isSlideUpPanelExpanded={false} isSlideUpPanelOpen={false} toggleSlideUpPanel={jest.fn()} />);
    });
    /*
    it('Timed Exercise', () => {
        renderer.create(<TimedExercise
        />);
    });
    */
});

describe('Testing Render of Onboarding Pages', () => {
    it('User Account', () => {
        renderer.create(<UserAccount componentStep={1} currentStep={1} handleFormChange={jest.fn()} handleFormSubmit={jest.fn()} isFormValid={false} isUpdatingUser={false} togglePrivacyPolicyWebView={jest.fn()} user={emptyUser} />);
    });
    it('User Account About', () => {
        renderer.create(<UserAccountAbout handleFormChange={jest.fn()} setAccordionSection={jest.fn()} updateErrorMessage={jest.fn()} user={emptyUser} />);
    });
    it('User Account Info', () => {
        renderer.create(<UserAccountInfo handleFormChange={jest.fn()} isConfirmPasswordSecure={false} isPasswordSecure={false} isUpdatingUser={false} setAccordionSection={jest.fn()} toggleShowPassword={jest.fn()} updateErrorMessage={jest.fn()} user={emptyUser} />);
    });
    it('Account Details', () => {
        renderer.create(<AccountDetails user={emptyUser} />);
    });
    it('Change Email', () => {
        renderer.create(<ChangeEmail user={emptyUser} />);
    });
    it('Onboarding', () => {
        renderer.create(<Onboarding accountCode={''} accountRole={''} authorizeUser={jest.fn()} createUser={jest.fn()} finalizeLogin={jest.fn()} getMyPlan={jest.fn()} lastOpened={{}} network={{}} onFormSubmit={jest.fn()} registerDevice={jest.fn()} setAccountCode={jest.fn()} setAppLogs={jest.fn()} updateUser={jest.fn()} user={emptyUser} />);
    });
    it('ResendEmail', () => {
        renderer.create(<ResendEmail user={emptyUser} />);
    });
    it('Survey', () => {
        renderer.create(<Survey postSurvey={jest.fn()} updateUser={jest.fn()} user={emptyUser} />);
    });
    /*it('Tutorial', () => {
        renderer.create(<Tutorial updateUser={jest.fn()} user={emptyUser} />);
    });*/
});

describe('Testing Render of Settings Pages', () => {
    it('Settings', () => {
        renderer.create(<Settings accessoryData={{}} deleteUserSensorData={jest.fn()} deleteAllSingleSensorPractices={jest.fn()} logout={jest.fn()} network={{}} user={{}} updateUser={jest.fn()} userJoinAccount={jest.fn()} />);
    });
    it('Join A Team Modal', () => {
        renderer.create(<JoinATeamModal code={''} handleFormChange={jest.fn()} handleFormSubmit={jest.fn()} handleToggleModal={jest.fn()} isFormSubmitting={false} isFormSuccessful={false} isOpen={false} resultMsg={{status: '', success: '', error: ['ooops!'],}} />);
    });
});

/*describe('Testing Render of UI Pages', () => {
    it('CircularProgress', () => {
        renderer.create(<CircularProgress startRequest={jest.fn()} stopRequest={jest.fn()} resetVisibleStates={jest.fn()} />);
    });
});*/
