import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function useStepTracker() {
    const [steps, setSteps] = useState<number>(0);
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [supported, setSupported] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const today = format(new Date(), 'yyyy-MM-dd');
    const STORAGE_KEY = `steps_${today}`;
    const PERMISSION_KEY = 'step_tracker_permission';

    useEffect(() => {
        // Check device support
        if ('DeviceMotionEvent' in window) {
            setSupported(true);
        }

        // Load today's steps
        const savedSteps = localStorage.getItem(STORAGE_KEY);
        if (savedSteps) {
            setSteps(parseInt(savedSteps));
        }

        // Auto-request permission and start tracking
        requestStepAccess();

        // Setup daily reset at midnight
        setupDailyReset();

        // Handle app visibility changes
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    const setupDailyReset = () => {
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        const msUntilMidnight = tomorrow.getTime() - now.getTime();
        
        setTimeout(() => {
            // Reset steps at midnight
            setSteps(0);
            localStorage.removeItem(STORAGE_KEY);
            // Setup next day's reset
            setupDailyReset();
        }, msUntilMidnight);
    };

    const handleVisibilityChange = () => {
        if (!document.hidden && permission === 'granted') {
            // App became visible, sync with any background counting
            const savedSteps = localStorage.getItem(STORAGE_KEY);
            if (savedSteps) {
                setSteps(parseInt(savedSteps));
            }
        }
    };

    const requestStepAccess = async () => {
        try {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                // iOS 13+ - requires user interaction
                const savedPermission = localStorage.getItem(PERMISSION_KEY);
                if (savedPermission === 'granted') {
                    setPermission('granted');
                    startStepTracking();
                    return;
                }
                // Will be called on user interaction
                setPermission('prompt');
            } else {
                // Android Chrome - auto grant
                setPermission('granted');
                localStorage.setItem(PERMISSION_KEY, 'granted');
                startStepTracking();
            }
        } catch (error) {
            console.error('Step permission error:', error);
        }
    };

    const enableTracking = async () => {
        try {
            if (typeof (DeviceMotionEvent as any).requestPermission === 'function') {
                const result = await (DeviceMotionEvent as any).requestPermission();
                setPermission(result);
                localStorage.setItem(PERMISSION_KEY, result);
                if (result === 'granted') {
                    startStepTracking();
                }
            }
        } catch (error) {
            console.error('Permission error:', error);
        }
    };

    const startStepTracking = () => {
        if (isTracking) return;
        
        setIsTracking(true);
        let gravity = 9.81;
        let lastStepTime = 0;
        let stepCount = steps;
        let avgPeak = 1.5;
        let peakList: number[] = [];

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!event.accelerationIncludingGravity) return;

            const { x, y, z } = event.accelerationIncludingGravity;
            if (x === null || y === null || z === null) return;

            // Calculate magnitude (orientation independent)
            const magnitude = Math.sqrt(x*x + y*y + z*z);

            // Remove gravity with low-pass filter
            gravity = 0.9 * gravity + 0.1 * magnitude;
            const filtered = magnitude - gravity;

            const now = Date.now();

            // Peak detection with dynamic threshold
            if (filtered > avgPeak * 0.6) {
                // Valid step: 300-1500ms gap
                if (now - lastStepTime > 300 && now - lastStepTime < 1500) {
                    // Update peak averages (rolling window of 5)
                    peakList.push(filtered);
                    if (peakList.length > 5) peakList.shift();
                    avgPeak = peakList.reduce((a, b) => a + b, 0) / peakList.length;

                    lastStepTime = now;
                    stepCount++;
                    setSteps(stepCount);
                    
                    // Save immediately to localStorage
                    localStorage.setItem(STORAGE_KEY, stepCount.toString());
                }
            }
        };

        window.addEventListener('devicemotion', handleMotion);
        
        // Register service worker for background tracking
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/step-worker.js').catch(console.error);
        }
    };

    const syncSteps = () => {
        const savedSteps = localStorage.getItem(STORAGE_KEY);
        if (savedSteps) {
            setSteps(parseInt(savedSteps));
        }
    };

    return {
        steps,
        permission,
        supported,
        isTracking,
        enableTracking,
        syncSteps
    };
}