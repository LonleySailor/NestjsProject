import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';

test(' should check if the server will reject recruits with missing or incorrect information', async ({ request }) => {
    // Send a GET request
    const testData = {
        "name": faker.person.fullName(),
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 6, max: 17 })

    }
    //Send a post request to add a recruit
    const postResponse = await request.post('http://localhost:4000/addRecruits', {
        data: testData, headers: { 'Content-Type': 'application/json' }
    });
    //check if server declines to0 young recruits
    expect(postResponse.status()).toBe(400);
    const responseData = await postResponse.json();
    expect(responseData.message).toBe(`Validation failed. Path \`age\` (${testData.age}) is less than minimum allowed value (18).`);
    //create a dataset where recruit is too old and test server response
   
   const testData2 = {
    "name": faker.person.fullName(),
    "email": faker.internet.email(),
    "age": faker.number.int({ min: 70, max: 100 })
    }
    const postResponse2 = await request.post('http://localhost:4000/addRecruits', {
        data: testData2, headers: { 'Content-Type': 'application/json' }
    })

    expect(postResponse2.status()).toBe(400);
    const responseData2 = await postResponse2.json();
    expect(responseData2.message).toBe(`Validation failed. Path \`age\` (${testData2.age}) is more than maximum allowed value (60).`);

    //create a dataset without email and check server response
     const testData3 = {
      "name": faker.person.fullName(),
      "age": faker.number.int({ min: 18, max: 60 })
     }
     const postResponse3 = await request.post('http://localhost:4000/addRecruits', {
        data: testData3, headers: { 'Content-Type': 'application/json' }
     })
     expect(postResponse3.status()).toBe(400);
     const responseData3 = await postResponse3.json();
     expect (responseData3.message).toBe("Validation failed. email is required");

     //create a dataset without name and check server response
     const testData4 = {
        
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 18, max: 60 })
       }
     const postResponse4 = await request.post('http://localhost:4000/addRecruits', {
        data: testData4, headers: { 'Content-Type': 'application/json' }
     })  
expect (postResponse4.status()).toBe(400);
const responseData4 = await postResponse4.json();
expect (responseData4.message).toBe("Validation failed. name is required");
//create a dataset without age and check server response
const testData5 = {
    "name": faker.person.fullName(),
    "email": faker.internet.email()
   }
   const postResponse5 = await request.post('http://localhost:4000/addRecruits', {
      data: testData5, headers: { 'Content-Type': 'application/json' }
   })
   expect (postResponse5.status()).toBe(400);
   const responseData5 = await postResponse5.json();
   expect (responseData5.message).toBe("Validation failed. age is required");
    
});