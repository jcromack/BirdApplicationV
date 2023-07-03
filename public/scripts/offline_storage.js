var db;


/**
 *  connects to indexedDB database when offline
 */
function openDatabase() {
    var request = indexedDB.open('formDatabase', 1);

    request.onerror = function(event) {
        console.error('Error opening database');
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        var objectStore = db.createObjectStore('forms', { keyPath: 'id', autoIncrement: true });
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Database opened successfully');
    };
}

/**
 *
 * @param formData
 * store data of form in indexeddb for offline functionality
 */
function storeFormData(formData) {
    var transaction = db.transaction('forms', 'readwrite');
    var objectStore = transaction.objectStore('forms');
    var formObject = {
        identification: formData.get('identification'),
        description: formData.get('description'),
        image: formData.get('myImg'),
        latitude: formData.get('latitude'),
        longitude: formData.get('longitude')
    };

    var request = objectStore.add(formObject);

    request.onsuccess = function(event) {
        console.log('Form data stored in IndexedDB');
    };

    request.onerror = function(event) {
        console.error('Error storing form data in IndexedDB');
    };
}


/**
 * sync form data with the back-end server
 *
 */
function syncFormData() {
    var transaction = db.transaction('forms', 'readwrite');
    var objectStore = transaction.objectStore('forms');
    var request = objectStore.openCursor();

    request.onsuccess = function(event) {
        var cursor = event.target.result;

        if (cursor) {
            var formObject = cursor.value;
            var formData = new FormData();

            formData.append('identification', formObject.identification);
            formData.append('description', formObject.description);
            formData.append('myImg', formObject.image);
            formData.append('latitude', formObject.latitude);
            formData.append('longitude', formObject.longitude);

            sendAjaxQuery('/add', formData);

            cursor.delete();
            cursor.continue();
        } else {
            console.log('Sync completed');
        }
    };

    request.onerror = function(event) {
        console.error('Error syncing form data with the server');
    };
}


/**
 * send ajax query with offline storage information
 */
function sendAjaxQuery(url, data) {
    $.ajax({
        url: url,
        data: data,
        dataType: 'json',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function(dataR) {
            var ret = dataR;
            document.getElementById('results').innerHTML = JSON.stringify(ret);
        },
        error: function(xhr, status, error) {
            alert('Error: ' + error.message);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    openDatabase();

    var isOnline = navigator.onLine;

    if (!isOnline) {
        var myForm = document.getElementById('xForm');
        myForm.addEventListener('submit', function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            var formData = new FormData(myForm);
            storeFormData(formData);
            return false;
        });
    } else {
        syncFormData();
    }
});
