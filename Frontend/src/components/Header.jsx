import StartSmartIcon from "/w_startSmart_icon.png";

export const Header = () => {
  return (
    <nav className="absolute top-0 left-0 right-0 z-50 w-full bg-black/80 backdrop-blur-md supports-[backdrop-filter]:bg-black/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-16 md:h-18 lg:h-20">
          <div
            className="flex items-center space-x-3 md:space-x-4 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 rounded-lg p-1"
            tabIndex={0}
          >
            <div className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 rounded-lg flex items-center justify-center shadow-lg">
              <img
                src={StartSmartIcon}
                alt="StartSmart Logo"
                className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10"
              />
            </div>
            <span className="text-text-primary font-semibold text-xl md:text-2xl lg:text-3xl font-manrope whitespace-nowrap">
              StartSmart
            </span>
          </div>
        </div>
      </div>
    </nav>
  );
};
