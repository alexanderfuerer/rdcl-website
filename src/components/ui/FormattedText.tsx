import React from 'react';

interface FormattedTextProps {
    text: string;
    className?: string;
}

export const FormattedText: React.FC<FormattedTextProps> = ({ text, className }) => {
    if (!text) return null;

    // Split by markdown link pattern [text](url)
    const parts = text.split(/(\[.*?\]\(.*?\))/g);

    return (
        <span className={className}>
            {parts.map((part, i) => {
                const match = part.match(/\[(.*?)\]\(.*?\)/);
                if (match) {
                    const urlMatch = part.match(/\((.*?)\)/);
                    const url = urlMatch ? urlMatch[1] : "#";
                    return (
                        <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-secondary-blue hover:text-secondary-orange underline decoration-secondary-blue/30 transition-all font-semibold"
                        >
                            {match[1]}
                        </a>
                    );
                }
                return part;
            })}
        </span>
    );
};
