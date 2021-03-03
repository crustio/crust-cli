const fs = require('fs');

module.exports = {
    default: async (seeds) => {
        // 1. Judge legality of the seeds
        const seedsVec = seeds.split(' ');
        if (seedsVec.length !== 12) {
            console.error('Seeds illegal, check it again');
            return;
        }
        
        // 2. Write into local file
        fs.writeFileSync('./seeds', seeds);
        
        // 3. Read it and compare with input seeds
        const seedsLocal = fs.readFileSync('./seeds', 'utf8');

        if (seedsLocal === seeds) {
            console.log('Login success!');
        } else {
            console.error('Save seeds error, do it again.');
        }
    }
}