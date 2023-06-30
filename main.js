const fs = require('fs');
const db = require("mysql2");
const csv = require("csv-parser");  // CSV parsing library

// Goods and Services Constants
const gasFilePath = "./goods_and_services.csv";
const gasTable = "goods_and_services";
const gasColumns = [  // Used as the headers for the Goods and Services CSV
  "id",
  "uspto_id",
  "class_id",
  "product_description",
  "product_status",
  "effective_date",
  "product_type",
  "notes"
];
const gasDateColumns = gasColumns.slice(5, 6);

// Trademarks (USPTO) Constants
const tTable = "trademarks";
const tColumns = [  // Used as the headers for the USPTO file
  "id",
  "trademark",
  "services",
  "serial_no",
  "registration_no",
  "current_basis",
  "original_filing_basis",
  "published",
  "filing_date",
  "registration_date",
  "published_for_opposition_date",
  "cancellation_date",
  "abandoment_date",
  "status_date",
  "first_use_anywhere_date",
  "first_use_commerce_date",
  "transaction_date",
  "drawing_code",
  "trademark_owner",
  "assignment_recorded",
  "attorney",
  "disclaimer",
  "trademark_type",
  "type_summary",
  "register",
  "correspondent",
  "trademark_status",
  "status_code",
  "status_description",
  "status_category",
  "record",
  "characters_claimed",
  "prior_registrations",
  "i_code",
  "us_code",
];
const usptoSeparator = "|";
const tDateColumns = tColumns.slice(7, 17);

// Helper Functions
/**
 * Given a table to insert into and an array of columns of that table, makes
 * a SQL insert query template to be used for a prepared statement.
 * @param {string} table A string denoting the name of a table to insert into
 * @param {[string]} columns An array of strings denoting the columns of a table
 * @returns {string} An insert query template for a prepared statement
 */
function makeInsertTemplate(table, columns) {
  return `INSERT INTO ${table} (${columns.join(", ")})
    VALUES (${makeValuesTemplate(columns)});`;
}

/**
 * Given the columns of a table, creates a template for the VALUES part of a prepared 
 * statement to be used in a MySQL INSERT
 * @param {[string]} columns An array of strings denoting the columns of a table
 * @returns {string} A string in the format of "?, ?, ..." where ? appears 
 * for each column. To be used for a prepared SQL insert query
 */
function makeValuesTemplate(columns) {
  return columns.map(() => "?").join(", ");
}

/**
 * Returns whether or not a given date is in the format yyyy-mm-dd,
 * SQL's specified date format.
 * @param {string} date A date read in by the program
 * @returns {boolean} Whether or not the date is in the format yyyy-mm-dd
 */
function isFormattedDate(date) {
  return /^(1[89]|20)\d\d-(0[1-9]|[12][012])-(0[1-9]|[12][0-9]|3[01])$/.test(date);
}

/**
 * Takes an irregularly formatted date string and attempts to format it to 
 * yyyy-mm-dd if possible. After checking through the date values of the files,
 * only the USPTO file seemed to have dates in an irregular format and only for
 * the columns of first_use_anywhere_date and first_use_commerce_date.
 * @param {string} date An irregularly formatted date
 * @returns {string | null} A date in the format yyyy-mm-dd or null
 */
function formatDate(date) {
  // Most of the first_use_anywhere and first_use_commerce_date values 
  // are entered as yyyymmdd
  const yyyymmddRE = /^(1[89]|20)\d\d(0[0-9]|[12][012])(0[0-9]|[12][0-9]|3[01])$/;

  if (yyyymmddRE.test(date)) {
    const mm = date.slice(4, 6);
    const dd = date.slice(6, 8);

    // Some first_use date columns are entered such that they are in 
    // yyyymmdd but only have a year or year and month and enter in the
    // rest of the date as 00's. To preserve the data but keep in line with
    // SQL's DATE constraints, 00 values are set to 01.
    const mmFormatted = mm === "00" ? "01" : mm;
    const ddFormatted = dd === "00" ? "01" : dd;

    return `${date.slice(0, 4)}-${mmFormatted}-${ddFormatted}`;
  } else {
    // If the date is not in the yyyymmdd format, it is likely to be entered
    // in a manner such that its intended date representation is ambiguous.
    // e.g. the first_use_anywhere_date for row id 160396 is entered
    // as 40721, which could be interpreted as 2004-07-21 or 1940-07-21. 
    // As such, any date not entered in yyyymmdd is to be considered garabage data
    // and entered in as null.
    return null;
  }
}

/**
 * Creates the values array for an SQL execute prepared statement. 
 * @param {[string]} columns An array of strings denoting the columns of a table
 * @param {[string]} dateColumns An array of strings denoting the columns of a table
 * with a date data type
 * @param {Object} data An object made of the columns of a row in a CSV
 * @returns {[Number | string]} An array of values to be interpolated into a
 * prepared SQL statement
 */
function makeValuesFromColumns(columns, dateColumns, data) {
  return columns.map(col => {
    if (dateColumns.includes(col) && !isFormattedDate(data[col])) {
      return formatDate(data[col]);
    }

    return data[col] && data[col] !== "0" ? data[col] : null;
  });
}

/**
 * If an error occurs while trying to execute a query, log
 * the error message
 * @param {error} err Error received from mysql2 execute
 * @param {object} results rows returned from server
 * @param {object} field extra meta data about results
 */
function logSQLErrors(err, results, field) {
  if (err) {
    console.log(err.message);
  }
}

// Establish connection
// Assumes database called coding_challenge_05_10_23 already exists on localhost
const connection = db.createConnection({
  // Connection information redacted
});

// Insert Templates for Prepared Queries
const gasInsert = makeInsertTemplate(gasTable, gasColumns);
const usptoInsert = makeInsertTemplate(tTable, tColumns);

// Main function
// Assumes user has already made tables for the good_and_services and
// trademarks following the schema in the coding_challenge_05_10_23.sql
// CREATE TABLE statements.
(function () {
  // --------GOODS AND SERVICES TABLE FILLING--------
  const gasStream = fs.createReadStream(gasFilePath, "utf-8")
    .pipe(csv(gasColumns))  // Pipes data stream into CSV parser
    .on("data", (chunk) => {
      const values = makeValuesFromColumns(gasColumns, gasDateColumns, chunk);
      connection.execute(gasInsert, values, logSQLErrors);
    })
    .on("end", () => {
      console.log(`Reading of ${gasFilePath} completed.`);
    })
    .on("close", () => {
      console.log(`${gasFilePath} stream closed.`);
    });

  // --------TRADEMARKS TABLE FILLING--------
  const stream = fs.createReadStream('./uspto.txt', 'utf-8');

  stream.on('error', (error) => {
    console.log(error.message);
  });

  // Uses option object to specify both names of columns in the file
  // as well as the usage of the | as a delimiter
  stream.pipe(csv({
    headers: tColumns,
    separator: usptoSeparator
  }))
    .on('data', (chunk) => {
      const values = makeValuesFromColumns(tColumns, tDateColumns, chunk);
      connection.execute(usptoInsert, values, logSQLErrors);
    });

  stream.on('end', () => {
    console.log('Reading complete');
  });

  stream.on("close", () => {
    console.log("./uspto.txt stream closed.");
    // Connection ended in uspto stream closure since USPTO is more likely to finish
    // reading after gasStream due to length
    connection.end();
  });
})();

