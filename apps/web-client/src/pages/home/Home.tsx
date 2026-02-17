import { useNavigate } from 'react-router-dom';
import { HomeView } from './HomeView';

export const Home = () => {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate('/preset-selection');
  };

  const handleStartGoogleLogin = () => {
    window.location.assign('/api/auth/google/start');
  };

  return (
    <HomeView
      onStartWorkout={handleStartWorkout}
      onStartGoogleLogin={handleStartGoogleLogin}
    />
  );
};
