async function generatePassword(length = 12) {
    const lowerCase = 'abcdefghijklmnopqrstuvwxyz';
    const upperCase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const specialChars = '!@#$%^&*()_+=-[]{}|;:/?.<>,';

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

async function generateUsername(length = 8) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let username = "";

    for (let i = 0; i < length; i++) {
        username += characters.charAt(Math.floor(Math.random() * characters.length));
    }

    return username;
}

async function generateUsernamePassword(ul = 8, pl = 12) {
    // Usage
    const username = await generateUsername(ul);
    const password = await generatePassword(pl);
    console.log(password);
    return [username, password];
}
// generateUsernamePassword()
module.exports = generatePassword