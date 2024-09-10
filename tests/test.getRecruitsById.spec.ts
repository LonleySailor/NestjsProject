import { faker } from '@faker-js/faker';
import { test, expect, request } from '@playwright/test';

test(' should to create a recruit and retreive it', async ({ request }) => {
    // Send a GET request
    const testData = {
        "name": faker.person.fullName(),
        "email": faker.internet.email(),
        "age": faker.number.int({ min: 18, max: 100 })

    }
    const response = await request.post('http://localhost:4000/addRecruits', {
        data: testData, headers: { 'Content-Type': 'application/json' }
    });
    expect(response.status()).toBe(201);
    const responseData = await response.json();

    const recruit = await request.get(`http://localhost:4000/getRecruitById/${responseData._id}`);
    expect(response.status()).toBe(200);
    // Check the response body
    const responseBody = await response.json();

    expect(responseBody.name).toBe({ name: testData.name });
    expect(responseBody.email).toBe({ email: testData.email });
    expect(responseBody.age).toBe({ age: testData.age });
});
