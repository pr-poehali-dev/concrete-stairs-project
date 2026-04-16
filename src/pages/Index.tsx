import { useState, useEffect, useRef, FormEvent } from "react";
import Icon from "@/components/ui/icon";

const NAV_LINKS = [
  { label: "Главная", id: "home" },
  { label: "Наши работы", id: "jb" },
  { label: "Услуги", id: "services" },
  { label: "О нас", id: "about" },
  { label: "Контакты", id: "contacts" },
];

const JB_PHOTOS = [
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/58b60c7e-0594-4926-a041-573c3517c38f.jpg", title: "Г-образная ж/б", desc: "Двухмаршевая с забежными ступенями" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/bf6da054-0ae5-4734-bd00-d98790c3c01c.jpg", title: "П-образная ж/б", desc: "Многомаршевая конструкция" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/c1171b0f-7e68-4ba7-92d6-05bb762b06bf.jpg", title: "Маршевая с закруглением", desc: "С закруглённым нижним маршем" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/db9d71e5-0f7e-4e7e-8195-5cf75ddbd91e.jpg", title: "П-образная вид сверху", desc: "Вид сверху, закрытый проём" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/4f4bf395-1e12-4ee4-a136-fbe208b45e14.png", title: "П-образная ж/б", desc: "Двухмаршевая с поворотом" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/5af41e1f-1eca-4e31-b14c-de7340e4a80a.jpg", title: "Маршевая ж/б", desc: "Прямой марш с площадкой" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/bbdfe161-da14-4be2-9a55-c5a49db2dd68.jpg", title: "Г-образная ж/б", desc: "С закруглённым нижним маршем" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/df7409f6-2532-429f-95b4-6145c1f8522b.jpg", title: "Винтовая ж/б", desc: "Компактная забежная конструкция" },
  { url: "https://cdn.poehali.dev/projects/705ac054-ce69-4453-af09-fe16be3731e4/bucket/533b9280-6d5f-4cf4-a5ae-f264d267d20a.jpg", title: "Спиральная ж/б", desc: "Вид сверху, закрытый проём" },
];

