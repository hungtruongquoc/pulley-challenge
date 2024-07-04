const axios = require('axios');
const atob = require('atob');

// Replace with your email to start the process
const email = 'hungtruongquoc@gmail.com';

// Fetch challenge data from a given URL
async function fetchChallengeData(url) {
    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error(`Error fetching data from ${url}:`, error);
        return null;
    }
}

// Decode the path based on the encryption method
function decodePath(encryptedPath, encryptionMethod) {
    if (encryptionMethod === "nothing") {
        return encryptedPath;
    } else if (encryptionMethod === "encoded as base64") {
        return "task_" + atob(encryptedPath.replace("task_", ""));
    } else {
        console.error(`Unknown encryption method: ${encryptionMethod}`);
        return null;
    }
}

// Process the challenges recursively
async function processChallenges(email) {
    const initialUrl = `https://ciphersprint.pulley.com/${email}`;
    const initialData = await fetchChallengeData(initialUrl);

    if (!initialData) return;

    let { level, encrypted_path: encryptedPath, encryption_method: encryptionMethod } = initialData;

    while (encryptedPath) {
        const decodedPath = decodePath(encryptedPath, encryptionMethod);

        if (!decodedPath) {
            console.error(`Failed to decode path for level ${level} with method ${encryptionMethod}`);
            break;
        }

        console.log(`Level ${level}: Decoded Path - ${decodedPath}`);

        const nextUrl = `https://ciphersprint.pulley.com/${decodedPath}`;
        const nextData = await fetchChallengeData(nextUrl);

        if (!nextData) break;

        ({ level, encrypted_path: encryptedPath, encryption_method: encryptionMethod } = nextData);
    }

    console.log("No more challenges found or an error occurred.");
}

processChallenges(email);
