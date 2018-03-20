/*
 * @Author: Vir Desai 
 * @Date: 2017-10-12 11:31:04 
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-03-19 00:52:57
 */

/**
 * Threshold Config
 */

// Consts
import { AppColors } from '@theme/';

export default {
    acwr: [
        { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.brand.red },
        { max: 1.5, min: 1.2, color: AppColors.brand.yellow },
        { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.yellow },
        { max: 1.2, min: 0.8, color: AppColors.greyText },
    ],
    fatigueRateAcrossDays: [
        { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.red },
        { max: -1, min: -5, color: AppColors.brand.yellow },
    ],
    fatigueRateSingleDay: [
        { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.red },
        { max: -10, min: -19.99, color: AppColors.brand.yellow },
    ],
    movementQualityScore: [
        { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.brand.red },
        { max: 88, min: 70, color: AppColors.brand.yellow },
    ],
    gfrDist: [
        { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.brand.red },
        { max: 9.99, min: 5, color: AppColors.brand.yellow },
    ],
    chart: {
        acwr: [
            { max: Number.POSITIVE_INFINITY, min: 1.5, color: AppColors.chart.red, title: 'High Ramp', detectionResponse: 'Critically high workload risk', recommedationResponse: 'template text' },
            { max: 1.5, min: 1.2, color: AppColors.chart.yellow, title: 'Low Ramp', detectionResponse: 'Moderate workload risk', recommedationResponse: 'template text' },
            { max: 0.8, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.yellow, title: 'Low Ramp', detectionResponse: 'Moderate workload risk', recommedationResponse: 'template text' },
        ],
        fatigueRateAcrossDays: [
            { max: -5, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.red, title: 'Fatigue Across Sessions', detectionResponse: 'Severe functional movement decline trending across days', recommedationResponse: 'template text' },
            { max: -1, min: -5, color: AppColors.chart.yellow, title: 'Fatigue Across Sessions', detectionResponse: 'Functional movement decline trending across days', recommedationResponse: 'template text' },
        ],
        fatigueRateSingleDay: [
            { max: -20, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.red, title: 'Fatigue in Session', detectionResponse: 'Severe functional movement declined within session', recommedationResponse: 'template text' },
            { max: -10, min: -19.99, color: AppColors.chart.yellow, title: 'Fatigue in Session', detectionResponse: 'Functional movement declined within session', recommedationResponse: 'template text' },
        ],
        movementQualityScore: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.red, title: 'Nonoptimal Movement Pattern', detectionResponse: 'Severely poor functional movement within session', recommedationResponse: 'template text' },
            { max: 88, min: 70, color: AppColors.chart.yellow, title: 'Nonoptimal Movement Pattern', detectionResponse: 'Poor functional movement within session', recommedationResponse: 'template text' },
        ],
        gfrDist: [
            { max: Number.POSITIVE_INFINITY, min: 10, color: AppColors.chart.red, title: 'Asymmetric Loading', detectionResponse: 'Highly asymmetric force exposure', recommedationResponse: 'template text' },
            { max: 9.99, min: 5, color: AppColors.chart.yellow, title: 'Asymmetric Loading', detectionResponse: 'Asymmetric force exposure', recommedationResponse: 'template text' },
        ],
        symmetry: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.red, title: 'Asymmetric Movement Pattern', detectionResponse: 'Highly asymmetric movement pattern detected', recommedationResponse: 'template text' },
            { max: 88, min: 70, color: AppColors.chart.yellow, title: 'Asymmetric Movement Pattern', detectionResponse: 'Asymmetric movement pattern detected', recommedationResponse: 'template text' }
        ],
        control: [
            { max: 70, min: Number.NEGATIVE_INFINITY, color: AppColors.chart.red, title: 'Poor Joint Control', detectionResponse: 'Critically poor joint control detected', recommedationResponse: 'template text' },
            { max: 90, min: 70, color: AppColors.chart.yellow, title: 'Poor Joint Control', detectionResponse: 'Poor joint control detected', recommedationResponse: 'template text' }
        ]
    }
}