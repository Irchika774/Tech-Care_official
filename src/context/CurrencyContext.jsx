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
    const [currency, setCurrency] = useState('LKR');
    const [country, setCountry] = useState('Sri Lanka');
    const [loading, setLoading] = useState(true);
    const [initialized, setInitialized] = useState(false);

    useEffect(() => {
        initializeCurrency();
    }, []);

    const initializeCurrency = async () => {
        try {
            setLoading(true);
            const result = await detectUserCurrency();
            setCurrency(result.currency);
            setCountry(result.country);
            setInitialized(true);
        } catch (error) {
            console.error('Failed to initialize currency:', error);
            setCurrency('LKR');
            setCountry('Sri Lanka');
            setInitialized(true);
        } finally {
            setLoading(false);
        }
    };

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
