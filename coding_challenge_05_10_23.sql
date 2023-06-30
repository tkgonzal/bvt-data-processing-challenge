-- Table Creation
-- @block
CREATE Table Goods_And_Services (
    id INT PRIMARY KEY,
    uspto_id VARCHAR(255) NOT NULL,
    class_id CHAR(3) NOT NULL,
    product_description TEXT NOT NULL,
    product_status CHAR(1) NOT NULL,
    effective_date DATE NOT NULL,
    product_type VARCHAR(8) NOT NULL,
    notes TEXT
);
-- @block
CREATE TABLE Trademarks (
    id INT PRIMARY KEY,
    trademark TEXT,
    services TEXT NOT NULL,
    serial_no CHAR(8) NOT NULL,
    registration_no CHAR(7),
    current_basis VARCHAR(4) NOT NULL,
    original_filing_basis VARCHAR(4) NOT NULL,
    -- No rows in USPTO have a published so data type is DATE for now
    published DATE,
    filing_date DATE,
    registration_date DATE,
    -- No rows in the USPTO have a published_for_opposition_date, DATE for now
    published_for_opposition_date DATE,
    cancellation_date DATE,
    abandoment_date DATE,
    status_date DATE NOT NULL,
    first_use_anywhere_date DATE,
    first_use_commerce_date DATE,
    transaction_date DATE NOT NULL,
    drawing_code VARCHAR(5),
    trademark_owner TEXT,
    -- No rows in the USPTO have an assignment_recorded, TEXT for now
    assignment_recorded TEXT,
    attorney TEXT,
    disclaimer TEXT,
    trademark_type VARCHAR(23),
    -- No rows in the USPTO have a type_summary, TEXT for now
    type_summary TEXT,
    register VARCHAR(12),
    correspondent TEXT NOT NULL,
    -- Now rows in the USPTO have a trademark_status, TEXT for now
    trademark_status TEXT,
    status_code VARCHAR(3) NOT NULL,
    -- No rows in the USPTO have a status_description, TEXT for now
    status_description TEXT,
    -- Now rows in the USPTO have a status_category, TEXT for now
    status_category TEXT,
    -- No rows in the USPTO have a record, TEXT for now
    record TEXT,
    -- No rows in the USPTO have a characters_claimed, TEXT for now
    characters_claimed TEXT,
    -- No rows in the USPTO have a prior_registrations, TEXT for now
    prior_registrations TEXT,
    i_code TEXT,
    us_code TEXT
);
-- Debugging Queries
-- -- Goods and Services
-- -- @block
-- SELECT *
-- FROM goods_and_services;
-- -- @block 
-- TRUNCATE goods_and_services;
-- -- @block 
-- DROP TABLE goods_and_services;
-- -- Trademarks (USPTO)
-- -- @block
-- SELECT *
-- FROM trademarks
-- LIMIT 20;
-- -- @block
-- SELECT COUNT(*)
-- FROM trademarks;
-- -- @block
-- TRUNCATE trademarks;
-- -- @block
-- DROP TABLE trademarks;