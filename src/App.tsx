import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { PostsProvider } from './contexts/PostsContext';

function App() {
  return (
    <BrowserRouter>
      <PostsProvider>
        <AppRoutes />
      </PostsProvider>
    </BrowserRouter>
  );
}

export default App;
