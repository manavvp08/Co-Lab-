import Spinner from "@/components/spinner";

const Loading = () => {
    return (
        <div className="w-screen h-screen flex justify-center items-center">
            {/* <div className="flex justify-center items-center"> */}
            <Spinner />
        </div>
    )
}

export default Loading;