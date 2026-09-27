export default function AdminLoading() {
  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto w-full h-full animate-pulse">
      <div className="h-8 bg-white/5 rounded-lg w-1/4 shrink-0"></div>
      
      <div className="flex flex-col lg:flex-row gap-4 flex-1">
        <div className="w-full lg:w-72 shrink-0 h-64 bg-white/5 rounded-xl"></div>
        <div className="flex-1 bg-white/5 rounded-xl"></div>
      </div>
    </div>
  );
}
