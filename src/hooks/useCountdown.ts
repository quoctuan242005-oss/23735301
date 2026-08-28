import { useEffect, useState } from 'react';

export function useCountdown(
    initialSeconds: number,
) {
    const [secondsLeft, setSecondsLeft] =
        useState(initialSeconds);

    useEffect(() => {
        setSecondsLeft(initialSeconds);

        const timer = setInterval(() => {
            setSecondsLeft(current => {
                if (current <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [initialSeconds]);

    const minutes = Math.floor(secondsLeft / 60);
    const seconds = secondsLeft % 60;

    const formatted =
        `${String(minutes).padStart(2, '0')}:` +
        `${String(seconds).padStart(2, '0')}`;

    return {
        secondsLeft,
        formatted,
        isExpired: secondsLeft <= 0,
    };
}

export default useCountdown;