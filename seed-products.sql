-- Run this in Supabase SQL Editor to add the initial products

INSERT INTO products (name, slug, description, price, compare_price, image, category, in_stock, badge) VALUES
('Ultra Bee Baja Headlight Kit', 'ultra-bee-baja-headlight', 'High-performance LED headlight kit for Ultra Bee', 29900, NULL, 'baja-headlight.jpeg', 'ultra-bee', true, 'new'),
('Surron Ultra Bee Sintered Brake Pads', 'ultra-bee-brake-pads', 'High-performance sintered brake pads', 4500, 5500, 'brake-pads.jpeg', 'ultra-bee', true, 'sale'),
('Surron Ultra Bee Shift Lock', 'ultra-bee-shift-lock', 'Prevents accidental gear shifts', 8900, NULL, 'ultra-bee-shift-lock.jpg', 'ultra-bee', true, NULL),
('Ultra Bee Front Windscreen', 'ultra-bee-windscreen', 'Aerodynamic front windscreen', 7900, NULL, 'windscreen.jpeg', 'ultra-bee', true, 'new'),
('Ultra Bee Rear Fender', 'ultra-bee-rear-fender', 'Replacement rear fender', 6500, NULL, 'rear-fender.jpeg', 'ultra-bee', true, NULL),
('Surron Ultra Bee Guts Seat Cover', 'ultra-bee-seat-cover', 'Premium GUTS Racing seat cover', 8500, NULL, 'ultra-bee-seat-cover.png', 'ultra-bee', true, NULL),
('Light Bee Front Number Plate', 'light-bee-front-plate', 'MX-style front number plate', 4900, 6500, 'front-plate.jpeg', 'light-bee', true, 'sale'),
('Light Bee Motor Guard', 'light-bee-motor-guard', 'CNC machined motor protection', 11900, NULL, 'motor-guard.jpeg', 'light-bee', true, 'new'),
('Light Bee Passenger Peg Kit', 'light-bee-passenger-peg', 'Passenger foot peg mounting kit', 8900, NULL, 'passenger-peg.jpeg', 'light-bee', true, NULL),
('Surron Light Bee Shift Lock', 'light-bee-shift-lock', 'Prevents accidental gear shifts', 7900, NULL, 'light-bee-shift-lock.jpg', 'light-bee', true, NULL),
('Surron Light Bee Motor Cover', 'light-bee-motor-cover', 'Protective motor cover', 11900, NULL, 'light-bee-motor-cover.webp', 'light-bee', true, NULL),
('Surron Light Bee Guts Seat Cover', 'light-bee-seat-cover', 'Premium GUTS Racing seat cover', 8000, NULL, 'light-bee-seat-cover.png', 'light-bee', true, NULL);
