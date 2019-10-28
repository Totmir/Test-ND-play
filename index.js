// Server settings
const HOST = "http://edu.nd.ru/tests/test1.json";
const PROXY = "https://cors-anywhere.herokuapp.com/";

// Object data template
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

// Rerender the table after getting the data from URL
class TableRenderer {
  generateTableBody = dataSet => {
    const check = document.querySelector("tbody");
    const tableBody = document.createElement("tbody");
    const tableNode = document.querySelector("table");
    if (check) {
      tableNode.removeChild(check);
    }
    tableNode.appendChild(tableBody);
    dataSet.forEach(item => {
      const tableCells = Object.keys(item);
      const tableBodyRow = document.createElement("tr");
      tableCells.forEach(key => {
        const td = document.createElement("td");
        td.innerHTML = item[key];
        tableBodyRow.appendChild(td);
      });
      tableBody.appendChild(tableBodyRow);
    });
  };

  // Renders columns with keys from HOST
  generateTableColumns = columnConfig => {
    const tableColumns = Object.keys(columnConfig);
    const tableNode = document.querySelector("table");
    const columnsRoot = document.createElement("thead");
    const tableHeadRow = document.createElement("tr");

    tableColumns.forEach(tableHead => {
      const th = document.createElement("th");
      th.innerHTML = TABLE_HEADER_TRANSLATIONS[tableHead];
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

// Input area
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
  }
  searchInput.value = "";
};

const tableRenderer = new TableRenderer();

// Outputs the result of matching 
const checkInput = () => {
  const searchInput = document.querySelector("input");
  const total = document.getElementById("total");

  if (searchInput.value !== "") {
    const filtered = window.data.filter(item => {
      const keys = Object.keys(item);
      const temp = keys
        .map(
          k =>
          item[k].toLowerCase().search(searchInput.value.toLowerCase()) !== -1
        )
        .filter(item => item);
      return temp.includes(true);
    });
    total.innerHTML = "Всего найдено: " + filtered.length;
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