Run app
1: start DB
2: start app


Start DB:
cd /Users/tancrede/Documents/Developement/mongodb-osx-x86_64-2.2.2/bin
./mongod --dbpath '/Users/tancrede/Documents/Developement/Projets/TodoMap/data_db'


Start app:
cd /Users/tancrede/Documents/Developement/Projets/TodoMap/workspace/TodoMap
node app.js


Run tests
cd /Users/tancrede/Documents/Developement/Projets/TodoMap/workspace/TodoMap
Start tests servers: ./scripts/server.sh
Start tests : ./scripts/test.sh