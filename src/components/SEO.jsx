import { Helmet } from 'react-helmet-async';

const SEO = ({
    title = 'TechCare - Professional Tech Repair Services',
    description = 'Find expert technicians for mobile, PC, and electronics repair. Fast, reliable, and affordable service.',
    keywords = 'tech repair, mobile repair, PC repair, technician, electronics repair',
    image = '/og-image.jpg',
    url = window.location.href
}) => {
    return (
        <Helmet>
            {/* Basic Meta Tags */}
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta name="keywords" content={keywords} />

            {/* Open Graph Tags */}
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={image} />
            <meta property="og:url" content={url} />
            <meta property="og:type" content="website" />

            {/* Twitter Card Tags */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:image" content={image} />

            {/* Canonical URL */}
            <link rel="canonical" href={url} />
        </Helmet>
    );
};

export default SEO;
