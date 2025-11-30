import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState } from 'react';

const MapComponent = ({ technicians, center, onTechnicianClick }) => {
    const [selectedTechnician, setSelectedTechnician] = useState(null);

    const mapContainerStyle = {
        width: '100%',
        height: '500px',
        borderRadius: '0.5rem'
    };

    const defaultCenter = center || {
        lat: 6.9271, // Colombo, Sri Lanka
        lng: 79.8612
    };

    const options = {
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: true,
    };

    return (
        <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap
                mapContainerStyle={mapContainerStyle}
                center={defaultCenter}
                zoom={12}
                options={options}
            >
                {technicians && technicians.map((tech) => (
                    tech.location && tech.location.coordinates && (
                        <Marker
                            key={tech._id}
                            position={{
                                lat: tech.location.coordinates[1],
                                lng: tech.location.coordinates[0]
                            }}
                            onClick={() => setSelectedTechnician(tech)}
                            title={tech.name}
                        />
                    )
                ))}

                {selectedTechnician && (
                    <InfoWindow
                        position={{
                            lat: selectedTechnician.location.coordinates[1],
                            lng: selectedTechnician.location.coordinates[0]
                        }}
                        onCloseClick={() => setSelectedTechnician(null)}
                    >
                        <div className="p-2 min-w-[200px]">
                            <h3 className="font-bold text-lg">{selectedTechnician.name}</h3>
                            <div className="flex items-center gap-1 my-1">
                                <span className="text-yellow-500">★</span>
                                <span>{selectedTechnician.rating || 'New'}</span>
                                <span className="text-gray-500 text-sm">({selectedTechnician.reviews?.length || 0} reviews)</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                {selectedTechnician.specialties?.join(', ') || 'General Technician'}
                            </p>
                            <button
                                onClick={() => onTechnicianClick(selectedTechnician)}
                                className="w-full mt-2 px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark transition-colors text-sm font-medium"
                            >
                                View Profile
                            </button>
                        </div>
                    </InfoWindow>
                )}
            </GoogleMap>
        </LoadScript>
    );
};

export default MapComponent;
