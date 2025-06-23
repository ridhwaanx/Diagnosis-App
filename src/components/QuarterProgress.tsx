"use client"

import React, { useState, useEffect, useRef } from 'react';

export const QuarterProgress: React.FC = () => {
  // State management
  const [userId, setUserId] = useState<string | null>(null);
  const [displayProgress, setDisplayProgress] = useState(0);
  const targetProgress = useRef(0);
  const animationRef = useRef<number>();
  const lastTimeRef = useRef<number>(0);

  // Get user ID from localStorage on mount
  useEffect(() => {
    const localUser = localStorage.getItem('user');
    if (localUser) {
      const parsedUser = JSON.parse(localUser);
      setUserId(parsedUser.id);
    }
  }, []);

  // Fetch and calculate profile completion progress
  useEffect(() => {
    const fetchProgress = async () => {
      if (!userId) return;

      try {
        let totalProgress = 0;

        // Fetch basic profile
        const profileResponse = await fetch(`/api/profile/${userId}`);
        if (profileResponse.ok) {
          const profileData = await profileResponse.json();

          const profileFields = ['age', 'height', 'weight', 'ethnicity', 'sex'];
          let completedProfileFields = 0;

          profileFields.forEach(field => {
            if (profileData[field] !== null && profileData[field] !== undefined && profileData[field] !== '') {
              completedProfileFields++;
            }
          });

          totalProgress += Math.min(completedProfileFields * 10, 50);
        }

        // Fetch health profile
        const healthResponse = await fetch(`/api/health/${userId}`);
        if (healthResponse.ok) {
          const healthData = await healthResponse.json();

          const healthFields = ['bloodPressure', 'bloodType', 'cholesterol', 'hasAllergies', 'hasConditions'];
          let completedHealthFields = 0;

          healthFields.forEach(field => {
            const value = healthData.data[field];

            if (field === 'cholesterol') {
              if (value && typeof value === 'object' &&
                ('total' in value || 'hdl' in value || 'ldl' in value)) {
                completedHealthFields++;
              }
            }
            else if (
              value !== null &&
              value !== undefined &&
              value !== '' &&
              value !== false &&
              !(Array.isArray(value) && value.length === 0)
            ) {
              completedHealthFields++;
            }
          });

          totalProgress += Math.min(completedHealthFields * 10, 50);
        }

        targetProgress.current = totalProgress;
        startAnimation();

      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    };

    fetchProgress();
  }, [userId]);

  // Start progress animation
  const startAnimation = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(animateProgress);
  };

  // Animate progress towards target value
  const animateProgress = (time: number) => {
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const animationSpeed = 0.5;
    const step = deltaTime * animationSpeed;

    if (Math.abs(displayProgress - targetProgress.current) > 0.5) {
      setDisplayProgress(prev => {
        const diff = targetProgress.current - prev;
        const direction = diff > 0 ? 1 : -1;
        const newValue = prev + direction * Math.min(step, Math.abs(diff) * 0.1);
        return Math.abs(newValue - targetProgress.current) < 0.5
          ? targetProgress.current
          : newValue;
      });
      animationRef.current = requestAnimationFrame(animateProgress);
    } else {
      setDisplayProgress(targetProgress.current);
    }
  };

  // Clean up animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // SVG circle calculations
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const progressOffset = circumference * (1 - displayProgress / 100);

  return (
    <div className="relative w-24 h-24">
      <svg width="100" height="100" viewBox="0 0 100 100">

        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#E0E0E0"
          strokeWidth="10"
        />

        {/* Progress circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="#4CAF50"
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />

        {/* Progress percentage text */}
        <text
          x="50"
          y="55"
          textAnchor="middle"
          fontSize="18"
          fill="#333"
          fontWeight="bold"
          style={{ transition: 'opacity 0.3s ease' }}
        >
          {Math.round(displayProgress)}%
        </text>
      </svg>
    </div>
  );
};
