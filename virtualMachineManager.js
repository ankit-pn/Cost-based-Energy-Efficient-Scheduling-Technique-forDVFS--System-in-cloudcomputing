import { mongoose } from 'mongoose';
import { domainToASCII } from 'url';
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/servers-db');
};
main().catch(err => console.log(err));
const vmSchema = new mongoose.Schema({
    vmName: String,
    status: Boolean,
    vmId: String,
    resourcesRequired: Number,
    vmMIPS: Number,
    vmCommunicationCost: Number,
    currentServer: {
        type: mongoose.Schema.type.ObjectId,
        ref: 'servers'
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'tasks'
    }],
    currentAccess: Boolean
});
const virtualMachines = mongoose.model('virtualMachines', vmSchema);


const createVirtualMachine = async (vmName, currentServerId, status, vmId, resourcesRequired, currentServer, tasks, currentAccess) => {
    const vm = new virtualMachines({
        vmName: vmName,
        currentServerId: currentServerId,
        status: status,
        vmId: vmId,
        resourcesRequired: resourcesRequired,
        currentServer: currentServer,
        tasks: tasks,
        currentAccess: currentAccess
    })
    await vm.save();
};

module.exports = virtualMachines;