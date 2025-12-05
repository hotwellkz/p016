import { Link } from "react-router-dom";
import { 
  Sparkles, 
  Wand2, 
  Clock, 
  Calendar, 
  Zap, 
  Shield, 
  Bot, 
  Cloud, 
  PlayCircle,
  CheckCircle2,
  ArrowRight,
  Youtube,
  Instagram,
  MessageSquare,
  FolderOpen,
  Timer,
  Target,
  TrendingUp,
  Users,
  Settings
} from "lucide-react";
import SEOHead from "../../components/SEOHead";

const LandingPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "ShortsAI Studio",
    description: "Автоматизация генерации сценариев и видео-контента для YouTube Shorts, TikTok и Instagram Reels",
    url: "https://shortsai.ru",
    applicationCategory: "MultimediaApplication",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "RUB"
    },
    featureList: [
      "Генерация сценариев на базе продвинутого AI",
      "Автоматизация публикаций по расписанию",
      "Интеграции Telegram + Google Drive",
      "Работа без лимитов OpenAI"
    ]
  };

  return (
    <>
      <SEOHead
        title="ShortsAI Studio — автоматизация сценариев и генерация роликов"
        description="Генерация сценариев и автоматическая публикация контента для YouTube Shorts, TikTok и Reels. Интеграция Telegram, Google Drive, AI-сценарист и умная автоматизация."
        keywords="shorts ai, генерация сценариев shorts, автоматизация контента, ai videos, tiktok сценарии, youtube shorts автоматизация"
        structuredData={structuredData}
      />
      
      <div className="min-h-screen bg-slate-950 text-white">
        {/* Hero-блок */}
        <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="text-center">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/10 px-4 py-2 text-sm font-medium text-brand-light">
                <Sparkles size={16} />
                <span>ShortsAI Studio</span>
              </div>
              
              <h1 className="mb-6 text-4xl font-bold leading-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
                Автогенерация сценариев и видео-контента для{" "}
                <span className="bg-gradient-to-r from-brand to-brand-light bg-clip-text text-transparent">
                  Shorts, TikTok и Reels
                </span>
              </h1>
              
              <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-300 sm:text-xl">
                Создавайте и запускайте генерацию роликов с помощью нейросети, автоматически публикуйте их и управляйте десятками каналов из одного пространства.
              </p>
              
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  to="/auth"
                  className="group flex items-center gap-2 rounded-xl bg-brand px-8 py-4 text-base font-semibold text-white transition hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/20"
                >
                  Начать бесплатно
                  <ArrowRight size={20} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <a
                  href="#features"
                  className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10"
                >
                  Узнать больше
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Блок "Что делает приложение" */}
        <section id="features" className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Что делает приложение
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Полный цикл создания и публикации контента в одном инструменте
              </p>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: Sparkles,
                  title: "Генерация сценариев на базе продвинутого AI",
                  description: "Умная нейросеть создаёт уникальные сценарии с учётом ваших настроек канала"
                },
                {
                  icon: Settings,
                  title: "Полный контроль тона, длительности, стиля",
                  description: "Настройте каждый канал под свою аудиторию и нишу"
                },
                {
                  icon: Calendar,
                  title: "Автоматизация публикаций по расписанию",
                  description: "Установите расписание и забудьте о ручной публикации контента"
                },
                {
                  icon: PlayCircle,
                  title: "Экспорт в YouTube, TikTok, Instagram",
                  description: "Один клик — и контент готов к публикации на любой платформе"
                },
                {
                  icon: Bot,
                  title: "Интеграции Telegram + Google Drive",
                  description: "Автоматическая загрузка видео в облако и отправка через бота"
                },
                {
                  icon: Zap,
                  title: "Работаем без лимитов OpenAI",
                  description: "Используйте собственный API-ключ без ограничений сервиса"
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group rounded-2xl border border-white/10 bg-slate-900/60 p-6 transition hover:border-brand/30 hover:bg-slate-900/80"
                >
                  <div className="mb-4 inline-flex rounded-xl bg-brand/10 p-3 text-brand-light">
                    <feature.icon size={24} />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-400">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Блок "Почему это лучше ручной работы" */}
        <section className="border-y border-white/10 bg-slate-900/30 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Почему это лучше ручной работы
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Экономьте время и масштабируйте производство контента
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: TrendingUp,
                  title: "10× быстрее",
                  description: "Чем писать сценарии самому. Генерация за секунды вместо часов"
                },
                {
                  icon: Target,
                  title: "Стабильное качество",
                  description: "AI поддерживает единый стиль и тон для всех ваших каналов"
                },
                {
                  icon: Timer,
                  title: "Контент по расписанию",
                  description: "Публикации выходят строго в запланированное время, без задержек"
                },
                {
                  icon: Users,
                  title: "Десятки каналов без команды",
                  description: "Управляйте множеством каналов самостоятельно, без найма контент-менеджеров"
                },
                {
                  icon: Shield,
                  title: "Приватное хранение",
                  description: "Все данные хранятся безопасно в Firebase, только у вас"
                },
                {
                  icon: Zap,
                  title: "Без ограничений",
                  description: "Используйте свой API-ключ OpenAI без лимитов сервиса"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="flex gap-4 rounded-xl border border-white/10 bg-slate-900/60 p-6"
                >
                  <div className="flex-shrink-0">
                    <div className="rounded-lg bg-brand/10 p-3 text-brand-light">
                      <benefit.icon size={24} />
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-2 text-lg font-semibold text-white">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-400">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Блок о функционале (глубокий) */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Функции
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Всё необходимое для профессионального производства контента
              </p>
            </div>
            
            <div className="space-y-12">
              {/* Создание сценариев */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-purple-500/10 p-3 text-purple-400">
                    <Wand2 size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Создание сценариев
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {[
                    "Выбор языка (русский, английский, казахский)",
                    "Настройка длительности (15-60 секунд)",
                    "Выбор тона и стиля",
                    "Адаптация под нишу и аудиторию"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-brand-light" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Автоматизация */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-3 text-emerald-400">
                    <Calendar size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Автоматизация
                  </h3>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    "Расписание публикаций на любой день недели",
                    "Обратные таймеры до следующей публикации",
                    "Подсветка текущего и следующего ролика",
                    "Уведомления о завершении генерации",
                    "Автоматическая загрузка в Google Drive",
                    "Отправка через Telegram бота"
                  ].map((item, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-emerald-400" />
                      <span className="text-slate-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Генерация промптов */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-amber-500/10 p-3 text-amber-400">
                    <Sparkles size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Генерация промптов для Veo/Sora/GenAI
                  </h3>
                </div>
                <p className="text-slate-300">
                  Формирование готовых видео-промптов для генерации видео через AI-модели. 
                  Сценарии автоматически адаптируются под формат промпта для создания визуального контента.
                </p>
              </div>

              {/* Интеграции */}
              <div className="rounded-2xl border border-white/10 bg-slate-900/60 p-8 sm:p-10">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-xl bg-blue-500/10 p-3 text-blue-400">
                    <Bot size={28} />
                  </div>
                  <h3 className="text-2xl font-bold text-white">
                    Интеграции
                  </h3>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      icon: MessageSquare,
                      title: "Telegram Bot",
                      description: "Запуск генерации через бота, автоматическая отправка готовых видео"
                    },
                    {
                      icon: FolderOpen,
                      title: "Google Drive",
                      description: "Автоматическая загрузка сгенерированных видео в облачное хранилище"
                    },
                    {
                      icon: Zap,
                      title: "OpenAI API",
                      description: "Использование собственного API-ключа без ограничений"
                    }
                  ].map((integration, index) => (
                    <div key={index} className="rounded-xl border border-white/10 bg-slate-950/60 p-6">
                      <div className="mb-4 inline-flex rounded-lg bg-blue-500/10 p-2 text-blue-400">
                        <integration.icon size={24} />
                      </div>
                      <h4 className="mb-2 text-lg font-semibold text-white">
                        {integration.title}
                      </h4>
                      <p className="text-slate-400">
                        {integration.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Блок "Как это работает в 3 шага" */}
        <section className="border-y border-white/10 bg-gradient-to-br from-slate-900/50 to-slate-950 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Как это работает в 3 шага
              </h2>
              <p className="mx-auto max-w-2xl text-lg text-slate-400">
                Начните создавать контент уже через несколько минут
              </p>
            </div>
            
            <div className="grid gap-8 sm:grid-cols-3">
              {[
                {
                  step: "1",
                  title: "Создайте канал и настройте параметры",
                  description: "Выберите платформу, язык, длительность, тон и аудиторию. Настройте расписание публикаций.",
                  icon: Settings
                },
                {
                  step: "2",
                  title: "Запустите генерацию сценариев",
                  description: "Один клик — и AI создаст уникальный сценарий с учётом всех ваших настроек канала.",
                  icon: Sparkles
                },
                {
                  step: "3",
                  title: "Автоматизация публикует ролики по расписанию",
                  description: "Система автоматически загружает видео в Google Drive и отправляет через Telegram бота.",
                  icon: PlayCircle
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="relative rounded-2xl border border-white/10 bg-slate-900/60 p-8 text-center"
                >
                  <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-brand/20 text-3xl font-bold text-brand-light">
                    {step.step}
                  </div>
                  <div className="mb-4 inline-flex rounded-xl bg-brand/10 p-3 text-brand-light">
                    <step.icon size={32} />
                  </div>
                  <h3 className="mb-3 text-xl font-semibold text-white">
                    {step.title}
                  </h3>
                  <p className="text-slate-400">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Отзывы/кейсы (заглушки) */}
        <section className="px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                Отзывы пользователей
              </h2>
            </div>
            
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  name: "Алексей М.",
                  role: "Контент-мейкер",
                  text: "Экономит мне 10+ часов в неделю. Теперь могу вести 5 каналов одновременно без команды.",
                  rating: 5
                },
                {
                  name: "Мария К.",
                  role: "SMM-менеджер",
                  text: "Автоматизация работает идеально. Контент публикуется строго по расписанию, без задержек.",
                  rating: 5
                },
                {
                  name: "Дмитрий С.",
                  role: "Предприниматель",
                  text: "Лучший инструмент для масштабирования контента. Интеграция с Telegram и Drive — просто находка.",
                  rating: 5
                }
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-white/10 bg-slate-900/60 p-6"
                >
                  <div className="mb-4 flex gap-1">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <span key={i} className="text-amber-400">★</span>
                    ))}
                  </div>
                  <p className="mb-4 text-slate-300">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <div className="font-semibold text-white">{testimonial.name}</div>
                    <div className="text-sm text-slate-400">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA-блок */}
        <section className="border-y border-white/10 bg-gradient-to-r from-brand/20 via-brand/10 to-brand/20 px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
              Готовы начать создавать контент быстрее?
            </h2>
            <p className="mb-8 text-lg text-slate-300">
              Присоединяйтесь к создателям контента, которые уже экономят часы каждый день
            </p>
            <Link
              to="/auth"
              className="group inline-flex items-center gap-2 rounded-xl bg-brand px-10 py-5 text-lg font-semibold text-white transition hover:bg-brand-dark hover:shadow-lg hover:shadow-brand/30"
            >
              Попробовать сейчас
              <ArrowRight size={24} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 bg-slate-950 px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <div className="mb-4 flex items-center gap-2">
                  <Sparkles size={24} className="text-brand-light" />
                  <span className="text-lg font-semibold text-white">ShortsAI Studio</span>
                </div>
                <p className="text-sm text-slate-400">
                  Автоматизация генерации контента для Shorts, TikTok и Reels
                </p>
              </div>
              
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Правовая информация</h4>
                <ul className="space-y-2">
                  <li>
                    <Link to="/privacy" className="text-sm text-slate-400 transition hover:text-white">
                      Политика конфиденциальности
                    </Link>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Контакты</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="https://t.me/shortsai" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 transition hover:text-white">
                      Telegram канал
                    </a>
                  </li>
                </ul>
              </div>
              
              <div>
                <h4 className="mb-4 text-sm font-semibold text-white">Документация</h4>
                <ul className="space-y-2">
                  <li>
                    <a href="https://github.com/hotwellkz/p015" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-400 transition hover:text-white">
                      GitHub
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="mt-8 border-t border-white/10 pt-8 text-center text-sm text-slate-400">
              <p>© {new Date().getFullYear()} ShortsAI Studio. Все права защищены.</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default LandingPage;

