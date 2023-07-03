/**
 * connect to indexed db for storage of offline post form information and store the data
 *
 */


const openDBRequest = window.indexedDB.open('MyDatabase', 1);

openDBRequest.onupgradeneeded = function(event) {
    const db = event.target.result;

    // Make an object store (similar to a table) to store posts
    const postStore = db.createObjectStore('posts', { keyPath: 'id', autoIncrement: true });

    // Make an index on username field for querying posts by username
    postStore.createIndex('by_username', 'username');
};


openDBRequest.onsuccess = function(event) {
    const db = event.target.result;

    // save the form data to IndexedDB
    function savePost() {
        const form = document.getElementById('xForm');
        const username = form.username.value;
        const description = form.description.value;

        const fileInput = document.getElementById('myImage');
        const file = fileInput.files[0];

        const reader = new FileReader();

        reader.onload = function(event) {
            const imageData = event.target.result;


            const post = {
                username: username,
                description: description,
                image: imageData
            };

            // store post in object store

            const transaction = db.transaction('posts', 'readwrite');
            const postStore = transaction.objectStore('posts');
            const addRequest = postStore.add(post);

            addRequest.onsuccess = function() {
                console.log('Post saved successfully!');
                document.getElementById('messageLabel').textContent = 'Post saved successfully!';
            };

            addRequest.onerror = function() {
                console.error('Error saving post:', addRequest.error);
                document.getElementById('messageLabel').textContent = 'Error saving post';
            };
        };

        reader.readAsDataURL(file);
    }


    const form = document.getElementById('xForm');
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent form submission
        savePost();
    });
};


