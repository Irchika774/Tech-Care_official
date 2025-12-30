/**
 * TechCare Custom Logo Component
 * A unique, modern SVG logo combining technology symbols (circuit/chip pattern) 
 * with care/repair concepts (shield/tools)
 */

const TechCareLogo = ({ className = "h-8 w-8", variant = "full", color = "currentColor" }) => {
    // Icon-only version - compact logo mark
    const IconLogo = () => (
        <svg
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Outer Shield Shape - represents protection/care */}
            <path
                d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z"
                stroke={color}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                fill="none"
            />

            {/* Inner Tech/Circuit Pattern */}
            <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                {/* Central processor/chip square */}
                <rect x="18" y="16" width="12" height="12" rx="1" fill={color} fillOpacity="0.15" />

                {/* Circuit connectors - top */}
                <line x1="22" y1="16" x2="22" y2="12" />
                <line x1="26" y1="16" x2="26" y2="12" />

                {/* Circuit connectors - bottom */}
                <line x1="22" y1="28" x2="22" y2="32" />
                <line x1="26" y1="28" x2="26" y2="32" />

                {/* Circuit connectors - left */}
                <line x1="18" y1="20" x2="14" y2="20" />
                <line x1="18" y1="24" x2="14" y2="24" />

                {/* Circuit connectors - right */}
                <line x1="30" y1="20" x2="34" y2="20" />
                <line x1="30" y1="24" x2="34" y2="24" />

                {/* Center power/tech symbol - like a power button inside */}
                <circle cx="24" cy="22" r="3" fill={color} />
            </g>
        </svg>
    );

    // Full logo with text
    const FullLogo = () => (
        <svg
            viewBox="0 0 200 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* Icon Part */}
            <g transform="translate(0, 0)">
                {/* Outer Shield Shape */}
                <path
                    d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />

                {/* Inner Tech/Circuit Pattern */}
                <g stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="18" y="16" width="12" height="12" rx="1" fill={color} fillOpacity="0.15" />
                    <line x1="22" y1="16" x2="22" y2="12" />
                    <line x1="26" y1="16" x2="26" y2="12" />
                    <line x1="22" y1="28" x2="22" y2="32" />
                    <line x1="26" y1="28" x2="26" y2="32" />
                    <line x1="18" y1="20" x2="14" y2="20" />
                    <line x1="18" y1="24" x2="14" y2="24" />
                    <line x1="30" y1="20" x2="34" y2="20" />
                    <line x1="30" y1="24" x2="34" y2="24" />
                    <circle cx="24" cy="22" r="3" fill={color} />
                </g>
            </g>

            {/* Text Part - TECHCARE */}
            <text
                x="52"
                y="32"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="22"
                fontWeight="800"
                letterSpacing="0.05em"
                fill={color}
            >
                TECHCARE
            </text>
        </svg>
    );

    // Horizontal compact logo (icon + text in one line)
    const CompactLogo = () => (
        <div className="flex items-center gap-2">
            <IconLogo />
            <span className="font-bold tracking-tight text-xl uppercase" style={{ color }}>
                TechCare
            </span>
        </div>
    );

    switch (variant) {
        case 'icon':
            return <IconLogo />;
        case 'full':
            return <FullLogo />;
        case 'compact':
            return <CompactLogo />;
        default:
            return <IconLogo />;
    }
};

// Alternative modern logo with wrench + circuit combined
export const TechCareLogoAlt = ({ className = "h-8 w-8", color = "currentColor" }) => (
    <svg
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        {/* Modern abstract TC monogram with tech elements */}
        <g stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            {/* T shape - left part */}
            <path d="M8 12H24" />
            <path d="M16 12V36" />

            {/* C shape - right part, curved */}
            <path d="M40 16C40 16 44 20 44 24C44 28 40 32 36 32C32 32 28 28 28 24C28 20 32 16 36 16" />

            {/* Connection dots (circuit nodes) */}
            <circle cx="8" cy="12" r="2" fill={color} />
            <circle cx="24" cy="12" r="2" fill={color} />
            <circle cx="16" cy="36" r="2" fill={color} />
            <circle cx="36" cy="16" r="2" fill={color} />
            <circle cx="36" cy="32" r="2" fill={color} />

            {/* Connecting circuit lines */}
            <path d="M24 12L28 16" strokeDasharray="2 2" />
            <path d="M16 24H28" strokeDasharray="2 2" />
        </g>
    </svg>
);

// Inline SVG string for use in HTML files
export const TECHCARE_LOGO_SVG = `
<svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="18" y="16" width="12" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <line x1="22" y1="16" x2="22" y2="12"/>
    <line x1="26" y1="16" x2="26" y2="12"/>
    <line x1="22" y1="28" x2="22" y2="32"/>
    <line x1="26" y1="28" x2="26" y2="32"/>
    <line x1="18" y1="20" x2="14" y2="20"/>
    <line x1="18" y1="24" x2="14" y2="24"/>
    <line x1="30" y1="20" x2="34" y2="20"/>
    <line x1="30" y1="24" x2="34" y2="24"/>
    <circle cx="24" cy="22" r="3" fill="currentColor"/>
  </g>
</svg>
`;

// Full logo with text as inline SVG string
export const TECHCARE_FULL_LOGO_SVG = `
<svg viewBox="0 0 200 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M24 4L40 10V22C40 32.5 33 40.5 24 44C15 40.5 8 32.5 8 22V10L24 4Z" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
  <g stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <rect x="18" y="16" width="12" height="12" rx="1" fill="currentColor" fill-opacity="0.15"/>
    <line x1="22" y1="16" x2="22" y2="12"/>
    <line x1="26" y1="16" x2="26" y2="12"/>
    <line x1="22" y1="28" x2="22" y2="32"/>
    <line x1="26" y1="28" x2="26" y2="32"/>
    <line x1="18" y1="20" x2="14" y2="20"/>
    <line x1="18" y1="24" x2="14" y2="24"/>
    <line x1="30" y1="20" x2="34" y2="20"/>
    <line x1="30" y1="24" x2="34" y2="24"/>
    <circle cx="24" cy="22" r="3" fill="currentColor"/>
  </g>
  <text x="52" y="32" font-family="system-ui, -apple-system, sans-serif" font-size="22" font-weight="800" letter-spacing="0.05em" fill="currentColor">TECHCARE</text>
</svg>
`;

export default TechCareLogo;
