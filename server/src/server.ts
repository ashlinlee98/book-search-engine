import { ApolloServer } from 'apollo-server-express';
import express, { Application } from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';
import { authenticateToken } from './services/auth.js';
import typeDefs from './schemas/typeDefs.js';
import resolvers from './schemas/resolvers.js';

const app = express() as Application;
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

app.use(routes);

const startApolloServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => {
      const token = req.headers.authorization?.split(' ')[1]; 
      if (!token) {
        return { user: null }; 
      }

      const user = authenticateToken(token); 
      return { user }; 
    },
  });

  await server.start();
  server.applyMiddleware({ app });

  db.once('open', () => {
    app.listen(PORT, () => {
      console.log(`🌍 Server listening on http://localhost:${PORT}`);
      console.log(`🚀 GraphQL available at http://localhost:${PORT}${server.graphqlPath}`);
    });
  });
};

startApolloServer();
