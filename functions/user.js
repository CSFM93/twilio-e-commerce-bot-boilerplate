const functions = Runtime.getFunctions();
const dbHelperFunction = functions.dbHelper;
const {
  createRecord, getRecord, getRecordByField, updateRecord,
} = require(dbHelperFunction.path);
const tableName = 'Users';

const createUser = async (context, sender, intent) => {
  const fields = {
    PhoneNumber: sender,
    State: intent,
  };
  const user = await createRecord(context, tableName, fields);
  return user;
};

const getUser = async (context, userId) => {
  const user = await getRecord(context, tableName, userId);
  return user;
};

const getUserByPhoneNumber = async (context, sender) => {
  const fieldName = 'PhoneNumber';
  const fieldValue = sender;
  const user = await getRecordByField(context, tableName, fieldName, fieldValue);
  return user;
};

const updateUser = async (context, userId, fields) => {
  const userUpdated = await updateRecord(context, tableName, userId, fields);
  return userUpdated;
};

module.exports = {
  getUser, getUserByPhoneNumber, createUser, updateUser,
};
