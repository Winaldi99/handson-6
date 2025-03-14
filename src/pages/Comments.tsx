import { useMutation, useQuery } from '@tanstack/react-query'
import axios from '../utils/AxiosInstance'
import { useNavigate } from 'react-router-dom'

// Define the structure of a single comment
interface Comment {
    id: number,
    body: string,
    postId: number,
    likes: number
    user: {
        id: number,
        username: string,
        fullName: string
    }
}

// Define the structure of the response containing multiple comments
interface Comments {
    comments: Comment[]
}

// Define the structure of a deleted comment
interface DeletedComment extends Comment {
    isDeleted: Boolean;
    deletedOn: string;
}

// Function to fetch comments from the API
const fetchCommentsDat = async () => {
    return axios.get<Comments>('/comments')
}

// Function to delete a comment by its ID
const deleteComments = async (id: string | undefined) => {
    return await axios.delete<DeletedComment>(`comments/${id}`);
};

// Component to display a skeleton loader while comments are being fetched
const CommentsSkeleton = () => {
    return (
        <div className='bg-slate-100 rounded-lg shadow-md p-4 mb-4'>
            <div className='flex items-center gap-3 mb-3'>
                <div className="bg-slate-300 animate-pulse h-12 w-12 rounded-full"></div>
                <div className='flex-1'>
                    <div className="bg-slate-300 animate-pulse h-5 w-32 rounded mb-2"></div>
                    <div className="bg-slate-300 animate-pulse h-3 w-24 rounded"></div>
                </div>
                <div className="bg-slate-300 animate-pulse h-6 w-6 rounded-full"></div>
            </div>
            <div className="bg-slate-300 animate-pulse h-16 w-full rounded mb-3"></div>
            <div className='flex justify-between items-center'>
                <div className="bg-slate-300 animate-pulse h-4 w-24 rounded"></div>
                <div className="bg-slate-300 animate-pulse h-4 w-8 rounded"></div>
            </div>
        </div>
    );
}

// Main component to display and manage comments
const Comments = () => {
    // Fetch comments using React Query
    const getCommentDat = useQuery({
        queryKey: ["comments"],
        queryFn: fetchCommentsDat
    });

    // Mutation to delete a comment
    const deleteCommentDat = useMutation(
        { mutationFn: (id: string) => deleteComments(id) }
    )

    const navigate = useNavigate(); // Hook for navigation

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8">
            <div className="max-w-4xl mx-auto px-4">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Comments</h1>
                    <p className="text-slate-600">Join the conversation</p>
                </header>

                <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
                    <div className="max-h-[70vh] overflow-y-auto pr-2 space-y-4">
                        {getCommentDat.isFetching ?
                            Array.from({ length: 3 }).map((_, index) => <CommentsSkeleton key={index} />)
                            : getCommentDat.data?.data.comments.map((comment) => (
                                <div key={comment.id} className="bg-white border border-slate-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="flex-shrink-0">
                                            <div className="h-12 w-12 rounded-full bg-gray-600 flex items-center justify-center text-white">
                                                {comment.user.fullName.charAt(0)}
                                            </div>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-medium text-slate-800">{comment.user.fullName}</h3>
                                            <p className="text-xs text-slate-500">@{comment.user.username}</p>
                                        </div>
                                        <div className="relative group">
                                            <button className="p-2 rounded-full hover:bg-slate-100">
                                                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                                </svg>
                                            </button>
                                            <div className="absolute right-0 mt-1 invisible group-focus-within:visible bg-white rounded-md shadow-lg border border-slate-200 w-32 py-1 z-10">
                                                <button
                                                    onClick={() => navigate(`${comment.id}/edit`)}
                                                    className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-indigo-50 hover:text-indigo-700">
                                                    Edit
                                                </button>
                                                <button
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                                    onClick={() => {
                                                        if (confirm("Are you sure you want to delete this comment?")) {
                                                            deleteCommentDat.mutate(comment.id.toString());
                                                        }
                                                    }}>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="py-2 text-slate-700">
                                        <p>{comment.body}</p>
                                    </div>
                                    <div className="flex justify-between items-center pt-2 mt-2 border-t border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <button className="flex items-center gap-1 text-slate-500 hover:text-indigo-600">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"></path>
                                                </svg>
                                                <span>{comment.likes}</span>
                                            </button>
                                        </div>
                                        <span className="text-xs text-slate-400">ID: {comment.id}</span>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                </div>

                <button 
                    onClick={() => navigate("./add")}
                    className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}

export default Comments // Export the Comments component