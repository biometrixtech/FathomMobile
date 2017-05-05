'use strict';

var React = require('react-native');
var bleManager = React.NativeModules.BleManager;

var BleManager = function () {
  function BleManager() {
    babelHelpers.classCallCheck(this, BleManager);

    this.isPeripheralConnected = this.isPeripheralConnected.bind(this);
  }

  babelHelpers.createClass(BleManager, [{
    key: 'read',
    value: function read(peripheralId, serviceUUID, characteristicUUID) {
      return new Promise(function (fulfill, reject) {
        bleManager.read(peripheralId, serviceUUID, characteristicUUID, function (error, data) {
          if (error) {
            reject(error);
          } else {
            fulfill(data);
          }
        });
      });
    }
  }, {
    key: 'readRSSI',
    value: function readRSSI(peripheralId) {
      return new Promise(function (fulfill, reject) {
        bleManager.readRSSI(peripheralId, function (error, rssi) {
          if (error) {
            reject(error);
          } else {
            fulfill(rssi);
          }
        });
      });
    }
  }, {
    key: 'write',
    value: function write(peripheralId, serviceUUID, characteristicUUID, data, maxByteSize) {
      if (maxByteSize == null) {
        maxByteSize = 20;
      }
      return new Promise(function (fulfill, reject) {
        bleManager.write(peripheralId, serviceUUID, characteristicUUID, data, maxByteSize, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'writeWithoutResponse',
    value: function writeWithoutResponse(peripheralId, serviceUUID, characteristicUUID, data, maxByteSize, queueSleepTime) {
      if (maxByteSize == null) {
        maxByteSize = 20;
      }
      if (queueSleepTime == null) {
        queueSleepTime = 10;
      }
      return new Promise(function (fulfill, reject) {
        bleManager.writeWithoutResponse(peripheralId, serviceUUID, characteristicUUID, data, maxByteSize, queueSleepTime, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'connect',
    value: function connect(peripheralId) {
      return new Promise(function (fulfill, reject) {
        bleManager.connect(peripheralId, function (error, peripheral) {
          if (error) {
            reject(error);
          } else {
            fulfill(peripheral);
          }
        });
      });
    }
  }, {
    key: 'disconnect',
    value: function disconnect(peripheralId) {
      return new Promise(function (fulfill, reject) {
        bleManager.disconnect(peripheralId, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'startNotification',
    value: function startNotification(peripheralId, serviceUUID, characteristicUUID) {
      return new Promise(function (fulfill, reject) {
        bleManager.startNotification(peripheralId, serviceUUID, characteristicUUID, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'stopNotification',
    value: function stopNotification(peripheralId, serviceUUID, characteristicUUID) {
      return new Promise(function (fulfill, reject) {
        bleManager.stopNotification(peripheralId, serviceUUID, characteristicUUID, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'checkState',
    value: function checkState() {
      bleManager.checkState();
    }
  }, {
    key: 'start',
    value: function start(options) {
      return new Promise(function (fulfill, reject) {
        if (options == null) {
          options = {};
        }
        bleManager.start(options, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'scan',
    value: function scan(serviceUUIDs, seconds, allowDuplicates) {
      return new Promise(function (fulfill, reject) {
        if (allowDuplicates == null) {
          allowDuplicates = false;
        }
        bleManager.scan(serviceUUIDs, seconds, allowDuplicates, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'stopScan',
    value: function stopScan() {
      return new Promise(function (fulfill, reject) {
        bleManager.stopScan(function (error) {
          if (error != null) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'enableBluetooth',
    value: function enableBluetooth() {
      return new Promise(function (fulfill, reject) {
        bleManager.enableBluetooth(function (error) {
          if (error != null) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'getConnectedPeripherals',
    value: function getConnectedPeripherals(serviceUUIDs) {
      return new Promise(function (fulfill, reject) {
        bleManager.getConnectedPeripherals(serviceUUIDs, function (error, result) {
          if (error) {
            reject(error);
          } else {
            if (result != null) {
              fulfill(result);
            } else {
              fulfill([]);
            }
          }
        });
      });
    }
  }, {
    key: 'getDiscoveredPeripherals',
    value: function getDiscoveredPeripherals() {
      return new Promise(function (fulfill, reject) {
        bleManager.getDiscoveredPeripherals(function (error, result) {
          if (error) {
            reject(error);
          } else {
            if (result != null) {
              fulfill(result);
            } else {
              fulfill([]);
            }
          }
        });
      });
    }
  }, {
    key: 'removePeripheral',
    value: function removePeripheral(peripheralId) {
      return new Promise(function (fulfill, reject) {
        bleManager.removePeripheral(peripheralId, function (error) {
          if (error) {
            reject(error);
          } else {
            fulfill();
          }
        });
      });
    }
  }, {
    key: 'isPeripheralConnected',
    value: function isPeripheralConnected(peripheralId, serviceUUIDs) {
      return this.getConnectedPeripherals(serviceUUIDs).then(function (result) {
        if (result.find(function (p) {
          return p.id === peripheralId;
        })) {
          return true;
        } else {
          return false;
        }
      });
    }
  }]);
  return BleManager;
}();

module.exports = new BleManager();