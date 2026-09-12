INSERT INTO events (name, venue, event_date, total_seats, available_seats, price)
SELECT 'Dhaka Tech Summit 2026', 'ICCB, Dhaka', '2026-11-14', 200, 200, 1500.0
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = 'Dhaka Tech Summit 2026');

INSERT INTO events (name, venue, event_date, total_seats, available_seats, price)
SELECT 'Indie Music Night', 'Army Stadium, Dhaka', '2026-12-05', 500, 500, 800.0
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = 'Indie Music Night');

INSERT INTO events (name, venue, event_date, total_seats, available_seats, price)
SELECT 'Startup Pitch Day', 'Gulshan Society Hall', '2026-10-20', 80, 80, 500.0
WHERE NOT EXISTS (SELECT 1 FROM events WHERE name = 'Startup Pitch Day');
