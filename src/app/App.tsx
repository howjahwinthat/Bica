import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { useAuth } from '@/app/context/AuthContext';

export default function App() {
  return (
    <useAuth>
      <RouterProvider router={router} />
    </useAuth>
  );
}
