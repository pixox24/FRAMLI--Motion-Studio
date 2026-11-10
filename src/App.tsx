import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { MOTION_ITEMS } from './motion-engine/motionData';
import {
  MotionItem,
  AnimationOverrides,
  StageTheme,
  ViewportMode,
} from './types/motion';
import {
  SoundSettings,
  DEFAULT_SOUND_SETTINGS,
  soundEngine,
} from './audio/soundEngine';
import { Header } from './components/Header';
import { HomePage } from './components/HomePage';
import { PresetSidebar } from './components/PresetSidebar';
import { StudioCanvas } from './components/StudioCanvas';
import { StudioInspector } from './components/StudioInspector';
import { filterMotionItems } from './utils/motionUtils';

const DEFAULT_OVERRIDES: AnimationOverrides = {
  duration: 2.4,
  cubicBezier: [0.25, 0.46, 0.45, 0.94],
  easingName: '柔和缓出 (Ease Out)',
  accentColor: '#cdff39',
  stagger: 0.04,
  scale: 1.0,
  scatterMultiplier: 1.0,
  rotationMultiplier: 1.0,
  playbackSpeed: 1.0,
  loop: true,
};

export default function App() {
  const [selectedItem, setSelectedItem] = useState<MotionItem>(
    MOTION_ITEMS[0] || {
      id: 1,
      zh: '闪电砸落',
      en: 'Lightning Strike',
      desc: '伴随闪电强光重重砸下',
      comp: 'text',
      when: ['enter'],
      tech: 'CSS',
      style: '冲击登场',
      uses: ['hero', 'emph'],
      tag: '冲击开场',
      txt: '雷鸣',
      bg: 'dark',
      added: '2026-10-15',
      prompt: '闪电砸落',
    }
  );

  const [customText, setCustomText] = useState<string>('FRAMLI-MOTION');
  const [overrides, setOverrides] = useState<AnimationOverrides>(DEFAULT_OVERRIDES);
  const [stageTheme, setStageTheme] = useState<StageTheme>('dark');
  const [viewportMode, setViewportMode] = useState<ViewportMode>('16:9');
  const [viewMode, setViewMode] = useState<'home' | 'studio'>('home');
  const [replayKey, setReplayKey] = useState<number>(0);

  // Sound Engine Settings
  const [soundSettings, setSoundSettings] = useState<SoundSettings>(() => {
    try {
      const saved = localStorage.getItem('motion_sound_settings');
      return saved ? JSON.parse(saved) : DEFAULT_SOUND_SETTINGS;
    } catch {
      return DEFAULT_SOUND_SETTINGS;
    }
  });

  const handleUpdateSoundSettings = useCallback((partial: Partial<SoundSettings>) => {
    setSoundSettings(prev => {
      const next = { ...prev, ...partial };
      try {
        localStorage.setItem('motion_sound_settings', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedComp, setSelectedComp] = useState<string>('all');
  const [selectedWhen, setSelectedWhen] = useState<string>('all');
  const [selectedTech, setSelectedTech] = useState<string>('all');

  // Favorites in localStorage
  const [favorites, setFavorites] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem('motion_studio_favorites');
      return saved ? JSON.parse(saved) : [1, 13, 18, 25, 328];
    } catch {
      return [1, 13, 18, 25, 328];
    }
  });

  const toggleFavorite = useCallback((id: number) => {
    setFavorites(prev => {
      const next = prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id];
      try {
        localStorage.setItem('motion_studio_favorites', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const handleUpdateOverrides = useCallback((partial: Partial<AnimationOverrides>) => {
    setOverrides(prev => ({ ...prev, ...partial }));
  }, []);

  const handleResetOverrides = useCallback(() => {
    setOverrides(DEFAULT_OVERRIDES);
  }, []);

  // Play audio strictly once on manual replay / user trigger
  const handleReplay = useCallback(() => {
    setReplayKey(k => k + 1);
    soundEngine.play(selectedItem, overrides, soundSettings, customText);
  }, [selectedItem, overrides, soundSettings, customText]);

  // When user picks an item, trigger animation + audio once
  const handleSelectItem = useCallback((item: MotionItem) => {
    setSelectedItem(item);
    setReplayKey(k => k + 1);
    soundEngine.play(item, overrides, soundSettings, customText);
  }, [overrides, soundSettings, customText]);

  // Filtered motion items list
  const filteredItems = useMemo(() => {
    return filterMotionItems(
      MOTION_ITEMS,
      searchQuery,
      selectedComp,
      selectedWhen,
      selectedTech,
      favorites
    );
  }, [searchQuery, selectedComp, selectedWhen, selectedTech, favorites]);

  // When selecting an item from the gallery, switch to studio workbench
  const handleSelectForStudio = useCallback((item?: MotionItem) => {
    if (item) {
      setSelectedItem(item);
      setReplayKey(k => k + 1);
      soundEngine.play(item, overrides, soundSettings, customText);
    }
    setViewMode('studio');
  }, [overrides, soundSettings, customText]);

  // Keyboard navigation for presets (ArrowUp / ArrowDown / R for Replay)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't capture when typing in text input or textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleReplay();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleUpdateSoundSettings({ enabled: !soundSettings.enabled });
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
        if (currentIndex < filteredItems.length - 1) {
          handleSelectItem(filteredItems[currentIndex + 1]);
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const currentIndex = filteredItems.findIndex(i => i.id === selectedItem.id);
        if (currentIndex > 0) {
          handleSelectItem(filteredItems[currentIndex - 1]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [filteredItems, selectedItem, handleReplay, handleSelectItem, handleUpdateSoundSettings, soundSettings.enabled]);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#07080c] text-[#e0e2ec] overflow-hidden font-sans">
      {/* Global Studio Header with Sound controls */}
      <Header
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        totalCount={MOTION_ITEMS.length}
        soundSettings={soundSettings}
        onUpdateSoundSettings={handleUpdateSoundSettings}
      />

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'home' ? (
          /* Home Page: Hero with 3D Parallax + Comprehensive Gallery */
          <HomePage
            items={filteredItems}
            customText={customText}
            overrides={overrides}
            onEnterStudio={handleSelectForStudio}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedComp={selectedComp}
            onSelectComp={setSelectedComp}
          />
        ) : (
          /* Studio Workbench: Left 3xN Sidebar + Center Canvas + Right Inspector */
          <>
            {/* Left Sidebar: Filterable 3xN mini gallery preset library */}
            <PresetSidebar
              items={filteredItems}
              selectedItem={selectedItem}
              onSelectItem={handleSelectItem}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              selectedComp={selectedComp}
              onSelectComp={setSelectedComp}
              selectedWhen={selectedWhen}
              onSelectWhen={setSelectedWhen}
              selectedTech={selectedTech}
              onSelectTech={setSelectedTech}
              favorites={favorites}
              onToggleFavorite={toggleFavorite}
              customText={customText}
              overrides={overrides}
            />

            {/* Center Canvas */}
            <StudioCanvas
              item={selectedItem}
              customText={customText}
              onCustomTextChange={setCustomText}
              overrides={overrides}
              onUpdateOverrides={handleUpdateOverrides}
              replayKey={replayKey}
              onReplay={handleReplay}
              stageTheme={stageTheme}
              viewportMode={viewportMode}
              onViewportModeChange={setViewportMode}
            />

            {/* Right Inspector & Code/Prompt Exporter */}
            <StudioInspector
              item={selectedItem}
              customText={customText}
              overrides={overrides}
              onUpdateOverrides={handleUpdateOverrides}
              onResetOverrides={handleResetOverrides}
              stageTheme={stageTheme}
              onChangeStageTheme={setStageTheme}
              soundSettings={soundSettings}
              onUpdateSoundSettings={handleUpdateSoundSettings}
            />
          </>
        )}
      </div>
    </div>
  );
}
