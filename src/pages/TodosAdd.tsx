import { useMutation } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import TodoForm from '../components/TodoForm';

// Define the structure of a Todo item
interface Todo {
  todo : string,
  completed : boolean,
  userId : number
}

// Function to add a new todo via API
const TodoAdd = async (data : Todo) =>{
  return await axios.post("/todo/add", data);
}

// Define the AddTodo component
const AddTodo = () => {
  // Initialize mutation for adding a todo
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: TodoAdd // Function to handle the mutation
  });
  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the todo list page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate("/todo", { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="bg-gray-100 min-h-screen py-10">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
        </div>
        
        <div className="bg-white shadow-lg rounded-xl overflow-hidden relative">
          {isPending && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="bg-white shadow-lg rounded-lg px-6 py-4 flex items-center">
                <svg className="animate-spin h-6 w-6 text-gray-800 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span className="text-lg font-medium text-gray-800">Creating todo...</span>
              </div>
            </div>
          )}
          
          <div className="px-8 py-6 bg-gray-800">
            <h2 className="text-3xl font-bold text-white">Create New Todo</h2>
            <p className="text-blue-100 mt-2">Add a new task to your todo list</p>
          </div>
          
          <div className="p-8">
            <TodoForm isEdit={false} mutateFn={mutate} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddTodo; // Export the AddTodo component