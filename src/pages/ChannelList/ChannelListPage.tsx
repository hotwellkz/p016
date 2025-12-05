import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { Loader2, Plus, Video, Wand2, Calendar, MoreVertical, Bell, Grid3x3, List, User, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy
} from "@dnd-kit/sortable";
import ChannelCard from "../../components/ChannelCard";
import AIAutoGenerateModal from "../../components/AIAutoGenerateModal";
import CustomPromptModal from "../../components/CustomPromptModal";
import UserMenu from "../../components/UserMenu";
import NotificationBell from "../../components/NotificationBell";
import { useAuthStore } from "../../stores/authStore";
import { useChannelStore } from "../../stores/channelStore";
import type { Channel } from "../../domain/channel";
import { calculateChannelStates, type ChannelStateInfo } from "../../utils/channelAutomationState";
import { fetchScheduleSettings } from "../../api/scheduleSettings";

const ChannelListPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore((state) => ({
    user: state.user,
    logout: state.logout
  }));

  const { channels, loading, error, fetchChannels, deleteChannel, reorderChannels } =
    useChannelStore((state) => ({
      channels: state.channels,
      loading: state.loading,
      error: state.error,
      fetchChannels: state.fetchChannels,
      deleteChannel: state.deleteChannel,
      reorderChannels: state.reorderChannels
    }));

  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [selectedChannelForAI, setSelectedChannelForAI] =
    useState<Channel | null>(null);
  const [isCustomPromptModalOpen, setIsCustomPromptModalOpen] = useState(false);
  const [selectedChannelForCustomPrompt, setSelectedChannelForCustomPrompt] =
    useState<Channel | null>(null);
  const [localChannels, setLocalChannels] = useState<Channel[]>([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [channelStates, setChannelStates] = useState<Map<string, ChannelStateInfo>>(new Map());
  const [minIntervalMinutes, setMinIntervalMinutes] = useState(11);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);
  const [menuPosition, setMenuPosition] = useState<{ top: number; right: number } | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Состояние для режима отображения (grid/list)
  const [layoutMode, setLayoutMode] = useState<"grid" | "list">(() => {
    const saved = localStorage.getItem("channels-layout-mode");
    return (saved === "grid" || saved === "list") ? saved : "grid";
  });

  // Сохраняем режим в localStorage при изменении
  useEffect(() => {
    localStorage.setItem("channels-layout-mode", layoutMode);
  }, [layoutMode]);

  const toggleLayoutMode = () => {
    setLayoutMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Синхронизируем локальное состояние с глобальным
  useEffect(() => {
    setLocalChannels(channels);
  }, [channels]);

  // Настройка сенсоров для drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8 // Минимальное расстояние для начала перетаскивания (в пикселях)
      }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    if (!user?.uid) {
      return;
    }

    const oldIndex = localChannels.findIndex((ch) => ch.id === active.id);
    const newIndex = localChannels.findIndex((ch) => ch.id === over.id);

    if (oldIndex === -1 || newIndex === -1) {
      return;
    }

    // Оптимистично обновляем локальное состояние
    const newChannels = arrayMove(localChannels, oldIndex, newIndex);
    setLocalChannels(newChannels);

    // Отправляем новый порядок на сервер
    try {
      const orderedIds = newChannels.map((ch) => ch.id);
      await reorderChannels(user.uid, orderedIds);
    } catch (error) {
      // В случае ошибки откатываем изменения
      console.error("Failed to reorder channels:", error);
      setLocalChannels(channels);
      alert("Не удалось сохранить новый порядок каналов. Попробуйте ещё раз.");
    }
  };

  useEffect(() => {
    if (user?.uid) {
      void fetchChannels(user.uid);
    }
  }, [user?.uid, fetchChannels]);

  // Загружаем настройки расписания для получения minIntervalMinutes
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await fetchScheduleSettings();
        setMinIntervalMinutes(settings.minIntervalMinutes || 11);
      } catch (error) {
        console.error("Failed to load schedule settings:", error);
      }
    };
    void loadSettings();
  }, []);

  // Вычисляем состояния каналов
  useEffect(() => {
    if (localChannels.length === 0) {
      setChannelStates(new Map());
      return;
    }

    const recalculateStates = () => {
      const states = calculateChannelStates(localChannels, minIntervalMinutes);
      setChannelStates(states);
    };

    recalculateStates();

    // Обновляем каждые 30 секунд
    const intervalId = setInterval(recalculateStates, 30_000);

    return () => clearInterval(intervalId);
  }, [localChannels, minIntervalMinutes]);

  const handleDelete = async (channelId: string) => {
    if (!user?.uid) {
      return;
    }
    const confirmed = window.confirm(
      "Удалить канал? Его настройки будут потеряны."
    );
    if (!confirmed) {
      return;
    }
    await deleteChannel(user.uid, channelId);
  };

  const goToWizard = () => {
    navigate("/channels/new");
  };

  const goToEdit = (channelId: string) => {
    navigate(`/channels/${channelId}/edit`);
  };

  const goToGeneration = (channelId: string) => {
    navigate(`/channels/${channelId}/generate`);
  };

  const handleAutoGenerate = (channel: Channel) => {
    setSelectedChannelForAI(channel);
    setIsAIModalOpen(true);
  };

  const handleCloseAIModal = () => {
    setIsAIModalOpen(false);
    setSelectedChannelForAI(null);
  };

  const handleCustomPrompt = (channel: Channel) => {
    setSelectedChannelForCustomPrompt(channel);
    setIsCustomPromptModalOpen(true);
  };

  const handleCloseCustomPromptModal = () => {
    setIsCustomPromptModalOpen(false);
    setSelectedChannelForCustomPrompt(null);
  };

  const handleCustomPromptSuccess = () => {
    // Можно добавить обновление списка каналов или показ уведомления
    console.log("Custom prompt sent successfully");
  };

  const handleMobileLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      setShowMobileMenu(false);
      setMenuPosition(null);
      navigate("/auth", { replace: true });
    } catch (error) {
      console.error("Ошибка при выходе:", error);
      // Всё равно делаем редирект
      setShowMobileMenu(false);
      setMenuPosition(null);
      navigate("/auth", { replace: true });
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleMobileProfileClick = () => {
    setShowMobileMenu(false);
    setMenuPosition(null);
    navigate("/settings");
  };

  return (
    <div className="relative min-h-screen px-3 py-3 text-white sm:px-4 sm:py-10 md:py-10">
      {/* Премиальный фон */}
      <div className="channels-premium-bg" />
      
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-4 sm:gap-8">
        {/* Десктопная версия заголовка */}
        <header className="hidden flex-col gap-4 rounded-3xl channels-premium-header p-8 md:flex">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex-1">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400 font-medium">
                Панель канала
              </p>
              <h1 className="mt-3 text-4xl font-bold premium-title">
                Ваши каналы ({channels.length})
              </h1>
              <p className="mt-2 text-[15px] premium-subtitle leading-relaxed">
                Управляйте настройками, запускайте генерации сценариев и создавайте
                новые каналы под разные соцсети.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={goToWizard}
                  className="premium-btn-primary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold text-white"
                >
                  <Plus size={16} />
                  <span className="hidden sm:inline">Создать канал</span>
                  <span className="sm:hidden">Создать</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/channels/schedule")}
                  className="premium-btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm text-slate-200"
                >
                  <Calendar size={16} />
                  <span className="hidden sm:inline">Расписание</span>
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/scripts")}
                  className="premium-btn-secondary inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm text-slate-200"
                >
                  <Wand2 size={16} />
                  <span className="hidden sm:inline">Генератор</span>
                </button>
              </div>
              {/* Переключатель раскладки Grid/List */}
              <div className="hidden md:flex items-center gap-1 rounded-2xl premium-btn-secondary p-1">
                <button
                  type="button"
                  onClick={() => setLayoutMode("grid")}
                  className={`flex items-center justify-center rounded-xl px-3 py-2 text-sm transition-all ${
                    layoutMode === "grid"
                      ? "bg-brand text-white shadow-lg"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Сетка"
                >
                  <Grid3x3 size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode("list")}
                  className={`flex items-center justify-center rounded-xl px-3 py-2 text-sm transition-all ${
                    layoutMode === "list"
                      ? "bg-brand text-white shadow-lg"
                      : "text-slate-300 hover:text-white"
                  }`}
                  title="Список"
                >
                  <List size={16} />
                </button>
              </div>
              <NotificationBell />
              <UserMenu />
            </div>
          </div>

          {user && (
            <div className="border-t border-white/5 pt-4">
              <p className="text-xs text-slate-400">
                Вы вошли как <span className="text-slate-200 font-medium">{user.email}</span>
              </p>
            </div>
          )}
        </header>

        {/* Мобильная версия заголовка */}
        <div className="flex flex-col gap-3 md:hidden">
          <div className="flex items-center justify-between rounded-2xl channels-premium-header p-4">
            <h1 className="text-xl font-bold premium-title">
              Ваши каналы ({channels.length})
            </h1>
            <div className="flex items-center gap-2">
              <div className="relative mobile-header-menu-container">
                <button
                  ref={mobileMenuButtonRef}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const button = e.currentTarget;
                    const rect = button.getBoundingClientRect();
                    const menuWidth = 192; // w-48 = 12rem = 192px
                    const estimatedMenuHeight = 400; // примерная высота меню
                    const padding = 8;
                    
                    // Вычисляем позицию справа от правого края кнопки
                    let right = window.innerWidth - rect.right;
                    
                    // Вычисляем позицию сверху (открываем вниз)
                    let top = rect.bottom + padding;
                    
                    // Проверяем, помещается ли меню снизу
                    if (top + estimatedMenuHeight > window.innerHeight - padding) {
                      // Если не помещается снизу, открываем вверх
                      top = rect.top - estimatedMenuHeight - padding;
                      // Если и вверх не помещается, открываем снизу с ограничением высоты
                      if (top < padding) {
                        top = rect.bottom + padding;
                      }
                    }
                    
                    // Проверяем, не выходит ли меню за левый край
                    const leftPosition = window.innerWidth - right - menuWidth;
                    if (leftPosition < padding) {
                      right = window.innerWidth - menuWidth - padding;
                    }
                    
                    setMenuPosition({
                      top: Math.max(padding, Math.min(top, window.innerHeight - padding)),
                      right: Math.max(padding, Math.min(right, window.innerWidth - padding))
                    });
                    setShowMobileMenu(!showMobileMenu);
                  }}
                  className="premium-btn-secondary flex min-h-[40px] min-w-[40px] items-center justify-center rounded-lg p-2 text-slate-300"
                  aria-label="Меню"
                >
                  <MoreVertical size={20} />
                </button>
                {showMobileMenu && menuPosition && createPortal(
                  <>
                    <div
                      className="fixed inset-0 bg-transparent"
                      style={{ zIndex: 99998 }}
                      onClick={() => {
                        setShowMobileMenu(false);
                        setMenuPosition(null);
                      }}
                    />
                    <div 
                      className="mobile-header-menu-dropdown fixed w-48 rounded-lg channels-premium-header p-2 shadow-2xl z-[99999]"
                      style={{
                        top: `${menuPosition.top}px`,
                        right: `${menuPosition.right}px`,
                        maxHeight: `calc(100vh - ${menuPosition.top + 16}px)`,
                        maxWidth: `calc(100vw - ${menuPosition.right + 16}px)`,
                        overflowY: 'auto'
                      }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/notifications");
                          setShowMobileMenu(false);
                          setMenuPosition(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/50"
                      >
                        <Bell size={16} />
                        Уведомления
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/channels/schedule");
                          setShowMobileMenu(false);
                          setMenuPosition(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/50"
                      >
                        <Calendar size={16} />
                        Расписание
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          navigate("/scripts");
                          setShowMobileMenu(false);
                          setMenuPosition(null);
                        }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/50"
                      >
                        <Wand2 size={16} />
                        Генератор
                      </button>
                      <div className="my-2 border-t border-white/10" />
                      {/* Переключатель раскладки для мобильной версии */}
                      <div className="flex items-center gap-1 px-3 py-2">
                        <button
                          type="button"
                          onClick={() => {
                            setLayoutMode("grid");
                            setShowMobileMenu(false);
                            setMenuPosition(null);
                          }}
                          className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm transition-all ${
                            layoutMode === "grid"
                              ? "bg-brand text-white"
                              : "text-slate-300 hover:text-white"
                          }`}
                          title="Сетка"
                        >
                          <Grid3x3 size={16} />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setLayoutMode("list");
                            setShowMobileMenu(false);
                            setMenuPosition(null);
                          }}
                          className={`flex items-center justify-center rounded-lg px-3 py-2 text-sm transition-all ${
                            layoutMode === "list"
                              ? "bg-brand text-white"
                              : "text-slate-300 hover:text-white"
                          }`}
                          title="Список"
                        >
                          <List size={16} />
                        </button>
                      </div>
                      <div className="my-2 border-t border-white/10" />
                      {/* Пункты меню пользователя для мобильной версии */}
                      {user && (
                        <>
                          <div className="rounded-lg border border-white/5 bg-slate-800/40 px-3 py-2 mb-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/20 text-xs font-semibold text-brand-light">
                                {user.displayName 
                                  ? user.displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
                                  : user.email?.[0].toUpperCase() || "U"}
                              </div>
                              <div className="min-w-0 flex-1">
                                {user.displayName && (
                                  <div className="truncate text-sm font-medium text-white">
                                    {user.displayName}
                                  </div>
                                )}
                                <div className="truncate text-xs text-slate-400">{user.email}</div>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={handleMobileProfileClick}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-200 transition hover:bg-slate-800/50"
                          >
                            <User size={16} />
                            Профиль
                          </button>
                          <div className="my-1 border-t border-white/10" />
                          <button
                            type="button"
                            onClick={handleMobileLogout}
                            disabled={isLoggingOut}
                            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-300 transition hover:bg-red-900/20 hover:text-red-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {isLoggingOut ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <LogOut size={16} />
                            )}
                            <span>{isLoggingOut ? "Выход..." : "Выйти"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </>,
                  document.body
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={goToWizard}
            className="premium-btn-primary w-full min-h-[44px] flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white"
          >
            <Plus size={18} />
            Создать канал
          </button>
        </div>

        {loading && (
          <div className="flex items-center justify-center rounded-2xl channels-premium-header py-16">
            <div className="flex items-center gap-3 text-slate-200">
              <Loader2 className="h-5 w-5 animate-spin text-brand-light" />
              <span className="font-medium">Загружаем каналы...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-900/20 backdrop-blur-sm px-6 py-4 text-red-100 shadow-lg">
            <span className="font-semibold">Ошибка:</span> {error}
          </div>
        )}

        {!loading && channels.length === 0 && (
          <div className="rounded-3xl channels-premium-header p-10 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border border-white/10 bg-slate-900/50 backdrop-blur-sm text-brand-light shadow-lg">
              <Video size={28} />
            </div>
            <h2 className="mt-6 text-2xl font-bold premium-title">
              Каналы ещё не созданы
            </h2>
            <p className="mt-2 text-slate-300 premium-subtitle">
              Пройдите мастер настройки, чтобы задать платформу, длительность,
              аудиторию и тон, а затем начните генерацию сценариев.
            </p>
            <button
              type="button"
              onClick={goToWizard}
              className="premium-btn-primary mt-6 rounded-2xl px-6 py-3 text-sm font-semibold text-white"
            >
              Запустить мастер
            </button>
          </div>
        )}

        {localChannels.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={localChannels.map((ch) => ch.id)}
              strategy={rectSortingStrategy}
            >
              <div
                className={`transition-all duration-300 pb-6 sm:pb-0 ${
                  layoutMode === "grid"
                    ? "grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4"
                    : "flex flex-col gap-3 sm:gap-4"
                }`}
              >
                {localChannels.map((channel, index) => {
                  const stateInfo = channelStates.get(channel.id);
                  return (
                    <div
                      key={channel.id}
                      className={layoutMode === "list" ? "w-full" : ""}
                    >
                      <ChannelCard
                        channel={channel}
                        index={index}
                        compact
                        automationState={stateInfo?.state || "default"}
                        automationStateInfo={stateInfo}
                        minIntervalMinutes={minIntervalMinutes}
                        onEdit={() => goToEdit(channel.id)}
                        onDelete={() => handleDelete(channel.id)}
                        onGenerate={() => goToGeneration(channel.id)}
                        onAutoGenerate={() => handleAutoGenerate(channel)}
                        onCustomPrompt={() => handleCustomPrompt(channel)}
                      />
                    </div>
                  );
                })}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      {/* AI Auto Generate Modal */}
      {selectedChannelForAI && (
        <AIAutoGenerateModal
          isOpen={isAIModalOpen}
          channel={selectedChannelForAI}
          onClose={handleCloseAIModal}
        />
      )}

      {/* Custom Prompt Modal */}
      {selectedChannelForCustomPrompt && (
        <CustomPromptModal
          channel={selectedChannelForCustomPrompt}
          isOpen={isCustomPromptModalOpen}
          onClose={handleCloseCustomPromptModal}
          onSuccess={handleCustomPromptSuccess}
        />
      )}
    </div>
  );
};

export default ChannelListPage;

