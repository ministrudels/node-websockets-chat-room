import { useContext } from 'react';
import './App.css';
import { ChatRoom, Login } from './components';
import { UserContext } from './contexts/userContext';

const App = () => {
  const { isUserLoggedIn } = useContext(UserContext)

  return (
    <div className="app">
      {isUserLoggedIn &&
        <ChatRoom />
      }
      {!isUserLoggedIn &&
        <Login />
      }
    </div>
  );
}

export default App;