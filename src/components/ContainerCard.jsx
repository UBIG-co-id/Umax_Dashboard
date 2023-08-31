
export default function ContainerCard({ children, title }) {
    return (
        <div className='bg-white flex-grow mt-5 -ml-7 shadow-xl rounded-e-xl flex flex-col'>
            {children}
        </div>
    )
}