/**
 * BLE Config
 */

export default {
    serviceUUID:        '3282ae19-ab8b-f495-7544-67e11bb6223f',
    characteristicUUID: 'a268ae6f-3433-d999-4e44-42e82070d3de',

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
    }
};