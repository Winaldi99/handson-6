import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../utils/AxiosInstance'
import { useNavigate } from 'react-router-dom'
import { useState } from 'react'

interface Todo {
    id: number,
    todo: string,
    completed: boolean,
    userId: number
}

interface TodoList {
    todos: Todo[] 
}

interface DeletedTodo extends Todo {
    isDeleted: Boolean;
    deletedOn: string;
}

const fetchTodoList = async () => {
    return axios.get<TodoList>('/todo')
}

const deleteTodo = async (id: string | undefined) => {
    return await axios.delete<DeletedTodo>(`todo/${id}`);
};

const TodoSkeleton = () => {
    return (
        <div className="mb-4 p-4 border border-gray-200 rounded-lg shadow-sm">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="h-4 w-4 bg-gray-200 rounded-sm animate-pulse"></div>
                    <div className="h-5 w-64 bg-gray-200 rounded-md animate-pulse"></div>
                </div>
                <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
            <div className="mt-3 h-0.5 w-full bg-gray-100 animate-pulse"></div>
            <div className="mt-2 flex justify-end">
                <div className="h-3 w-5 bg-gray-200 animate-pulse"></div>
            </div>
        </div>
    )
}

const Todo = () => {
    const [activeMenu, setActiveMenu] = useState<number | null>(null);
    
    const getTodoList = useQuery({
        queryKey: ["Todo"],
        queryFn: fetchTodoList
    });

    const deleteTodoMutation = useMutation(
        {
            mutationFn: (id: string) => deleteTodo(id),
            onSuccess: () => {
                getTodoList.refetch();
            }
        }
    )

    const navigate = useNavigate();
    
    const toggleMenu = (todoId: number) => {
        if (activeMenu === todoId) {
            setActiveMenu(null);
        } else {
            setActiveMenu(todoId);
        }
    };

    // Close menu when clicking outside
    const handleClickOutside = () => {
        setActiveMenu(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-8" onClick={handleClickOutside}>
            <div className="max-w-3xl mx-auto px-4">
                <div className="bg-white rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-gray-800 px-6 py-4">
                        <h1 className="text-2xl font-bold text-white">My Todo List</h1>
                    </div>
                    
                    <div className="px-6 py-6">
                        <div className="flex justify-between items-center mb-6">
                            <p className="text-gray-500 text-sm">
                                {getTodoList.data?.data.todos.length || 0} tasks
                            </p>
                            <button 
                                onClick={() => navigate("./add")}
                                className="bg-gray-700 hover:bg-gray-900 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors duration-300"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                Add Task
                            </button>
                        </div>
                        
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {getTodoList.isFetching ? 
                                Array.from({length: 6}).map((_, index) => <TodoSkeleton key={index} />) : 
                                getTodoList.data?.data.todos.map((todo) => (
                                    <div 
                                        key={todo.id} 
                                        className={`p-4 rounded-lg transition-all duration-300 ${
                                            todo.completed ? 
                                            'bg-gray-50 border border-gray-100' : 
                                            'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                                        }`}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className={`h-5 w-5 rounded flex items-center justify-center ${
                                                    todo.completed ? 'bg-green-100 text-green-600' : 'border border-gray-300'
                                                }`}>
                                                    {todo.completed && (
                                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                        </svg>
                                                    )}
                                                </div>
                                                <p className={`${
                                                    todo.completed ? 
                                                    'text-gray-400 line-through' : 
                                                    'text-gray-800'
                                                }`}>
                                                    {todo.todo}
                                                </p>
                                            </div>
                                            
                                            <div className="relative">
                                                <button 
                                                    className="text-gray-500 hover:text-indigo-600 p-1 rounded-full hover:bg-indigo-50 transition-colors duration-200"
                                                    onClick={() => toggleMenu(todo.id)}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
                                                    </svg>
                                                </button>
                                                {activeMenu === todo.id && (
                                                    <div className="absolute right-0 mt-2 w-36 bg-white rounded-md shadow-lg overflow-hidden z-10">
                                                        <button 
                                                            onClick={() => {
                                                                navigate(`${todo.id}/edit`);
                                                                setActiveMenu(null);
                                                            }}
                                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 flex items-center gap-2"
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                                                            </svg>
                                                            Edit
                                                        </button>
                                                        <button 
                                                            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                                            onClick={() => {
                                                                if (confirm("Are you sure you want to delete this task?")) {
                                                                    deleteTodoMutation.mutate(todo.id.toString());
                                                                }
                                                                setActiveMenu(null);
                                                            }}
                                                        >
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                                                            </svg>
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        {todo.userId && (
                                            <div className="mt-3 pt-2 border-t border-gray-100">
                                                <div className="flex justify-end">
                                                    <span className="text-xs text-gray-400">User ID: {todo.userId}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Todo