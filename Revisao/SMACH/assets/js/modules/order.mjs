import {
  uuid,
  getPriceFormated,
  notify,
  checkedAllItemsRender,
  getFormData,
  setFormData,
} from "../_utils.js";
import SMACH from "../data/index.mjs";
import { findProduct } from "./produto.mjs";

function getOrdersCheckedOnTable(orders) {
  const ordersChecked = getCheckedItemsOnTable(".table-all-orders");
  const ordersID = Array.from(ordersChecked).map((selected) =>
    selected.getAttribute("order-id")
  );
  const ordersSelected = orders.filter((order) =>
    ordersID.some((id) => id === order.id)
  );
  return ordersSelected;
}

function getOrderComputedData(order) {
  const name = order.products.reduce(
    (name, product) => (name += `${product.quantity} - ${product.name}  `),
    ""
  );
  const priceTotal = order.products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );

  return { name, priceTotal };
}

function updateOrder(order, orderPayload) {
  const { id, type, products } = orderPayload;
  const orderMapped = { ...order, id, type, products };
  return orderMapped;
}

export function clearOrder() {
  return {
    products: [],
  };
}

export function printOrders() {
  if (SMACH.orders.length == 0) {
    notify("warning", "Não ha nenhum pedido para ser impresso");
    return;
  }
  window.print();
}

export function changeOrderStatus(orders, orderId) {
  const getStatus = {
    [SMACH.domains.ORDER_STATE.RECEIVED]: SMACH.domains.ORDER_STATE.DONE,
    [SMACH.domains.ORDER_STATE.DONE]: SMACH.domains.ORDER_STATE.DELIVERED,
    [SMACH.domains.ORDER_STATE.DELIVERED]: SMACH.domains.ORDER_STATE.DELIVERED,
  };

  const ordersMapped = orders.map((order) => {
    if (order.id === orderId) {
      return { ...order, status: getStatus[order.status] };
    }
    return order;
  });
  return ordersMapped;
}

export function getTotalPriceToOrder(products) {
  return products.reduce(
    (priceTotal, product) => (priceTotal += product.priceTotal),
    0
  );
}

function editOrder(allOrders, order) {
  const { name, priceTotal } = getOrderComputedData(order);
  const ordersMapped = allOrders.map((orderItem) => {
    if (orderItem.id === order.id) {
      return {
        ...order,
        name,
        priceTotal,
        status: SMACH.domains.ORDER_STATE.RECEIVED,
      };
    }
    return order;
  });
  return ordersMapped;
}

export function addOrder(allOrders, order) {
  const { name, priceTotal } = getOrderComputedData(order);
  const orderMapped = {
    id: uuid(),
    name,
    priceTotal,
    status: SMACH.domains.ORDER_STATE.RECEIVED,
    ...order,
  };
  allOrders.unshift(orderMapped);
  return allOrders;
}

function deleteProductToOrder(order, product) {
  const productIndex = order.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  if (productIndex >= 0) {
    order.products.splice(productIndex, 1);
  }
  return order;
}
export function addProductToOrder(order, product) {
  const productIndex = order.products.findIndex(
    (orderItem) => orderItem.code === product.code
  );
  const productFinded = order.products[productIndex];
  if (productFinded) {
    productFinded.quantity += product.quantity;
    productFinded.priceTotal = productFinded.quantity * product.price;
  } else {
    const priceTotal = product.quantity * product.price;
    order.products.push({ ...product, priceTotal });
  }
  return order;
}

export function searchProductAndFillFormOrder() {
  const productCode = getFormData(".form-new-order").get("productCode");
  const product = findProduct(productCode);
  if (product) {
    setFormData(".form-new-order", {
      productName: product.name,
      productQuantity: 1,
      productPrice: getPriceFormated(product.price),
    });
  } else {
    notify("error", "Produto nao encontrado insira um codigo valido");
  }
}

export function editOrderChecked() {
  const ordersSelecteds = getOrdersCheckedOnTable(SMACH.orders);
  const order = ordersSelecteds[0];

  if (ordersSelecteds.length !== 1) {
    notify("warning", "Voce so pode editar 1 pedido por fez");
    return;
  }
  SMACH.order = updateOrder(SMACH.order, order);
  changePage(PAGE_STATE.EDIT_ORDER);
  tableOrderRender(SMACH.order);
}

export function deleteOrdersChecked() {
  const orders = getOrdersCheckedOnTable(SMACH.orders);
  SMACH.orders = deleteOrders(SMACH.orders, orders);
  tableAllOrdersRender(SMACH.orders);
  changePage(PAGE_STATE.ALL_ORDERS);
}

function getAllOrdersFiltered(type, status) {
  let ordersFiltered = SMACH.orders.filter(
    (order) => order.type === type || type === "all"
  );
  ordersFiltered = ordersFiltered.filter(
    (order) => order.status === status || status === "all"
  );
  return ordersFiltered;
}

function deleteOrders(orders, ordersRemoved) {
  const ordersUpdated = orders.filter((order) =>
    ordersRemoved.every((removed) => removed.id !== order.id)
  );
  return ordersUpdated;
}
