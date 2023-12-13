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


        await page.waitForSelector('input[id="RegistrationPage.AccountSection.email"]');
        await page.type('input[id="RegistrationPage.AccountSection.email"]', data["Email"]);
        await page.type('input[id="RegistrationPage.AccountSection.username"]', username);
        await page.type('input[id="RegistrationPage.AccountSection.password"]', password);
        // console.log(usernamepassword)

        



        try {
            await page.click('div[data-actionable="RegistrationPage.TermsAndConditions.agree_terms"]');
        } catch (error) {
            console.log("already cehceked");
        }

        await sleep(3000);
        await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage1.Continue"]');
        await sleep(3000);



        // Type Details
        if (data['Gender'] === 'Male') {
            await page.click('button[value="Mr"]');
        } else {
            await page.click('button[value="Mrs"]');
        }

        

        await page.type('input[id="RegistrationPage.PersonalSection.first_name"]', data['FirstName']);
        await page.type('input[id="RegistrationPage.PersonalSection.last_name"]', data['LastName']);

        // const date = data[3].split('/');

        await page.type('input[data-actionable="RegistrationPage.DateOfBirthInput.day"]', data['DOB'][1]);
        await page.type('input[data-actionable="RegistrationPage.DateOfBirthInput.month"]', data['DOB'][0]);
        await page.type('input[data-actionable="RegistrationPage.DateOfBirthInput.year"]', data['DOB'][2]);


        await sleep(3000);
        await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage2.Continue"]');
        await sleep(1000);
        try {
            await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage2.Continue"]');
        } catch (error) {
            console.log("already cehceked");
        }
        await sleep(3000);

        await page.type('input[id="RegistrationPage.TelephoneNumberInput.telephone.mobile-telephone"]', data['Phone']);

        await sleep(1000);
        await page.type('select[id="RegistrationPage.Dropdown.mobile-securityQuestion"]', "Your");
        await sleep(1000);
        await page.type('input[id="RegistrationPage.ContactSection.mobile_security_answer"]', data["LastName"]);

        await sleep(3000);
        await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage3.Continue"]');
        await sleep(1000);

        await page.click('button[class="_1ljq2nn"]');
        await sleep(3000);

        await page.type('input[id="RegistrationPage.AddressEditor.line1"]', data["Address"]);
        await page.type('input[id="RegistrationPage.AddressEditor.city"]', data["City"]);

        await page.type('input[id="RegistrationPage.AddressEditor.postcode"]', data["Postcode"]);

        await sleep(3000);
        await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage4.Continue"]');
        await sleep(3000);


        await page.click('div[data-actionable="RegistrationPage.PromotionsSelector.sms"]');
        await page.click('div[data-actionable="RegistrationPage.PromotionsSelector.email"]');
        await sleep(1000);
        await page.click('button[data-actionable="RegistrationPage.NavigationButtonsPage5.Register"]');
        await sleep(10000);


        console.log('$$$$$$$$$$$$$$$$$$$$$$');
        const h3Exists = await page.$('main[class="_15xp08j"]');
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