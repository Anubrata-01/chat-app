
import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "react-lottie";

const EmptyChatContainer = () => {
  return (
    <div className="flex-1.2 bg-[#101015] flex flex-col justify-center items-center p-4 duration-1000 transition-all">
      <div className="w-full max-w-[150px] sm:max-w-[200px] md:max-w-[200px]">
        <Lottie 
          isClickToPauseDisabled={true} 
          options={animationDefaultOptions}
        />
      </div>
      <div className="text-white flex flex-col gap-3 sm:gap-5 items-center mt-4 sm:mt-6 md:mt-10 text-center">
        <h3 className="poppins-medium text-xl sm:text-2xl md:text-3xl lg:text-4xl">
          Hi <span className="text-purple-300">!</span> Welcome to <span className="text-purple-300">Chat app</span>
        </h3>
        <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-[80%] sm:max-w-[70%] md:max-w-[60%]">
          Select a chat from the sidebar to start messaging or create a new conversation.
        </p>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
