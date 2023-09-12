'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from 'react';

export default function LanguageDropdown({ userId }: { userId: string }) {
    const supabase = createClientComponentClient()
    const [selectedLanguage, setSelectedLanguage] = useState<string | null>(null);

    const languages = [
        { language: 'English', flag: '🇬🇧' },
        { language: 'Spanish', flag: '🇪🇸' },
        { language: 'French', flag: '🇫🇷' },
        { language: 'German', flag: '🇩🇪' },
        { language: 'Mandarin Chinese', flag: '🇨🇳' },
        { language: 'Hindi', flag: '🇮🇳' },
        { language: 'Bengali', flag: '🇧🇩' },
        { language: 'Portuguese', flag: '🇵🇹' },
        { language: 'Russian', flag: '🇷🇺' },
        { language: 'Japanese', flag: '🇯🇵' },
        { language: 'Punjabi', flag: '🇵🇰' },
        { language: 'Javanese', flag: '🇮🇩' },
        { language: 'Turkish', flag: '🇹🇷' },
        { language: 'Korean', flag: '🇰🇷' },
        { language: 'Vietnamese', flag: '🇻🇳' },
        { language: 'Telugu', flag: '🇮🇳' },
        { language: 'Italian', flag: '🇮🇹' },
        { language: 'Marathi', flag: '🇮🇳' },
        { language: 'Thai', flag: '🇹🇭' },
        { language: 'Dutch', flag: '🇳🇱' },
    ]; // Add more languages as needed

    useEffect(() => {
        const fetchUserLanguage = async () => {
            const { data, error } = await supabase
                .from('users')
                .select('language')
                .eq('id', userId);

            if (error) {
                console.error('Error fetching user language:', error);
            } else if (data && data.length > 0) {
                setSelectedLanguage(data[0].language);
            }
        };

        fetchUserLanguage();
    }, [userId, supabase]);

    const handleLanguageChange = async (language: string) => {
        const { error } = await supabase
            .from('users')
            .update({ language })
            .eq('id', userId);

        if (error) {
            console.error('Error updating language:', error);
        } else {
            setSelectedLanguage(language);
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button className="w-[200px]">
                    {selectedLanguage || 'Select Language'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
                <DropdownMenuLabel> Language</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {languages.map((language, index) => (
                    <DropdownMenuItem key={index} onClick={() => handleLanguageChange(language.language)}>
                        {language.flag} {language.language}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}