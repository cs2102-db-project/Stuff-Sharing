CREATE TABLE IF NOT EXISTS Accounts(
    username TEXT,
    password TEXT not null,
    primary key (username)
);
CREATE TABLE IF NOT EXISTS Admins(
    username TEXT references Accounts(username)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    primary key (username)
);
CREATE TABLE IF NOT EXISTS NonAdmins(
    username TEXT references Accounts(username)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    primary key (username)
);
CREATE TABLE IF NOT EXISTS Profiles(
    username TEXT references Accounts(username)
      on DELETE CASCADE
      ON UPDATE CASCADE,
    name TEXT not null,
    picture TEXT,
    address VARCHAR(100),
    primary key (username)
);
CREATE TABLE IF NOT EXISTS Stuff(
    stuffId INTEGER,
    picture TEXT,
    name VARCHAR(100) not null,
    owner TEXT not null,
    price FLOAT8 not null,
    description TEXT,
    primary key (stuffId),
    foreign key (owner) references Profiles(username)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
CREATE TABLE IF NOT EXISTS Deliverables(
    stuffId INTEGER references Stuff(stuffId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    deliveryCost FLOAT8 not null,
    primary key (stuffId)
);
CREATE TABLE IF NOT EXISTS Pickups(
    stuffId INTEGER references Stuff(stuffId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    pickupAddress VARCHAR(100) not null,
    primary key (stuffId)
);
CREATE TABLE IF NOT EXISTS Intangibles(
    stuffId INTEGER references Stuff(stuffId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    primary key (stuffId)
);
CREATE TABLE IF NOT EXISTS Services(
    stuffId INTEGER references Stuff(stuffId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    primary key (stuffId)
);
CREATE TYPE STATUS AS ENUM('ONGOING', 'PENDING', 'FINISHED', 'CANCELLED');
CREATE TABLE IF NOT EXISTS Transactions(
    transId INTEGER,
    loanee TEXT not null references Profiles(username),
    stuffId INTEGER not null references Stuff(stuffId) ON DELETE CASCADE,
    loaneeContact TEXT not null,
    loaneeEmail TEXT not null,
    status TEXT not null,
    cost DECIMAL(10, 2) not null,
    startDate DATE not null,
    endDate DATE not null,
    bid DECIMAL(10, 2) not null,
    primary key (transId),
    check (startDate <= endDate)
);
CREATE TABLE IF NOT EXISTS Reviews(
    reviewId INTEGER,
    transId INTEGER not null references Transactions(transId)
        ON DELETE CASCADE
        ON UPDATE CASCADE,
    rating INTEGER not null,
    details TEXT not null,
    primary key (reviewId),
    check (rating >= 0 and rating <= 5)
);
CREATE TABLE IF NOT EXISTS ads(
    stuffId INTEGER references Stuff(stuffId)
        ON DELETE CASCADE,
    owner TEXT references Accounts(username),
    primary key (owner)
);

INSERT INTO accounts VALUES
    ('johndoe', 'johndoe'),
    ('janedoe', 'janedoe'),
    ('ayush', 'password'),
    ('chelsea', 'password'),
    ('daryl', 'password'),
    ('adam', 'password');
INSERT INTO admins VALUES
    ('johndoe'),
    ('ayush');
INSERT INTO nonadmins VALUES
    ('janedoe'),
    ('daryl'),
    ('adam'),
    ('chelsea');
INSERT INTO profiles VALUES
    ('johndoe', 'John Doe', 'picture?', '10 john road'),
    ('janedoe', 'Jane Doe', 'picture?', '10 jane road'),
    ('ayush', 'Ayush', 'picture?', '10 Ayush road'),
    ('daryl', 'Daryl', 'picture?', '10 Daryl road'),
    ('chelsea', 'Chelsea', 'picture?', '10 Chelsea road'),
    ('adam', 'Adam', 'picture?', '10 Adam road');
INSERT INTO stuff VALUES
    (1, 'picture?', 'Math book', 'johndoe', 1.50, 'its a math book'),
    (2, 'picture?', 'Car', 'johndoe', 2.50, 'its a car'),
    (3, 'picture?', 'Car wash', 'janedoe', 3.50, 'its a car wash'),
    (4, 'picture?', 'Math notes', 'janedoe', 4.50, 'its math notes'),
    (5, 'picture?', 'Shoes', 'ayush', 1.50, 'Size 8 Shoes'),
    (6, 'picture?', 'Chair', 'ayush', 2.50, 'Really comfortable'),
    (7, 'picture?', 'Plumbing', 'ayush', 3.50, 'I will fix your plumbing issues'),
    (8, 'picture?', 'Tutor', 'daryl', 1.50, 'I can tutor A-level Math'),
    (9, 'picture?', 'Guitar', 'daryl', 2.50, 'Electric guitar to jam'),
    (10, 'picture?', 'Truck', 'daryl', 3.50, 'Pick-up truck'),
    (11, 'picture?', 'Sofa', 'chelsea', 3.50, 'Comfy sofa'),
    (12, 'picture?', 'TV', 'chelsea', 3.50, 'Widescreen plasma'),
    (13, 'picture?', 'Bottle', 'chelsea', 3.50, 'To drink water'),
    (14, 'picture?', 'Table', 'chelsea', 3.50, 'Dinner table, looks great'),
    (15, 'picture?', 'eBook', 'chelsea', 3.50, 'I will email it to you'),
    (16, 'picture?', 'Vacation Photos', 'adam', 3.50, 'Really pretty photos! Great wallpapers'),
    (17, 'picture?', 'Web Developer', 'adam', 3.50, 'Ill make ExpressJS websites for you'),
    (18, 'picture?', 'Wedding photography', 'adam', 3.50, 'Ill shoot you'),
    (19, 'picture?', 'Bag', 'ayush', 3.50, 'Louis Vuitton'),
    (20, 'picture?', 'Phone', 'ayush', 3.50, 'Samsung S9');

INSERT INTO deliverables VALUES
    (1, 1.00),
    (5, 0.00),
    (6, 5.00),
    (9, 2.00),
    (13, 0.00),
    (19, 0.00),
    (20, 0.00);
INSERT INTO pickups VALUES
    (2, '10 john road'),
    (10, 'anywhere'),
    (11, 'my home'),
    (12, 'my house'),
    (14, '11 john road');
INSERT INTO intangibles VALUES
    (4),
    (15),
    (16);
INSERT INTO services VALUES
    (3),
    (7),
    (8),
    (17),
    (18);
INSERT INTO transactions VALUES
    (1, 'janedoe', 1, '83365620', 'janedoe@joe.com', 'FINISHED', 10.00, '2019-01-01', '2019-01-20', 12.42),
    (2, 'ayush', 2, '81823456', 'ayush@ayush.com', 'ONGOING', 10.00, '2019-05-20', '2019-05-21', 15.00),
    (3, 'daryl', 5, '12324212', 'asdad@gds.com', 'PENDING', 10.00, '2019-06-13', '2019-06-16', 20.00);
INSERT INTO reviews VALUES
    (1, 1, 5, 'good');
INSERT INTO ads VALUES
    (2, 'johndoe'),
    (3, 'janedoe'),
    (6, 'ayush'),
    (14, 'chelsea');

-- Prevent insertion if there are more than X overdue items
CREATE OR REPLACE FUNCTION check_overdue()
RETURNS trigger AS $$
DECLARE
  overdue_threshold NUMERIC;
BEGIN
    overdue_threshold := 0;
    IF (SELECT COUNT(*) FROM TRANSACTIONS T where loanee=NEW.loanee and status='ONGOING' and now()::date > T.endDate) > overdue_threshold THEN
        RAISE EXCEPTION 'You have at least 1 overdue item. Please return that first if you wish to continue using the website.';
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_overdue
BEFORE INSERT ON Transactions
FOR EACH ROW
EXECUTE PROCEDURE check_overdue();

-- Prevent insertion if password is too weak
CREATE OR REPLACE FUNCTION check_password()
RETURNS trigger as $$
DECLARE
  minLength NUMERIC;
  actualLength NUMERIC;
BEGIN
  minLength := 6;
  actualLength = length(NEW.password);
  IF actualLength < minLength THEN
    RAISE EXCEPTION 'password';
    RETURN NULL;
  END IF;
  RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_password
BEFORE INSERT OR UPDATE ON Accounts
FOR EACH ROW
EXECUTE PROCEDURE check_password();

-- Prevent deletion if item is loaned out
CREATE OR REPLACE FUNCTION check_borrowed()
RETURNS trigger AS $$
DECLARE
  borrow_threshold NUMERIC;
BEGIN
  borrow_threshold := 0;
  IF (SELECT COUNT(*) FROM Transactions T WHERE T.stuffId = OLD.stuffId AND T.status = 'ONGOING') > borrow_threshold THEN
      RAISE EXCEPTION 'This item is currently borrowed by someone, so you cannot delete it';
  END IF;
  RETURN OLD;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_borrowed
before DELETE ON Stuff
FOR EACH ROW
EXECUTE PROCEDURE check_borrowed();

-- Function create both Account and Profile at the same time
CREATE OR REPLACE FUNCTION update_profile(signUpUsername TEXT, signUpPassword TEXT, signUpName TEXT, signUpPicture TEXT, signUpAddress VARCHAR(100))
RETURNS VOID as $$
BEGIN
    INSERT INTO accounts (username, password) VALUES (signUpUsername, signUpPassword);
    INSERT INTO profiles (username, name, picture, address) VALUES (signUpUsername, signUpName, signUpPicture, signUpAddress);
END;
$$
LANGUAGE plpgsql;
