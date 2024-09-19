import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';

test(' should check if server allows correct change in a recruit and rejects incorrect', async ({ request }) => {
    // Send a GET request
    const testData = {
        "name": faker.person.fullName(),
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 18, max: 60 })

    }
    //Send a post request to add a recruit
    const postResponse = await request.post('http://localhost:4000/addRecruits', {
        data: testData, headers: { 'Content-Type': 'application/json' }
    });
    expect(postResponse.status()).toBe(201);
    const responseData = await postResponse.json();
const updateData={
    "name": faker.person.fullName(),
    "email": faker.internet.email(),
    "age": faker.number.int({ min: 18, max: 60 }),
}

    const postResponse2 = await request.post(`http://localhost:4000/editRecruits/${responseData._id}`, {
        data: updateData, headers: { 'Content-Type': 'application/json' }
    })
    expect(postResponse2.status()).toBe(201);
    const responseData2 = await postResponse2.json();
    expect(responseData2.name).toBe(updateData.name);
    expect(responseData2.email).toBe(updateData.email);
    expect(responseData2.age).toBe(updateData.age);
    const testData2 = {
        "name": faker.person.fullName(),
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 5, max:18  })

    }
    const postResponse3= await request.post(`http://localhost:4000/editRecruits/${responseData._id}`, {
        data: testData2, headers: { 'Content-Type': 'application/json' }
    })
    expect(postResponse3.status()).toBe(400);
    const responseData3 = await postResponse3.json();   
    expect(responseData3.message).toBe(`Validation failed. Path \`age\` (${testData2.age}) is less than minimum allowed value (18).`);
   
  
   
});
