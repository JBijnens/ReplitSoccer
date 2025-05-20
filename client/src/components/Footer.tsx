const Footer = () => {
  return (
    <footer className="bg-neutral-dark py-6 text-white mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <svg 
              className="text-white h-5 w-5 mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 512 512" 
              fill="currentColor"
            >
              <path d="M177.1 228.6L207.9 320h96.5l29.62-91.38L256 172.1L177.1 228.6zM255.1 0C114.6 0 .0001 114.6 .0001 256S114.6 512 256 512s255.1-114.6 255.1-255.1S397.4 0 255.1 0zM416.6 360.9l-85.4-1.297l-25.15 81.59C290.1 445.5 273.4 448 256 448s-34.09-2.523-50.09-6.797L180.8 359.6l-85.4 1.297c-18.12-27.66-29.15-60.27-30.88-95.31L137.8 233.3L109.5 147.2C134.2 104.8 171.8 71.21 217.7 55.34L256 125.9l38.3-70.53c45.95 15.87 83.54 49.45 108.2 91.86l-28.28 86.1l73.31 32.37C446.1 300.6 434.7 333.2 416.6 360.9z" />
            </svg>
            <h2 className="text-xl font-heading font-bold">TeamPresence</h2>
          </div>
          <div className="text-neutral-medium text-sm">
            &copy; {new Date().getFullYear()} TeamPresence. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
