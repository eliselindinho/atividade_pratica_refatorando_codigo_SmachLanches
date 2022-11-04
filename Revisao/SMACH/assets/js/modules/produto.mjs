import products from "../data/products.mjs";

export function findProduct(productCode) {
    return products.find((product) => product.code === Number(productCode));
}