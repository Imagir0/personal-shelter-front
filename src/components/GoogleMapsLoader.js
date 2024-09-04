import React from 'react';
import Autocomplete from 'react-google-autocomplete';

const GoogleMapsLoader = ({ user, setUser }) => {
    const handleAddressChange = (place) => {
        const formattedAddress = place.formatted_address;
        
        // Mettre à jour l'état du formulaire avec l'adresse sélectionnée
        setUser((prevUser) => ({
            ...prevUser,
            postal_address: formattedAddress
        }));
    };

    return (
        <Autocomplete
            apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
            style={{
                width: '94%',
                padding: '16.5px 14px',
                borderRadius: '4px',
                border: '1px solid rgba(0, 0, 0, 0.23)',
                fontSize: '16px',
                marginTop: '16px',
                marginBottom: '8px'
            }}
            onPlaceSelected={handleAddressChange}
            options={{
                types: ['address'],
                componentRestrictions: { country: 'fr' },
            }}
            defaultValue={user.postal_address}
            placeholder="Enter your address"
        />
    );
};

export default GoogleMapsLoader;