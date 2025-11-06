--  Insert Tony Stark into the account table
INSERT INTO account (
    account_firstname, 
    account_lastname, 
    account_email, 
    account_password)
VALUES (
    'Tony', 
    'Stark', 
    'tony@starkent.com', 
    'Iam1ronM@n');

-- Modify Tony Stark’s account_type to "Admin"
UPDATE account
SET account_type = 'Admin'
WHERE email = 'tony@starkent.com';

-- Delete the Tony Stark record from the database
DELETE FROM account
WHERE email = 'tony@starkent.com';

-- Modify the "GM Hummer" record to read 
-- "a huge interior" instead of "small interiors"
UPDATE inventory
SET inv_description = REPLACE(
    inv_description, 
    'small interiors', 
    'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

-- Select make, model, and classification name 
--     for inventory items in the "Sport" category
SELECT i.inv_make, i.inv_model, c.classification_name
FROM inventory AS i
INNER JOIN classification AS c
ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

-- Update all records to include "/vehicles" in image paths
UPDATE inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');