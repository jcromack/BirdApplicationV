var db;

/**
 *  login functionality, called to save username to indexeddb
 */

document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.querySelector('form');
    loginForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission behavior

        const username = loginForm.elements.username.value;
        saveDeviceAndUser(username); // Call the function to save the device ID and create the user
    });
});

/**
 *
 * @param username
 * creates devicedb where it saves the user information
 */
function saveDeviceAndUser(username) {
    return new Promise((resolve, reject) => {
        const request = window.indexedDB.open("devicedb", 1);

        request.onerror = function(event) {
            reject(new Error("Database error: " + event.target.errorCode));
        };

        request.onupgradeneeded = function(event) {
            db = event.target.result;
            const deviceStore = db.createObjectStore("device", { keyPath: "id" });
        };

        request.onsuccess = function(event) {
            db = event.target.result;
            const deviceStore = db.transaction("device", "readwrite").objectStore("device");
            let deviceRequest = deviceStore.get(1);

            deviceRequest.onsuccess = function(event) {
                let device = event.target.result;
                if (device) {
                    resolve(device.deviceID);
                } else {
                    const newDeviceID = generateID();
                    deviceStore.put({ id: 1, deviceID: newDeviceID });
                    resolve(newDeviceID);
                }
            };

            deviceRequest.onerror = function(event) {
                reject(new Error("Error getting device ID: " + event.target.errorCode));
            };
        };
    }).then((deviceID) => {
        createUser(username, deviceID);
    }).catch((error) => {
        console.error(error);
    });
}


function createUser(username, deviceID) {
    fetch('/user', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            deviceID: deviceID
        })
    })
        .then(response => {
            if (response.ok) {
                console.log('User successfully created');
                console.log("res", response)
                console.log(response.url);
                window.location.href = '/home';
            } else {
                response.text().then(errorMsg => {
                    console.log('Error creating user:', errorMsg);
                });
            }
        })
        .catch(error => {
            console.log('Error creating user:', error);
        });
}





function generateID() {
    // Generate a v4 UUID (Random UUID)
    return uuidv4();
}
