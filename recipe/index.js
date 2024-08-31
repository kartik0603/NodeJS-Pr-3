const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const PORT = 8090;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

let initialRecipe = [
  {
    name: 'Spaghetti Carbonara',
    description: 'A classic Italian pasta dish.',
    preparationTime: '15 minutes',
    cookingTime: '15',
    imageUrl: 'https://hips.hearstapps.com/hmg-prod/images/carbonara-index-6476367f40c39.jpg?crop=0.888888888888889xw:1xh;center,top&resize=1200:*',
    country: "Italy",
    veg: false,
    id: 1
  }
];


app.get('/', (req, res) => {
    res.send('welcome to the recipe api');
  });
  

// Route to fetch all recipes
app.get('/recipe/all', (req, res) => {
  res.json(initialRecipe);
});

// Route to serve the index.html 
app.get('/index', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route to serve the recipe.html 
app.get('/add', (req, res) => {
  res.sendFile(path.join(__dirname, 'recipe.html'));
});

// Route to add  new recipe
app.post('/recipe/add', (req, res) => {
  const { name, description, preparationTime, cookingTime, imageUrl, country, veg } = req.body;

  if (!name || !description || !preparationTime || !cookingTime || !imageUrl || !country) {
    return res.status(400).send('All fields are required');
  }

  const newRecipe = {
    name,
    description,
    preparationTime,
    cookingTime,
    imageUrl,
    country,
    veg: veg ? true : false,
    id: initialRecipe.length + 1
  };

  initialRecipe.push(newRecipe);
  res.json(initialRecipe);
});

// Route to update  existing recipe by Id
app.patch('/recipe/update/:id', (req, res) => {
  const { id } = req.params;
  const recipeIndex = initialRecipe.findIndex(recipe => recipe.id === parseInt(id));

  if (recipeIndex === -1) {
    return res.status(404).send('Recipe not found');
  }

  const updatedRecipe = { ...initialRecipe[recipeIndex], ...req.body };
  initialRecipe[recipeIndex] = updatedRecipe;
  res.json(initialRecipe);
});

// Route  delete a recipe by id
app.delete('/recipe/delete/:id', (req, res) => {
  const { id } = req.params;
  initialRecipe = initialRecipe.filter(recipe => recipe.id !== parseInt(id));

  res.json(initialRecipe);
});

// Route  filter and sort recipes 
app.get('/recipe/filter', (req, res) => {
  let { veg, sort, country } = req.query;
  let filteredRecipes = [...initialRecipe];

  if (veg !== undefined) {
    veg = veg === 'true';
    filteredRecipes = filteredRecipes.filter(recipe => recipe.veg === veg);
  }

  if (country) {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.country.toLowerCase() === country.toLowerCase());
  }

  if (sort) {
    if (sort === 'lth') {
      filteredRecipes.sort((a, b) => parseInt(a.cookingTime) - parseInt(b.cookingTime));
    } else if (sort === 'htl') {
      filteredRecipes.sort((a, b) => parseInt(b.cookingTime) - parseInt(a.cookingTime));
    }
  }

  res.json(filteredRecipes);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
