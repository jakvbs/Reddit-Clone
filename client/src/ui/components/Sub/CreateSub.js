import SubForm from './SubForm';

const CreateSub = () => {
    return (
        <div className="flex bg-dark-400 w-screen h-screen">
            <div className="flex flex-col justify-center pl-6 m-auto">
                <div className="w-98">
                    <h1 className="mb-2 text-lg font-medium">Create a Community</h1>
                    <hr />
                    <SubForm />
                </div>
            </div>
        </div>
    );
};

export default CreateSub;
