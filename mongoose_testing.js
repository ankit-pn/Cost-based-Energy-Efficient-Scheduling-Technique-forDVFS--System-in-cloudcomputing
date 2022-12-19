import { mongoose } from 'mongoose';
import { domainToASCII } from 'url';
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/servers-db');
};
main().catch(err => console.log(err));


const createTasks = async(taskName,taskId,)

const updateWeightOfServers = async () => {
    const cursor = servers.find().cursor();
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        doc.weight = doc.usedResource > 0 ? doc.unitPowerCost * doc.usedResource : doc.unitPowerCost;
        await doc.save();
    }
};

const assignVirtualMachine = async (virtualMachine) => {
    const server = await servers.find().sort({ status: -1, weight: 1 });
    console.log(virtualMachine);
    const resourcesRequired = virtualMachine.resourcesRequired;
    const vmId = virtualMachine['vmId'];
    console.log(resourcesRequired);
    console.log(vmId);
    for (let sv in server) {
        console.log(server[sv].currentAvailableResources);
        if (server[sv].currentAvailableResources >= resourcesRequired && server[sv].status === true) {
            virtualMachine.currentServerId = server[sv].serverId;
            server[sv].virtualMachinesIds.push(vmId);
            server[sv].currentAvailableResources -= resourcesRequired;
            server[sv].usedResource = server[sv].totalResource - server[sv].currentAvailableResources;
            let tasks = virtualMachine.tasksIds;
            for (let i in tasks) {
                server[sv].tasksIds.push(tasks[i]);
            }
            server[sv].save();
            virtualMachine.save();
            console.log(`Virtual Machine is Assigned to  ${server[sv].serverName}`);
            updateWeightOfServers();
            return {
                result: true,
                serverId: server[sv].serverId,
                serverName: server[sv].serverName
            };
        }
    }
    updateWeightOfServers();
    console.log(`No server which is assigned. Try Powerring On Offed Server`);
    return {
        result: false
    };
};
const assignVMByPoweringOnServer = async (virtualMachine) => {
    const server = await servers.find().sort({ status: 1, weight: 1 });
    console.log(virtualMachine);
    const resourcesRequired = virtualMachine.resourcesRequired;
    const vmId = virtualMachine['vmId'];
    console.log(resourcesRequired);
    console.log(vmId);
    for (let sv in server) {
        console.log(server[sv].currentAvailableResources);
        if (server[sv].currentAvailableResources >= resourcesRequired && server[sv].status === false) {
            virtualMachine.currentServerId = server[sv].serverId;
            server[sv].status = true;
            server[sv].virtualMachinesIds.push(vmId);
            server[sv].currentAvailableResources -= resourcesRequired;
            server[sv].usedResource = server[sv].totalResource - server[sv].currentAvailableResources;
            let tasks = virtualMachine.tasksIds;
            for (let i in tasks) {
                server[sv].tasksIds.push(tasks[i]);
            }
            server[sv].save();
            virtualMachine.save();
            console.log(`Virtual Machine is Assigned to  ${server[sv].serverName}`);
            updateWeightOfServers();
            updateWeightOfServers();
            return {
                result: true,
                serverId: server[sv].serverId,
                serverName: server[sv].serverName
            };
        }
    }
    console.log(`No server which is assigned. Try Migrating VMs from on server to other.`);
    updateWeightOfServers();
    return {
        result: false
    };
}


const migrateVms = async (server) => {
    const vmIds = server.virtualMachinesIds;
    for (let i in vmIds) {
        let vmId = vmIds[i];
        let virtualMachine = virtualMachines.find({ vmId: vmId })[0];
        let avmoff = assignVirtualMachine(virtualMachine);
        if (avmoff.result === true) {
            const tempVmIds = [];
            for (let i in vmIds) {
                if (vmIds[i] !== vmId) {
                    tempVmIds.push(vmId);
                }
            }

            server.virtualMachinesIds = tempVmIds;
            server.currentAvailableResources += virtualMachine.resourcesRequired;
            server.usedResource -= virtualMachine.resourcesRequired;
            updateWeightOfServers();
            server.save();
        }
        else {
            let avmon = assignVMByPoweringOnServer(virtualMachine);
            if (avmon.result === true) {
                const tempVmIds = [];
                for (let i in vmIds) {
                    if (vmIds[i] !== vmId) {
                        tempVmIds.push(vmId);
                    }
                }
                server.virtualMachinesIds = tempVmIds;
                server.currentAvailableResources += virtualMachine.resourcesRequired;
                server.usedResource -= virtualMachine.resourcesRequired;
                updateWeightOfServers();
                server.save();
            }
        }

    }
}

const relocateResources = (virtualMachine) => {
    const server = servers.find();
    for (let i in server) {
        if (server.totalResource > virtualMachine.resourcesRequired) {
            migrateVms(server);
            if (assignVirtualMachine(server, virtualMachine).result === false) {
                assignVMByPoweringOnServer(server, virtualMachine);
            }
        }
    }
}

// await deleteServer('server1');
// await createServer('server1',1,'0xewwe',50,50,50,['dfdf','fdfd','wqwqw'],['sdsds','sasasa','zzz'],1);
// for(var i=0;i<10;i++){
//  await createServer(`server${i}`, i%2, `0x${i}`, i, i*2, [`d1${i}`], [`d2${i}`], 1);
// }
//  await updateWeightOfServers();

// for(var i=0;i<50;i++)
//   await deleteServer(`server${i}`);
// console.log(await createVirtualMachine('vm4','',1,'dsds',6,[],1));
// const kittens = await servers.find();
const vm2 = await virtualMachines.find({ vmName: 'vm2' });
// await assignVirtualMachine(vm2[0]);
// console.log(vm4);

