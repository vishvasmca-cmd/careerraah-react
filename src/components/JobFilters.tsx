'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

export interface FilterState {
    states: string[];
    qualifications: string[];
    physical: string[];
    gender: string[];
    selection: string[];
}

interface JobFiltersProps {
    filters: FilterState;
    setFilters: (filters: FilterState) => void;
}

export function JobFilters({ filters, setFilters }: JobFiltersProps) {
    const handleCheck = (category: keyof FilterState, value: string) => {
        setFilters({
            ...filters,
            [category]: filters[category].includes(value)
                ? filters[category].filter((item) => item !== value)
                : [...filters[category], value],
        });
    };

    const sections = [
        {
            id: 'states',
            title: '📍 State',
            options: ['UP', 'Bihar', 'Rajasthan', 'MP', 'Delhi', 'Central'],
        },
        {
            id: 'qualifications',
            title: '🎓 Qualification',
            options: ['10th', '12th', 'Graduate', 'PG', 'Diploma'],
        },
        {
            id: 'physical',
            title: '🧍 Physical Requirement',
            options: ['Height Required', 'No Physical Test'],
        },
        {
            id: 'gender',
            title: '👩 Gender Friendly',
            options: ['Female Eligible'],
        },
        {
            id: 'selection',
            title: '📝 Selection Type',
            options: ['Exam', 'Interview', 'Walk-in'],
        },
    ] as const;

    return (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-5 space-y-6 shadow-sm">
            <h3 className="font-bold text-lg border-b border-zinc-200 dark:border-zinc-700 pb-2 mb-4">
                FILTER JOBS
            </h3>

            {sections.map((section) => (
                <div key={section.id} className="space-y-3">
                    <h4 className="font-semibold text-sm text-zinc-700 dark:text-zinc-300">
                        {section.title}
                    </h4>
                    <div className="space-y-2">
                        {section.options.map((option) => (
                            <div key={option} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`${section.id}-${option}`}
                                    checked={filters[section.id as keyof FilterState].includes(option)}
                                    onCheckedChange={() => handleCheck(section.id as keyof FilterState, option)}
                                />
                                <Label
                                    htmlFor={`${section.id}-${option}`}
                                    className="text-sm font-normal text-zinc-600 dark:text-zinc-400 cursor-pointer"
                                >
                                    {option}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
