import React, {
    createContext,
    useContext,
    useMemo,
    useState,
} from 'react';

import { COLORS } from '@constants/theme';

type ThemeMode = 'light' | 'dark';

type ThemeContextValue = {
    mode: ThemeMode;
    isDark: boolean;
    toggleTheme: () => void;
    colors: {
        background: string;
        surface: string;
        text: string;
        textLight: string;
        border: string;
        primary: string;
        secondary: string;
        error: string;
        success: string;
    };
};

const ThemeContext =
    createContext<ThemeContextValue | undefined>(
        undefined,
    );

export function ThemeProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [mode, setMode] =
        useState<ThemeMode>('light');

    const toggleTheme = () => {
        setMode(current =>
            current === 'light' ? 'dark' : 'light',
        );
    };

    const colors = useMemo(() => {
        const isDark = mode === 'dark';

        return {
            background: isDark
                ? '#042F2E'
                : COLORS.background,

            surface: isDark
                ? '#0B4F4A'
                : COLORS.surface,

            text: isDark
                ? '#F0FDFA'
                : COLORS.text,

            textLight: isDark
                ? '#A7D8D2'
                : COLORS.textLight,

            border: isDark
                ? '#166A63'
                : COLORS.border,

            primary: COLORS.primary,
            secondary: COLORS.secondary,
            error: COLORS.error,
            success: COLORS.success,
        };
    }, [mode]);

    const value = useMemo(
        () => ({
            mode,
            isDark: mode === 'dark',
            toggleTheme,
            colors,
        }),
        [mode, colors],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            'useTheme must be used inside ThemeProvider',
        );
    }

    return context;
}