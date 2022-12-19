import { mongoose } from 'mongoose';
import { domainToASCII } from 'url';
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/servers-db');
};
main().catch(err => console.log(err));


const serverSchema = new mongoose.Schema({
    serverName: String,
    status: Boolean,
    serverId: String,
    unitPowerCost: Number,
    totalResource: Number,
    currentAvailableResources: Number,
    usedResource: Number,
    weight: Number,
    virtualMachines: [{
        type: mongoose.Schema.type.ObjectId,
        ref: 'virtualMachine'
    }],
    tasks: [{
        type: mongoose.Schema.type.ObjectId,
        ref: 'tasks'
    }],
    currentAccess: Boolean
});

const servers = mongoose.model('servers', serverSchema);

const createServer = async (serverName, status, serverId, unitPowerCost, totalResource, virtualMachines, tasks, currentAccess) => {
    const server = new servers({
        serverName: serverName,
        status: status,
        serverId: serverId,
        unitPowerCost: unitPowerCost,
        totalResource: totalResource,
        currentAvailableResources: totalResource,
        usedResource: 0,
        weight: unitPowerCost,
        virtualMachines: virtualMachines,
        tasks: tasks,
        currentAccess: currentAccess
    });
    await server.save();
};
createServer('dsdsd',1,'ankit',100,100,[],[],1);

module.exports = servers;