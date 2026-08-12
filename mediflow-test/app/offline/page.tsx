"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#071B34] flex flex-col items-center justify-center text-white px-6">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-4xl shadow-2xl">
          ⚡
        </div>
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">You&apos;re Offline</h1>
        <p className="text-slate-300 text-sm leading-relaxed mb-8">
          Mediflow-AI requires a connection to load live hospital data. Please check your internet connection and try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg transition-all cursor-pointer"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
