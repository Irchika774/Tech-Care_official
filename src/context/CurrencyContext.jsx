import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    detectUserCurrency,
    getUserCurrency,
    setUserCurrency as saveCurrency,
    convertFromLKR,
    formatCurrency as formatCurrencyUtil
} from '../utils/currency';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    // Always use LKR for Sri Lanka - no currency switching
    const [currency, setCurrency] = useState('LKR');
    const [country, setCountry] = useState('Sri Lanka');
    const [loading, setLoading] = useState(false);
    const [initialized, setInitialized] = useState(true);

    // Load saved currency preference
    useEffect(() => {
        const savedCurrency = getUserCurrency();
        // Try to get country from storage or default to Sri Lanka
        const savedCountry = localStorage.getItem('userCountry') || 'Sri Lanka';

        setCurrency(savedCurrency);
        setCountry(savedCountry);
        setInitialized(true);
        setLoading(false);
    }, []);

    const changeCurrency = (newCurrency, newCountry = null) => {
        setCurrency(newCurrency);
        if (newCountry) {
            setCountry(newCountry);
        }
        saveCurrency(newCurrency, newCountry);
    };

    const convertPrice = async (priceInLKR) => {
        if (currency === 'LKR') {
            return priceInLKR;
        }
        try {
            return await convertFromLKR(priceInLKR, currency);
        } catch (error) {
            console.error('Price conversion failed:', error);
            return priceInLKR;
        }
    };

    const formatPrice = (amount, decimals = 2) => {
        return formatCurrencyUtil(amount, currency, decimals);
    };

    const value = {
        currency,
        country,
        loading,
        initialized,
        changeCurrency,
        convertPrice,
        formatPrice
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

CurrencyProvider.propTypes = {
    children: PropTypes.node.isRequired
};

export default CurrencyContext;
