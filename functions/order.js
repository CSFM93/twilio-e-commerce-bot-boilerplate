/* eslint-disable no-undef */
/* eslint-disable import/no-dynamic-require */
const functions = Runtime.getFunctions();
const dbHelperFunction = functions.dbHelper;
const { createRecord } = require(dbHelperFunction.path);
const tableName = 'Orders';

const createOrder = async (context, fields) => {
  const order = await createRecord(context, tableName, fields);
  return order;
};

module.exports = { createOrder };
