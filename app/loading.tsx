export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF5EF]">
      <div className="text-center">
        <div className="relative w-16 h-16 mx-auto mb-4">
          <div className="absolute inset-0 border-4 border-classic-green/20 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-classic-green rounded-full animate-spin"></div>
        </div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  );
}
