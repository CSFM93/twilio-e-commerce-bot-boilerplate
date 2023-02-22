const Airtable = require('airtable');

const getBase = (context) => {
  const airtable = new Airtable({ apiKey: context.AIRTABLE_ACCESS_TOKEN });
  const base = airtable.base(context.AIRTABLE_BASE);
  return base;
};

const createRecord = (context, tableName, fields) => {
  return new Promise((resolve) => {
    const base = getBase(context);
    const table = base.table(tableName);
    table.create([
      {
        fields,
      },
    ], (err, records) => {
      if (err) {
        console.error(err);
        resolve(undefined);
      }
      if (records.length > 0) {
        const record = {
          id: records[0].id,
          fields: records[0].fields,
        };
        resolve(record);
      } else {
        resolve(undefined);
      }
    });
  });
};

const getRecord = (context, tableName, recordId) => {
  return new Promise((resolve) => {
    const base = getBase(context);
    const table = base.table(tableName);
    table.find(recordId, (err, record) => {
      if (err) {
        console.error(err);
        resolve(undefined);
      }

      resolve(record);
    });
  });
};

const getRecordByField = (context, tableName, fieldName, fieldValue) => {
  return new Promise((resolve) => {
    const base = getBase(context);
    const table = base.table(tableName);
    table.select({
      filterByFormula: `${fieldName} = '${fieldValue}'`,
    }).firstPage((err, records) => {
      if (err) {
        console.error('error', err);
        resolve(undefined);
      }

      if (records.length > 0) {
        const record = {
          id: records[0].id,
          fields: records[0].fields,
        };
        resolve(record);
      } else {
        resolve(undefined);
      }
    });
  });
};

const getRecords = async (context, tableName) => {
  return new Promise((resolve) => {
    const base = getBase(context);
    const table = base.table(tableName);

    table.select().all(async (err, records) => {
      if (err) {
        console.error(err);
        return undefined;
      }
      resolve(records);
    });
  });
};

const updateRecord = (context, tableName, recordId, fields) => {
  return new Promise((resolve) => {
    const base = getBase(context);

    const table = base.table(tableName);
    table.update([
      {
        id: recordId,
        fields,
      },
    ], (err, record) => {
      if (err) {
        console.error(err);
        resolve(false);
      }

      resolve(true);
    });
  });
};

module.exports = {
  createRecord, getRecord, getRecords, getRecordByField, updateRecord,
};
