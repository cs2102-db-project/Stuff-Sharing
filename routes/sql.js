/* A script containing all queries needed. */

/* Create tables */
var migrate_database = "\
  CREATE TABLE IF NOT EXISTS Accounts(\
    username TEXT,\
    password TEXT not null,\
    primary key (username)\
  );\
  CREATE TABLE IF NOT EXISTS Admins(\
    username TEXT references Accounts(username),\
    primary key (username)\
  );\
  CREATE TABLE IF NOT EXISTS NonAdmins(\
    username TEXT references Accounts(username),\
    primary key (username)\
  );\
  CREATE TABLE IF NOT EXISTS Profiles(\
    username TEXT references Accounts(username)\
      on delete CASCADE,\
    name TEXT not null,\
    picture TEXT,\
    address VARCHAR(100),\
    primary key (username)\
  );\
  CREATE TABLE IF NOT EXISTS Stuff(\
    stuffId INTEGER,\
    picture TEXT,\
    name VARCHAR(100) not null,\
    owner TEXT not null,\
    description TEXT,\
    primary key (stuffId),\
    foreign key (owner) references Profiles(username)\
  );\
  CREATE TABLE IF NOT EXISTS Deliverables(\
    stuffId INTEGER references Stuff(stuffId),\
    deliveryCost FLOAT8 not null,\
    primary key (stuffId)\
  );\
  CREATE TABLE IF NOT EXISTS Pickups(\
    stuffId INTEGER references Stuff(stuffId),\
    pickupAddress VARCHAR(100) not null,\
    primary key (StuffId)\
  );\
  CREATE TABLE IF NOT EXISTS Intangibles(\
    stuffId INTEGER references Stuff(stuffId),\
    primary key (stuffId)\
  );\
  CREATE TABLE IF NOT EXISTS Services(\
    stuffId INTEGER references Stuff(stuffId),\
    primary key (stuffId)\
  );\
  CREATE TABLE IF NOT EXISTS Transactions(\
    transId INTEGER,\
    loaner TEXT not null,\
    loanee TEXT not null,\
    status TEXT not null,\
    cost DECIMAL(10, 2) not null,\
    startDate DATE not null,\
    endDate DATE,\
    primary key (transId)\
  );\
  CREATE TABLE IF NOT EXISTS Reviews(\
    reviewId INTEGER,\
    transId INTEGER not null references Transactions(transId),\
    rating INTEGER not null,\
    details TEXT not null,\
    primary key (reviewId),\
    check (rating >= 0 and rating <= 10)\
  );\
"


/* Seed tables */
var seed_database ="\
  DELETE FROM accounts;\
  DELETE FROM admins;\
  DELETE FROM nonadmins;\
  DELETE FROM profiles;\
  DELETE FROM stuff;\
  DELETE FROM deliverables;\
  DELETE FROM pickups;\
  DELETE FROM intangibles;\
  DELETE FROM services;\
  DELETE FROM transactions;\
  DELETE FROM reviews;\
  \
  INSERT INTO accounts VALUES\
    ('johndoe', 'johndoe'),\
    ('janedoe', 'janedoe');\
  INSERT INTO admins VALUES\
    ('johndoe');\
  INSERT INTO nonadmins VALUES\
    ('janedoe');\
  INSERT INTO profiles VALUES\
    ('johndoe', 'John Doe', 'picture?', '10 john road'),\
    ('janedoe', 'Jane Doe', 'picture?', '10 jane road');\
  INSERT INTO stuff VALUES\
    (1, 'picture?', 'book', 'johndoe', 'its a book'),\
    (2, 'picture?', 'car', 'johndoe', 'its a car'),\
    (3, 'picture?', 'car wash', 'janedoe', 'its a car wash'),\
    (4, 'picture?', 'math notes', 'janedoe', 'its math notes');\
  INSERT INTO deliverables VALUES\
    (1, 1.00);\
  INSERT INTO pickups VALUES\
    (2, '10 john road');\
  INSERT INTO intangibles VALUES\
    (4);\
  INSERT INTO services VALUES\
    (3);\
  INSERT INTO transactions VALUES\
    (1, 'johndoe', 'janedoe', 'ONGOING', 10.00, '2019-01-01', '2019-01-20');\
  INSERT INTO reviews VALUES\
    (1, 1, 10, 'good');\
"


module.exports.migrate_database = migrate_database;
module.exports.seed_database = seed_database;
