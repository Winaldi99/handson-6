import { useMutation, useQuery } from '@tanstack/react-query';
import axios from '../utils/AxiosInstance';
import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import CommentFrom from '../components/CommentForm';

interface Comment {
  body: string,
  postId: number,
  user: {
    id: number
  }
}

const CommentEdit = async (data: Comment, id: string | undefined) => {
  return await axios.put(`comments/${id}`, data);
}

const fetchCommentDat = (id: string | undefined) => {
  return axios.get<Comment>(`/comments/${id}`);
}

const EditComment = () => {
  const { id } = useParams();
  
  const getTodoDat = useQuery({
    queryKey: ["CommentDat", id],
    queryFn: () => fetchCommentDat(id)
  });

  const { mutate, isSuccess, isPending } = useMutation({
    mutationFn: (data: Comment) => CommentEdit(data, id)
  });
  
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isSuccess) {
      navigate("/comments", { replace: true });
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
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-6">Edit Comment</h2>
      <CommentFrom isEdit={true} mutateFn={mutate} defaultInputData={getTodoDat.data?.data} />
    </div>
  );
}

export default EditComment