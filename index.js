const express = require('express');
const mongoose = require('mongoose');

const kittySchema = new mongoose.Schema({
  name: String
});

const Kitten = mongoose.model('Kitten', kittySchema);

const app = express();
const port = 3000;

app.use(express.json())
app.use(express.urlencoded())

const CONNECTION_STRING = "mongodb://54.179.183.169:27017/local?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.10.6"
async function connect() {
  await mongoose.connect(CONNECTION_STRING);
  console.log('Connected mongodb')
}

connect().catch(err => console.log(err));


app.get('/', (req, res) => {
	// res.send('Hello World!');
  res.send('<h1>sol</h1>')
});

app.get('/kittens', async (req, res) => {
  const kittens = await Kitten.find()
  let message = ''
  if (!kittens.length) message = 'Oops, you haven\'t adopted any kittens!'
  else message = `you currently have ${kittens.length} kittens: ${kittens.map(el => el.name).join(', ')}`

  res.send(`
    <p>${message}</p>

    <form id="create" action="/kittens" method="post">
      <input name="name"> </input>
      <button type="submit">adopt now</button>
    </form>
    <form id="delete" action="/kittens/delete" method="post">
      <input name="name"> </input>
      <button type="submit">kill</button>
    </form>
  `)
})
app.post('/kittens', async (req, res) => {
  const { name } = req.body
  const newKitten = new Kitten({ name })
  await newKitten.save()
  res.redirect('/kittens')
  // res.send(`Oh, say hi to new kitten: ${name}`)
})

app.post('/kittens/delete', async (req, res) => {
  const { name } = req.body
  await Kitten.deleteMany({ name })
  // res.send(`Great, you\'ve just successfully killed ${name}`)
  res.redirect('/kittens')

})
app.listen(port, () => {
	console.log(`Example app listening on port ${port}`);
});
