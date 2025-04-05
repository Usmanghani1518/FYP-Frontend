import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import { Provider } from 'react-redux'
import { router } from './router.tsx'
import { store,persistor } from './redux/app.ts'
import { PersistGate } from 'redux-persist/integration/react';
// import { store,  } from './app/store';

createRoot(document.getElementById('root')!).render(
  <PersistGate loading={null} persistor={persistor}>
  <Provider store={store}>
   <RouterProvider router={router}/>
  </Provider>,
   </PersistGate>
)
