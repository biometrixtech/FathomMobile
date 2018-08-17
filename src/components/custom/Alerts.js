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
import {
    View,
    StyleSheet,
} from 'react-native';

// Components
import { Text } from './';

import { AppColors, AppFonts } from '../../constants';

/* Styles ==================================================================== */
const styles = StyleSheet.create({
    alerts: {
        left:  0,
        right: 0,
    },

    // Success
    msg: {
        backgroundColor: AppColors.alerts.successBackground,
        paddingVertical: 10,
    },
    msg_text: {
        ...AppFonts.oswaldMedium,
        color:     AppColors.white,
        fontSize:  AppFonts.scaleFont(14),
        textAlign: 'center',
    },

    // Error
    msgError: {
        backgroundColor: AppColors.alerts.errorBackground,
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
const Alerts = ({ status, success, error }) => (
    <View style={styles.alerts}>
        {!!success &&
          <View>
              <View style={[styles.msg]}>
                  <Text style={[styles.msg_text]}>{success}</Text>
              </View>
          </View>
        }

        {!!status &&
          <View>
              <View style={[styles.msg, styles.msgStatus]}>
                  <Text style={[styles.msg_text, styles.msgStatus_text]}>
                      {status}
                  </Text>
              </View>
          </View>
        }

        {!!error &&
          <View>
              <View style={[styles.msg, styles.msgError]}>
                  <Text
                      style={[
                          styles.msg_text,
                          styles.msgError_text,
                      ]}
                  >
                      {error}
                  </Text>
              </View>
          </View>
        }
    </View>
);

Alerts.propTypes = {
    status:  PropTypes.string,
    success: PropTypes.string,
    error:   PropTypes.string,
};

Alerts.defaultProps = {
    status:  '',
    success: '',
    error:   '',
};

Alerts.componentName = 'Alerts';

/* Export Component ==================================================================== */
export default Alerts;
