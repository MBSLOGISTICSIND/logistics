CREATE DATABASE IF NOT EXISTS logistics_db;
USE logistics_db;


CREATE TABLE IF NOT EXISTS bills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    lr_no VARCHAR(50),
    manual_bill_no VARCHAR(50),
    bill_no VARCHAR(50),
    customer_name VARCHAR(100),
    from_location VARCHAR(100),
    to_location VARCHAR(100),
    consignor VARCHAR(100),
    consignee VARCHAR(100),
    goods VARCHAR(100),
    no_of_articles INT,
    rate_per_article DECIMAL(10, 2),
    gst_amount DECIMAL(10, 2),
    freight DECIMAL(10, 2),
    total DECIMAL(10, 2),
    date DATE,
    time TIME
);


INSERT INTO bills (
    lr_no,
    manual_bill_no,
    bill_no,
    customer_name,
    from_location,
    to_location,
    consignor,
    consignee,
    goods,
    no_of_articles,
    rate_per_article,
    gst_amount,
    freight,
    total,
    date,
    time
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);


SELECT * FROM bills ORDER BY date DESC, time DESC;
