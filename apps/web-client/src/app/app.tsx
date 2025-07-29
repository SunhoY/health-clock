import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Home } from '../pages/home';
import { PresetSelection } from '../pages/preset-selection';
import { CreateRoutine } from '../pages/create-routine';
import { ExerciseSelection } from '../pages/exercise-selection';
import { ExerciseDetail } from '../pages/exercise-detail';
import { RoutineTitle } from '../pages/routine-title';
import { Workout } from '../pages/workout';
import { WorkoutComplete } from '../pages/workout-complete';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/preset-selection" element={<PresetSelection />} />
        <Route path="/create-routine" element={<CreateRoutine />} />
        <Route path="/exercise-selection/:bodyPart" element={<ExerciseSelection />} />
        <Route path="/exercise-detail/:bodyPart/:exerciseId" element={<ExerciseDetail />} />
        <Route path="/routine-title" element={<RoutineTitle />} />
        <Route path="/workout" element={<Workout />} />
        <Route path="/workout-complete" element={<WorkoutComplete />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
