import { useState, useEffect, useCallback } from 'react';
import { SkillLevel } from '@shared/types';
const SETTINGS_KEY = 'prismfin_user_settings';
interface UserSettings {
  skillLevel: SkillLevel;
  isSimMode: boolean;
}
export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    return saved ? JSON.parse(saved) : { skillLevel: 'beginner', isSimMode: false };
  });
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  const setSkillLevel = useCallback((level: SkillLevel) => {
    setSettings(prev => ({ ...prev, skillLevel: level }));
  }, []);
  const setSimMode = useCallback((active: boolean) => {
    setSettings(prev => ({ ...prev, isSimMode: active }));
  }, []);
  return {
    skillLevel: settings.skillLevel,
    isSimMode: settings.isSimMode,
    setSkillLevel,
    setSimMode
  };
}