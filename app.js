import jobs from './jobs.json' assert {type: 'json'}
import sr from './server_resource.json' assert {type: 'json'}

// console.log(jobs[1].length);

const weigth = () => {
    var weight = {};
    for (var i in sr) {
        let used_resources = sr[i].total_resource - sr[i].current_available_resource;
        weight[i] = used_resources>1 ? sr[i].unit_power_cost * (used_resources):sr[i].unit_power_cost;
    }
    return weight;
}
console.log(weigth());
