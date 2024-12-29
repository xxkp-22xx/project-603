import React, { createContext, useState, useContext, useEffect } from "react";

const PropertiesContext = createContext();

export const PropertiesProvider = ({ children }) => {
    const [properties, setProperties] = useState(() => {
        const savedProperties = localStorage.getItem("properties");
        return savedProperties ? JSON.parse(savedProperties) : [];
    });

    useEffect(() => {
        localStorage.setItem("properties", JSON.stringify(properties));
    }, [properties]);

    return (
        <PropertiesContext.Provider value={{ properties, setProperties }}>
            {children}
        </PropertiesContext.Provider>
    );
};

export const useProperties = () => useContext(PropertiesContext);
