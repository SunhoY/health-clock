import { useNavigate } from 'react-router-dom';
import { HomeView } from './HomeView';

export const Home = () => {
  const navigate = useNavigate();

  const handleStartWorkout = () => {
    navigate('/preset-selection');
  };

  return <HomeView onStartWorkout={handleStartWorkout} />;
}; 