const pogobuf = require('pogobuf'),
    POGOProtos = require('node-pogo-protos');
var username = ''
var password = ''
var fs = require('fs');
setInterval(function(){
    var login = new pogobuf.PTCLogin();
    var client = new pogobuf.Client();
    var gymData = []
    login.login(username, password).catch(console.error)
    .then(token => {
        client.setAuthInfo('ptc', token);
        client.setPosition(34.364492, -92.811087);
        return client.init();
    }).catch(console.error)
    .then(() =>{
        var fs = require('fs');
        var gymListObj = JSON.parse(fs.readFileSync('./malvern_gyms.json', 'utf8'));
        gymListObj
        .forEach((gym,i) => {
            setTimeout(function(){
                client.setPosition(gym.lat, gym.lng)
                if(gym.type=='gym'){
                    client.getGymDetails(gym.id, gym.lat, gym.lng).then(data => {
                        //console.log(data)
                        gymData.push({'gym' : data})
                        if(gymData.length==gymListObj.length){
                            fs.writeFileSync('./malvern_gym_status.json', JSON.stringify(gymData),'utf8')
                            fs.writeFileSync('./update.json', JSON.stringify({'updated:' : Date()}),'utf8')
                            console.log('Files updated at ' + Date())
                        }
                    }).catch(console.error)
                }if(gym.type=='pokestop'){
                    client.fortDetails(gym.id, gym.lat, gym.lng).then(data => {
                        //console.log(data)
                        gymData.push({'pokestop' : data})
                        if(gymData.length==gymListObj.length){
                            fs.writeFileSync('./malvern_gym_status.json', JSON.stringify(gymData),'utf8')
                            fs.writeFileSync('./update.json', JSON.stringify({'updated' : Date()}),'utf8')
                            console.log('Files updated at ' + Date())
                        }
                    })
                }
            }, 1000 * i)
        })
    })
},30000)
