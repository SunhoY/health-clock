import { HomeView } from './HomeView';

export const Home = () => {
  const handleStartWorkout = () => {
    // TODO: 프리셋 선택 화면으로 라우팅
    // navigate('/preset-selection');
    console.log('프리셋 선택 화면으로 이동');
  };

  return <HomeView onStartWorkout={handleStartWorkout} />;
}; 