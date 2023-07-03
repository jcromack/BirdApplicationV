/**
 * sends ajax query for creating post
 * @param url
 * @param data
 */


function sendAjaxQuery(url, data) {
    $.ajax({
        url: url ,
        data: data,
        dataType: 'json',
        type: 'POST',
        processData: false,
        contentType: false,
        success: function (dataR) {

            var ret = dataR;

            document.getElementById('results').innerHTML= JSON.stringify(ret);
        },
        error: function (xhr, status, error) {

            alert('Error: ' + error.message);
        }
    });
}

// form submission
function onSubmit() {

    event.preventDefault();
    event.stopImmediatePropagation();
    var myForm = document.getElementById('xForm');
    var formData = new FormData(myForm);
    console.log(formData);
    // call the sendAjaxQuery function to send the form data to  '/add
    sendAjaxQuery('/add', formData);
    return false;
}


