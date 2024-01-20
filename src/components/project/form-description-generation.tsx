import { api } from '@/utils/api';
import Spinner from '@/components/spinner';

const GeneratedDescriptions = ({ description, setDescription }: { description: string, setDescription?: React.Dispatch<React.SetStateAction<string>> }) => {

    const { data: generatedDescription } = api.openai.generateDescription.useQuery({ description });

    if (!generatedDescription) return (
        <div className="flex justify-center items-center">
            <Spinner />
        </div>
    );

    return (
        <div className='flex flex-row justify-between'>
            <p>Suggested Generated Description: {generatedDescription}</p>
        </div >
    );
}

export default GeneratedDescriptions;