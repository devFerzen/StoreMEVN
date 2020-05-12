import express from 'express';
import http from 'http';
import config from './config';
import bodyParser from 'body-parser';
import morgan from 'morgan'; //Console loggs
import cors from 'cors'; //Peticiones remotas
import path from 'path'; //Now path
import mongoose from 'mongoose';
import router from './routes';

mongoose.connect(config.mongooseUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
})
.then(mongoose => console.log("coneccion successfully"))
.catch(err => console.log(err));

let app = express();
app.server = http.createServer(app);

//Middleware
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({
  extended:true
}));
app.use(bodyParser.json());

//Indicar los archivos publicos que estan en el mismo nivel
app.use(express.static(path.join(__dirname,'public')));

//Indicar la ruta principal
app.use('/api',router);
//Server
app.server.listen(config.port, () => {
  console.log(path.join(__dirname,'public'));
});
