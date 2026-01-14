import { Button } from "./ui/button";

/**
 * Reusable Empty State component for dashboards
 * @param {LucideIcon} icon - The icon to display
 * @param {string} title - The main heading
 * @param {string} description - Descriptive text
 * @param {string} buttonText - Text for the CTA button
 * @param {function} onAction - Callback for the CTA button
 */
const EmptyState = ({ icon: Icon, title, description, buttonText, onAction }) => {
    return (
        <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500">
            <div className="bg-zinc-800/50 p-6 rounded-full mb-6 ring-1 ring-white/10 shadow-2xl">
                {Icon && <Icon className="w-12 h-12 text-zinc-400 opacity-50" />}
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            <p className="text-zinc-400 mb-8 max-w-sm mx-auto leading-relaxed">
                {description}
            </p>
            {buttonText && onAction && (
                <Button
                    onClick={onAction}
                    className="bg-white text-black hover:bg-zinc-200 px-8 rounded-full font-semibold shadow-lg transition-all active:scale-95"
                >
                    {buttonText}
                </Button>
            )}
        </div>
    );
};

export default EmptyState;
