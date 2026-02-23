import { useEffect, useState } from 'react'

interface Item {
    id: number
    name: string
    description: string
}

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

function App() {
    const [items, setItems] = useState<Item[]>([])
    const [name, setName] = useState('')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchItems()
    }, [])

    const fetchItems = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/items`)
            const data = await response.json()
            setItems(data)
        } catch (error) {
            console.error('Error fetching items:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        try {
            const response = await fetch(`${API_BASE_URL}/items`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, description }),
            })
            if (response.ok) {
                setName('')
                setDescription('')
                fetchItems()
            }
        } catch (error) {
            console.error('Error creating item:', error)
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-800 mb-8">Simple Fullstack App</h1>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition"
                        >
                            Add Item
                        </button>
                    </div>
                </form>

                <div className="space-y-4">
                    <h2 className="text-xl font-semibold">Items List</h2>
                    {loading ? (
                        <p>Loading...</p>
                    ) : items.length === 0 ? (
                        <p className="text-gray-500 italic">No items found.</p>
                    ) : (
                        items.map((item) => (
                            <div key={item.id} className="bg-white p-4 rounded-lg shadow-sm">
                                <h3 className="font-bold text-lg">{item.name}</h3>
                                <p className="text-gray-600">{item.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default App
