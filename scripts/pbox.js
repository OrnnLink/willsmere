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
	let pbox_history = [];
	if (localStorage.getItem("pbox_history")) {
		pbox_history = JSON.parse(localStorage.getItem("pbox_history"));
	}
	update_history("", "", pbox_history);

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
    	const result = search(fnSearchBar.value.toLowerCase(), lnSearchBar.value.toLowerCase(), data); 
    	if (result) {
    		// display_result(result);
    		display_search_result(result);
    		update_history(fnSearchBar.value, lnSearchBar.value, pbox_history);
    	}
    })

    const clearBtn = document.getElementById("clear-btn");
    clearBtn.addEventListener("click", () => {
    	fnSearchBar.value = "";
    	lnSearchBar.value = "";
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
	let values = [];
	list.forEach(
		(data) => {
			let fnFound = false;
			if (fn && data.firstname.includes(fn) ) {
				values.push(data);
			}

			if (ln && data.lastname.includes(ln) && !fnFound) {
				values.push(data);
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

const display_search_result = (data) => {
	const search_result = document.getElementById("search-result");
	search_result.innerHTML = "";

	const headings = [ "Name", "Shelf", "Level", "Row", "Column" ]; 
	data.forEach(
		(p) => {
			const box = document.createElement("section");
			box.classList.add("display-box");
			box.classList.add("col-flex-box");
			headings.forEach(
				(value) => {
					const inner_box = document.createElement("div");
					inner_box.classList.add("flex-box");
					inner_box.style.width = "90%";

					const title = document.createElement("span");
					title.style.width = "50%";
					title.textContent = value;

					const text_value = document.createElement("span");
					text_value.style.width = "50%";
					if (value.toLowerCase() === "name") {
						text_value.textContent = p.firstname + " " + p.lastname;
					} else if (value.toLowerCase() === "column") {
						text_value.textContent = p.col;
					} else {
						text_value.textContent = p[value.toLowerCase()];
					}

					inner_box.appendChild(title);
					inner_box.appendChild(text_value);
					box.append(inner_box);
				}
			);
			search_result.appendChild(box);
		}
	)
	
}

const update_history = (fn, ln, list) => {
	const newValue = `${ln.toLowerCase()}, ${fn.toLowerCase()}`;

	const history = document.getElementById("search-history");
	history.innerHTML = "";

	if (!list.includes(newValue) && fn && ln) { 
		if (list.length >= 10) {
			list.shift();
		}
		list.push(newValue);
	}


	localStorage.setItem("pbox_history", JSON.stringify(list));
	list.forEach(
		(name) => { 
			const container = document.createElement("a");
			container.classList.add("history-box");
			container.classList.add("flex-box");

			const span = document.createElement("span"); 
			span.style.width = "100%";
			span.textContent = name;

			container.appendChild(span);
			history.appendChild(container);

			container.addEventListener("click", () => {
			    const fnSearchBar = document.getElementById("firstname-search");
			    const lnSearchBar = document.getElementById("lastname-search");

			    const [lastname, firstname] = name.split(", ");
			    fnSearchBar.value = firstname;
			    lnSearchBar.value = lastname;
			    console.log(fnSearchBar);
			});
		}
	)

}