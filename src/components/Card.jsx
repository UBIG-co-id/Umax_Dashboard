export default function Card({ color, children }) {

    const renderColor = () => {
        switch (color) {
            case 'blue':
                return 'bg-sky-100 border border-sky-500'
            case 'green':
                return 'bg-green-100 border border-green-500'
            case 'yellow':
                return 'bg-yellow-100 border border-yellow-500'
            case 'red':
                return 'bg-red-100 border border-red-500'
            default:
                return 'bg-sky-100 border border-sky-500'
        }
    }

    return (
        <div className={`${renderColor()} rounded-lg p-4`}>
            {children}
        </div>
    )
}