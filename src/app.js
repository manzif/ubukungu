import express, { json, urlencoded } from 'express';
import cors from 'cors'
import routes from './routes';

const app = express();

app.use(cors())
app.use(urlencoded({ extended: false }));
app.use(json())
app.use(routes);

const PORT = process.env.PORT || 4000;

app.get('/test', async (req, res) => {
    res.json({ status: true, message: "Our node.js app works" })
});

app.use((req, res) => {
  res.status(404).json({
      message: 'Endpoint not found. Please read the project documentation'
  })
});

app.listen(PORT, () => console.log(`App listening at port ${PORT}`));
