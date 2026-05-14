import { RouterProvider } from 'react-router-dom'
import { router } from './app.routes'
import { AuthProvider } from './features/auth/auth.context'
import {InterviewProvider} from './features/interview/interview.context'
function App() {    

  return (
    <div className="App">
      <AuthProvider>
        <InterviewProvider>
          <RouterProvider router={router} />
        </InterviewProvider>
      </AuthProvider>
    </div>
  )
}

export default App
