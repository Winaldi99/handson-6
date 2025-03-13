import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from "react-router-dom";
import RootLayout from "./layouts/RootLayout";
import Product from "./pages/Product";
import ProductDetail from "./pages/ProductDetail";
import Post from "./pages/Post";
import PostAdd from "./pages/PostAdd";
import PostEdit from "./pages/PostEdit";
import Recipes from "./pages/Recipes";
import RecipesDetail from "./pages/RecipesDetails";
import RecipesEdit from "./pages/RecipesEdit";
import RecipesAdd from "./pages/RecipesAdd";
import Comments from "./pages/Comments";
import CommentAdd from "./pages/CommentsAdd";
import CommentEdit from "./pages/CommentsEdit";
import Home from "./pages/Home";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";

const queryClient = new QueryClient()

function App() {
	const router = createBrowserRouter(createRoutesFromElements(
		<Route path="/" element={<RootLayout />}>
			<Route index element={<Home/>} />
			<Route path="product" element={<Product />} />
			<Route path="product/add" element={<AddProduct />} />
			<Route path="product/:id" element={<ProductDetail/>}/>
			<Route path="product/:id/edit" element={<EditProduct/>}/>
			<Route path="posts" element={<Post />} />
			<Route path="posts/add" element={<PostAdd />} />
			<Route path="posts/:id/edit" element={<PostEdit />} />
			<Route path="recipes/:id/edit" element={<RecipesEdit/>}/>
			<Route path="recipes" element={<Recipes />} />
			<Route path="recipes/add" element={<RecipesAdd />} />
			<Route path="recipes/:id" element={<RecipesDetail />} />
			<Route path="/comments" element={<Comments/>}/>
			<Route path="comments/add"element={<CommentAdd/>} />
			<Route path="comments/:id/edit" element={<CommentEdit/>}/>
			

			
		</Route>
	));
	return (
		<>
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
			</QueryClientProvider>
		</>
	)
}

export default App