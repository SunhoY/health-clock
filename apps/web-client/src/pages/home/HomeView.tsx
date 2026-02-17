interface HomeViewProps {
  onStartWorkout: () => void;
  onStartGoogleLogin: () => void;
}

export const HomeView = ({
  onStartWorkout,
  onStartGoogleLogin,
}: HomeViewProps) => {
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
          <div
            data-testid="home-cta-stack"
            className="fixed inset-x-6 z-10 flex flex-col gap-3 sm:static sm:inset-auto sm:mx-auto sm:mt-12 sm:max-w-sm"
            style={{
              bottom: 'max(1.75rem, calc(env(safe-area-inset-bottom) + 0.75rem))',
            }}
          >
            <button
              onClick={onStartGoogleLogin}
              className="rounded-full border border-cyan-300/70 bg-slate-900/80 px-9 py-4 text-lg font-bold text-cyan-100 transition hover:border-cyan-200 hover:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              Google로 로그인
            </button>
            <button
              onClick={onStartWorkout}
              className="rounded-full bg-cyan-400 px-9 py-4 text-lg font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
            >
              GUEST로 시작하기
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};
