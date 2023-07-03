var button = document.querySelector('.toggle-button');
button.addEventListener('click', function() {
    var container = this.parentNode;
    if (container.classList.contains('expanded')) {
        container.classList.remove('expanded');
    } else {
        container.classList.add('expanded');
    }
});


async function searchBirdsTable() {
    const birdType = document.getElementById("searchInput").value;

    const url = 'http://dbpedia.org/sparql';

    const query = `PREFIX dbo: <http://dbpedia.org/ontology/>
  PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>

  SELECT ?birdLabel ?birdDescription
  WHERE {
    ?bird a dbo:Bird ;
      rdfs:label ?birdLabel ;
      rdfs:comment ?birdDescription .
    FILTER(LANG(?birdLabel) = 'en' && LANG(?birdDescription) = 'en')
    FILTER(CONTAINS(LCASE(?birdLabel), "${birdType}"))
  }`;

    const encodedQuery = encodeURIComponent(query);
    const fullUrl = `${url}?query=${encodedQuery}&format=json`;

    try {
        const response = await fetch(fullUrl);
        const data = await response.json();

        // Get the table body element
        const tableBody = document.getElementById("dataTable").getElementsByTagName("tbody")[0];

        // Clear previous search results
        tableBody.innerHTML = "";

        // Iterate over search results
        data.results.bindings.forEach((result) => {
            const birdLabel = result.birdLabel.value;
            const birdDescription = result.birdDescription.value;

            // Create a new row and cells
            const newRow = tableBody.insertRow();
            const labelCell = newRow.insertCell();
            const descriptionCell = newRow.insertCell();

            // set cell values
            labelCell.textContent = birdLabel;
            descriptionCell.textContent = birdDescription;

            // make label cell clickable and call handleBirdLabelClick function when its clicked
            labelCell.style.cursor = 'pointer';
            labelCell.style.color = 'blue';
            labelCell.onclick = function () {
                var container = document.querySelector('.expandable-container');
                container.classList.remove('expanded');
                console.log(birdLabel);

            };

            // set description cell value
            descriptionCell.textContent = birdDescription;

        });
        var container = document.querySelector('.expandable-container');
        container.classList.add('expanded');
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}