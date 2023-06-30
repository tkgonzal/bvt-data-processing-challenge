# Data Processing Coding Challenge

### Background
The USPTO (United States Patent and Trademark Office) maintains a database of all trademarks and history of each trademark. They 
offer bulk data downloads with all this data. Unfortunately, the data isn't developer-friendly in its raw state and we must 
perform some big-data processing.

This coding challenge must be performed in under 3 hours.

### Goal
 - Create a database that stores all this information.

### Acceptance Criteria
 - Your database must contain all rows from the source files.
 - All dates must be formatted.

### Bonus Points
 - The `owner` column contains an address that is not formatted. Create additional database columns for each address part (Line 1, Line 2, City, State, etc.)
 - There are a few columns that contain multiple values, the I Code and US Code columns (the last two columns in each row of the data set) usually have multiple values. Create other tables to hold this data with a foreign key to the trademark.

### Other Notes
 - Feel free to use any database engine you're comfortable with. MySQL, Oracle, Firebase, whatever.
 - The `goods_and_services.csv` file contains a comma-delimited list of all goods and services. The columns are as follows:
   - Row ID
   - USPTO ID
   - Class ID
   - Description
   - Status
   - Effective Date
   - If the row represents a good or service
   - Notes

 - The `uspto.txt` file contains a pipe-delimited list of trademark. The columns are as follow:
   - Row ID
   - Trademark
   - Services
   - Serial Number
   - Registration Number
   - Current Basis
   - Original Filing Basis
   - Published
   - Filing Date
   - Registration Date
   - Published For Opposition Date
   - Cancellation Date
   - Abandonment Date
   - Status Date
   - First Use Anywhere Date
   - First Use Commerce Date
   - Transaction Date
   - Drawing Code
   - Owner
   - Assignment Recorded
   - Attorney
   - Disclaimer
   - Type
   - Type Summary
   - Tegister
   - Correspondent
   - Status
   - Status Code
   - Status Description
   - Status Category
   - Record
   - Characters Claimed
   - Prior Registration
   - I Code
   - US Code


