const { Client } = require('tplink-smarthome-api');

const client = new Client();
const switchIp = '<switch IP address>';
const lightSwitch = client.getPlug({ host: switchIp });

//lightSwitch.timer.addRule({ delay: 10, powerState: false });
lightSwitch.setPowerState(true);