/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-undef */
const functions = Runtime.getFunctions();
const userFunction = functions.user;
const productFunction = functions.product;
const { getProduct, getProductByColor, updateProduct } = require(productFunction.path);
const { updateUser } = require(userFunction.path);

const getCartItems = async (context, user) => {
  const cart = JSON.parse(user.fields.Cart);
  for (let i = 0; i < cart.length; i++) {
    const product = await getProduct(context, cart[i].productId);
    cart[i].product = {
      Title: product.fields.Title,
      Image: product.fields.Image,
      Price: product.fields.Price,
    };
  }
  return cart;
};

const addItemToCart = async (context, user, entities) => {
  let color;
  let quantity = 1;

  entities.forEach((entity) => {
    if (entity.entity === 't-shirt') {
      color = entity.option;
    } else {
      quantity = entity.resolution.value;
    }
  });

  const product = await getProductByColor(context, color);
  if (product === undefined || product === '') {
    return false;
  }

  const cart = user.fields.Cart === undefined ? [] : JSON.parse(user.fields.Cart);
  let itemExists = false;

  for (let i = 0; i < cart.length; i++) {
    if (cart[i].productId === product.id) {
      itemExists = true;
      cart[i].quantity += quantity;
    }
  }

  if (!itemExists) {
    const item = { productId: product.id, quantity };
    cart.push(item);
  }

  const userFields = {
    Cart: JSON.stringify(cart),
  };

  const userUpdated = await updateUser(context, user.id, userFields);

  const productFields = {
    Quantity: product.fields.Quantity - quantity,
  };
  await updateProduct(context, product.id, productFields);

  return userUpdated;
};

module.exports = { addItemToCart, getCartItems };
