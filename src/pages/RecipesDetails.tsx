import { useMutation, useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/AxiosInstance";
import { useEffect } from "react";

// Define the structure of a recipe's details
interface RecipeDetails {
  id: number;
  name: string;
  ingredients: string[];
  instructions: string[];
  prepTimeMinutes: number;
  cookTimeMinutes: number;
  servings: number;
  difficulty: string;
  cuisine: string;
  caloriesPerServing: number;
  tags: string[];
  userId: number;
  image: string;
  rating: number;
  mealType: string[];
}

// Define the structure of a deleted recipe
interface DeletedRecipe extends RecipeDetails {
  isDeleted: Boolean;
  deletedOn: string;
}

// Function to fetch the details of a specific recipe by its ID
export const fetchRecipeDetail = async (id: string | undefined) => {
  return await axios.get<RecipeDetails>(`/recipes/${id}`);
};

// Function to delete a recipe by its ID
const deleteRecipe = async (id: string | undefined) => {
  return await axios.delete<DeletedRecipe>(`recipes/${id}`);
};

// Component to display a skeleton loader while recipe details are being fetched
const RecipeDetailSkeleton = () => {
  return (
    <div className="container mx-auto p-4 animate-pulse">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Skeleton */}
        <div className="rounded-xl bg-gray-300 h-64 md:h-96"></div>

        {/* Details Skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-gray-300 rounded-md w-3/4"></div>
          <div className="h-6 bg-gray-300 rounded-md w-1/2"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/3"></div>
          <div className="h-4 bg-gray-300 rounded-md w-2/5"></div>
          <div className="h-4 bg-gray-300 rounded-md w-1/4"></div>
        </div>
      </div>

      {/* Ingredients and Instructions Skeleton */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
        <div>
          <div className="h-6 bg-gray-300 rounded-md w-1/2 mb-2"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded-md"></div>
            <div className="h-4 bg-gray-300 rounded-md"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display the recipe details
const RecipeContent: React.FC<RecipeDetails> = (recipe: RecipeDetails) => {
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <img
            src={recipe.image}
            alt={recipe.name}
            className="rounded-xl w-full object-cover h-64 md:h-96"
          />
        </div>

        {/* Recipe Details */}
        <div>
          <h1 className="text-3xl font-semibold mb-4">{recipe.name}</h1>
          <div className="flex items-center mb-2">
            <span className="text-yellow-500 mr-1">
              {/* Star Icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5"
              >
                <path
                  fillRule="evenodd"
                  d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.172 1.107-.536 1.651l3.62 3.104-1.415 4.692c-.218.72-.058 1.408.688 1.408l4.123-2.925 4.123 2.925c.746 0 .906-.688.688-1.408l-1.415-4.692 3.62-3.104c.635-.544.296-1.584-.536-1.651l-4.753-.381-1.83-4.401z"
                  clipRule="evenodd"
                />
              </svg>
            </span>
            <span>{recipe.rating}</span>
          </div>
          <p className="text-gray-600 mb-4">
            {recipe.cuisine} | {recipe.mealType.join(", ")}
          </p>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="font-semibold">Difficulty:</p>
              <p className="text-gray-700">{recipe.difficulty}</p>
            </div>
            <div>
              <p className="font-semibold">Cook Time:</p>
              <p className="text-gray-700">{recipe.cookTimeMinutes} mins</p>
            </div>
            <div>
              <p className="font-semibold">Prep Time:</p>
              <p className="text-gray-700">{recipe.prepTimeMinutes} mins</p>
            </div>
            <div>
              <p className="font-semibold">Servings:</p>
              <p className="text-gray-700">
                {recipe.servings} ({recipe.caloriesPerServing * recipe.servings} Cal)
              </p>
            </div>
          </div>
          <div>
            <p className="font-semibold">Tags:</p>
            <div className="flex flex-wrap gap-2">
              {recipe.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-200 rounded-full px-3 py-1 text-sm font-medium text-gray-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Ingredients and Instructions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
        {/* Ingredients */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
          <ul className="list-disc list-inside text-gray-700">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index}>{ingredient}</li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <ol className="list-decimal list-inside text-gray-700">
            {recipe.instructions.map((instruction, index) => (
              <li key={index} className="mb-2">
                {instruction}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
};

// Main Recipe Details component
const RecipesDetail = () => {
  const { id } = useParams();

  // Fetch the recipe details using React Query
  const getRecipeDetails = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id),
  });

  // Initialize mutation for deleting the recipe
  const deleteRecipeMutation = useMutation({
    mutationFn: () => deleteRecipe(id),
  });

  const recipe: RecipeDetails | undefined = getRecipeDetails.data?.data; // Extract recipe data

  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the recipes list page when the recipe is successfully deleted
  useEffect(() => {
    if (deleteRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [deleteRecipeMutation.isSuccess, navigate]);

  return (
    <div className="p-5">
      {getRecipeDetails.isFetching || recipe === undefined ? (
        <RecipeDetailSkeleton />
      ) : (
        <RecipeContent {...recipe} />
      )}
      <div className="fixed bottom-4 right-4 z-50">
        <div className="relative group">
          <button className="bg-blue-500 text-white rounded-full p-3 shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300 z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </button>
          <div className="absolute bottom-14 right-0 bg-white rounded-lg shadow-lg w-32 hidden group-focus-within:block">
            <button
              onClick={() => {
                navigate("edit");
              }}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
            >
              Edit
            </button>
            <button
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              onClick={() => {
                if (confirm("Are you sure want to delete this recipe ? ")) {
                  deleteRecipeMutation.mutate();
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipesDetail; // Export the RecipesDetail component
