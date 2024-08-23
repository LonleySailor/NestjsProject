import { faker } from '@faker-js/faker';
import axios from 'axios';
import { Types } from 'mongoose';
import { writeFileSync } from 'fs';
const pMap = require('p-map');

const start = async () => {
    console.time("recruits");

    const recruits = [];
    const ids = [];  // Array to store the generated IDs

    for (let i = 0; i < 1000000; i++) {
        const _id = new Types.ObjectId();  // Generate a new ObjectId

        recruits.push({
            _id,  // Use the generated ObjectId
            "name": faker.person.fullName(),
            "email": faker.internet.email(),
            "age": faker.number.int({ min: 18, max: 100 })
        });

        ids.push(_id);  // Store the ID in the array
    }

    // Save the generated IDs to a JSON file
    writeFileSync('recruit_ids.json', JSON.stringify(ids, null, 2));

    await pMap(recruits, async (recruit) => {
        try {
            await axios.post('http://localhost:4000/addRecruitstoqueue', recruit);
        } catch (error) {
            console.log(error);
        }
    }, { concurrency: 100 });

    console.timeEnd("recruits");
};

start();
