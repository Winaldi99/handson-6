import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "../utils/AxiosInstance"
import {useNavigate} from "react-router-dom";

// Define the structure of a post
interface postData {
  id: number,
  title: string,
  body: string,
  tags: string[],
  reactions: reactionType,
  views: number,
  userId: number
}

// Define the structure of reactions
interface reactionType {
  likes: number,
  dislikes: number
}

// Define the structure of the response containing multiple posts
interface postList {
  posts: postData[]
}

// Function to fetch posts from the API
const fetchPostData = async () => {
  return await axios.get<postList>("/post");
}

// Define the structure of a deleted post
interface DeletedPost extends postData {
  isDeleted: Boolean;
  deletedOn: string;
}

// Function to delete a post by its ID
const deletePost = async (id: string | undefined) => {
  return await axios.delete<DeletedPost>(`post/${id}`);
};

// Component to display a single post card
const PostCard : React.FC<postData> = (post : postData) =>{
  const deletePostMutation = useMutation({
    mutationFn: (id : string) => deletePost(id) // Mutation function to delete a post
  });
  const navigate = useNavigate(); // Hook for navigation
  return(
    <div className="bg-white shadow-lg rounded-xl overflow-hidden transform transition-all hover:shadow-xl">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white">
              <span className="font-semibold">{post.userId}</span>
            </div>
            <p className="font-medium text-gray-800">Anonymous {post.userId}</p>
          </div>
          
          <div className="relative group">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <svg className="w-5 h-5 text-gray-600" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" stroke-linecap="round" stroke-linejoin="round"></path>
              </svg>
            </button>
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg z-10 hidden group-focus-within:block">
              <button
                onClick={() => navigate(`${post.id}/edit`)}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 rounded-t-md"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                  Edit
                </div>
              </button>
              <button
                onClick={() => {
                  if (confirm("Are you sure want to delete this post?")) {
                    deletePostMutation.mutate(post.id.toString());
                  }
                }}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-md"
              >
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                  </svg>
                  Delete
                </div>
              </button>
            </div>
          </div>
        </div>
        
        <h2 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h2>
        <div className="prose prose-sm text-gray-600 mb-4 line-clamp-3">
          {post.body}
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((tag) => (
            <span className="bg-blue-100 text-gray-800 text-xs font-medium px-2.5 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="flex items-center text-gray-500">
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{post.views}</span>
          </div>
          
          <div className="flex space-x-4">
            <button className="flex items-center text-gray-500 hover:text-blue-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
              </svg>
              <span>{post.reactions.likes}</span>
            </button>
            
            <button className="flex items-center text-gray-500 hover:text-red-600">
              <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"></path>
              </svg>
              <span>{post.reactions.dislikes}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Skeleton loader for posts
const PostSkeleton = () => {
  return (
    <div className="bg-white shadow-lg rounded-xl overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
          </div>
          <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
        </div>
        
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
        <div className="space-y-2 mb-4">
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
        </div>
        
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div className="h-6 bg-gray-200 rounded w-12 animate-pulse"></div>
        </div>
        
        <div className="flex justify-between items-center pt-4 border-t border-gray-200">
          <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
          <div className="flex space-x-4">
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
            <div className="h-5 bg-gray-200 rounded w-16 animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Post component
const Post = () => {
  const getPostData = useQuery({ queryKey: ["postDat"], queryFn: fetchPostData }); // Fetch posts using React Query
  const navigate = useNavigate(); // Hook for navigation
  
  return (
    <div className="bg-gray-100 min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Posts</h1>
          <button 
            onClick={() => navigate("./add")}
            className="flex items-center gap-2 bg-gray-700 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            Create Post
          </button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-1">
          {getPostData.isFetching ? (
            Array.from({length: 3}).map((_, index) => <PostSkeleton key={index} />)
          ) : (
            getPostData.data?.data.posts.map((post) => (
              <PostCard key={post.id} {...post} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Post; // Export the Post component