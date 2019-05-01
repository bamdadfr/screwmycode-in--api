const express = require('express')
const graphqlHTTP = require('express-graphql');
const { buildSchema } = require('graphql');

const app = express()
const port = 3000

app.get('/', (req, res) => res.send('Hello World!'))

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
