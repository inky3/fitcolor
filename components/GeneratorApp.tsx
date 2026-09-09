"use client";

import React, { useEffect, useState } from "react";
import { useOutfit } from "@/hooks/useOutfit";
import OutfitRow from "./OutfitRow";
import RandomizeButton from "./RandomizeButton";
import HarmonySelector from "./HarmonySelector";
import ShowYourWork from "./ShowYourWork";
import SettingsDrawer from "./SettingsDrawer";
import SettingsPanel from "./SettingsPanel";
import FavoriteButton from "./FavoriteButton";
import ShareButton from "./ShareButton";
import { useI18n } from "@/lib/i18n";
import {
  addFavorite,
  removeFavorite,
  loadFavorites,
  isOutfitFavorited,
  FavoriteEntry,
} from "@/lib/outfitState";

const SOUND_KEY = "fitcolor.sound";

export default function GeneratorApp() {
  const { t } = useI18n();
  const {
    state,
    colors,
    lastRerollAt,
    reroll,
    toggleLock,
    setFit,
    setRule,
    setStyle,
    setBlendStyle,
    setBlendMix,
    setOccasion,
    setUndertone,
    setSeason,
    shareUrl,
    wardrobe,
    useWardrobeColors,
    setUseWardrobeColors,
    addWardrobeItem,
    removeWardrobeItem,
  } = useOutfit();

  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    setFavorites(loadFavorites());
    setSoundOn(window.localStorage.getItem(SOUND_KEY) === "1");
  }, []);

  const savedId = isOutfitFavorited(state, favorites);

  const handleFavoriteToggle = () => {
    if (savedId) {
      setFavorites(removeFavorite(savedId));
    } else {
      setFavorites(addFavorite(state));
    }
  };

  const handleToggleUseWardrobe = () => {
    setUseWardrobeColors(!useWardrobeColors);
    reroll();
  };

  const handleSoundToggle = () => {
    setSoundOn((prev) => {
      const next = !prev;
      window.localStorage.setItem(SOUND_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pt-4">
      <div className="flex-1 flex flex-col items-center gap-8">
        <div className="text-center max-w-lg">
          <h1 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream">{t("tagline")}</h1>
        </div>

        <HarmonySelector rule={state.rule} onChange={setRule} />

        <OutfitRow
          colors={colors}
          state={state}
          rerollTrigger={lastRerollAt}
          onToggleLock={toggleLock}
          onSetFit={setFit}
        />

        <RandomizeButton onRandomize={reroll} soundOn={soundOn} />

        <ShowYourWork rule={state.rule} />

        <div className="flex flex-wrap items-center justify-center gap-3">
          <FavoriteButton saved={Boolean(savedId)} onToggle={handleFavoriteToggle} />
          <ShareButton getUrl={shareUrl} />
        </div>

        <p className="font-body text-xs text-ink-faint dark:text-cream/40 text-center max-w-sm">
          {t("honesty.generator")}
        </p>
      </div>

      <SettingsDrawer>
        <SettingsPanel
          state={state}
          onUndertone={setUndertone}
          onSeason={setSeason}
          onStyle={setStyle}
          onBlendStyle={setBlendStyle}
          onBlendMix={setBlendMix}
          onOccasion={setOccasion}
          soundOn={soundOn}
          onSoundToggle={handleSoundToggle}
          wardrobe={wardrobe}
          useWardrobeColors={useWardrobeColors}
          onAddWardrobeItem={addWardrobeItem}
          onRemoveWardrobeItem={removeWardrobeItem}
          onToggleUseWardrobe={handleToggleUseWardrobe}
        />
      </SettingsDrawer>
    </div>
  );
}
