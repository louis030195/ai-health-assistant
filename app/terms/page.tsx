import Markdown from '@/components/ui/Markdown';
import React from 'react';
import MarkdownPolicy from './MarkdownPolicy';

const EmptyComponent = () => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4">
            <MarkdownPolicy />
        </div>
    );
};

export default EmptyComponent;
