import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';

test(' should to create a recruit and retreive it', async ({ request }) => {
    // Send a GET request
    const testData = {
        "name": faker.person.fullName(),
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 18, max: 100 })

    }
    //Send a post request to add a recruit
    const postResponse = await request.post('http://localhost:4000/addRecruits', {
        data: testData, headers: { 'Content-Type': 'application/json' }
    });
    expect(postResponse.status()).toBe(201);
    const responseData = await postResponse.json();
    
//Send a Get request to get the recruit by ID
    const getResponse = await request.get(`http://localhost:4000/getRecruitById/${responseData._id}`);
    expect(getResponse.status()).toBe(200);

  
    
   //Check the respose body
   const responseBody = await getResponse.json();
   console.log(responseBody);
   expect(responseBody.name).toBe(testData.name);
   expect(responseBody.email).toBe(testData.email);
   expect(responseBody.age).toBe(testData.age);
});
