/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:04 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-23 00:32:30
 */

/**
 * Threshold Config
 */

// Consts
import { AppColors } from '@theme/';

export default {
    acwr: [
        { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.secondary.red.hundredPercent },
        { max: 1.5, min: 1.2, color: AppColors.primary.yellow.hundredPercent },
        { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.primary.yellow.hundredPercent },
        { max: 1.2, min: 0.8, color: AppColors.primary.grey.hundredPercent },
    ],
    fatigueRateAcrossDays: [
        { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: -1, min: -5, color: AppColors.primary.yellow.hundredPercent },
    ],
    fatigueRateSingleDay: [
        { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: -10, min: -19.99, color: AppColors.primary.yellow.hundredPercent },
    ],
    movementQualityScore: [
        { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red.hundredPercent },
        { max: 88, min: 70, color: AppColors.primary.yellow.hundredPercent },
    ],
    gfrDist: [
        { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.secondary.red.hundredPercent },
        { max: 9.99, min: 5, color: AppColors.primary.yellow.hundredPercent },
    ],
    chart: {
        acwr: [
            { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'High Ramp', detectionResponse: 'Critically high workload risk', recommedationResponse: 'template text' },
            { max: 1.5, min: 1.2, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Low Ramp', detectionResponse: 'Moderate workload risk', recommedationResponse: 'template text' },
            { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Low Ramp', detectionResponse: 'Moderate workload risk', recommedationResponse: 'template text' },
        ],
        fatigueRateAcrossDays: [
            { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Fatigue Across Sessions', detectionResponse: 'Severe functional movement decline trending across days', recommedationResponse: 'template text' },
            { max: -1, min: -5, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Fatigue Across Sessions', detectionResponse: 'Functional movement decline trending across days', recommedationResponse: 'template text' },
        ],
        fatigueRateSingleDay: [
            { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Fatigue in Session', detectionResponse: 'Severe functional movement declined within session', recommedationResponse: 'template text' },
            { max: -10, min: -19.99, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Fatigue in Session', detectionResponse: 'Functional movement declined within session', recommedationResponse: 'template text' },
        ],
        movementQualityScore: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Nonoptimal Movement Pattern', detectionResponse: 'Severely poor functional movement within session', recommedationResponse: 'template text' },
            { max: 88, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Nonoptimal Movement Pattern', detectionResponse: 'Poor functional movement within session', recommedationResponse: 'template text' },
        ],
        gfrDist: [
            { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Asymmetric Loading', detectionResponse: 'Highly asymmetric force exposure', recommedationResponse: 'template text' },
            { max: 9.99, min: 5, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Asymmetric Loading', detectionResponse: 'Asymmetric force exposure', recommedationResponse: 'template text' },
        ],
        symmetry: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Asymmetric Movement Pattern', detectionResponse: 'Highly asymmetric movement pattern detected', recommedationResponse: 'template text' },
            { max: 88, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Asymmetric Movement Pattern', detectionResponse: 'Asymmetric movement pattern detected', recommedationResponse: 'template text' }
        ],
        control: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.secondary.red, cardColor: AppColors.secondary.red.fiftyPercent, title: 'Poor Joint Control', detectionResponse: 'Critically poor joint control detected', recommedationResponse: 'template text' },
            { max: 90, min: 70, color: AppColors.primary.yellow, cardColor: AppColors.primary.yellow.fiftyPercent, title: 'Poor Joint Control', detectionResponse: 'Poor joint control detected', recommedationResponse: 'template text' }
        ]
    }
}