const SERVICES = [
  { icon: "Ruler", title: "Замер и проект", desc: "Выезд специалиста, обмеры проёма, разработка 3D-проекта и согласование всех деталей перед производством." },
  { icon: "Hammer", title: "Производство", desc: "Изготовление на собственном предприятии из сертифицированных материалов. Контроль качества на каждом этапе." },
  { icon: "Truck", title: "Доставка", desc: "Доставка по городу и области. Бережная упаковка и транспортировка всех элементов конструкции." },
  { icon: "Wrench", title: "Монтаж", desc: "Профессиональная установка бригадой мастеров. Монтаж, отделка, устранение недостатков и сдача объекта." },
  { icon: "Shield", title: "Гарантия", desc: "5 лет гарантии на конструкцию и 2 года на лакокрасочное покрытие. Гарантийное и постгарантийное обслуживание." },
  { icon: "Palette", title: "Дизайн-проект", desc: "Разработка индивидуального дизайна, подбор материалов и отделки под интерьер вашего дома." },
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
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.phone) return;
    setFormStatus("sending");
    try {
      const res = await fetch("https://functions.poehali.dev/789ac8b8-978e-4325-aeea-22f327128359", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setFormStatus("done");
        setForm({ name: "", phone: "", message: "" });
      } else {
        setFormStatus("error");
      }
    } catch {
      setFormStatus("error");
    }
  }

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
          <a
            href="tel:+79109550300"
            className="hidden md:flex items-center gap-2 bg-zinc-900 text-white text-sm px-5 py-2.5 hover:bg-zinc-700 transition-colors"
          >
            <Icon name="Phone" size={14} />
            +7 910 955-03-00
          </a>
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
                onClick={() => scrollTo("jb")}
                className="bg-zinc-900 text-white text-sm px-8 py-4 hover:bg-zinc-700 transition-colors tracking-wide"
              >
                Смотреть работы
              </button>
              <button
                onClick={() => scrollTo("contacts")}
                className="border border-zinc-300 text-zinc-700 text-sm px-8 py-4 hover:border-zinc-600 transition-colors tracking-wide"
              >
                Связаться
              </button>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Лет опыта", value: "10+" },
              { label: "Мастеров", value: "2–4" },
              { label: "Гарантия", value: "Есть" },
              { label: "Работаем", value: "Пн–Вс" },
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
          <span>Железобетон</span><span>—</span>
          <span>Комбинированные</span>
        </div>
      </section>



      {/* Ж/Б ЛЕСТНИЦЫ */}
      <section id="jb" className="py-24 px-6 bg-stone-900 text-white">
        <div className="max-w-7xl mx-auto">
          <AnimatedSection>
            <div className="flex items-end justify-between mb-14">
              <div>
                <p className="text-xs tracking-[0.25em] text-stone-400 uppercase mb-3">Монолитный железобетон</p>
                <h2 className="font-cormorant text-5xl md:text-6xl font-light text-white">
                  Ж/б лестницы
                </h2>
              </div>
              <p className="hidden md:block text-sm text-stone-400 max-w-xs text-right leading-relaxed">
                Надёжные монолитные конструкции из армированного бетона — для частных домов и коммерческих объектов
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-12">
            {JB_PHOTOS.map((photo, i) => (
              <AnimatedSection key={i}>
                <div className="group relative overflow-hidden aspect-[3/4] cursor-pointer">
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="font-cormorant text-base font-medium text-white leading-tight">{photo.title}</p>
                    <p className="text-xs text-stone-300 mt-0.5">{photo.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t border-stone-700 pt-12">
              {[
                { icon: "Shield", title: "Долговечность", desc: "Монолитный бетон служит десятилетиями без деформаций и скрипа" },
                { icon: "Layers", title: "Любая отделка", desc: "Под дерево, плитку, ламинат, ковровое покрытие — на ваш выбор" },
                { icon: "Ruler", title: "Любая форма", desc: "Прямые, Г-образные, П-образные, забежные и винтовые конструкции" },
              ].map((f) => (
                <div key={f.title} className="flex gap-4 items-start">
                  <div className="w-9 h-9 border border-stone-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Icon name={f.icon} fallback="Star" size={16} className="text-stone-400" />
                  </div>
                  <div>
                    <h4 className="font-cormorant text-xl font-medium text-white mb-1">{f.title}</h4>
                    <p className="text-sm text-stone-400 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
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
                <p>Более 10 лет занимаемся бетонными работами в Ярославле. Специализируемся на монолитных железобетонных лестницах для частных домов, коттеджей и коммерческих объектов.</p>
                <p>Работаем бригадой 2–4 мастера. Выезжаем по всему Ярославлю и другим областям России. Станислав лично контролирует каждый объект.</p>
                <p>Работаем по договору. Готовим все документы: договор, расписку, акт. Материалы закупаем самостоятельно. Есть гарантия на выполненные работы.</p>
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { val: "10+", label: "Лет опыта" },
                  { val: "2–4", label: "Мастера в бригаде" },
                  { val: "Есть", label: "Гарантия на работу" },
                  { val: "Пн–Вс", label: "Работаем без выходных" },
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
                  { icon: "Phone", label: "Телефон", val: "+7 910 955-03-00 — Станислав" },
                  { icon: "Mail", label: "Почта", val: "missis.alio@yandex.ru" },
                  { icon: "MapPin", label: "Адрес", val: "Ярославль, Яковлевская ул., р-н Заволжский" },
                  { icon: "Clock", label: "Режим работы", val: "Пн–Вс, 07:00–20:00" },
                  { icon: "Car", label: "Выезд", val: "По всей Ярославской области и другим регионам РФ" },
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
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <a
                  href="tel:+79109550300"
                  className="inline-flex items-center justify-center gap-3 bg-white text-zinc-900 text-sm font-medium px-6 py-4 hover:bg-zinc-200 transition-colors tracking-wide"
                >
                  <Icon name="Phone" size={16} />
                  Позвонить
                </a>
                <a
                  href="https://vk.com/club228096132"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 border border-zinc-600 text-zinc-200 text-sm px-6 py-4 hover:border-zinc-400 hover:text-white transition-colors tracking-wide"
                >
                  ВКонтакте
                </a>
                <a
                  href="mailto:missis.alio@yandex.ru"
                  className="inline-flex items-center justify-center gap-3 border border-zinc-600 text-zinc-200 text-sm px-6 py-4 hover:border-zinc-400 hover:text-white transition-colors tracking-wide"
                >
                  <Icon name="Mail" size={16} />
                  Почта
                </a>
              </div>
              <div className="mt-6 overflow-hidden">
                <iframe
                  src="https://yandex.ru/map-widget/v1/?ll=39.838509%2C57.626560&z=15&pt=39.838509,57.626560,pm2rdm"
                  width="100%"
                  height="200"
                  frameBorder="0"
                  allowFullScreen
                  className="w-full grayscale opacity-80"
                  title="Карта"
                />
              </div>
            </AnimatedSection>
            <AnimatedSection>
              <div className="bg-zinc-800 p-8 mb-4">
                <h3 className="font-cormorant text-2xl font-light text-white mb-6">Оставить заявку</h3>
                {formStatus === "done" ? (
                  <div className="py-8 text-center">
                    <div className="w-12 h-12 border border-zinc-500 flex items-center justify-center mx-auto mb-4">
                      <Icon name="Check" size={22} className="text-white" />
                    </div>
                    <p className="text-white font-cormorant text-xl mb-2">Заявка отправлена!</p>
                    <p className="text-zinc-400 text-sm">Мы свяжемся с вами в ближайшее время</p>
                    <button onClick={() => setFormStatus("idle")} className="mt-6 text-xs text-zinc-500 hover:text-zinc-300 underline">
                      Отправить ещё
                    </button>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={handleSubmit}>
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
                      <label className="text-xs text-zinc-400 block mb-2 tracking-wide">Телефон *</label>
                      <input
                        type="tel"
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        className="w-full bg-zinc-700 border border-zinc-600 text-white text-sm px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500"
                        placeholder="+7 (___) ___-__-__"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 block mb-2 tracking-wide">Сообщение</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-zinc-700 border border-zinc-600 text-white text-sm px-4 py-3 focus:outline-none focus:border-zinc-400 transition-colors placeholder:text-zinc-500 resize-none"
                        placeholder="Опишите ваш проект, тип лестницы, размеры..."
                      />
                    </div>
                    {formStatus === "error" && (
                      <p className="text-red-400 text-xs">Ошибка отправки. Попробуйте ещё раз или позвоните нам.</p>
                    )}
                    <button
                      type="submit"
                      disabled={formStatus === "sending"}
                      className="w-full bg-white text-zinc-900 text-sm font-medium py-4 hover:bg-zinc-200 transition-colors tracking-wide disabled:opacity-50"
                    >
                      {formStatus === "sending" ? "Отправляем..." : "Отправить заявку"}
                    </button>
                  </form>
                )}
              </div>
              <div className="space-y-3">
                <a href="tel:+79109550300" className="flex items-center gap-4 bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors group">
                  <Icon name="Phone" size={16} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <span className="text-sm text-zinc-300">+7 910 955-03-00 — Станислав</span>
                </a>
                <a href="https://vk.com/club228096132" target="_blank" rel="noopener noreferrer" className="flex items-center gap-4 bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors group">
                  <span className="text-xs font-bold text-zinc-400 group-hover:text-zinc-200 transition-colors w-4">ВК</span>
                  <span className="text-sm text-zinc-300">vk.com/club228096132</span>
                </a>
                <a href="mailto:missis.alio@yandex.ru" className="flex items-center gap-4 bg-zinc-800 px-6 py-4 hover:bg-zinc-700 transition-colors group">
                  <Icon name="Mail" size={16} className="text-zinc-400 group-hover:text-zinc-200 transition-colors" />
                  <span className="text-sm text-zinc-300">missis.alio@yandex.ru</span>
                </a>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* ФУТЕР */}
      <footer className="py-8 px-6 bg-zinc-950 text-zinc-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="font-cormorant text-lg text-zinc-400">Ж/б лестницы — Ярославль</span>
          <span className="text-xs">© 2024. Все права защищены.</span>
          <a href="tel:+79109550300" className="text-xs hover:text-zinc-400 transition-colors">+7 910 955-03-00</a>
        </div>
      </footer>
    </div>
  );
}