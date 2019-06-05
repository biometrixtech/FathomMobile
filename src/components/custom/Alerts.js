/*
 * @Author: Vir Desai
 * @Date: 2017-10-12 11:16:07
 * @Last Modified by: Vir Desai
 * @Last Modified time: 2018-08-09 20:24:34
 */

/**
 * Alerts - Status/Success/Error Messages
 *
    <Alerts
      error={'Error hey'}
      success={'Hello Success'}
      status={'Something\'s happening...'}
    />
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, } from 'react-native';

// Components
import { Text } from './';

import { AppColors, AppFonts, AppStyles, } from '../../constants';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    alerts: {
        left:  0,
        right: 0,
    },

    // Success
    msg: {
        paddingVertical:   10,
        paddingHorizontal: 10,
        backgroundColor:   AppColors.zeplin.success,
    },
    msg_text: {
        ...AppFonts.oswaldMedium,
        color:    AppColors.white,
        fontSize: AppFonts.scaleFont(14),
    },

    // Error
    msgError: {
        backgroundColor: AppColors.zeplin.error,
    },
    msgError_text: {
        color: AppColors.white,
    },

    // Status
    msgStatus: {
        backgroundColor: AppColors.alerts.statusBackground,
    },
    msgStatus_text: {
        color: AppColors.white,
    },
});

/* Component ==================================================================== */
const Alerts = ({ error, extraStyles, leftAlignText, rightAlignText, status, success, }) => (
    <View style={styles.alerts}>
        {!!success &&
          <View>
              <View style={[extraStyles, styles.msg]}>
                  <Text style={[
                      leftAlignText ? AppStyles.textLeftAligned : rightAlignText ? AppStyles.textRightAligned : AppStyles.textCenterAligned,
                      styles.msg_text,
                  ]}>
                      {Array.isArray(success) ? success[0].toUpperCase() : success.toUpperCase()}
                  </Text>
              </View>
          </View>
        }

        {!!status &&
          <View>
              <View style={[extraStyles, styles.msg, styles.msgStatus]}>
                  <Text style={[
                      leftAlignText ? AppStyles.textLeftAligned : rightAlignText ? AppStyles.textRightAligned : AppStyles.textCenterAligned,
                      styles.msg_text,
                      styles.msgStatus_text,
                  ]}>
                      {Array.isArray(status) ? status[0].toUpperCase() : status.toUpperCase()}
                  </Text>
              </View>
          </View>
        }

        {!!error &&
          <View>
              <View style={[extraStyles, styles.msg, styles.msgError]}>
                  <Text
                      style={[
                          leftAlignText ? AppStyles.textLeftAligned : rightAlignText ? AppStyles.textRightAligned : AppStyles.textCenterAligned,
                          styles.msg_text,
                          styles.msgError_text,
                      ]}
                  >
                      {Array.isArray(error) ? error[0].toUpperCase() : error.toUpperCase()}
                  </Text>
              </View>
          </View>
        }
    </View>
);

Alerts.propTypes = {
    error: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    extraStyles: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.shape({}),
    ]),
    leftAlignText: PropTypes.bool,
    status:        PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
    success: PropTypes.oneOfType([
        PropTypes.array,
        PropTypes.string,
    ]),
};

Alerts.defaultProps = {
    error:         '',
    extraStyles:   null,
    leftAlignText: false,
    status:        '',
    success:       '',
};

Alerts.componentName = 'Alerts';

/* Export Component ==================================================================== */
export default Alerts;
