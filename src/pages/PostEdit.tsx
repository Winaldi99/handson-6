import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PostForm from '../components/PostForm';

// Define the structure of a post
interface postDat {
  title: string;
  body: string;
  tags: string[];
  reactions: reactionType;
  views: number;
  userId: number;
}

// Define the structure of reactions
interface reactionType {
  likes: number;
  dislikes: number;
}

// Function to fetch the details of a specific post by its ID
export const fetchPostDetail = async (id: string | undefined) => {
  return await axios.get<postDat>(`/post/${id}`);
};

// Function to update a post via API
const editPost = async (data: postDat, id: string | undefined) => {
  return await axios.put(`/posts/${id}`, data);
};

// Define the PostEdit component
const PostEdit = () => {
  const { id } = useParams(); // Get the post ID from the URL parameters

  // Initialize mutation for updating the post
  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: postDat) => editPost(data, id), // Mutation function to handle the update
  });

  // Fetch the post data using React Query
  const getPostData = useQuery({
    queryKey: ['postDatDetail', id],
    queryFn: () => fetchPostDetail(id),
  });

  const navigate = useNavigate(); // Hook for navigation

  // Redirect to the posts page when the mutation is successful
  useEffect(() => {
    if (isSuccess) {
      navigate('/posts', { replace: true });
    }
  }, [isSuccess]);

  return (
    <div className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-8 mt-10">
      {isPending && (
        <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="flex items-center bg-white/90 px-6 py-3 rounded-lg shadow-lg">
            <span className="text-2xl mr-4 text-gray-800">Updating...</span>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Edit Post</h2>
      <PostForm isEdit={true} mutateFn={mutate} defaultInputData={getPostData.data?.data} />
    </div>
  );
};

export default PostEdit; // Export the PostEdit component