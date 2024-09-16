import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';

test(' should to create a recruit and retreive it', async ({ request }) => {
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
   //Check if the model will reject the same recruit so no duplicates occur
    const postResponse2 = await request.post('http://localhost:4000/addRecruits', {
        data: testData, headers: { 'Content-Type': 'application/json' }
    });
    expect(postResponse2.status()).toBe(400);
    const responseData2 = await postResponse2.json();
    expect (responseData2.message).toBe('Recruit already exists. Please check the details.');


    
});
