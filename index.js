// Server settings
const HOST = "http://edu.nd.ru/tests/test1.json";
// Proxy address to send crossorigin request
const PROXY = "https://cors-anywhere.herokuapp.com/";

// Object data keys template
const TABLE_HEADER_TRANSLATIONS = {
  id: "ID",
  fullname: "Имя",
  date_submited: "Дата регистрации",
  position: "Профессия",
  organization: "Организация",
  org_type: "Тип организации",
  territory: "Территория",
  location: "Локация",
  vid: "Вид",
  birthdate: "Дата рождения",
  qualification_category: "Квалификация",
  plan_attestation_year: "Год аттестации",
  workflow: "Распорядок работы"
};

// Rerenders the table after getting the data from URL
class TableRenderer {
  generateTableBody = dataSet => {
    const check = document.querySelector("tbody");
    const tableBody = document.createElement("tbody");
    const tableNode = document.querySelector("table");
    // Remove table body before generation procces if table body exists
    if (check) {
      tableNode.removeChild(check);
    }
    tableNode.appendChild(tableBody);
    // Creates row for each object
    dataSet.forEach(item => {
      const tableCells = Object.keys(item);
      const tableBodyRow = document.createElement("tr");
      tableBody.appendChild(tableBodyRow);
      // Creates table cell for each object key
      tableCells.forEach(key => {
        const td = document.createElement("td");
        td.textContent = item[key];
        tableBodyRow.appendChild(td);
      });
    });
  };

  // Creates columns with keys from HOST
  generateTableColumns = columnConfig => {
    const tableColumns = Object.keys(columnConfig);
    const tableNode = document.querySelector("table");
    const columnsRoot = document.createElement("thead");
    const tableHeadRow = document.createElement("tr");

    tableColumns.forEach(tableHead => {
      const th = document.createElement("th");
      th.textContent = TABLE_HEADER_TRANSLATIONS[tableHead];
      tableHeadRow.appendChild(th);
    });

    columnsRoot.appendChild(tableHeadRow);
    tableNode.appendChild(columnsRoot);
  };
}

// Gets data from the host
function getData(url) {
  return fetch(url)
    .then(response => response.json())
    .then(result => result);
}

// Input area matching
const searchInput = document.querySelector("input");
const changeInputValue = e => {
  const clearButton = document.getElementById("clearButton");
  // Clear Button controller
  if (!clearButton.classList.contains("visible")) {
    clearButton.classList.toggle("visible");
  }
  checkInput();
  searchInput.value = e.target.value;
};

// Keys controllers
searchInput.addEventListener("change", changeInputValue);
searchInput.addEventListener("keypress", event => {
  if (event.keyCode === 13) {
    event.preventDefault();
    checkInput();
  }
});

// Clears the input area with rerandering the table
const clearInput = () => {
  const searchInput = document.querySelector("input");
  if (searchInput.value === "") {
    return null;
  } // if nothing is written nothing comeback
  searchInput.value = "";
};

const tableRenderer = new TableRenderer();

// Outputs the result of matching 
const checkInput = () => {
  const searchInput = document.querySelector("input");
  const total = document.getElementById("total");

  if (searchInput.value !== "") {
    const filtered = window.data.filter(teacher => {
      const keys = Object.keys(teacher);
      const searchResult = keys
        .map(
          letter =>
          teacher[letter].toLowerCase().search(searchInput.value.toLowerCase()) !== -1
        ) // Generate new array only with letter-matching items
      console.log(searchResult)
      const s = searchResult.filter(item => item);
      return s.includes(true);
    });
    total.textContent = "Всего найдено: " + filtered.length;
    return tableRenderer.generateTableBody(filtered);
  }
};

// Data preparation to be processed
const prepareData = data => {
  window.data = data;
  if (data.length > 0) {
    tableRenderer.generateTableColumns(data[0]);
    tableRenderer.generateTableBody(data);
  }
};

getData(PROXY + HOST).then(result => {
  prepareData(result.teachers);
});