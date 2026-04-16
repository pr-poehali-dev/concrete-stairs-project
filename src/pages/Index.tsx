import { useState, useEffect, useRef } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "Портфолио", id: "portfolio" },
  { label: "Услуги", id: "services" },
  { label: "Цены", id: "prices" },
  { label: "О нас", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const PORTFOLIO_ITEMS = [
  { title: "Прямая маршевая", material: "Дуб / металл", year: "2024", bg: "bg-stone-200", accent: "from-stone-300 to-stone-100" },
  { title: "Винтовая классика", material: "Сосна / чёрный металл", year: "2024", bg: "bg-zinc-200", accent: "from-zinc-300 to-zinc-100" },
  { title: "Г-образная", material: "Ясень / нержавеющая сталь", year: "2023", bg: "bg-neutral-200", accent: "from-neutral-300 to-neutral-100" },
  { title: "П-образная", material: "Дуб / белый металл", year: "2023", bg: "bg-stone-300", accent: "from-stone-400 to-stone-200" },
  { title: "На больцах", material: "Бук / стекло", year: "2023", bg: "bg-zinc-300", accent: "from-zinc-400 to-zinc-200" },
  { title: "Консольная", material: "Дуб / скрытый металл", year: "2022", bg: "bg-neutral-300", accent: "from-neutral-400 to-neutral-200" },
];

const SERVICES = [
  { icon: "Ruler", title: "Замер и проект", desc: "Выезд специалиста, обмеры проёма, разработка 3D-проекта и согласование всех деталей перед производством." },
  { icon: "Hammer", title: "Производство", desc: "Изготовление на собственном предприятии из сертифицированных материалов. Контроль качества на каждом этапе." },
  { icon: "Truck", title: "Доставка", desc: "Доставка по городу и области. Бережная упаковка и транспортировка всех элементов конструкции." },
  { icon: "Wrench", title: "Монтаж", desc: "Профессиональная установка бригадой мастеров. Монтаж, отделка, устранение недостатков и сдача объекта." },
  { icon: "Shield", title: "Гарантия", desc: "5 лет гарантии на конструкцию и 2 года на лакокрасочное покрытие. Гарантийное и постгарантийное обслуживание." },
  { icon: "Palette", title: "Дизайн-проект", desc: "Разработка индивидуального дизайна, подбор материалов и отделки под интерьер вашего дома." },
];

const PRICE_CATEGORIES = [
  {
    title: "Прямые маршевые лестницы",
    subtitle: "Классическое решение для любого интерьера",
    items: [
      { name: "Прямая на деревянных косоурах (сосна)", price: "от 85 000 ₽" },
      { name: "Прямая на металлических косоурах", price: "от 120 000 ₽" },
      { name: "Прямая на больцах (стекло)", price: "от 180 000 ₽" },
      { name: "Прямая консольная (скрытый металл)", price: "от 250 000 ₽" },
    ],
  },
  {
    title: "Поворотные лестницы",
    subtitle: "Г-образные и П-образные конструкции",
    items: [
      { name: "Г-образная с площадкой (дерево)", price: "от 110 000 ₽" },
      { name: "Г-образная с забежными ступенями", price: "от 135 000 ₽" },
      { name: "П-образная с площадкой (дерево)", price: "от 140 000 ₽" },
      { name: "П-образная комбинированная", price: "от 195 000 ₽" },
    ],
  },
  {
    title: "Винтовые лестницы",
    subtitle: "Компактные конструкции для ограниченного пространства",
    items: [
      { name: "Винтовая деревянная (сосна, д.120 см)", price: "от 95 000 ₽" },
      { name: "Винтовая деревянная (дуб, д.120 см)", price: "от 130 000 ₽" },
      { name: "Винтовая металлическая", price: "от 115 000 ₽" },
      { name: "Винтовая комбинированная (дуб+металл)", price: "от 200 000 ₽" },
    ],
  },
  {
    title: "Ограждения и перила",
    subtitle: "Отдельно или в составе лестницы",
    items: [
      { name: "Деревянные перила (пог. м)", price: "от 3 500 ₽/м" },
      { name: "Металлические перила кованые (пог. м)", price: "от 6 000 ₽/м" },
      { name: "Перила из нержавеющей стали (пог. м)", price: "от 8 500 ₽/м" },
      { name: "Ограждение со стеклом (пог. м)", price: "от 12 000 ₽/м" },
    ],
  },
  {
    title: "Материалы ступеней",
    subtitle: "Стоимость одной ступени по породам дерева",
    items: [
      { name: "Сосна (клееный щит)", price: "от 1 800 ₽/шт" },
      { name: "Берёза", price: "от 2 400 ₽/шт" },
      { name: "Ясень", price: "от 3 200 ₽/шт" },
      { name: "Дуб", price: "от 4 500 ₽/шт" },
    ],
  },
  {
    title: "Дополнительные услуги",
    subtitle: "Замер, монтаж, гарантийное обслуживание",
    items: [
      { name: "Выезд замерщика (в черте города)", price: "Бесплатно" },
      { name: "Разработка 3D-проекта", price: "от 5 000 ₽" },
      { name: "Монтаж лестницы", price: "от 15 000 ₽" },
      { name: "Реставрация и покраска", price: "от 20 000 ₽" },
    ],
  },
];

function useScrollSpy() {
  const [active, setActive] = useState("home");
  useEffect(() => {
    const handler = () => {
      const scrollY = window.scrollY + 100;
      for (let i = NAV_LINKS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_LINKS[i].id);
        if (el && el.offsetTop <= scrollY) {
          setActive(NAV_LINKS[i].id);
          break;
        }
      }
    };
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return active;
}

function scrollTo(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

function AnimatedSection({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"} ${className}`}
    >
      {children}
    </div>
  );
}

export default function Index() {
  const active = useScrollSpy();
  const [menuOpen, setMenuOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", message: "" });

  return (
    <div className="font-golos bg-white text-zinc-900">

      {/* НАВИГАЦИЯ */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("home")} className="font-cormorant text-xl font-semibold tracking-wide text-zinc-900">
            АртЛестница
          </button>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className={`text-sm tracking-wide transition-colors ${
                  active === l.id ? "text-zinc-900 font-medium" : "text-zinc-400 hover:text-zinc-700"
                }`}
              >
                {l.label}
              </button>
            ))}
          </nav>
          <button
            className="hidden md:flex items-center gap-2 bg-zinc-900 text-white text-sm px-5 py-2.5 hover:bg-zinc-700 transition-colors"
            onClick={() => scrollTo("contacts")}
          >
            Получить расчёт
          </button>
          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Icon name={menuOpen ? "X" : "Menu"} size={22} />
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden border-t border-zinc-100 bg-white px-6 py-4 flex flex-col gap-4">
            {NAV_LINKS.map((l) => (
              <button
                key={l.id}
                onClick={() => { scrollTo(l.id); setMenuOpen(false); }}
                className="text-left text-sm text-zinc-600 hover:text-zinc-900"
              >
                {l.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* ГЛАВНАЯ */}
      <section id="home" className="min-h-screen flex flex-col justify-end pb-20 pt-32 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
          <div>
            <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-6">Изготовление лестниц с 2008 года</p>
            <h1 className="font-cormorant text-6xl md:text-8xl font-light leading-[0.9] text-zinc-900 mb-8">
              Лестницы,<br />
              <em className="italic">которые</em><br />
              остаются
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 mt-10">
              <button
                onClick={() => scrollTo("portfolio")}
                className="bg-zinc-900 text-white text-sm px-8 py-4 hover:bg-zinc-700 transition-colors tracking-wide"
              >
                Смотреть работы
              </button>
              <button
                onClick={() => scrollTo("prices")}
                className="border border-zinc-300 text-zinc-700 text-sm px-8 py-4 hover:border-zinc-600 transition-colors tracking-wide"
              >
                Прайс-лист
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Проектов", value: "800+" },
              { label: "Лет опыта", value: "16" },
              { label: "Гарантия", value: "5 лет" },
              { label: "Срок изготовления", value: "30 дней" },
            ].map((stat) => (
              <div key={stat.label} className="bg-zinc-50 p-6">
                <div className="font-cormorant text-4xl font-light text-zinc-900 mb-1">{stat.value}</div>
                <div className="text-xs text-zinc-400 tracking-wide">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-20 h-px bg-zinc-100" />
        <div className="flex flex-wrap gap-4 md:gap-8 pt-6 text-xs text-zinc-400 tracking-wide">
          <span>Дерево</span><span>—</span>
          <span>Металл</span><span>—</span>
          <span>Стекло</span><span>—</span>
          <span>Комбинированные</span>
        </div>
      </section>

      {/* ПОРТФОЛИО */}
      <section id="portfolio" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-3">Наши работы</p>
                <h2 className="font-cormorant text-5xl md:text-6xl font-light text-zinc-900">Портфолио</h2>
              </div>
              <p className="hidden md:block text-sm text-zinc-400 max-w-xs text-right">
                Более 800 реализованных проектов в Москве и Московской области
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PORTFOLIO_ITEMS.map((item) => (
              <AnimatedSection key={item.title}>
                <div className={`group relative overflow-hidden cursor-pointer ${item.bg}`}>
                  <div className={`h-64 bg-gradient-to-br ${item.accent} flex items-center justify-center`}>
                    <div className="text-center opacity-40">
                      <Icon name="Layers" size={40} className="mx-auto mb-2 text-zinc-600" />
                      <p className="text-xs text-zinc-600 tracking-widest uppercase">Фото</p>
                    </div>
                  </div>
                  <div className="p-5 bg-white">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-cormorant text-xl font-medium text-zinc-900">{item.title}</h3>
                        <p className="text-xs text-zinc-500 mt-1">{item.material}</p>
                      </div>
                      <span className="text-xs text-zinc-400">{item.year}</span>
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-zinc-900/0 group-hover:border-zinc-900/20 transition-colors" />
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* УСЛУГИ */}
      <section id="services" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-3">Что мы делаем</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-zinc-900">Услуги</h2>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-zinc-100">
            {SERVICES.map((service) => (
              <AnimatedSection key={service.title}>
                <div className="bg-white p-8 hover:bg-zinc-50 transition-colors group h-full">
                  <div className="w-10 h-10 border border-zinc-200 flex items-center justify-center mb-6 group-hover:border-zinc-400 transition-colors">
                    <Icon name={service.icon} fallback="Star" size={18} className="text-zinc-600" />
                  </div>
                  <h3 className="font-cormorant text-2xl font-medium text-zinc-900 mb-3">{service.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{service.desc}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ЦЕНЫ */}
      <section id="prices" className="py-24 px-6 bg-zinc-50">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="mb-14">
              <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-3">Стоимость работ</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-zinc-900">Прайс-лист</h2>
              <p className="text-sm text-zinc-500 mt-4 max-w-lg">
                Цены указаны ориентировочно. Точная стоимость рассчитывается после замера и уточнения всех параметров.
              </p>
            </div>
          </AnimatedSection>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {PRICE_CATEGORIES.map((cat) => (
              <AnimatedSection key={cat.title}>
                <div className="bg-white p-8">
                  <h3 className="font-cormorant text-2xl font-medium text-zinc-900 mb-1">{cat.title}</h3>
                  <p className="text-xs text-zinc-400 mb-6">{cat.subtitle}</p>
                  <div>
                    {cat.items.map((item, ii) => (
                      <div
                        key={item.name}
                        className={`flex items-center justify-between py-3.5 ${ii < cat.items.length - 1 ? "border-b border-zinc-100" : ""}`}
                      >
                        <span className="text-sm text-zinc-600 pr-4">{item.name}</span>
                        <span className="text-sm font-medium text-zinc-900 whitespace-nowrap">{item.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection className="mt-8">
            <div className="bg-zinc-900 text-white p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <p className="font-cormorant text-2xl font-light mb-1">Нужен точный расчёт?</p>
                <p className="text-sm text-zinc-400">Позвоните нам или оставьте заявку — рассчитаем бесплатно</p>
              </div>
              <button
                onClick={() => scrollTo("contacts")}
                className="border border-white text-white text-sm px-8 py-3.5 hover:bg-white hover:text-zinc-900 transition-colors whitespace-nowrap"
              >
                Заказать расчёт
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* О НАС */}
      <section id="about" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection>
              <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-3">О компании</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-zinc-900 mb-8">
                Мастерство,<br />
                <em className="italic">проверенное</em><br />
                временем
              </h2>
              <div className="space-y-5 text-sm text-zinc-500 leading-relaxed">
                <p>С 2008 года мы проектируем и изготавливаем лестницы для частных домов, коттеджей и коммерческих помещений. За эти годы воплотили в жизнь более 800 уникальных проектов.</p>
                <p>Каждая лестница — индивидуальное изделие, которое мы создаём с учётом архитектуры дома, пожеланий владельца и требований безопасности. Работаем только с проверенными материалами.</p>
                <p>Собственное производство площадью 2000 м² позволяет контролировать качество на каждом этапе — от заготовки до финишного покрытия.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "2008", label: "Год основания" },
                  { val: "800+", label: "Объектов сдано" },
                  { val: "2000 м²", label: "Производство" },
                  { val: "40+", label: "Мастеров в команде" },
                ].map((s) => (
                  <div key={s.label} className="border border-zinc-100 p-8">
                    <div className="font-cormorant text-4xl font-light text-zinc-900 mb-2">{s.val}</div>
                    <div className="text-xs text-zinc-400 tracking-wide">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* КОНТАКТЫ */}
      <section id="contacts" className="py-24 px-6 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <AnimatedSection>
              <p className="text-xs tracking-[0.25em] text-zinc-400 uppercase mb-3">Свяжитесь с нами</p>
              <h2 className="font-cormorant text-5xl md:text-6xl font-light text-white mb-10">
                Начнём<br />ваш проект
              </h2>
              <div className="space-y-6">
                {[
                  { icon: "Phone", label: "Телефон", val: "+7 (495) 000-00-00" },
                  { icon: "Mail", label: "Email", val: "info@artlestnitsa.ru" },
                  { icon: "MapPin", label: "Адрес", val: "Москва, ул. Примерная, д. 1" },
                  { icon: "Clock", label: "Режим работы", val: "Пн–Сб, 9:00–19:00" },
                ].map((c) => (
                  <div key={c.label} className="flex items-start gap-4">
                    <div className="w-8 h-8 border border-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Icon name={c.icon} fallback="Circle" size={14} className="text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-xs text-zinc-500 mb-0.5">{c.label}</p>
                      <p className="text-sm text-zinc-200">{c.val}</p>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-zinc-800 p-8">
                <h3 className="font-cormorant text-2xl font-light text-white mb-6">Оставить заявку</h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => { e.preventDefault(); alert("Заявка отправлена! Мы свяжемся с вами."); }}
                >
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2 tracking-wide">Ваше имя</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white text-sm px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500"
                      placeholder="Иван Иванов"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2 tracking-wide">Телефон</label>
                    <input
                      type="tel"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white text-sm px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500"
                      placeholder="+7 (___) ___-__-__"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 block mb-2 tracking-wide">Сообщение</label>
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-zinc-700 border border-zinc-600 text-white text-sm px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500 resize-none"
                      placeholder="Опишите ваш проект, размеры проёма, пожелания по материалам..."
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-white text-zinc-900 text-sm font-medium py-4 hover:bg-zinc-200 transition-colors tracking-wide"
                  >
                    Отправить заявку
                  </button>
                </form>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="py-8 px-6 bg-zinc-950 text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-cormorant text-lg text-zinc-400">АртЛестница</span>
          <span className="text-xs">© 2024 АртЛестница. Все права защищены.</span>
          <span className="text-xs">Изготовление лестниц с 2008 года</span>
        </div>
      </footer>
    </div>
  );
}