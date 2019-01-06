const express = require('express');
const bodyParser = require('body-parser');
const expressGraphql = require('express-graphql');
const mongoose = require('mongoose');
const schema = require('./graphql/schema/index');
const resolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/is-auth');

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use('/graphql', expressGraphql({
    schema,
    rootValue: resolvers,
    graphiql:true
}));


mongoose.connect(`mongodb://localhost/db`,{useNewUrlParser:true}).then(()=>{
    app.listen(3000);
}).catch(e=>console.log(e));

