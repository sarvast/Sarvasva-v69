import { useState, useEffect, useRef } from "react";

export function useStepTracker(onStep?: (steps: number) => void) {
    const [permission, setPermission] = useState<'granted' | 'denied' | 'prompt'>('prompt');
    const [supported, setSupported] = useState(false);
    const [isTracking, setIsTracking] = useState(false);

    const motionRef = useRef<(e: DeviceMotionEvent) => void>();
    const lastStepRef = useRef(0);
    const gravityRef = useRef(9.81);
    const avgRef = useRef(1.2);
    const bufferRef = useRef<number[]>([]);

    useEffect(() => {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        if (!isMobile || !("DeviceMotionEvent" in window)) {
            setSupported(false);
            return;
        }

        setSupported(true);

        if (localStorage.getItem("motion_perm") === "granted") {
            setPermission("granted");
            startTracking();
        }

        return () => {
            if (motionRef.current) {
                window.removeEventListener("devicemotion", motionRef.current);
            }
        };
    }, []);

    const requestPermission = async () => {
        try {
            if (typeof (DeviceMotionEvent as any).requestPermission === "function") {
                const result = await (DeviceMotionEvent as any).requestPermission();
                setPermission(result);
                if (result === "granted") {
                    localStorage.setItem("motion_perm", "granted");
                    startTracking();
                }
            } else {
                setPermission("granted");
                localStorage.setItem("motion_perm", "granted");
                startTracking();
            }
        } catch {
            setPermission("denied");
        }
    };

    const startTracking = () => {
        if (isTracking) return;
        setIsTracking(true);

        const handler = (event: DeviceMotionEvent) => {
            if (!event.accelerationIncludingGravity) return;

            const { x, y, z } = event.accelerationIncludingGravity;
            if (x == null || y == null || z == null) return;

            const magnitude = Math.sqrt(x*x + y*y + z*z);

            gravityRef.current = 0.9 * gravityRef.current + 0.1 * magnitude;
            const filtered = magnitude - gravityRef.current;
            const now = Date.now();

            bufferRef.current.push(filtered);
            if (bufferRef.current.length > 6) bufferRef.current.shift();

            const avg = bufferRef.current.reduce((a, b) => a + b, 0) / bufferRef.current.length;
            avgRef.current = 0.8 * avgRef.current + 0.2 * avg;

            const diff = Math.abs(avgRef.current - filtered);

            if (
                diff > 1.1 &&
                now - lastStepRef.current > 350 &&
                now - lastStepRef.current < 1800
            ) {
                lastStepRef.current = now;
                onStep?.(1);
            }
        };

        motionRef.current = handler;
        window.addEventListener("devicemotion", handler);
    };

    return {
        supported,
        permission,
        isTracking,
        requestPermission,
    };
}