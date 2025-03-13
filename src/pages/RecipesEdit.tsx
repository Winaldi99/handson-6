import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../utils/AxiosInstance";
import RecipeForm, { Recipe } from "../components/RecipesForm";
import { fetchRecipeDetail } from "./RecipesDetails";

const editRecipe = async (data: Recipe, id: string | undefined) => {
  return await axios.put(`/recipes/${id}`, data);
};

const EditRecipes = () => {
  const { id } = useParams();

  const editRecipeMutation = useMutation({
    mutationFn: (data: Recipe) => editRecipe(data, id)
  });

  const getRecipeDetail = useQuery({
    queryKey: ["recipeDetail", id],
    queryFn: () => fetchRecipeDetail(id)
  });

  const navigate = useNavigate();
  useEffect(() => {
    if (editRecipeMutation.isSuccess) {
      navigate("/recipes", { replace: true });
    }
  }, [editRecipeMutation.isSuccess]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      {(editRecipeMutation.isPending || getRecipeDetail.isFetching) && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            <span className="text-2xl mr-4 text-gray-800">Updating...</span>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Edit Recipe</h2>
      <RecipeForm
        isEdit={true}
        mutateFn={editRecipeMutation.mutate}
        defaultInputData={getRecipeDetail.data?.data}
      />
    </div>
  );
};

export default EditRecipes;