import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import TodoForm from '../components/TodoForm';

// Define the structure of a Todo item
interface Todo {
  todo : string,
  completed : boolean,
  userId : number
}

// Function to update a todo via API
const TodoEdit = async (data: Todo, id: string | undefined) => {
  return await axios.put(`/todo/${id}`, data);
};

// Function to fetch the details of a specific todo by its ID
const fetchTodoDat = (id: string | undefined) => {
  return axios.get<Todo>(`/todo/${id}`);
}

// Define the EditTodo component
const EditTodo = () => {
  const { id } = useParams();
  
  // Fetch the todo data using React Query
  const getTodoDat = useQuery({
    queryKey: ["TodoDat", id],
    queryFn: () => fetchTodoDat(id)
  });

  const navigate = useNavigate(); // Hook for navigation

  // Initialize mutation for updating the todo
  const editTodoMutation = useMutation({
    mutationFn: (data: Todo) => TodoEdit(data, id) // Mutation function to handle the update
  });

  // Redirect to the todo list page when the mutation is successful
  useEffect(() => {
    if (editTodoMutation.isSuccess) {
      navigate("/todo", { replace: true });
    }
  }, [editTodoMutation.isSuccess]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      {editTodoMutation.isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            <span className="text-2xl mr-4 text-gray-800">Updating...</span>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Edit Todo</h2>
      <TodoForm isEdit={true} mutateFn={editTodoMutation.mutate} defaultInputData={getTodoDat.data?.data} />
    </div>
  );
}

export default EditTodo; // Export the EditTodo component