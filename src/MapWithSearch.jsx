import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import 'leaflet/dist/leaflet.css';
import 'leaflet-defaulticon-compatibility';
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css';
import 'leaflet-geosearch/dist/geosearch.css';

const MapWithSearch = () => {
    const [position, setPosition] = useState([11.0168, 76.9558]); // Default position: Coimbatore
    const [searchValue, setSearchValue] = useState(''); // Input value
    const [showMarkers, setShowMarkers] = useState(false); // Control when to show the scrap shop markers

    // Waste scrap shop locations
    const scrapShops = [
        {
            name: 'Tharani Electronics Waste-Electronics Waste',
            position: [11.025532316147663, 76.96543711095988],
            address: 'No: 1A, Lala Mahal Road, PM Samy Colony, Gandhipuram, Tamil Nadu 641027',
        },
        {
            name: 'V.K.STEELS',
            position: [11.037834254045684, 77.00932340885122],
            address: 'Peelamedu Industrial Estate, Peelamedu, Gauthama Puri Nagar, Coimbatore, Tamil Nadu 641004',
        },
        {
            name: 'Annai Waste Paper Mart',
            position: [11.019316789488894, 77.01843737019868],
            address: 'Masakalipalayam Rd, Peelamedu, Lakshmipuram, Coimbatore, Tamil Nadu 641004',
        },
    ];

    // Create an instance of OpenStreetMapProvider for geocoding
    const provider = new OpenStreetMapProvider();

    // Function to handle searching and setting the new position
    const handleSearch = async (e) => {
        e.preventDefault();

        // Check if the user is searching for "waste scrap shops in Coimbatore"
        if (searchValue.toLowerCase()||toUpperCaase() === 'waste scrap shops in coimbatore') {
            setPosition([11.0168, 76.9558]); // Center the map to Coimbatore
            setShowMarkers(true); // Show the waste scrap shop markers
        } else {
            // For other search queries, perform geocoding search
            const results = await provider.search({ query: searchValue });
            if (results && results.length > 0) {
                const { x, y } = results[0]; // Get the longitude (x) and latitude (y)
                setPosition([y, x]); // Set the new position to center the map
                setShowMarkers(false); // Hide the scrap shop markers for other searches
            } else {
                alert('Location not found');
                setShowMarkers(false); // Hide the scrap shop markers if no search results
            }
        }
    };

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', }}>
            {/* Search Bar */}
            <form
                onSubmit={handleSearch}
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '20px',
                    backgroundColor: '#14618',
                    borderBottom: '1px solid #ddd',
                    width: '100%',
                }}
            >
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '10px',
                    borderRadius: '10px',
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                    backgroundColor: 'green', // White background for better visibility
                }}>
                    <input
                        type="text"
                        placeholder="Search location"
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        style={{
                            width: '300px',
                            padding: '10px',
                            fontSize: '16px',
                            border: '1px solid #ccc',
                            borderRadius: '5px',
                            backgroundColor: 'white',
                            color: '#000'
                        }}
                    />
                    <button
                        type="submit"
                        style={{
                            marginLeft: '10px',
                            padding: '10px',
                            backgroundColor: 'green',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                        }}
                    >
                        Search
                    </button>
                </div>
            </form>

            {/* Map Box */}
            <div style={{
                flexGrow: 1,
                width: '1200px', // Full width of the screen
                padding: '20px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{

                    width: '1200px', // Full width for the map
                    height: '100%', // Full height of the box
                    backgroundColor: '#f0f0f0', // Light grey background for contrast
                    borderRadius: '10px',
                    overflow: 'hidden', // Ensures map doesn't overflow the box
                }}>
                    <MapContainer center={position} zoom={13} style={{ height: '100%', width: '100%' }}>
                        <TileLayer
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        />

                        {/* Markers for waste scrap shops (only if searched for "waste scrap shops in Coimbatore") */}
                        {showMarkers &&
                            scrapShops.map((shop, index) => (
                                <Marker key={index} position={shop.position}>
                                    <Popup>
                                        <strong>{shop.name}</strong> <br />
                                        {shop.address}
                                    </Popup>
                                </Marker>
                            ))}

                        {/* Marker for searched location */}
                        {!showMarkers && (
                            <Marker position={position}>
                                <Popup>Selected location: {position.join(', ')}</Popup>
                            </Marker>
                        )}

                        {/* Update the map view when position changes */}
                        <MapUpdater position={position} />
                    </MapContainer>
                </div>
            </div>
        </div>
    );
};

// Custom hook to update map view when position changes
const MapUpdater = ({ position }) => {
    const map = useMap();
    useEffect(() => {
        map.setView(position, map.getZoom());
    }, [position, map]);

    return null;
};

export default MapWithSearch;
