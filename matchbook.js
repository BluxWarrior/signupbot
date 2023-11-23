const puppeteer = require('puppeteer');
const axios = require('axios');
const generatepassword = require('./generateusernamepassword');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    console.log("Start...");
    await sleep(5000);
    console.log("...End");
})();


async function matchbook(data) {
    const password = await generatepassword();
    const unlimitedusername = data["Email"].split("@")[0];
    const username = unlimitedusername.length > 12 ? unlimitedusername.slice(0, 12) : unlimitedusername;
    const client = data["FirstName"] + " " + data["LastName"];
    // const browser = await puppeteer.launch({
    //     headless: false,
    //     args: ["--start-maximized"],
    //     timeout: 6000000,
    //     protocolTimeout: 6000000,
    //     defaultViewport: null,
    // });
    try {
        const browserURL = 'http://127.0.0.1:9222';
        const browser = await puppeteer.connect({ browserURL });
        const page = (await browser.pages())[0];

        await page.goto("https://www.matchbook.com/promo/oddschecker-welcome-offer?utm_content=3344&utm_medium=Affiliate&utm_source=384&bonus-code=OC30");

        await sleep(10000);

        await page.click('a[class="mb-button mb-button--undefined mb-button--wide mb-button--primary "]');

        await page.type('input[data-field-name="first"]', data["FirstName"]);
        await page.type('input[data-field-name="last"]', data["LastName"]);

        await page.type('input[name="day"]', data["DOB"][1]);
        await page.type('input[name="month"]', data["DOB"][0]);
        await page.type('input[name="year"]', data["DOB"][2]);

        await sleep(5000);

        await page.type('input[data-field-name="username"]', username);
        await page.type('input[data-field-name="email"]', data["Email"]);
        await page.type('input[data-field-name="password"]', password);

        await sleep(3000);
        await page.click('a[data-hook="register-next-step"]');
        sleep(3000);

        await page.type('input[data-hook="register-address-line-1"]', data["Address"]);
        await page.type('input[data-hook="register-city"]', data["City"]);
        await page.type('input[data-hook="register-post-code"]', data["Postcode"]);
        await page.type('input[data-hook="register-phone-number"]', data["Phone"]);

        sleep(3000);
        await page.click('a[data-hook="register-next-step"]');
        sleep(3000);


        await page.type('input[data-hook="register-security-question"]', 'Your');
        await sleep(3000);
        const option_btn = await page.$x("//div[contains(text(), 'Your mothers')]");
        console.log(option_btn);
        await option_btn[0].click();

        sleep(3000);
        await page.waitForSelector('div[data-hook="register-security-question-option-3"]');
        await page.click('div[data-hook="register-security-question-option-3"]');
        await page.type('input[data-hook="register-answer"]', data['LastName']);
        await page.click('input[data-hook="register-deposit-terms"]');

        sleep(3000);
        await page.click('a[data-hook="register-next-step"]');
        sleep(3000);

        // browser.close();
        return ["Matchbook 1", client, data["Email"], username, password, "yes"];
    } catch (error) {
        console.error(`Error: ${error.message}`);
        // browser.close();
        return ["Matchbook 1", client, data["Email"], username, password, "no"];
    }
}

// async function matchbook(data) {
//     let gender = data['Gender'] === 'Male' ? 'Mr' : 'Ms';
//     console.log(gender);
//     let birth = data['DOB'][2] + '-' + data['DOB'][0] + '-' + data['DOB'][1];
//     body = 
//     {
//         "name": {
//             "title-id": gender,
//             "first": "Blux",
//             "last": "Warrior"
//         },
//         "date-of-birth": "1995-03-11T12:00:00.000Z",
//         "email": "wa.rriorb.lu.x@gmail.com",
//         "phone-number": "+44 7070551450",
//         "address": {
//             "country": {
//                 "country-id": 204
//             },
//             "post-code": "AB2 4US",
//             "address-line-1": "57 Broomfield Place",
//             "address-line-2": "n/a",
//             "region-name": "Stoneywood"
//         },
//         "username": "bleywxrrior",
//         "password": "P@ssw0rd",
//         "password-confirmation": "P@ssw0rd",
//         "currency-id": 3,
//         "user-security-question": {
//             "question": {
//                 "security-question-id": 3
//             },
//             "answer": "Warrior"
//         },
//         "forum-handle": "",
//         "bonus-code": "OC30",
//         "confirm-age": true,
//         "confirm-terms": true,
//         "marketing-consent": false,
//         "deposit-terms": "HIGH",
//         "registration-vertical": "EXCHANGE"
//     };

//     const apiEndpoint = 'https://www.matchbook.com/bpapi/rest/account';

//     const response = await axios.post(apiEndpoint, body);

//     // try {
//     //     const response = await axios.post(apiEndpoint, body);
//     // } catch (error) {
//     //     console.log("api error");
//     // };

//     if ("session-token" in response.data) {
//         console.log("True");
//     } else {
//         console.log("Failed");
//     };
    
//     // console.log(response.data);

// }

// signupbrowser();

module.exports = matchbook;