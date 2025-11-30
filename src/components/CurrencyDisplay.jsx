import { useCurrency } from '../context/CurrencyContext';
import { useEffect, useState } from 'react';

const CurrencyDisplay = ({ amount, decimals = 2 }) => {
    const { convertPrice, formatPrice, currency } = useCurrency();
    const [displayAmount, setDisplayAmount] = useState(amount);

    useEffect(() => {
        const convert = async () => {
            const converted = await convertPrice(amount);
            setDisplayAmount(converted);
        };
        convert();
    }, [amount, currency, convertPrice]);

    return <span>{formatPrice(displayAmount, decimals)}</span>;
};

export default CurrencyDisplay;
