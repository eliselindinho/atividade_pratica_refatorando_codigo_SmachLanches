import {
  addOrder,
  addProductToOrder,
  clearOrder,
  getTotalPriceToOrder,
} from "../modules/order.mjs";
import { findProduct } from "../modules/produto.mjs";
import {
  getFormData,
  isValidForm,
  notify,
  setFormData,
  getPageState,
  getPriceFormated,
  tableRender,
} from "../_utils.js";
import SMACH from "../data/index.mjs";
import { changePage } from "../navigation.mjs";

/**PRIVATES  */

function tableOrderListeners() {
  const buttonDeleteProduct = document.querySelectorAll(
    ".table-new-order .icon-trash"
  );
  buttonDeleteProduct.forEach((button) => {
    button.addEventListener("click", () => {
      const product = findProduct(button.getAttribute("product-id"));
      SMACH.order = deleteProductToOrder(SMACH.order, product);
      notify("success", `Produto ${product.code} removido`);
      tableOrderRender(SMACH.order);
    });
  });
}

function tableAllOrdersListeners() {
  const buttonsStatus = document.querySelectorAll(
    ".table-all-orders .btn.__event"
  );
  const buttonsCheckbox = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox"
  );

  buttonsStatus.forEach((button) => {
    button.addEventListener("click", () => {
      const orderID = button.getAttribute("order-id");
      SMACH.orders = changeOrderStatus(SMACH.orders, orderID);
      notify("success", "Status alterado");
      tableAllOrdersRender(SMACH.orders);
    });
  });

  buttonsCheckbox.forEach((button) => {
    button.addEventListener("change", (e) => {
      formActionsUpdateStateRender();
    });
  });
}

/**PUBLIC */
export function tableOrderRender(order) {
  const tableTotal = document.querySelector(".table-new-order__total strong");
  const priceTotal = getTotalPriceToOrder(order.products);
  const formTitle =
    getPageState() === SMACH.domains.PAGE_STATE.EDIT_ORDER
      ? `Editar Pedido - ${order.id}`
      : "Novo Pedido";

  const formAddOrderTitle = document.querySelector(
    ".form-new-order .form-title"
  );
  formAddOrderTitle.innerText = formTitle;

  const productsMap = order.products.map((product) => ({
    ...product,
    action: `<i product-id="${product.code}" class="icon icon-trash"></i>`,
    pricelTotalFormated: getPriceFormated(product.priceTotal),
  }));

  tableRender(".table-new-order", productsMap, [
    "code",
    "name",
    "quantity",
    "pricelTotalFormated",
    "action",
  ]);
  tableOrderListeners();
  tableTotal.innerHTML = getPriceFormated(priceTotal);
}

export function addOrderAndTableRender() {
  if (!SMACH.order.products.length) {
    notify("error", "Adiciona algum produto no pedido");
    return false;
  }
  const order = {
    ...SMACH.order,
    type: getFormData(".form-new-order").get("orderType"),
  };

  if (!SMACH.order.id) {
    SMACH.orders = addOrder(SMACH.orders, order);
    notify("success", "Pedido adicionado");
  } else {
    SMACH.orders = editOrder(SMACH.orders, order);
    notify("success", "Pedido alterado");
  }

  SMACH.order = clearOrder();

  tableOrderRender(SMACH.order);
  tableAllOrdersRender(SMACH.orders);
  changePage(SMACH.domains.PAGE_STATE.ALL_ORDERS);
}

export function filterAllOrdersAndTableRender(orderType, orderStatus) {
  const orders = getAllOrdersFiltered(orderType, orderStatus);
  tableAllOrdersRender(orders);
}

export function addProductToOrderAndTableRender() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const productQuantity = getFormData(".form-new-order").get("productQuantity");
  const product = findProduct(productCode);
  const allFieldsFilled = isValidForm(".form-new-order", [
    "productName",
    "productQuantity",
    "productPrice",
  ]);

  try {
    if (!isValidForm(".form-new-order", ["orderType"])) {
      throw new Error("Preencha o tipo do pedido");
    }

    if (!allFieldsFilled) {
      throw new Error("Preencha todos os campos");
    }

    if (!product) {
      throw new Error("Produto não encontrado");
    }

    setFormData(".form-new-order", {
      productCode: "", // fix no clear search
      productName: "",
      productQuantity: 1,
      productPrice: "",
    });

    SMACH.order = addProductToOrder(SMACH.order, {
      ...product,
      quantity: Number(productQuantity),
    });

    tableOrderRender(SMACH.order);
  } catch (error) {
    notify("error", error.message);
  }
}

export function formActionsUpdateStateRender() {
  const itemsSelected = document.querySelectorAll(
    ".table-all-orders .row-field-checkbox:checked"
  );

  if (itemsSelected.length > 0) {
    changePage(SMACH.domains.PAGE_STATE.SELECTED_ORDERS);
  } else {
    changePage(SMACH.domains.PAGE_STATE.ALL_ORDERS);
  }
}

export function tableAllOrdersRender(orders) {
  const btn = {
    received: "btn btn-default __event __received",
    done: "btn btn-warning __event __done",
    delivered: "btn btn-success __delivered",
  };
  const legend = {
    received: "Recebido",
    done: "Pronto",
    delivered: "Entregue",
  };

  const ordersMapped = orders.map((order) => ({
    ...order,
    id: `<fieldset class="field"><input order-id="${order.id}" class="row-field-checkbox" type="checkbox" /></fieldset>${order.id}`,
    status: `<button order-id="${order.id}" class="${btn[order.status]}">${
      legend[order.status]
    }</button>`,
    pricelTotalFormated: getPriceFormated(order.priceTotal),
  }));

  tableRender(".table-all-orders", ordersMapped, [
    "id",
    "name",
    "type",
    "pricelTotalFormated",
    "status",
  ]);

  tableAllOrdersListeners();
}
