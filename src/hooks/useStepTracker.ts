import { useState, useEffect, useRef } from 'react';

export function useStepTracker(onStepDetected?: (steps: number) => void) {
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [supported, setSupported] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const PERMISSION_KEY = 'step_tracker_permission';
    const motionHandlerRef = useRef<(e: DeviceMotionEvent) => void>();

    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

        if (!isMobile) {
            setSupported(false);
            return;
        }

        if ("DeviceMotionEvent" in window) {
            setSupported(true);
        }

        const saved = localStorage.getItem(PERMISSION_KEY);
        if (saved === "granted") {
            setPermission("granted");
            startStepTracking();
        }

        return () => {
            if (motionHandlerRef.current) {
                window.removeEventListener("devicemotion", motionHandlerRef.current);
            }
        };
    }, []);

    const enableTracking = async () => {
        try {
            if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
                const result = await (DeviceMotionEvent as any).requestPermission();

                setPermission(result as any);
                localStorage.setItem(PERMISSION_KEY, result);

                if (result === "granted") startStepTracking();
                return;
            }

            setPermission("granted");
            localStorage.setItem(PERMISSION_KEY, "granted");
            startStepTracking();

        } catch (err) {
            console.error("Enable tracking error:", err);
        }
    };

    const startStepTracking = () => {
        if (isTracking) return;
        setIsTracking(true);

        let gravity = 9.81;
        let lastStep = 0;
        let avgPeak = 1.5;
        let peaks: number[] = [];

        const handler = (e: DeviceMotionEvent) => {
            if (!e.accelerationIncludingGravity) return;

            const { x, y, z } = e.accelerationIncludingGravity;
            if (x == null || y == null || z == null) return;

            const magnitude = Math.sqrt(x*x + y*y + z*z);

            gravity = 0.9 * gravity + 0.1 * magnitude;
            const filtered = magnitude - gravity;

            const now = Date.now();

            if (filtered > avgPeak * 0.6) {
                if (now - lastStep > 300 && now - lastStep < 1500) {
                    peaks.push(filtered);
                    if (peaks.length > 5) peaks.shift();
                    avgPeak = peaks.reduce((a, b) => a + b, 0) / peaks.length;

                    lastStep = now;
                    onStepDetected?.(1);
                }
            }
        };

        motionHandlerRef.current = handler;
        window.addEventListener("devicemotion", motionHandlerRef.current);
    };

    return {
        permission,
        supported,
        isTracking,
        enableTracking,
    };
}