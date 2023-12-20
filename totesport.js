const puppeteer = require('puppeteer');
const axios = require('axios');
const generatepassword = require('./generateusernamepassword');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



async function totesport(data) {
    const password = await generatepassword();
    const username = data["Email"].split("@")[0];
    const client = data["FirstName"] + " " + data["LastName"];
    console.log("welcome planet");
    const browserURL = 'http://127.0.0.1:9222';
    const browser = await puppeteer.connect({ browserURL });
    try {


        const page = (await browser.pages())[0];

        await page.goto("https://tote.co.uk/register");
        await sleep(10000);

        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const buttonExists = await page.$('button[data-testid="accept-cookies-button"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(buttonExists);

        if (buttonExists) {
            console.log('The button with the specified attribute exists.');
            await page.click('button[data-testid="accept-cookies-button"]');
        } else {
            console.log('The button with the specified attribute does not exist.');
            // isSucessful = "yes";
        }

        // Sign Up
        await page.waitForSelector('input[data-testid="single-page-step-email-address"]');
        await page.type('input[data-testid="single-page-step-email-address"]', data['Email']);
        await page.type('input[data-testid="single-page-username"]', username);
        await page.type('input[data-testid="single-page-password"]', password);

        await sleep(3000);
        console.log("clicking button...")
        await page.click('button[data-testid="multi-page-continue"]');
        try {
            await sleep(1000);
            await page.click('button[data-testid="multi-page-continue"]');
        } catch (error) {
            console.log("already continued");
        }
        await sleep(3000);



        // Type Details
        await page.type('input[data-testid="single-page-step-first-name-input"]', data['FirstName']);
        await page.type('input[data-testid="single-page-step-last-name-input"]', data['LastName']);

        await page.click('button[class="sc-jOFrXy PrUPk"]');

        await sleep(1000);

        try {
            await page.type('input[data-testid="manual-address-line1"]', data['Address']);
        } catch (error) {
            console.log("still not continued");
            await page.click('button[class="sc-jOFrXy PrUPk"]');
            await sleep(1000);
            await page.type('input[data-testid="manual-address-line1"]', data['Address']);
        }

        await page.type('input[data-testid="manual-address-town-city"]', data['City']);
        await page.type('input[data-testid="manual-address-county"]', 'United Kingdom');
        await page.type('input[data-testid="manual-address-postcode"]', data['Postcode']);
        // const date = data[3].split('/');

        await page.type('input[data-testid="-day"]', data['DOB'][1]);
        await page.type('input[data-testid="-month"]', data['DOB'][0]);
        await page.type('input[data-testid="-year"]', data['DOB'][2]);

        await page.type('input[data-testid="phone-number-input"]', data['Phone']);

        await sleep(3000);
        await page.click('button[data-testid="multi-page-continue"]');
        console.log("HEY");
        try {
            await sleep(1000);
            await page.click('button[data-testid="multi-page-continue"]');
        } catch (error) {
            console.log("already continued");
        }
        await sleep(3000);

        try {
            await page.click('input[value="EmailText"]');
        } catch (error) {
            console.log("still not continued");
            await page.click('button[data-testid="multi-page-continue"]');
            await sleep(1000);
            await page.click('input[value="EmailText"]');
        }

        await page.click('button[value="on"]');

        await sleep(3000);
        page.click('button[data-testid="join-button"');
        

        await sleep(20000);

        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const divExists = await page.$('li[data-testid="sticky-footer-menu-item-betslip"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(divExists);

        let isSucessful = "no"
        if (divExists) {
            console.log('The h3 tag with the specified attribute exists.');
            isSucessful = "yes";
        } else {
            console.log('The h3 tag with the specified attribute does not exist.');
            isSucessful = "no";
        }

        browser.close()
        return ["Totesport", client, data['Email'], username, password, isSucessful];
    } catch (error) {
        console.error(`Error: ${error.message}`);
        browser.close()
        return ["Totesport", client, data['Email'], username, password, "no"];
    }
}

module.exports = totesport;


// signupbrowser();