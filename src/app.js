const express = require("express");
const cors = require("cors");
const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// lista todos os repositórios
app.get("/repositories", (request, response) => {
   return response.json(repositories)
});

// Recebe title, url e techs dentro do corpo da requisição
app.post("/repositories", (request, response) => {
  
  const { title, url, techs } = request.body;

  const repository = {
    id: uuid(),
    title,
    techs,
    likes: 0,
    url,
  };

  repositories.push(repository);

  return response.json(repository);

});

/*altera apenas o título, a url e as techs do repositório que possua o id igual
* ao id presente nos parâmetros da rota;
*/
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(
    repository => repository.id === id
  );

  if(repositoryIndex < 0){
    return response.status(400).json({error:'Repository not found.'});
  }
  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes,
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

//Deleta o repositório com o id presente nos parâmetros da rota.
app.delete('/repositories/:id', (req, res) => {
  const { id } = req.params;

  const repositoryIndex = repositories.findIndex(
    (repository) => repository.id === id
  );

  if(repositoryIndex < 0){
    return res.status(400).json({ error: 'Repository not found.'});
  }

  repositories.splice(repositoryIndex, 1);

  return res.status(204).send();

});

/* aumentar o número de likes do repositório específico escolhido através do id
* presente nos parâmetros da rota
*/
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repository = repositories.find((repository) => repository.id === id);

  if(!repository){
    return response.status(400).json({error: 'Repository not found.'});
  }

  repository.likes += 1;
  
  return response.status(202).json(repository);

});

module.exports = app;
