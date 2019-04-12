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
    loaner TEXT not null references Profiles(username),
    loanee TEXT not null references Profiles(username),
    stuffId INTEGER not null references Stuff(stuffId) ON DELETE CASCADE,
    loanerNum TEXT not null,
    loanerEmail TEXT not null,
    status TEXT not null,
    cost DECIMAL(10, 2) not null,
    startDate DATE not null,
    endDate DATE not null,
    bid DECIMAL(10, 2) not null,
    primary key (transId),
    check (startDate <= endDate),
    check (loaner <> loanee)
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
    ('janedoe', 'janedoe');
INSERT INTO admins VALUES
    ('johndoe');
INSERT INTO nonadmins VALUES
    ('janedoe');
INSERT INTO profiles VALUES
    ('johndoe', 'John Doe', 'picture?', '10 john road'),
    ('janedoe', 'Jane Doe', 'picture?', '10 jane road');
INSERT INTO stuff VALUES
    (1, 'picture?', 'book', 'johndoe', 1.50, 'its a book'),
    (2, 'picture?', 'car', 'johndoe', 2.50, 'its a car'),
    (3, 'picture?', 'car wash', 'janedoe', 3.50, 'its a car wash'),
    (4, 'picture?', 'math notes', 'janedoe', 4.50, 'its math notes');
INSERT INTO deliverables VALUES
    (1, 1.00);
INSERT INTO pickups VALUES
    (2, '10 john road');
INSERT INTO intangibles VALUES
    (4);
INSERT INTO services VALUES
    (3);
INSERT INTO transactions VALUES
    (1, 'johndoe', 'janedoe', 1, '83365620', 'johndoe@joe.com', 'FINISHED', 10.00, '2019-01-01', '2019-01-20', 12.42);
INSERT INTO reviews VALUES
    (1, 1, 5, 'good');
INSERT INTO ads VALUES
    (2, 'johndoe');

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

-- Prevent insertion if there are more than X overdue items to the same loaner
CREATE OR REPLACE FUNCTION check_overdue_loaner()
RETURNS trigger AS $$
DECLARE
  overdue_threshold NUMERIC;
BEGIN
    overdue_threshold := 5;
    IF (SELECT COUNT(*) FROM TRANSACTIONS where loanee=NEW.loanee AND loaner=NEW.loaner and status='ONGOING') > overdue_threshold THEN
        RAISE NOTICE 'You cannot borrow anymore items as you have more than % ongoing items overdue to %', overdue_threshold, NEW.loaner;
        RETURN NULL;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER check_overdue_loaner
BEFORE INSERT ON Transactions
FOR EACH ROW
EXECUTE PROCEDURE check_overdue_loaner();

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
