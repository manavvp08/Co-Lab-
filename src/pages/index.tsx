import Loading from "@/components/loading";
import { useSession } from "next-auth/react";

const Home = () => {

  const { data: sessionData, status } = useSession();

  if (status === "loading") {
    return <Loading />;
  }

  return (
    <div className="flex flex-col items-center justify-center w-full h-full pb-20 dark:bg-slate-800">
      <div className="w-full mb-20">
        <div className="text-center mt-20">
          <h1 className="text-3xl lg:text-5xl md:text-5xl xl:text-5xl font-extrabold text-gray-800 dark:text-white mb-6">Welcome{sessionData?.user?.name ? `, ${sessionData?.user?.name}` : ""}.</h1>
          <p className="text-lg text-gray-600 dark:text-gray-200 mb-3">Get onboard now for an adventure!</p>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-7 justify-center items-center">
      </div>
    </div>
  );
};

export default Home;