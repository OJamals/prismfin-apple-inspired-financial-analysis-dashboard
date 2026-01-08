import { useState, useEffect, useCallback } from 'react';
import { SkillLevel, TradingMode, DensityMode } from '@shared/types';
import { toast } from 'sonner';
const SETTINGS_KEY = 'prismfin_user_settings_v2';
interface AlertThresholds {
  volatility: number;
  crossover: number;
}
interface UserSettings {
  skillLevel: SkillLevel;
  tradingMode: TradingMode;
  density: DensityMode;
  showTooltips: boolean;
  alertThresholds: AlertThresholds;
}
const DEFAULT_SETTINGS: UserSettings = {
  skillLevel: 'novice',
  tradingMode: 'paper',
  density: 'comfortable',
  showTooltips: true,
  alertThresholds: {
    volatility: 5.0,
    crossover: 2.5
  }
};
export function useUserSettings() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem(SETTINGS_KEY);
    if (!saved) return DEFAULT_SETTINGS;
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
    } catch (e) {
      return DEFAULT_SETTINGS;
    }
  });
  useEffect(() => {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  }, [settings]);
  const updateSetting = useCallback(<K extends keyof UserSettings>(key: K, value: UserSettings[K]) => {
    setSettings(prev => {
      if (prev[key] === value) return prev;
      return { ...prev, [key]: value };
    });
  }, []);
  const setSkillLevel = useCallback((level: SkillLevel) => {
    updateSetting('skillLevel', level);
    toast.info(`Intelligence Tier: ${level.toUpperCase()}`);
  }, [updateSetting]);
  const setTradingMode = useCallback((mode: TradingMode) => {
    updateSetting('tradingMode', mode);
    toast.success(`System switched to ${mode.toUpperCase()} environment`);
  }, [updateSetting]);
  const setDensity = useCallback((density: DensityMode) => {
    updateSetting('density', density);
    toast.info(`UI layout set to ${density}`);
  }, [updateSetting]);
  const setShowTooltips = useCallback((show: boolean) => {
    updateSetting('showTooltips', show);
    toast.info(`Educational overlays ${show ? 'enabled' : 'disabled'}`);
  }, [updateSetting]);
  const setAlertThresholds = useCallback((thresholds: Partial<AlertThresholds>) => {
    setSettings(prev => ({
      ...prev,
      alertThresholds: { ...prev.alertThresholds, ...thresholds }
    }));
  }, []);
  return {
    ...settings,
    setSkillLevel,
    setTradingMode,
    setDensity,
    setShowTooltips,
    setAlertThresholds
  };
}