import { mongoose } from 'mongoose';
import { domainToASCII } from 'url';
const main = async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/servers-db');
};
main().catch(err => console.log(err));

const taskSchema = new mongoose.Schema({
    taskName: String,
    taskId: String,
    taskLength: Number,
    taskCommunicationCost: Number,
    currentVirtualMachine: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'virtualMachines'
    },
    currentServer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'servers'
    }
})


const tasks = mongoose.model('tasks',taskSchema);
module.exports = tasks;
