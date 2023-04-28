const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
  res.status(200).send('API tesis, PostgreSQL ON');
})

app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})