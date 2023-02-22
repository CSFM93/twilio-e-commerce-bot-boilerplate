/* eslint-disable import/no-dynamic-require */
/* eslint-disable no-undef */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-loop-func */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-plusplus */
/* eslint-disable consistent-return */
const functions = Runtime.getFunctions();
const dbHelperFunction = functions.dbHelper;
const {
  getRecord, getRecordByField, getRecords, updateRecord,
} = require(dbHelperFunction.path);
const tableName = 'Products';

const getProduct = async (context, productId) => {
  const product = await getRecord(context, tableName, productId);
  return product;
};

const getProductByColor = async (context, color) => {
  const fieldName = 'Color';
  const fieldValue = color;
  const product = await getRecordByField(context, tableName, fieldName, fieldValue);
  return product;
};

const getProducts = async (context) => {
  const products = await getRecords(context, tableName);
  return products;
};

const updateProduct = async (context, productId, fields) => {
  const productUpdated = await updateRecord(context, tableName, productId, fields);
  return productUpdated;
};

const sendProducts = async (context, products, baseURL, sender) => {
  const mediaMessages = [];
  const client = context.getTwilioClient();

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const imageURl = `${baseURL}/images/${product.fields.Image}`;
    const messageBody = `${product.fields.Title}  - $${product.fields.Price}`;

    const mediaMessage = new Promise((resolve) => {
      client.messages.create({
        from: `whatsapp:${context.WHATSAPP_NUMBER}`,
        body: messageBody,
        mediaUrl: imageURl,
        to: `whatsapp:${sender}`,
      }).then((res) => resolve(res));
    });

    mediaMessages.push(mediaMessage);
  }

  await Promise.all(mediaMessages);
  await new Promise((resolve) => {
    setTimeout(async () => {
      await client.messages.create({
        from: `whatsapp:${context.WHATSAPP_NUMBER}`,
        body: 'Which one would you like to buy ?',
        to: `whatsapp:${sender}`,
      }).then((res) => resolve(res));
    }, 2000);
  });

  return '';
};

module.exports = {
  getProduct, getProductByColor, getProducts, sendProducts, updateProduct,
};
