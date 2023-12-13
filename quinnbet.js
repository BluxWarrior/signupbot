const puppeteer = require('puppeteer');
const axios = require('axios');
const generateuseranmepassword = require('./generateusernamepassword');

function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}
async function generateUUID() {
  // Function to generate a single UUID segment with a desired length
  const generateSegment = (length) => {
    const availableChars = '0123456789abcdef';
    let segment = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * availableChars.length);
      segment += availableChars[randomIndex];
    }
    return segment;
  };

  // Construct the UUID using four segments and adding the version and variant bits
  return generateSegment(8) + '-' + 
    generateSegment(4) + '-' + 
    '4' + generateSegment(3) + '-' + 
    (['8','9','a','b'][Math.floor(Math.random() * 4)]) + generateSegment(3) + '-' + 
    generateSegment(12);
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
        let sex = "mr"
        await page.waitForSelector('label[for="title-0"]');
        if (data['Gender'] === "Male") {
            sex = "mr";
        } else {
            sex = "ms";
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
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

        // console.log(data['DOB'][0])
        // console.log(pareInt(data['DOB'][0]));
        let date = data['DOB'][2] + '-' + data['DOB'][0] + '-' + data['DOB'][1];
        
        const cookies = await page.cookies();
        const clientId = cookies.filter(el=>el.name === 'clid')[0].value;
        console.log([sex, data['FirstName'], data['LastName'], data['Email'], data['Phone'], password, username, date, clientId]);
        // const body = `title=${sex}&firstName=${data['FirstName']}&lastName=${data['LastName']}&email=${data['Email']}&password=${password}&mobileNo=${data['Phone']}&userName=${username}&dateOfBirth=${date}&couponCode=&currencyCode=GBP&tsAndCs=true&marketingOk=true&clientId=quinnweb&clientSecret=ebwGxdVeJb&uuid=${clientId}&captchaResponse=`;
        // console.log(body);
        const response = await page.evaluate(async(sex, firstname, lastname, email, phone, password, username, date, clientId )=>{
            console.log(")())()")
            const body = `title=${sex}&firstName=${firstname}&lastName=${lastname}&email=${email}&password=${email}&mobileNo=${phone}&userName=${username}&dateOfBirth=${date}&couponCode=&currencyCode=GBP&tsAndCs=true&marketingOk=true&clientId=quinnweb&clientSecret=ebwGxdVeJb&uuid=${clientId}&captchaResponse=`;
            console.log(body);
            const response = await fetch("https://www.quinnbet.com/fsb-api-rest/register.fsb", {
                "headers": {
                    "accept": "application/json, text/plain, */*",
                    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
                    "content-type": "application/x-www-form-urlencoded",
                    "sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Google Chrome\";v=\"120\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"Windows\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-origin"
                },
                "referrer": "https://www.quinnbet.com/register/",
                "referrerPolicy": "strict-origin-when-cross-origin",
                "body": `title=${sex}&firstName=${firstname}&lastName=${lastname}&email=${email}&password=${password}&mobileNo=${phone}&userName=${username}&dateOfBirth=${date}&couponCode=&currencyCode=GBP&tsAndCs=true&marketingOk=true&clientId=quinnweb&clientSecret=ebwGxdVeJb&uuid=${clientId}&captchaResponse=`,
                "method": "POST",
                "mode": "cors",
                "credentials": "include"
            });
            return response
           // console.log(response);
           // if(response.ok){
           //  const data = await response.json();

           // }

        }, sex, data['FirstName'], data['LastName'], data['Email'], data['Phone'], password, username, date, clientId)

        console.log(response);

        await page.click('span[class="sc-qs83k6-1 sc-fmd1un-0 bCBdMq ecVTiY"]');
        await sleep(1000);

        await page.type('input[data-test="email-field"]', username);
        await page.type('input[data-test="password-field"]', password);
        await page.click('button[class="sc-156c338-0 sc-z9jxkl-0 jmwJPc bHLZNK"]');
        await sleep(5000);

        const currentUrl = await page.url();

        if (currentUrl === "https://www.quinnbet.com/sportsbook/") {
            console.log('successfully registered');
            return ["Quinn 1", client, data['Email'], username, password, "yes"];
        } else {
            console.log('register failed');
            return ["Quinn 1", client, data['Email'], username, password, "no"];
        }

    } catch (error) {
        console.log(error)
        return ["Quinn 1", client, data['Email'], username, password, "no"];
    }
}

module.exports = quinnbet;
// quinnbet();