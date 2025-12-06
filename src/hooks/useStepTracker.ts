import { useState, useEffect } from 'react';
import { format } from 'date-fns';

export function useStepTracker(onStepDetected?: (steps: number) => void) {
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [supported, setSupported] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const PERMISSION_KEY = 'step_tracker_permission';

    useEffect(() => {
        if ('DeviceMotionEvent' in window) {
            setSupported(true);
            requestStepAccess();
        }
    }, []);



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
        let avgPeak = 1.5;
        let peakList: number[] = [];

        const handleMotion = (event: DeviceMotionEvent) => {
            if (!event.accelerationIncludingGravity) return;

            const { x, y, z } = event.accelerationIncludingGravity;
            if (x === null || y === null || z === null) return;

            const magnitude = Math.sqrt(x*x + y*y + z*z);
            gravity = 0.9 * gravity + 0.1 * magnitude;
            const filtered = magnitude - gravity;
            const now = Date.now();

            if (filtered > avgPeak * 0.6) {
                if (now - lastStepTime > 300 && now - lastStepTime < 1500) {
                    peakList.push(filtered);
                    if (peakList.length > 5) peakList.shift();
                    avgPeak = peakList.reduce((a, b) => a + b, 0) / peakList.length;

                    lastStepTime = now;
                    if (onStepDetected) {
                        onStepDetected(1);
                    }
                }
            }
        };

        window.addEventListener('devicemotion', handleMotion);
    };

    return {
        permission,
        supported,
        isTracking,
        enableTracking
    };
}