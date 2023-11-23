const puppeteer = require('puppeteer');
const axios = require('axios');
const generateuseranmepassword = require('./generateusernamepassword');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

(async () => {
    console.log("Start...");
    await sleep(5000);
    console.log("...End");
})();

async function generatePassword(length = 8) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    function getRandomChar(arr) {
        return arr.charAt(Math.floor(Math.random() * arr.length));
    }

    const policy = [getRandomChar(lowerCase), getRandomChar(upperCase), getRandomChar(numbers)];
    let password = '';

    for (let i = 0; i < length - 3; i++) {
        const randomPolicy = Math.floor(Math.random() * 3);
        password += getRandomChar(policy[randomPolicy]);
    }

    // Shuffle the order of characters for the final password
    password = password.split('').concat(policy).sort(() => Math.random() - 0.5).join('');

    // Check if the generated password meets the policy requirements
    if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,16}$/.test(password)) {
        return password;
    } else {
        // Recursively generate a new password if the policy is not met
        return generatePassword(length);
    }
}
async function quinnbet(data) {
    const username = data["Email"].split("@")[0];
    const password = await generatePassword(12);
    const client = data["FirstName"] + " " + data["LastName"];
    try {
        // const browser = await puppeteer.launch({
        //     headless: false,
        //     args: ["--start-maximized"],
        //     timeout: 6000000,
        //     protocolTimeout: 6000000,
        //     defaultViewport: null,
        // })

        const browserURL = 'http://127.0.0.1:9222';
        const browser = await puppeteer.connect({ browserURL });



        const page = (await browser.pages())[0];


        await page.goto("https://www.quinnbet.com/register/");

        await sleep(5000);


        // Sign Up
        await page.waitForSelector('label[for="title-0"]');
        if (data['Gender'] === "Male") {
            await page.click('label[for="title-0"]');
        } else {
            await page.click('label[for="title-1"]');
        }


        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const divExists = await page.$('span[class="sc-3f7l5t-3 bPQiZw"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(divExists);
        // await sleep(3000);
        if (divExists) {
            console.log('The div tag with the specified attribute exists.');
            await page.click('span[class="sc-3f7l5t-3 bPQiZw"]');
            await sleep(1000);
        } else {
            console.log('The div tag with the specified attribute does not exist.');

        }


        

        
        // await page.click('button[data-test="account-navigation-signup-link"]');
        await page.type('input[data-test="first-name"]', data['FirstName']);
        await page.type('input[data-test="last-name"]', data['LastName']);
        let date = data['DOB'][2] + '-' + data['DOB'][0] + '-' + data['DOB'][1]
        await page.$eval(
            'input[data-test="date-of-birth"]',
            (input, value) => {
                input.value = value;
                input.dispatchEvent(new Event("change"));
                input.dispatchEvent(new Event("blur"));
            },
            date
        );
        await page.type('input[type="number"]', data['Phone']);

        await sleep(3000);
        await page.click('button[name="Continue"]');
        await sleep(1000);

        await page.type('input[data-test="email-id"]', data['Email']);
        await page.type('input[data-test="user-name"]', username);
        await page.type('input[data-test="pass-word"]', password);
        async function selectDropdown(page, option) {
            await page.evaluate(() => {
                const event = new MouseEvent('mousedown', {
                    view: window,
                    bubbles: true,
                    cancelable: true,
                });
                const trigger = document.querySelector('div[class*="-indicator"]');
                trigger.dispatchEvent(event);
            })
            await sleep(400);
            const option_btn = await page.$x(`//div[contains(text(), '${option}')]`);
            console.log(option_btn);
            await option_btn[0].click();

        }
        await selectDropdown(page, 'GBP');

        await page.click('input[data-test="tc-check-one"]');
        await page.click('input[data-test="tc-check-two"]');

        await sleep(3000);
        await page.click('button[name="Complete"]');
        await sleep(30000);

        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const buttonExists = await page.$('button[name="Make First Deposit"]');
        console.log('%%%%%%%%%%%%%%');
        console.log(buttonExists);
        await sleep(3000);
        if (buttonExists) {
            console.log('The button tag with the specified attribute exists.');
            return ["Quinn 1", client, data['Email'], username, password, "yes"];
        } else {
            console.log('The button tag with the specified attribute does not exist.');
            return ["Quinn 1", client, data['Email'], username, password, "no"];
        }

    } catch (error) {
        return ["Quinn 1", client, data['Email'], username, password, "no"];
    }
}

module.exports = quinnbet;
// quinnbet();