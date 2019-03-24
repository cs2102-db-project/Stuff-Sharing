# Stuff-Sharing

A stuff sharing portal for CS2102.


## How to set up this project:
1. This project requires the following: postgres, node
2. Create the following postgres databases: `database_development`, `database_test`, `database_production`
3. `cd server/`
4. Run `sequelize db:migrate` to create the necesary tables
5. Run `sequelize db:seed:all` to seed your database with sample values
6. `node bin/www` to run the server

