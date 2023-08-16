'use client'

import React, { useEffect } from 'react';

interface SaveTimezoneProps {
    saveUserTimezoneServer: (userId: string, timezone: string) => Promise<void>;
    userId?: string;
}

const SaveTimezone: React.FC<SaveTimezoneProps> = ({ saveUserTimezoneServer, userId }) => {
    useEffect(() => {
        if (!userId) {
            return;
        }
        saveUserTimezoneServer(userId, Intl.DateTimeFormat().resolvedOptions().timeZone);
    }, [saveUserTimezoneServer, userId]);

    return null;
}

export default SaveTimezone;
