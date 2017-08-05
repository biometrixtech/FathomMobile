/**
 * BLE Config
 */

var _byteToHex = [];
var _hexToByte = {};
for (let i = 0; i < 256; i++) {
    _byteToHex[i] = (i + 0x100).toString(16).substr(1);
    _hexToByte[_byteToHex[i]] = i;
}

const parse = function parse(s, buf, offset) {
    return new Promise(resolve => {
        let i = (buf && offset) || 0;
        let ii = 0;

        buf = buf || [];
        s.toLowerCase().replace(/[0-9a-f]{2}/g, (oct) => {
            if (ii < 16) { // Don't overflow!
                buf[i + (ii++)] = _hexToByte[oct];
            }
        });

        // Zero out remaining bytes if string was short
        while (ii < 16) {
            buf[i + (ii++)] = 0;
        }

        return resolve(buf);
    });
}

function unparse(buf, offset) {
    let i = offset || 0;
    let bth = _byteToHex;
    return  bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] + '-' +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]] +
            bth[buf[i++]] + bth[buf[i++]];
}

export default {
    serviceUUID:        '3282ae19-ab8b-f495-7544-67e11bb6223f',
    characteristicUUID: 'a268ae6f-3433-d999-4e44-42e82070d3de',
    dataUUID:           '4A8C2B82-5BB8-D4B8-D244-57280862C228',

    pin: '135712',

    errors: {
        encryption: 'Encryption is insufficient.'
    },

    commands: {
        SHUTDOWN:           parseInt('0x01', 16),
        SYS_RESET:          parseInt('0x02', 16),
        GET_STATE:          parseInt('0x03', 16),
        SET_WIFI_SSID_HEAD: parseInt('0x04', 16),
        SET_WIFI_SSID_CONT: parseInt('0x05', 16),
        SET_WIFI_PSW_HEAD:  parseInt('0x06', 16),
        SET_WIFI_PSW_CONT:  parseInt('0x07', 16),
        CONNECT_WIFI:       parseInt('0x08', 16),
        GET_MAC_ADDRESS:    parseInt('0x09', 16),
        SET_SERIAL_ID:      parseInt('0x0A', 16),
        GET_SERIAL_ID:      parseInt('0x0B', 16),
        GET_BLE_BD:         parseInt('0x0C', 16),
        GET_UUID:           parseInt('0x0D', 16),
        SET_UUID:           parseInt('0x0E', 16),
        STORE_PARAMS:       parseInt('0x0F', 16),
        CALIBRATION:        parseInt('0x10', 16),
        STOP_SESSION:       parseInt('0x11', 16),
        START_LOG:          parseInt('0x12', 16),
        ERASE_MEMORY:       parseInt('0x13', 16),
        GET_MEMORY_BUSY:    parseInt('0x14', 16),
        GET_BATTERY:        parseInt('0x15', 16),
        GET_LOG_FILES:      parseInt('0x16', 16),
        GET_CALIB_OFFSET:   parseInt('0x17', 16),
        GET_CALIB_DIAG:     parseInt('0x18', 16),
        GET_CALIB_TRIANGLE: parseInt('0x19', 16),
        GET_CLK_DRIFT:      parseInt('0x1A', 16),
        SET_CLK_DRIFT:      parseInt('0x1B', 16),
        GET_CLK_OFFSET:     parseInt('0x1C', 16),
        SET_CLK_OFFSET:     parseInt('0x1D', 16),
        ENTER_TIME_SYNC:    parseInt('0x1E', 16),
        FACTORY_RESET:      parseInt('0x1F', 16),
        WIFI_SCAN:          parseInt('0x20', 16),
        TIME_OFFSET:        parseInt('0x21', 16),
        EXIT_TIME_SYNC:     parseInt('0x22', 16),
        WIFI_SSID:          parseInt('0x23', 16),
        READ_FILE:          parseInt('0x24', 16),
        SET_ACCESSORY_BD:   parseInt('0x25', 16),
        GET_ACCESSORY_BD:   parseInt('0x26', 16),
        WIFI_SSID_SCAN_ID:  parseInt('0x27', 16),
        SET_STATE:          parseInt('0x28', 16),
        START_STILL_CALIB:  parseInt('0x29', 16),
        STILL_CALIB:        parseInt('0x30', 16),
        AC_CALIB:           parseInt('0x31', 16),
        GET_MEMORY:         parseInt('0x32', 16),
        SET_BF_QUATERNION:  parseInt('0x33', 16),
        SET_NEUTRAL_QUAT:   parseInt('0x34', 16),
        SET_TIME:           parseInt('0x35', 16),
        GET_CONFIGURATION:  parseInt('0x36', 16),
        SET_OWNER_ORG:      parseInt('0x50', 16),
        SET_OWNER_TEAM:     parseInt('0x51', 16),
        SET_OWNER_USER:     parseInt('0x52', 16),
        SET_KIT_NAME:       parseInt('0x53', 16),
        GET_OWNER_ORG:      parseInt('0x54', 16),
        GET_OWNER_TEAM:     parseInt('0x55', 16),
        GET_OWNER_USER:     parseInt('0x56', 16),
        GET_KIT_NAME:       parseInt('0x57', 16),
        LOGIN:              parseInt('0x58', 16)
    },

    roles: {
        admin:           parseInt('0x03', 16),
        athlete:         parseInt('0x04', 16),
        super_admin:     parseInt('0x02', 16),
        biometrix_admin: parseInt('0x02', 16),
        manager:         parseInt('0x01', 16),
        researcher:      parseInt('0x01', 16),
    },

    state: {
        APP_NOTHING:     parseInt('0x00', 16),
        APP_IDLE:        parseInt('0x01', 16),
        APP_STARTUP:     parseInt('0x02', 16),
        APP_STOP:        parseInt('0x03', 16),
        APP_CALIBRATION: parseInt('0x04', 16),
        APP_PRACTICE:    parseInt('0x05', 16),
        APP_TIME_SYNC:   parseInt('0x06', 16),
        APP_READOUT:     parseInt('0x07', 16),
        APP_WAIT:        parseInt('0x20', 16),
        APP_KIT_SETUP:   parseInt('0x21', 16),
        APP_READY:       parseInt('0x22', 16),
        APP_ERROR:       parseInt('0xFF', 16)
    },

    configuration: {
        NOTHING:        parseInt('0x00', 16),
        ORG_SET:        parseInt('0x01', 16),
        USER_SET:       parseInt('0x02', 16),
        TEAM_SET:       parseInt('0x04', 16),
        NAME_SET:       parseInt('0x08', 16),
        DONE:           parseInt('0x1F', 16),
        UPSERT_PENDING: parseInt('0x2F', 16),
        UPSERT_TO_SAVE: parseInt('0x3F', 16),
        UPSERT_DONE:    parseInt('0x7F', 16),
    },

    parse,
    unparse
};