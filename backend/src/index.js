import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import express from 'express';
import { fileURLToPath } from 'url';
import cors from 'cors';
// import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import http from 'http';
import { addAlias } from 'module-alias';
const __filename = fileURLToPath(import.meta.url);
const __dirname = __filename.substring(0, __filename.lastIndexOf('/'));

addAlias('@app', `${__dirname}/`);
import 'dotenv/config'
import './service/logger.js'
import { schema } from './graphql/schema.js';
// import { i18next, i18nextMiddleware } from './i18next/index.js';
import { authentication } from './middleware/authentication.js';

const app = express();
const httpServer = http.createServer(app);
const server = new ApolloServer({
  schema,
  path: '/',
  plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
});

await server.start();
app.use(
  '/',
  express.json(),
  bodyParser.json(),
  // cookieParser(),
  cors(),
  // graphqlUploadExpress(),
  // i18nextMiddleware.handle(i18next),
  authentication,
  expressMiddleware(server, {
    context: async ({ req }) => ({ 
      user: req.user,
      headers: req.headers,
      accessToken: req.accessToken,
      i18n: req.i18n 
    }),
  }),
)


app.options('*', cors())

// server.applyMiddleware({
//   app,
//   path: '/',
//   cors: true
// })


app.use('*', (req, res) => {
  res.status(404).send('404 Not Found')
})

await new Promise((resolve) => httpServer.listen({ port: process.env.APP_PORT }, resolve));
console.log(`🚀 Server ready at  http://localhost:${process.env.APP_PORT}`)
