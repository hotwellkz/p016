import { useState, useEffect } from "react";
import { Copy, Trash2, Plus, ChevronDown, ChevronUp } from "lucide-react";
import type { ChannelPreferences, PreferenceVariant, PreferencesMode } from "../domain/channel";
import { createPreferenceVariant, validatePreferences } from "../utils/preferencesUtils";

interface PreferencesVariantsEditorProps {
  preferences: ChannelPreferences | undefined;
  onChange: (preferences: ChannelPreferences) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const PreferencesVariantsEditor = ({
  preferences,
  onChange,
  onValidationChange
}: PreferencesVariantsEditorProps) => {
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [collapsedVariants, setCollapsedVariants] = useState<Set<string>>(new Set());

  // Инициализация preferences если их нет
  const currentPreferences: ChannelPreferences = preferences || {
    variants: [createPreferenceVariant("", 1)],
    mode: "cyclic",
    lastUsedIndex: 0
  };

  const toggleVariantExpanded = (variantId: string) => {
    const newExpanded = new Set(expandedVariants);
    const newCollapsed = new Set(collapsedVariants);
    
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId);
      newCollapsed.add(variantId);
    } else {
      newExpanded.add(variantId);
      newCollapsed.delete(variantId);
    }
    
    setExpandedVariants(newExpanded);
    setCollapsedVariants(newCollapsed);
  };

  const handleVariantChange = (variantId: string, text: string) => {
    const updatedVariants = currentPreferences.variants.map((v) =>
      v.id === variantId ? { ...v, text } : v
    );

    const updatedPreferences: ChannelPreferences = {
      ...currentPreferences,
      variants: updatedVariants
    };

    onChange(updatedPreferences);
    
    // Валидация
    const validation = validatePreferences(updatedPreferences);
    if (onValidationChange) {
      onValidationChange(validation.valid);
    }
  };

  const handleAddVariant = () => {
    const newOrder = currentPreferences.variants.length + 1;
    const newVariant = createPreferenceVariant("", newOrder);
    
    const updatedPreferences: ChannelPreferences = {
      ...currentPreferences,
      variants: [...currentPreferences.variants, newVariant]
    };

    onChange(updatedPreferences);
    
    // Разворачиваем новый вариант
    setExpandedVariants(new Set([...expandedVariants, newVariant.id]));
    setCollapsedVariants(new Set([...collapsedVariants].filter(id => id !== newVariant.id)));
  };

  const handleDuplicateVariant = (variantId: string) => {
    const variantToDuplicate = currentPreferences.variants.find((v) => v.id === variantId);
    if (!variantToDuplicate) return;

    const newOrder = currentPreferences.variants.length + 1;
    const newVariant = createPreferenceVariant(variantToDuplicate.text, newOrder);
    
    const updatedPreferences: ChannelPreferences = {
      ...currentPreferences,
      variants: [...currentPreferences.variants, newVariant]
    };

    onChange(updatedPreferences);
    
    // Разворачиваем дублированный вариант
    setExpandedVariants(new Set([...expandedVariants, newVariant.id]));
  };

  const handleDeleteVariant = (variantId: string) => {
    if (currentPreferences.variants.length <= 1) {
      alert("Должен остаться хотя бы один вариант пожеланий");
      return;
    }

    const updatedVariants = currentPreferences.variants
      .filter((v) => v.id !== variantId)
      .map((v, index) => ({ ...v, order: index + 1 })); // Пересчитываем порядок

    const updatedPreferences: ChannelPreferences = {
      ...currentPreferences,
      variants: updatedVariants
    };

    onChange(updatedPreferences);
    
    // Удаляем из состояний развёрнутости
    setExpandedVariants(new Set([...expandedVariants].filter(id => id !== variantId)));
    setCollapsedVariants(new Set([...collapsedVariants].filter(id => id !== variantId)));
  };

  const handleModeChange = (mode: PreferencesMode) => {
    const updatedPreferences: ChannelPreferences = {
      ...currentPreferences,
      mode
    };

    onChange(updatedPreferences);
  };

  // Валидация при изменении preferences
  useEffect(() => {
    const validation = validatePreferences(currentPreferences);
    if (onValidationChange) {
      onValidationChange(validation.valid);
    }
  }, [currentPreferences, onValidationChange]);

  return (
    <div className="space-y-4">
      {/* Режим выбора варианта */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-200">
          Режим выбора варианта пожеланий
        </label>
        <select
          value={currentPreferences.mode}
          onChange={(e) => handleModeChange(e.target.value as PreferencesMode)}
          className="w-full rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/40"
        >
          <option value="cyclic">По порядку (циклически)</option>
          <option value="random">Случайно</option>
          <option value="fixed">Только первый вариант</option>
        </select>
        <p className="text-xs text-slate-400">
          {currentPreferences.mode === "cyclic" &&
            "Варианты будут использоваться по очереди: 1 → 2 → ... → 1"}
          {currentPreferences.mode === "random" &&
            "На каждый запуск будет выбираться случайный вариант"}
          {currentPreferences.mode === "fixed" &&
            "Всегда будет использоваться только первый вариант"}
        </p>
      </div>

      {/* Список вариантов */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-slate-200">
            Варианты дополнительных пожеланий
          </label>
          <button
            type="button"
            onClick={handleAddVariant}
            className="flex items-center gap-2 rounded-lg border border-white/10 bg-slate-800/50 px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-700/50 hover:text-white"
          >
            <Plus size={16} />
            Добавить вариант
          </button>
        </div>

        {currentPreferences.variants.map((variant, index) => {
          const isExpanded = expandedVariants.has(variant.id) || !collapsedVariants.has(variant.id);
          const previewText = variant.text.trim() || "(пусто)";
          const displayText = previewText.length > 100 
            ? `${previewText.substring(0, 100)}...` 
            : previewText;

          return (
            <div
              key={variant.id}
              className="rounded-xl border border-white/10 bg-slate-950/60 overflow-hidden"
            >
              {/* Заголовок варианта */}
              <div className="flex items-center justify-between px-4 py-3 bg-slate-900/40">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <button
                    type="button"
                    onClick={() => toggleVariantExpanded(variant.id)}
                    className="flex items-center gap-2 text-sm font-medium text-slate-200 hover:text-white transition"
                  >
                    {isExpanded ? (
                      <ChevronUp size={16} className="text-slate-400" />
                    ) : (
                      <ChevronDown size={16} className="text-slate-400" />
                    )}
                    <span>Вариант {index + 1}</span>
                  </button>
                  {!isExpanded && (
                    <span className="text-xs text-slate-400 truncate ml-2">
                      {displayText}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleDuplicateVariant(variant.id)}
                    className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/50 transition"
                    title="Дублировать"
                  >
                    <Copy size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteVariant(variant.id)}
                    disabled={currentPreferences.variants.length <= 1}
                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-900/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Удалить"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Содержимое варианта */}
              {isExpanded && (
                <div className="p-4">
                  <textarea
                    value={variant.text}
                    onChange={(e) => {
                      const textarea = e.currentTarget;
                      textarea.style.height = "auto";
                      textarea.style.height = `${textarea.scrollHeight}px`;
                      handleVariantChange(variant.id, textarea.value);
                    }}
                    rows={4}
                    className="w-full rounded-lg border border-white/10 bg-slate-900/60 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-brand focus:ring-2 focus:ring-brand/40 min-h-[100px] h-auto resize-y overflow-auto"
                    placeholder="Любые дополнительные требования к сценариям... Например: «бабушка и дедушка — казахи», особенности персонажей, сеттинг, стиль съёмки."
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Подсказка */}
      <p className="text-xs text-slate-400">
        Создайте несколько вариантов пожеланий для увеличения разнообразия контента. 
        Система будет использовать их согласно выбранному режиму.
      </p>
    </div>
  );
};

export default PreferencesVariantsEditor;

