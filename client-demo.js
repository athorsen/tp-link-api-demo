const { Client } = require('tplink-smarthome-api');

const client = new Client();

//display device info when they're discovered
client.on('device-new', async device => {
    await device.getSysInfo()
        .then(info => {
            info = {
                ...info,
                on: device.relayState,
                host: device.host
            }
            console.log(info)
        });
});

const hostIp = '<host IP address>';
(async () => {
    let playroomLight = await client.getDevice({ host: hostIp })
                            .then(wallSwitch => wallSwitch)
                            .catch(console.error);

    // handle power change event from switch ('power-on' and 'power-off' can also be handled)
    // playroomLight.on('power-update', value => {
    //     // This is fired all the time when polling (regardless of whether or not the actual light status changed)
    //     console.log('Power update. Wall switch is', value ? 'on' : 'off');
    // });

    // playroomLight.on('in-use', _ => {
    //     console.log('In-use update. Wall switch is on.');
    // });

    // playroomLight.on('power-on', _ => {
    //     console.log('The power was turned on.');
    // });

    // playroomLight.on('power-off', _ => {
    //     console.log('The power was turned off.');
    // });

    await playroomLight.getSysInfo()
        .then(info => {
            info = {
                ...info,
                type: typeof(playroomLight),
                on: playroomLight.relayState,
                host: playroomLight.host
            }
            console.log(info)
        });

    // delay is in seconds, powerState is boolean where true is on and false is off
    // there's a 'deleteExisting' property you can send, which defaults to 'true', and
    // deletes existing timer rules prior to adding this one, since you can only have one timer
    // going on a device at a time
    await playroomLight.timer.addRule({ delay: 10, powerState: false })
        .then(response => {
            console.log('Timer rule added. Response:', response);
        })
        .catch(err => console.error('Timer error', err));

     playroomLight.schedule.getRules()
        .then(response => {
            console.log('Wall switch scheduling rules:', response);
        })
        .catch(err => console.error('Error fetching scheduling rules for switch:', err));

    // away mode is a bit of a security feature and will turn your devices on and off at random times
    // during a set time period on scheduled days
     playroomLight.away.getRules()
        .then(response => {
            console.log('Wall switch away rules:', response);
        })
        .catch(err => {
            console.error('Error fetching away rules for switch');
        });

    playroomLight.startPolling()
        .on('in-use', _ => {
            console.log('In-use update. Wall switch is on.');
        })
        .on('power-on', _ => {
            console.log('The power was turned on.');
        })
        .on('power-off', _ => {
            console.log('The power was turned off.');
        });
})();

// discover new devices
// you can pass in an 'options' object to filter devices or contact certain devices directly (in addition to the broadcast)
client.startDiscovery();