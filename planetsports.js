const puppeteer = require('puppeteer');
const axios = require('axios');
const generatepassword = require('./generateusernamepassword');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



async function planetsports(data) {
    const password = await generatepassword();
    const username = data["Email"].split("@")[0];
    const client = data["FirstName"] + " " + data["LastName"];
    try {
        console.log("welcome planet");
        const browserURL = 'http://127.0.0.1:9222';
        const browser = await puppeteer.connect({ browserURL });
        const page = (await browser.pages())[0];

        await page.goto("https://www.planetsportbet.com/?account=signup");
        await sleep(10000);

        // Sign Up
        // await page.waitForSelector('button[data-test="account-navigation-signup-link"]');
        // await page.click('button[data-test="account-navigation-signup-link"]');
        await page.type('input[type="text"]', data['Email']);
        // console.log(usernamepassword)
        await page.type('input[type="password"]', password);

        await sleep(3000);
        await page.click('button[data-test="create-account-button"]');
        await sleep(3000);



        // Type Details
        if (data['Gender'] === 'Male') {
            await page.click('span[data-test="mr-title-choose-box"]');
        } else {
            await page.click('span[data-test="ms-title-choose-box"]');
        }


        await page.type('input[name="first-name"]', data['FirstName']);
        await page.type('input[name="last-name"]', data['LastName']);

        // const date = data[3].split('/');

        await page.type('input[name="day"]', data['DOB'][1]);
        await page.type('input[name="month"]', data['DOB'][0]);
        await page.type('input[name="year"]', data['DOB'][2]);

        await page.type('input[data-test="number-input"]', data['Phone']);
        await page.type('input[data-test="postcode-input"]', data['Postcode']);

        await sleep(3000);
        await page.click('span[data-test="enter-manually-button"]');
        await sleep(3000);

        await page.type('input[data-test="address-line-1-input"]', data['Address']);
        await page.type('input[data-test="town-city-input"]', data['City']);

        await page.click('div[data-test="email-settings"] div[data-test="yes"]');
        await page.click('div[data-test="sms-settings"] div[data-test="yes"]');
        await page.click('div[data-test="phone-settings"] div[data-test="yes"]');

        await sleep(3000);
        await page.click('button[data-test="agree-and-join-button"]');
        await sleep(10000);

        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const h3Exists = await page.$('h3[data-test="centered-verify-headline"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(h3Exists);

        let isSucessful = "no"
        if (h3Exists) {
            console.log('The h3 tag with the specified attribute exists.');
            isSucessful = "no";
        } else {
            console.log('The h3 tag with the specified attribute does not exist.');
            isSucessful = "yes";
        }


        return ["PlanetSportsBet", client, data["Email"], username, password, isSucessful];
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return ["PlanetSportsBet", client, data["Email"], username, password, "no"];
    }
}

module.exports = planetsports;


// signupbrowser();