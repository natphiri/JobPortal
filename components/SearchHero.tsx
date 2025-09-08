import React, { useState, useMemo, useRef, useEffect } from 'react';
import SearchIcon from './icons/SearchIcon';
import LocationIcon from './icons/LocationIcon';
import { Job } from '../types';

interface SearchHeroProps {
    onSearch: (searchTerm: string, locationTerm: string) => void;
    jobs: Job[];
}

const SearchHero: React.FC<SearchHeroProps> = ({ onSearch, jobs }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [locationTerm, setLocationTerm] = useState('');
    
    const [titleSuggestions, setTitleSuggestions] = useState<string[]>([]);
    const [locationSuggestions, setLocationSuggestions] = useState<string[]>([]);

    const [showTitleSuggestions, setShowTitleSuggestions] = useState(false);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    
    const searchContainerRef = useRef<HTMLDivElement>(null);

    const allSuggestions = useMemo(() => {
        if (!jobs) return { titles: [], locations: [] };
        const titles = new Set(jobs.map(job => job.title));
        const locations = new Set(jobs.map(job => job.location));
        return {
            titles: Array.from(titles),
            locations: Array.from(locations),
        };
    }, [jobs]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
                setShowTitleSuggestions(false);
                setShowLocationSuggestions(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value);
        if (value) {
            const filtered = allSuggestions.titles
                .filter(title => title.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);
            setTitleSuggestions(filtered);
            setShowTitleSuggestions(filtered.length > 0);
        } else {
            setShowTitleSuggestions(false);
        }
    };

    const handleLocationTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setLocationTerm(value);
        if (value) {
            const filtered = allSuggestions.locations
                .filter(location => location.toLowerCase().includes(value.toLowerCase()))
                .slice(0, 5);
            setLocationSuggestions(filtered);
            setShowLocationSuggestions(filtered.length > 0);
        } else {
            setShowLocationSuggestions(false);
        }
    };

    const handleSuggestionClick = (setter: React.Dispatch<React.SetStateAction<string>>, value: string, hideSetter: React.Dispatch<React.SetStateAction<boolean>>) => {
        setter(value);
        hideSetter(false);
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(searchTerm, locationTerm);
        setShowTitleSuggestions(false);
        setShowLocationSuggestions(false);
    };

    return (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 tracking-tight sm:text-5xl lg:text-6xl">
                    Find your next <span className="text-blue-600">opportunity</span>
                </h1>
                <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
                    Discover thousands of job openings and connect with top companies. Your dream job is just a search away.
                </p>

                <div ref={searchContainerRef} className="mt-10 max-w-3xl mx-auto relative">
                    <form onSubmit={handleSearch} className="bg-white dark:bg-gray-700 rounded-full border border-gray-300 dark:border-gray-600 focus-within:ring-2 focus-within:ring-blue-600 focus-within:border-transparent flex items-center transition-all">
                        <div className="flex-1 relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Job title, keywords, or company"
                                value={searchTerm}
                                onChange={handleSearchTermChange}
                                onFocus={() => searchTerm && titleSuggestions.length > 0 && setShowTitleSuggestions(true)}
                                className="w-full h-14 pl-11 pr-4 border-none rounded-l-full focus:outline-none bg-transparent dark:text-gray-200"
                                autoComplete="off"
                            />
                            {showTitleSuggestions && (
                                <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg text-left max-h-60 overflow-y-auto">
                                    {titleSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(setSearchTerm, suggestion, setShowTitleSuggestions)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <div className="h-8 border-l border-gray-200"></div>
                        <div className="flex-1 relative">
                            <LocationIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
                            <input
                                type="text"
                                placeholder="Location"
                                value={locationTerm}
                                onChange={handleLocationTermChange}
                                onFocus={() => locationTerm && locationSuggestions.length > 0 && setShowLocationSuggestions(true)}
                                className="w-full h-14 pl-11 pr-4 border-none focus:outline-none bg-transparent dark:text-gray-200"
                                autoComplete="off"
                            />
                            {showLocationSuggestions && (
                                <ul className="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg text-left max-h-60 overflow-y-auto">
                                    {locationSuggestions.map((suggestion, index) => (
                                        <li
                                            key={index}
                                            onClick={() => handleSuggestionClick(setLocationTerm, suggestion, setShowLocationSuggestions)}
                                            className="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                                        >
                                            {suggestion}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                        <button
                            type="submit"
                            className="px-8 m-1 h-12 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 flex items-center"
                        >
                            Search
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SearchHero;