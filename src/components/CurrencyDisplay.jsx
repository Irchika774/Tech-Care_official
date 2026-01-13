import { useCurrency } from '../context/CurrencyContext';
import { useEffect, useState } from 'react';

const CurrencyDisplay = ({ amount, decimals = 2 }) => {
    const { convertPrice, formatPrice, currency } = useCurrency();
    // Always use absolute value - no negative amounts displayed
    const safeAmount = Math.abs(typeof amount === 'number' ? amount : parseFloat(amount) || 0);
    const [displayAmount, setDisplayAmount] = useState(safeAmount);

    useEffect(() => {
        const convert = async () => {
            const converted = await convertPrice(safeAmount);
            setDisplayAmount(Math.abs(converted));
        };
        convert();
    }, [safeAmount, currency, convertPrice]);

    return <span>{formatPrice(displayAmount, decimals)}</span>;
};

export default CurrencyDisplay;

