const { Client } = require('tplink-smarthome-api');

const client = new Client();

// display device info when they're discovered
client.on('device-new', device => {
    device.getSysInfo()
        .then(console.log);
    console.log('on?', device.relayState);
});

// can't use 'switch' as variable name, because it conflicts with JavaScript keyword
client.getDevice({ host: '<ip address>' })
    .then(wallSwitch => {
        // display wallSwitch object
        console.log('wallSwitch', wallSwitch);

        // handle power change event from switch ('power-on' and 'power-off' can also be handled)
        wallSwitch.on('power-update', value => {
            console.log('wall switch is', value ? 'on' : 'off');
        });

        // delay is in seconds, powerState is boolean where true is on and false is off
        // there's a 'deleteExisting' property you can send, which defaults to 'true', and
        // deletes existing timer rules prior to adding this one, since you can only have one timer
        // going on a device at a time
        wallSwitch.timer.addRule({ delay: 5, powerState: true })
            .then(response => {
                console.log('Rule added. Response:', response);
            })
            .catch(console.error);

        wallSwitch.schedule.getRules()
            .then(response => {
                console.log('Wall switch scheduling rules:', response);
            })
            .catch(err => {
                console.error('Error fetching scheduling rules for switch.');
            });

        // away mode is a bit of a security feature and will turn your devices on and off at random times
        // during a set time period on scheduled days
        wallSwitch.away.getRules()
            .then(response => {
                console.log('Wall switch away rules:', response);
            })
            .catch(err => {
                console.error('Error fetching away rules for switch');
            });
    })
    .catch(console.error);

// discover new devices
// you can pass in an 'options' object to filter devices or contact certain devices directly (in addition to the broadcast)
client.startDiscovery();