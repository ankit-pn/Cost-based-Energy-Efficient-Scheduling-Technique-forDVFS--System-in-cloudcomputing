import sr from './server_resource.json' assert {type: 'json'}

const onServer = (reqResources) => {
    sr.sort((a,b)=>b['current_available_resource']-a['current_available_resource']);
    for(server in sr){
        if(server['status']==='off' && server['current_available_resource']>reqResources){
            server['status']='on';
            return true;
        }
        else if(server['status']==='off'){
            return false;
        }
    }
    return true;
}

const createServer = (serverName,defaultStatus,unitPowerCost,totalResource) =>{
        if(sr[serverName]===undefined){
            sr[serverName]={
                'status':defaultStatus,
                'unit_power_cost':unitPowerCost,
                'total_resource':totalResource,
                'current_available_resource':totalResource
            }
            console.log(sr[serverName]);
            return 1;
        }
        else{
            return 0;
        }
}
console.log(createServer('4','off',100,100));
console.log(onServer(50));
