const {
    getAuthToken,
    getSpreadSheet,
    getSpreadSheetValues,
    addValuesSpreadSheet,
    updateValuesSpreadSheet,
    updateRangeValuesSpreadSheet,
} = require("./googleSheetsService.js");
require("dotenv").config();

const planetsports = require('./planetsports.js');
const vickers = require('./vickers.js');
const matchbook = require('./matchbook.js');
const rhino = require('./rhino.js');
const quinnbet = require('./quinnbet.js');
const netbet = require('./netbet.js');
const betfred = require('./betfred.js');
const bresbet = require('./bresbet.js');
const totesport = require('./totesport.js');
const flag = process.argv[2];
console.log("flag: ", flag);

const spreadsheetId = process.env.SPREADSHEETID;

async function get_data(sheetName) {
    try {
        const auth = await getAuthToken();
        const response = await getSpreadSheetValues({
            spreadsheetId,
            sheetName,
            auth,
        });
        // console.log(JSON.stringify(response.data.values, null, 2));
        return response.data.values;
    } catch (error) {
        // console.log(error.message, error.stack);
        return error.message;
    }
};

async function add_data(sheetName, values) {
    const auth = await getAuthToken();
    const response = await addValuesSpreadSheet({
        spreadsheetId,
        sheetName,
        auth,
        values,
    });
}

async function todictdata(data) {
    let dictdata = {
        'Gender': data[0],
        'FirstName': data[1],
        'LastName': data[2],
        'DOB': data[3].split('/'),
        'Address': data[4],
        'City': data[5],
        'Postcode': data[6],
        'Email': data[1].toLowerCase() + data[2].toLowerCase() + Math.floor(Math.random() * 1001).toString() + '@gmail.com',
        'Phone': data[8]
    };

    return dictdata;
}

async function main(sheetNames) {
    let data = await get_data(sheetNames[0]);
    const accounts = data.slice(1).map((el) => {
        return el;
    });

    // data = await get_data(sheetNames[1]);
    // const urls = data.slice(1).map((el) => {
    //     return el;
    // });

    let dictdata = {};

    for (let i = 0; i < accounts.length; i++) {
        let item = accounts[i];
        let dictdata = await todictdata(item);

        let values = [];

        values =  await planetsports(dictdata);
        await add_data(sheetNames[2], values);

        values = await vickers(dictdata);
        await add_data(sheetNames[2], values);

        if (flag ===  '1'){
            values = await matchbook(dictdata);
            await add_data(sheetNames[2], values);
        }

        values = await rhino(dictdata);
        await add_data(sheetNames[2], values);

        values = await quinnbet(dictdata);
        await add_data(sheetNames[2], values);


        values = await betfred(dictdata);
        await add_data(sheetNames[2], values);

        values = await bresbet(dictdata);
        await add_data(sheetNames[2], values);

        values = await totesport(dictdata);
        await add_data(sheetNames[2], values);
    }

    
}

const sheetNames = ['Data', 'Websites to Signup for', 'Login Data'];

main(sheetNames);
