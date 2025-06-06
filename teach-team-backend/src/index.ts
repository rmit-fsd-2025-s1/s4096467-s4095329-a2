import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./data-source";
import userRoutes from "./routes/user.routes";
import cors from "cors";
import { UserController } from "./controller/UserController";
import { ClassesController } from "./controller/ClassesController";
import { ApolloServer } from "@apollo/server";
import { typeDefs } from "./graphql/schema";
import { resolvers } from "./graphql/resolvers";
import { expressMiddleware } from "@apollo/server/express4"

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

async function startServer(){
  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await apolloServer.start();

  app.use("/api", userRoutes);
  app.use("/graphql", expressMiddleware(apolloServer));

  AppDataSource.initialize().then(() => app.listen(PORT, () => {
    console.log("Data Source has been initialized!");
    console.log(`Server is running on port ${PORT}`);
    console.log(`GraphQL endpoint: https://localhost:${PORT}/graphql`);
    console.log(`REST API endpoint: https://localhost:${PORT}/api`);

    try
    {
      const userController = new UserController();
      const classesController = new ClassesController();
      userController.fillUsers().then(()=>{
        classesController.fillClasses();
      });
    }
    catch(e)
    {
      console.log("Failed to populate database: " + e);
    }
  }));
};

startServer().catch((error) =>
  console.log("Error during server initialization:", error)
);
