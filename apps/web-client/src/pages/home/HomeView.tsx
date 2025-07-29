interface HomeViewProps {
  onStartWorkout: () => void;
}

export const HomeView = ({ onStartWorkout }: HomeViewProps) => {
  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4">
      <div className="text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-2">
          Health Clock
        </h1>
        <p className="text-gray-300 text-lg mb-8">
          건강한 라이프스타일을 위한 운동 루틴을 시작해보세요
        </p>
        <button
          onClick={onStartWorkout}
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
        >
          운동 시작하기
        </button>
      </div>
    </div>
  );
};
