class PBox {
	constructor(firstname, lastname, shelf, level, row, col) { 
		this.firstname = firstname;
		this.lastname = lastname;
		this.shelf = shelf;
		this.level = level; 
		this.row = row; 
		this.col = col;
	}
}

document.addEventListener("DOMContentLoaded", async () => {
    const filename = "assets/data/pbox.txt";
    let pbox; // Declare the variable

    try {
        const response = await fetch(filename);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pbox = await response.text();

    } catch (error) {
        console.error("Error reading file:", error);
    }
    pbox = pbox.split("\n");

    const [firstnames, lastnames, data] = filtered_data(pbox);

  	const fnSearchBar = document.getElementById("firstname-search");
    const fnDatalist = document.getElementById("firstname-list");

    const lnSearchBar = document.getElementById("lastname-search");
    const lnDatalist = document.getElementById("lastname-list");

    fnSearchBar.addEventListener("input", () => {
        updateDatalist(fnSearchBar.value.toLowerCase(), firstnames, fnDatalist);
    });

    // Add input event listener for lastnames
    lnSearchBar.addEventListener("input", () => {
        updateDatalist(lnSearchBar.value.toLowerCase(), lastnames, lnDatalist);
    });

    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", () => {
    	const result = search(fnSearchBar.value, lnSearchBar.value, data); 
    	if (result) {
    		display_result(result);
    	}
    })
});

const filtered_data = (pbox) => {
	const firstnames = [];
	const lastnames = [];
	const data = [];

	pbox.forEach( 
		(line) => {
			const [firstname, lastname, shelf, level, row, column] = line.split(";");
			if (firstname && lastname) {
				firstnames.push(firstname.trim().toLowerCase());
				lastnames.push(lastname.trim().toLowerCase());
				data.push(new PBox(
					firstname.trim().toLowerCase(), 
					lastname.trim().toLowerCase(),
					shelf, level, row, column
				)
				)
			}
		}
	)
	return [firstnames, lastnames, data];
}

const updateDatalist = (query, list, datalistElement) => {
    // Clear existing options
    datalistElement.innerHTML = "";

    // Filter the list based on user input and remove duplicates
    const filtered = [...new Set(list.filter((item) => 
        item.startsWith(query.toLowerCase())
    ))];

    // Add new options
    filtered.forEach((item) => {
        const option = document.createElement("option");
        option.value = item;
        datalistElement.appendChild(option);
    });
};

const search = (fn, ln, list) => {
	let values;
	list.forEach(
		(data) => {
			if (data.firstname === fn && data.lastname === ln) {
				values = data;
				return;
			}
		}
	)
	return values;
}

const display_result = (data) => {
	const name_holder = document.getElementById("data-name");
	const shelf_holder = document.getElementById("data-shelf");
	const level_holder = document.getElementById("data-level");
	const row_holder = document.getElementById("data-row");
	const col_holder = document.getElementById("data-column");

	name_holder.textContent = data.firstname + " " + data.lastname;
	shelf_holder.textContent = data.shelf;
	level_holder.textContent = data.level;
	row_holder.textContent = data.row; 
	col_holder.textContent = data.col;
}
