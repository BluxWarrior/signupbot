const puppeteer = require('puppeteer');
const axios = require('axios');
async function generatePassword(length = 8) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '0123456789';

    function getRandomChar(arr) {
        return arr.charAt(Math.floor(Math.random() * arr.length));
    }

    const policy = [getRandomChar(lowerCase), getRandomChar(upperCase), getRandomChar(numbers), getRandomChar(specialChars)];
    let password = '';

    for (let i = 0; i < length - 4; i++) {
        const randomPolicy = Math.floor(Math.random() * 4);
        password += getRandomChar(policy[randomPolicy]);
    }

    // Shuffle the order of characters for the final password
    password = password.split('').concat(policy);
    return password.sort(() => Math.random() - 0.5).join('');
}

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}



async function betfred(data) {
    const password = await generatePassword(16);
    const username = data["Email"].split("@")[0];
    console.log("password; ", password);
    const client = data["FirstName"] + " " + data["LastName"];
    try {
        console.log("welcome planet");
        const browserURL = 'http://127.0.0.1:9222';
        const browser = await puppeteer.connect({ browserURL });
        const page = (await browser.pages())[0];

        await page.goto("https://www.betfred.com/register/account");
        await sleep(10000);



        await page.waitForSelector('input[id="username"]');
        await page.type('input[id="username"]', username);
        await page.type('input[id="password"]', password);
        // console.log(usernamepassword)

        const aExists = await page.$('a[class="wscrOk"]');
        console.log(aExists);
        // await sleep(3000);
        if (aExists) {
            console.log('The div tag with the specified attribute exists.');
            page.click('a[class="wscrOk"]');
            await sleep(1000);
        } else {
            console.log('The div tag with the specified attribute does not exist.');

        }



        try {
            await page.click('input[class="registration-form__checkbox"]');
        } catch (error) {
            console.log("already cehceked");
        }

        await sleep(3000);
        await page.click('a[data-id="registration_continue"]');
        await sleep(3000);



        // Type Details
        if (data['Gender'] === 'Male') {
            await page.click('button[value="Mr"]');
        } else {
            await page.click('button[value="Mrs"]');
        }

        

        await page.type('input[id="firstname"]', data['FirstName']);
        await page.type('input[id="lastname"]', data['LastName']);

        // const date = data[3].split('/');

        await page.type('input[id="DAY"]', data['DOB'][1]);
        await page.type('input[id="MONTH"]', data['DOB'][0]);
        await page.type('input[id="YEAR"]', data['DOB'][2]);


        await sleep(3000);
        await page.click('a[data-id="registration_continue"]');
        await sleep(3000);

        await page.type('input[id="email"]', data['Email']);
        await page.type('input[id="telephone"]', data['Phone']);


        await page.click('p[id="securityQuestion"]');
        await page.waitForSelector('li[data-value="MMN"]');
        await page.click('li[data-value="MMN"]');
        await page.click('a[data-id="registration_contact_validate-security-question"]');

        await page.type('input[id="securityAnswer"]', data["LastName"]);
        await page.focus('input[id="securityAnswer"]');
        await page.keyboard.press('Tab');
        await sleep(1000);
        await page.type('input[id="securityAnswer2"]', data["LastName"]);

        await page.click('a[data-id="registration_continue"]');
        await page.type('input[data-id="registration_address_postcode-search"]', '1');


        await sleep(1000);
        await page.click('button[class="registration-form__submit-button--postcode"]');
        await sleep(3000);
        await page.click('a[data-id="registration_address_postcode_manual_adress_error_link"]');

        await page.click('p[class="registration-form__input registration-form__input--country"]');
        await page.waitForSelector('li[id="country"]');
        await page.click('li[id="country"]');
        await page.click('a[data-id="registration_address_validate-country"]');

        await page.type('input[id="address1"]', data["Address"]);
        await page.type('input[id="county"]', data["City"]);

        await page.focus('input[id="postcode"]');
        await page.keyboard.press('Backspace');
        console.log("Backsapce");
        await page.type('input[id="postcode"]', data["Postcode"]);
        await page.click('span[class="registration-continue__button-text"]');

        await page.click('div[data-qaid="my-account-marketing-preference-item-betfred-email"]');
        await page.click('div[data-qaid="my-account-marketing-preference-item-thirdparty-email"]');

        await sleep(3000);
        await page.click('span[class="registration-register__button-text"]');
        await sleep(10000);

        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const h3Exists = await page.$('div[class="deposit-modal__confirmation"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(h3Exists);

        let isSucessful = "no"
        if (h3Exists) {
            console.log('The h3 tag with the specified attribute exists.');
            isSucessful = "yes";
        } else {
            console.log('The h3 tag with the specified attribute does not exist.');
            isSucessful = "no";
        }


        return ["Betfred", client, data["Email"], username, password, isSucessful];
    } catch (error) {
        console.error(`Error: ${error.message}`);
        return ["Betfred", client, data["Email"], username, password, "no"];
    }
}

module.exports = betfred;


// signupbrowser();