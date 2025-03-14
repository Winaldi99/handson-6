import { useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance";
import { useNavigate } from "react-router-dom";

// Define the structure of a single recipe
interface Recipe {
  id: number;
  name: string;
  difficulty: string;
  image: string;
  rating: number;
}

// Define the structure of the response containing multiple recipes
interface RecipesList {
  recipes: Recipe[];
}

// Component to display a single recipe card
const RecipeCard: React.FC<Recipe> = (recipe: Recipe) => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl bg-white">
      <div className="relative h-48 overflow-hidden">
        <img
          alt={recipe.name}
          src={recipe.image}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {recipe.name}
        </h3>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-yellow-400 mr-1">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </span>
            <span className="text-sm font-medium text-gray-700">{recipe.rating}</span>
          </div>
          <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">
            {recipe.difficulty}
          </span>
        </div>
      </div>
    </div>
  );
}

// Function to fetch the list of recipes from the API
const fetchRecipesList = async () => {
  return await axios.get<RecipesList>("/recipes");
}

// Component to display a skeleton loader while recipes are being fetched
const RecipesSkeleton = () => {
  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md bg-white">
      <div className="relative h-48 bg-gray-200 animate-pulse"></div>
      
      <div className="p-4">
        <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4"></div>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-5 h-5 bg-gray-200 rounded-full animate-pulse mr-1"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          </div>
          <div className="h-6 bg-gray-200 rounded-full animate-pulse w-16"></div>
        </div>
      </div>
    </div>
  );
}

// Main Recipes component
const Recipes = () => {
  const getRecipesList = useQuery({ queryKey: ["recipeList"], queryFn: fetchRecipesList })
  const navigate = useNavigate();

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      <div className="container mx-auto px-4">
        <div className="py-8 md:py-12">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Delicious Recipes</h1>
            <p className="text-gray-600 max-w-xl mx-auto">Discover our collection of tasty recipes for every occasion</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {getRecipesList.isFetching ? 
              (Array.from({ length: 8 }).map((_, index) => (
                <RecipesSkeleton key={index} />
              ))) : 
              (getRecipesList.data?.data.recipes.map((recipe) => (
                <div key={recipe.id} 
                  className="cursor-pointer" 
                  onClick={() => navigate(`/recipes/${recipe.id}`)}
                >
                  <RecipeCard {...recipe} />
                </div>
              )))
            }
          </div>
        </div>
      </div>
      
      <button 
        className="fixed bottom-6 right-6 bg-blue-600 text-white rounded-full p-4 shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 z-10 transition-transform duration-300 hover:scale-110" 
        onClick={() => navigate("./add")}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
        </svg>
      </button>
    </div>
  )
}

export default Recipes; // Export the Recipes component