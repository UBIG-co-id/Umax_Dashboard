
export default function ContainerCard({ children }) {
    return (
        <div className='bg-white flex-grow mt-5 -ml-5  max-sm:rounded-xl shadow-xl rounded-e-xl flex flex-col w-8/12  max-sm:max-h-screen max-sm:overflow-scroll'>
            {children}
        </div>
    )
}