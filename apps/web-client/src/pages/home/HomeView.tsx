interface HomeViewProps {
  onStartWorkout: () => void;
}

export const HomeView = ({ onStartWorkout }: HomeViewProps) => {
  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            'radial-gradient(circle at 15% 20%, rgba(56,189,248,0.18), transparent 30%), radial-gradient(circle at 85% 80%, rgba(14,165,233,0.16), transparent 35%)',
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex min-h-screen w-full max-w-5xl items-center justify-center px-6 pb-28 pt-16 sm:px-10 sm:pb-16">
        <section className="w-full max-w-3xl text-center">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-7xl">
            Health Clock
          </h1>
          <button
            onClick={onStartWorkout}
            className="fixed inset-x-6 z-10 rounded-full bg-cyan-400 px-9 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950 sm:static sm:inset-auto sm:bottom-auto sm:mt-12"
            style={{ bottom: 'max(1.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))' }}
          >
            운동 시작하기
          </button>
        </section>
      </div>
    </main>
  );
};
