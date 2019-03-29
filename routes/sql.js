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

module.exports.migrate_database = migrate_database;
