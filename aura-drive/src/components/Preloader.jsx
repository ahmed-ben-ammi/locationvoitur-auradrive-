export default function Preloader({ isFading }) {
  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#F9F6F0] dark:bg-[#121212] transition-opacity duration-500 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"}`}
    >
      <div className="relative w-12 h-12">
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#C17767] border-r-[#C17767] animate-spin"></div>
      </div>
    </div>
  );
}
