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
CREATE TABLE IF NOT EXISTS Transactions(
    transId INTEGER,
    loaner TEXT not null references Profiles(username),
    loanee TEXT not null references Profiles(username),
    itemId INTEGER not null references Stuff(stuffId),
    status TEXT not null,
    cost DECIMAL(10, 2) not null,
    startDate DATE not null,
    endDate DATE,
    primary key (transId),
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
    check (rating >= 0 and rating <= 10)
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
    (1, 'johndoe', 'janedoe', 'book', 'ONGOING', 10.00, '2019-01-01', '2019-01-20');
INSERT INTO reviews VALUES
    (1, 1, 10, 'good');
