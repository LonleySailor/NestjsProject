import { faker } from '@faker-js/faker';
import axios from 'axios';
const pMap = require('p-map');


const start = async () => {
    console.time("recriut")
    const recriuts = [];
    for (let i = 0; i < 100; i++) {

        recriuts.push({
            "name": faker.person.fullName(),
            "email": faker.internet.email(),
            "age": faker.number.int({ min: 18, max: 100 })

        })
    }


    await pMap(recriuts, async (recriut) => {
        try {
            await axios.post('http://localhost:4000/addRecruitstoqueue', recriut);
        } catch (error) {
            console.log(error)
        }
    }, { concurrency: 10 })
    console.timeEnd("recriut")
}
start();