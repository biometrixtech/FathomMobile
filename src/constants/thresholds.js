/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:04 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-04-23 18:38:09
 */

/**
 * Threshold Config
 */

// Consts
import AppColors from './colors';

export default {
    acwr: [
        { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.secondary.red.hundredPercent },
        { max: 1.5, min: 1.3, color: AppColors.zeplin.yellow },
        { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.zeplin.yellow },
        { max: 1.3, min: 0.8, color: AppColors.primary.grey.hundredPercent },
    ],
    fatigueRateAcrossDays: [
        { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: -1, min: -5, color: AppColors.zeplin.yellow },
    ],
    fatigueRateSingleDay: [
        { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: -10, min: -19.99, color: AppColors.zeplin.yellow },
    ],
    movementQualityScore: [
        { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: 88, min: 70, color: AppColors.zeplin.yellow },
    ],
    gfrDist: [
        { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.secondary.red.hundredPercent },
        { max: 9.99, min: 5, color: AppColors.zeplin.yellow },
    ],
    chart: {
        acwrTotalAccel7: [
            { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'WORKLOAD IS INCREASING AT A HIGH RATE', detectionResponse: 'Your workload is increasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If you\'ve worn the sensors consistently in prior weeks to track workouts, focus on recovery and consider regulating your workload by slowly decreasing your active minutes or intensity for the next several days until you\'re back in a safe range. If not, this alert may be triggered due to gaps in data!' },
            { max: 1.5, min: 1.3, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'WORKLOAD IS INCREASING AT A HIGH RATE', detectionResponse: 'Your workload is increasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If you\'ve worn the sensors consistently in prior weeks to track workouts, focus on recovery and consider regulating your workload by slowly decreasing your active minutes or intensity for the next several days until you\'re back in a safe range. If not, this alert may be triggered due to gaps in data!' },
            { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'WORKLOAD IS DECREASING AT A SIGNIFICANT RATE', detectionResponse: 'Your workload is decreasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If this is not intentionally decreasing for recovery, and you are consistently wearing the sensors in practice, consider slowly increasing your workload over the next two weeks to re-establish an ACWR of between .8 and 1.2. If you haven\'t worn the sensors consistently, this alert may be triggered due to gaps in data.' },
        ],
        acwrGRF7: [
            { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'FORCE EXPOSURE IS INCREASING AT A HIGH RATE', detectionResponse: 'Your force exposure is increasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If you\'ve worn the sensors consistently in prior weeks to track workouts, consider regulating the stress on your body by training on softer surfaces, softening your foot-strike-pattern, or slowing the rate of weekly workload increase. If not, this alert may be triggered due to gaps in data! ' },
            { max: 1.5, min: 1.3, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'FORCE EXPOSURE IS INCREASING AT A HIGH RATE', detectionResponse: 'Your force exposure is increasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If you\'ve worn the sensors consistently in prior weeks to track workouts, consider regulating the stress on your body by training on softer surfaces, softening your foot-strike-pattern, or slowing the rate of weekly workload increase. If not, this alert may be triggered due to gaps in data! ' },
            { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'FORCE EXPOSURE IS DECREASING AT A SIGNIFICANT RATE', detectionResponse: 'Your force exposure is decreasing at a rate that research has shown to increase your risk of injury.', recommedationResponse: 'If this is not intentionally decreasing for recovery, and you are consistently wearing the sensors in practice, consider slowly increasing your workload over the next two weeks to re-establish an ACWR of between .8 and 1.2. If you haven\'t worn the sensors consistently, this alert may be triggered due to gaps in data.' },
        ],
        fatigueRateAcrossDays: [
            { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'INCREASING FATIGUE IDENTIFIED THROUGHOUT THIS WEEK', detectionResponse: 'Your functional movement quality is declining from session to session', recommedationResponse: 'Focus on recovery after each practice with proper nutrition, stretching, foam rolling, and plenty of sleep. Consider taking an extra day to rest and reducing exposure to activities that cause aggravated muscle soreness or pain to let your recovery "catch up" with training demands.' },
            { max: -1, min: -5, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'INCREASING FATIGUE IDENTIFIED THROUGHOUT THIS WEEK', detectionResponse: 'Your functional movement quality is declining from session to session', recommedationResponse: 'Focus on recovery after each practice with proper nutrition, stretching, foam rolling, and plenty of sleep. Consider reducing exposure to activities that cause aggravated muscle soreness or pain to let your recovery "catch up" with training demands.' },
        ],
        fatigueRateSingleDay: [
            { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'FATIGUE IDENTIFIED THROUGHOUT SESSION', detectionResponse: 'Your biomechanical response declined over the course of this training session.', recommedationResponse: 'Focus on your recovery and consider decreasing the intensity of your next workout. In future training sessions similar to this one, consider decreasing the training volume or take more rest throughout the session.' },
            { max: -10, min: -19.99, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'FATIGUE IDENTIFIED THROUGHOUT SESSION', detectionResponse: 'Your biomechanical response declined over the course of this training session.', recommedationResponse: 'Focus on your recovery and consider decreasing the intensity of your next workout. In future training sessions similar to this one, consider decreasing the training volume or take more rest throughout the session.' },
        ],
        gfrDist: [
            { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'ASYMMETRIC FORCE EXPOSURE', detectionResponse: 'You\'re overloading your [left/right] side [x%] more times relative to your [right/left]', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may not be ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' },
            { max: 9.99, min: 5, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'ASYMMETRIC FORCE EXPOSURE', detectionResponse: 'You\'re overloading your [left/right] side [x%] more times relative to your [right/left]', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may not be ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' },
        ],
        symmetry: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'ASYMMETRIC MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' },
            { max: 88, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'ASYMMETRIC MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' }
        ],
        hipSymmetry: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'ASYMMETRIC HIP MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically at the hips.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' },
            { max: 88, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'ASYMMETRIC HIP MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically at the hips.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' }
        ],
        ankleSymmetry: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'ASYMMETRIC ANKLE MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically at your ankles.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' },
            { max: 88, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'ASYMMETRIC ANKLE MOVEMENT PATTERN', detectionResponse: 'You\'re distributing stress throughout your body asymmetrically at your ankles.', recommedationResponse: 'If this is due to asymmetry in your training plans, consider balancing your activities to decrease accumulated effects. Else, you may be compensating and are not ready for the volume or intensity of your training. Decrease your training intensity and strengthen in controlled settings.' }
        ],
        control: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'DECREASED JOINT STABILITY', detectionResponse: 'Your ability to maintain joint stability was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'DECREASED JOINT STABILITY', detectionResponse: 'Your ability to maintain joint stability was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' }
        ],
        controlRF: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'DECREASED JOINT STABILITY AT YOUR RIGHT ANKLE', detectionResponse: 'Your ability to maintain stability at your right ankle was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'DECREASED JOINT STABILITY AT YOUR RIGHT ANKLE', detectionResponse: 'Your ability to maintain stability at your right ankle was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' }
        ],
        controlLF: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'DECREASED JOINT STABILITY AT YOUR LEFT ANKLE', detectionResponse: 'Your ability to maintain stability at your left ankle was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'DECREASED JOINT STABILITY AT YOUR LEFT ANKLE', detectionResponse: 'Your ability to maintain stability at your left ankle was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' }
        ],
        hipControl: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'DECREASED JOINT STABILITY AT YOUR HIPS', detectionResponse: 'Your ability to maintain stability at your hips was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'DECREASED JOINT STABILITY AT YOUR HIPS', detectionResponse: 'Your ability to maintain stability at your hips was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' }
        ],
        ankleControl: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'DECREASED JOINT STABILITY AT YOUR ANKLES', detectionResponse: 'Your ability to maintain stability at your ankles was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.seventyPercent, title: 'DECREASED JOINT STABILITY AT YOUR ANKLES', detectionResponse: 'Your ability to maintain stability at your ankles was low throughout this training session.', recommedationResponse: 'You may not be ready for the volume or intensity introduced in this training session. Improve your neuromuscular response by training at lower intensities and increasing strength in controlled settings until you\'ve developed the strength and are ready to progress safely.' }
        ]
    }
}