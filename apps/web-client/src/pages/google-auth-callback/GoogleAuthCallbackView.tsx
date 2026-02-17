interface GoogleAuthCallbackViewProps {
  title: string;
  description: string;
  showHomeButton?: boolean;
  onGoHome?: () => void;
}

export const GoogleAuthCallbackView = ({
  title,
  description,
  showHomeButton = false,
  onGoHome,
}: GoogleAuthCallbackViewProps) => {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-5rem)] w-full max-w-md flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black tracking-tight">{title}</h1>
        <p className="mt-3 text-sm text-slate-300">{description}</p>

        {showHomeButton ? (
          <button
            onClick={onGoHome}
            className="mt-8 w-full rounded-full bg-cyan-400 px-6 py-4 text-base font-bold text-slate-950 transition hover:bg-cyan-300 focus:outline-none focus:ring-2 focus:ring-cyan-200 focus:ring-offset-2 focus:ring-offset-slate-950"
          >
            홈으로 이동
          </button>
        ) : null}
      </div>
    </main>
  );
};
