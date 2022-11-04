//PRIVATE FUNCTIONS 

function getDateNowFormated() {
  const date = new Date();
  const dateNow = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000
  ).toISOString();
  const [fullDate, fullTime] = dateNow.split("T");
  const dateFormated = fullDate.split("-").reverse().join("/");
  const dateTimeFormated = fullTime.split(".")[0].slice(0, -3);

  return `${dateFormated}-${dateTimeFormated}`;
}


// UTILITY FUNCTIONS
export function uuid() {
  return String(new Date().getTime()).slice(4, 13);
}

export function getPriceFormated(price) {
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
  return currency.format(price);
}

export function getPageState() {
  const state = document.querySelector("body").getAttribute("state");
  return state;
}

export function updateSidebarDate() {
  const sidebarInfoElement = document.querySelector(".sider-information-date");
  sidebarInfoElement.innerText = getDateNowFormated();
}

export function setFormData(formSelector, fields) {
  const form = document.querySelector(formSelector);
  Object.keys(fields).forEach((key) => {
    const value = fields[key];
    form.querySelector(`[name="${key}"]`).setAttribute("value", value);
  });
}

export function getFormData(formSelector) {
  const formData = new FormData(document.querySelector(formSelector));
  return formData;
}

export function isValidForm(formSelector, fieldsRequired) {
  const formData = getFormData(formSelector);

  const isFilledRequiredFields = fieldsRequired.every(
    (field) => formData.get(field) !== "" && formData.get(field) !== null
  );
  return isFilledRequiredFields;
}

export function checkedAllItemsRender(selector, checked) {
  const items = document.querySelectorAll(selector);
  items.forEach((item) => (item.checked = checked));
}

export function tableRender(tableSelector, items, columns) {
  const table = document.querySelector(tableSelector);
  const tbody = table.querySelector("tbody");
  let template = "";

  table.parentElement.classList.remove("__empty");

  if (items.length == 0) {
    table.parentElement.classList.add("__empty");
  }

  items.forEach((item) => {
    template += "<tr>";
    columns.forEach((column) => {
      let propValue = String(item[column]);
      template += `<td class="row-${column}">${propValue}</td>`;
    });
    template += "</tr>";
  });
  console.log("template", template);
  tbody.innerHTML = template;
  updateSidebarDate();
}


export function notify(state, message) {
  const notifyElement = document.querySelector(".notify");
  const classes = {
    success: "notify-success",
    error: "notify-error",
    warning: "notify-warning",
  };
  if (state === "none") {
    for (let prop of Object.values(classes)) {
      notifyElement.classList.remove(prop);
    }
    return;
  }
  notifyElement.querySelector("span").innerText = message;
  notifyElement.classList.add(classes[state]);
  setTimeout(() => {
    notify("none");
  }, 2000);
}
