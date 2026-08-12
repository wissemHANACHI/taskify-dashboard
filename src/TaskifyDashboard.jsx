import React, { useState, useMemo } from "react";
import {
  LayoutDashboard,
  ListChecks,
  FolderKanban,
  BarChart3,
  Settings,
  Bell,
  Search,
  Filter,
  Trash2,
  CheckCircle2,
  Circle,
  Plus,
  X,
  Clock,
  Users,
  Moon,
  Sun,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const CATEGORY_STYLES = {
  Design: { bg: "bg-violet-100", text: "text-violet-700", bar: "bg-violet-500", barColor: "#8b5cf6" },
  Dev: { bg: "bg-blue-100", text: "text-blue-700", bar: "bg-blue-500", barColor: "#3b82f6" },
  Marketing: { bg: "bg-orange-100", text: "text-orange-700", bar: "bg-orange-500", barColor: "#f97316" },
  Recherche: { bg: "bg-emerald-100", text: "text-emerald-700", bar: "bg-emerald-500", barColor: "#10b981" },
};

const INITIAL_TASKS = [
  { id: 1, title: "Web Dashboard", category: "Design", subtitle: "Maquettes UI", progress: 90, completed: false, due: "2 Mar", hours: 18 },
  { id: 2, title: "Mobile App", category: "Marketing", subtitle: "Campagne shopping", progress: 30, completed: false, due: "6 Mar", hours: 6 },
  { id: 3, title: "API Auth", category: "Dev", subtitle: "Endpoints sécurisés", progress: 75, completed: false, due: "8 Mar", hours: 14 },
  { id: 4, title: "Etude concurrentielle", category: "Recherche", subtitle: "Benchmark marché", progress: 100, completed: true, due: "1 Mar", hours: 9 },
  { id: 5, title: "Design system", category: "Design", subtitle: "Composants UI", progress: 60, completed: false, due: "10 Mar", hours: 11 },
  { id: 6, title: "Tests unitaires", category: "Dev", subtitle: "Couverture back-end", progress: 15, completed: false, due: "12 Mar", hours: 3 },
];

const INITIAL_PROJECTS = [
  {
    id: 1,
    name: "Refonte site vitrine",
    category: "Design",
    progress: 72,
    deadline: "20 Mar",
    objectives: ["Nouvelle identité visuelle", "Améliorer le temps de chargement", "Refonte du parcours d'achat"],
    members: ["Kim Namjoon", "Rinsen Jey"],
  },
  {
    id: 2,
    name: "App mobile v2",
    category: "Dev",
    progress: 45,
    deadline: "2 Avr",
    objectives: ["Migration vers React Native", "Mode hors-ligne", "Notifications push"],
    members: ["Kim Jee yong", "Rinsen Jey", "Kim Namjoon"],
  },
  {
    id: 3,
    name: "Campagne printemps",
    category: "Marketing",
    progress: 88,
    deadline: "15 Mar",
    objectives: ["Toucher 50k nouveaux visiteurs", "Lancer 3 partenariats influenceurs"],
    members: ["Kim Jee yong"],
  },
  {
    id: 4,
    name: "Etude UX utilisateurs",
    category: "Recherche",
    progress: 30,
    deadline: "28 Mar",
    objectives: ["Interviewer 20 utilisateurs", "Produire un rapport de synthèse"],
    members: ["Kim Namjoon"],
  },
];

const WEEKLY_DATA = [
  { day: "Lun", heures: 5 },
  { day: "Mar", heures: 7 },
  { day: "Mer", heures: 4 },
  { day: "Jeu", heures: 8 },
  { day: "Ven", heures: 6 },
  { day: "Sam", heures: 2 },
  { day: "Dim", heures: 0 },
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: ListChecks, label: "Suivi" },
  { icon: FolderKanban, label: "Projets" },
  { icon: BarChart3, label: "Rapports" },
];

const NAV_ITEMS_BOTTOM = [{ icon: Settings, label: "Paramètres" }];

const PIE_COLORS = ["#8b5cf6", "#3b82f6", "#f97316", "#10b981"];

export default function TaskifyDashboard() {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("Toutes");
  const [categoryFilter, setCategoryFilter] = useState("Toutes");
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [showAdd, setShowAdd] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState("Design");

  // Settings state
  const [profileName, setProfileName] = useState("Kim Namjoon");
  const [profileEmail, setProfileEmail] = useState("kim.namjoon@taskify.io");
  const [darkMode, setDarkMode] = useState(false);
  const [notifTasks, setNotifTasks] = useState(true);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifWeekly, setNotifWeekly] = useState(false);

  const categories = Object.keys(CATEGORY_STYLES);

  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      const matchesStatus =
        statusFilter === "Toutes" ||
        (statusFilter === "Terminés" && t.completed) ||
        (statusFilter === "En cours" && !t.completed);
      const matchesCategory = categoryFilter === "Toutes" || t.category === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [tasks, search, statusFilter, categoryFilter]);

  const completedCount = tasks.filter((t) => t.completed).length;
  const overallProgress = tasks.length
    ? Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)
    : 0;

  function toggleComplete(id) {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, completed: !t.completed, progress: !t.completed ? 100 : t.progress }
          : t
      )
    );
  }

  function deleteTask(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function addTask(e) {
    e.preventDefault();
    if (!newTitle.trim()) return;
    setTasks((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: newTitle.trim(),
        category: newCategory,
        subtitle: "Nouvelle tache",
        progress: 0,
        completed: false,
        due: "\u2014",
        hours: 0,
      },
    ]);
    setNewTitle("");
    setShowAdd(false);
  }

  function updateProgress(id, value) {
    const progress = Number(value);
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, progress, completed: progress === 100 } : t))
    );
  }

  function addProject(project) {
    setProjects((prev) => [...prev, { ...project, id: Date.now() }]);
  }

  function updateProject(id, updates) {
    setProjects((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }

  function deleteProject(id) {
    setProjects((prev) => prev.filter((p) => p.id !== id));
  }

  const categoryTotals = categories.map((cat) => ({
    name: cat,
    value: tasks.filter((t) => t.category === cat).length,
  })).filter((c) => c.value > 0);

  const totalHours = tasks.reduce((sum, t) => sum + (t.hours || 0), 0);

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="min-h-screen w-full bg-slate-50 dark:bg-slate-900 flex transition-colors">
        {/* Sidebar */}
        <aside className="w-60 bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 flex flex-col py-6 px-4 shrink-0">
          <div className="flex items-center gap-2 px-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-semibold">
              T
            </div>
            <span className="font-semibold text-slate-800 dark:text-white text-lg">Taskify</span>
          </div>

          <nav className="flex-1 space-y-1">
            {NAV_ITEMS.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeNav === label
                    ? "bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </nav>

          <div className="space-y-1 pt-4 border-t border-slate-100 dark:border-slate-700">
            {NAV_ITEMS_BOTTOM.map(({ icon: Icon, label }) => (
              <button
                key={label}
                onClick={() => setActiveNav(label)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeNav === label
                    ? "bg-violet-50 dark:bg-violet-500/20 text-violet-700 dark:text-violet-300"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
                }`}
              >
                <Icon size={18} />
                {label}
              </button>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-8 max-w-5xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-slate-800 dark:text-white">{activeNav}</h1>
              <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">
                {activeNav === "Dashboard" && "Voici l'état de tes tâches aujourd'hui"}
                {activeNav === "Suivi" && "Ton temps passé sur chaque tâche cette semaine"}
                {activeNav === "Projets" && "Vue d'ensemble de tes projets en cours"}
                {activeNav === "Rapports" && "Statistiques et répartition de ton activité"}
                {activeNav === "Paramètres" && "Gère ton profil et tes préférences"}
              </p>
            </div>
            <button className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-300">
              <Bell size={18} />
            </button>
          </div>

          {activeNav === "Dashboard" && (
            <DashboardPage
              tasks={filteredTasks}
              completedCount={completedCount}
              totalCount={tasks.length}
              overallProgress={overallProgress}
              search={search}
              setSearch={setSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              categories={categories}
              showAdd={showAdd}
              setShowAdd={setShowAdd}
              newTitle={newTitle}
              setNewTitle={setNewTitle}
              newCategory={newCategory}
              setNewCategory={setNewCategory}
              addTask={addTask}
              toggleComplete={toggleComplete}
              deleteTask={deleteTask}
              updateProgress={updateProgress}
            />
          )}

          {activeNav === "Suivi" && <SuiviPage tasks={tasks} totalHours={totalHours} />}

          {activeNav === "Projets" && (
            <ProjetsPage
              projects={projects}
              categories={categories}
              addProject={addProject}
              updateProject={updateProject}
              deleteProject={deleteProject}
            />
          )}

          {activeNav === "Rapports" && (
            <RapportsPage categoryTotals={categoryTotals} completedCount={completedCount} totalCount={tasks.length} />
          )}

          {activeNav === "Paramètres" && (
            <ParametresPage
              profileName={profileName}
              setProfileName={setProfileName}
              profileEmail={profileEmail}
              setProfileEmail={setProfileEmail}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
              notifTasks={notifTasks}
              setNotifTasks={setNotifTasks}
              notifDeadlines={notifDeadlines}
              setNotifDeadlines={setNotifDeadlines}
              notifWeekly={notifWeekly}
              setNotifWeekly={setNotifWeekly}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function DashboardPage({
  tasks,
  completedCount,
  totalCount,
  overallProgress,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  categories,
  showAdd,
  setShowAdd,
  newTitle,
  setNewTitle,
  newCategory,
  setNewCategory,
  addTask,
  toggleComplete,
  deleteTask,
  updateProgress,
}) {
  return (
    <>
      {/* Progress banner */}
      <div className="bg-violet-600 rounded-2xl p-6 mb-6 text-white flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Progression globale</h2>
          <p className="text-violet-100 text-sm">
            {completedCount} / {totalCount} tâches terminées
          </p>
        </div>
        <div className="text-right">
          <div className="text-4xl font-bold">{overallProgress}%</div>
          <button
            onClick={() => setShowAdd(true)}
            className="mt-3 inline-flex items-center gap-1.5 bg-white text-violet-700 text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-50 transition-colors"
          >
            <Plus size={16} />
            Nouvelle tâche
          </button>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher une tâche..."
            className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
        </div>

        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5">
          <Filter size={14} className="text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="text-sm text-slate-600 dark:text-white bg-transparent focus:outline-none"
          >
            <option>Toutes</option>
            <option>En cours</option>
            <option>Terminées</option>
          </select>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setCategoryFilter("Toutes")}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
              categoryFilter === "Toutes"
                ? "bg-slate-800 text-white border-slate-800"
                : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                categoryFilter === cat
                  ? `${CATEGORY_STYLES[cat].bg} ${CATEGORY_STYLES[cat].text} border-transparent`
                  : "bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-300 border-slate-200 dark:border-slate-700"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Add task form */}
      {showAdd && (
        <form
          onSubmit={addTask}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 mb-6 flex items-center gap-3"
        >
          <input
            autoFocus
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Titre de la tâche"
            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
          />
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
          >
            {categories.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
          >
            Ajouter
          </button>
          <button
            type="button"
            onClick={() => setShowAdd(false)}
            className="p-2 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <X size={16} />
          </button>
        </form>
      )}

      {/* Task list */}
      <div className="space-y-3">
        {tasks.length === 0 && (
          <div className="text-center py-16 text-slate-400 text-sm">
            Aucune tâche ne correspond à ta recherche.
          </div>
        )}

        {tasks.map((task) => {
          const style = CATEGORY_STYLES[task.category];
          return (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4"
            >
              <button onClick={() => toggleComplete(task.id)} className="shrink-0">
                {task.completed ? (
                  <CheckCircle2 size={22} className="text-violet-600" />
                ) : (
                  <Circle size={22} className="text-slate-300" />
                )}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p
                    className={`font-medium text-slate-800 dark:text-white truncate ${
                      task.completed ? "line-through text-slate-400 dark:text-slate-500" : ""
                    }`}
                  >
                    {task.title}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                    {task.category}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{task.subtitle}</p>

                <input
                  type="range"
                  min={0}
                  max={100}
                  step={5}
                  value={task.progress}
                  onChange={(e) => updateProgress(task.id, e.target.value)}
                  className="mt-2 w-full max-w-xs h-1.5 rounded-full appearance-none cursor-pointer accent-violet-600"
                  style={{
                    background: `linear-gradient(to right, ${style.barColor} ${task.progress}%, #f1f5f9 ${task.progress}%)`,
                  }}
                  aria-label={`Progression de ${task.title}`}
                />
              </div>

              <div className="text-right shrink-0 w-16">
                <p className="text-xs text-slate-400">{task.due}</p>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{task.progress}%</p>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                className="shrink-0 p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                aria-label="Supprimer la t\u00e2che"
              >
                <Trash2 size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </>
  );
}

function SuiviPage({ tasks, totalHours }) {
  return (
    <>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Temps total</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white">{totalHours}h</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Tâches suivies</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white">{tasks.length}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-100 dark:border-slate-700">
          <p className="text-xs text-slate-400 mb-1">Moyenne / tâche</p>
          <p className="text-2xl font-semibold text-slate-800 dark:text-white">
            {tasks.length ? Math.round(totalHours / tasks.length) : 0}h
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700 mb-6">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Heures passées cette semaine</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="heures" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => {
          const style = CATEGORY_STYLES[task.category];
          return (
            <div
              key={task.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-4 flex items-center gap-4"
            >
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${style.bg}`}>
                <Clock size={16} className={style.text} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-800 dark:text-white truncate">{task.title}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{task.category}</span>
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">{task.hours || 0}h</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function emptyForm(categories) {
  return {
    name: "",
    category: categories[0],
    deadline: "",
    objectivesText: "",
    membersText: "",
    progress: 0,
  };
}

function ProjetsPage({ projects, categories, addProject, updateProject, deleteProject }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm(categories));

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm(categories));
    setShowForm(true);
  }

  function openEditForm(project) {
    setEditingId(project.id);
    setForm({
      name: project.name,
      category: project.category,
      deadline: project.deadline,
      objectivesText: project.objectives.join("\n"),
      membersText: project.members.join(", "),
      progress: project.progress,
    });
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingId(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const payload = {
      name: form.name.trim(),
      category: form.category,
      deadline: form.deadline.trim() || "\u2014",
      objectives: form.objectivesText
        .split("\n")
        .map((o) => o.trim())
        .filter(Boolean),
      members: form.membersText
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean),
      progress: Number(form.progress) || 0,
    };

    if (editingId) {
      updateProject(editingId, payload);
    } else {
      addProject(payload);
    }
    closeForm();
  }

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={openAddForm}
          className="inline-flex items-center gap-1.5 bg-violet-600 text-white text-sm font-medium px-4 py-2 rounded-xl hover:bg-violet-700 transition-colors"
        >
          <Plus size={16} />
          Nouveau projet
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-5 mb-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200">
              {editingId ? "Modifier le projet" : "Nouveau projet"}
            </h3>
            <button type="button" onClick={closeForm} className="p-1 rounded-lg text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700">
              <X size={16} />
            </button>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Titre du projet</label>
            <input
              autoFocus
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Ex: Refonte site vitrine"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-400 mb-1">Catégorie</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none"
              >
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-slate-400 mb-1">Échéance</label>
              <input
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                placeholder="Ex: 20 Mar"
                className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Objectifs (un par ligne)</label>
            <textarea
              value={form.objectivesText}
              onChange={(e) => setForm({ ...form, objectivesText: e.target.value })}
              placeholder={"Ex:\nAugmenter la conversion de 15%\nRefondre le parcours d'achat"}
              rows={3}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">Membres (séparés par une virgule)</label>
            <input
              value={form.membersText}
              onChange={(e) => setForm({ ...form, membersText: e.target.value })}
              placeholder="Ex: Kim Namjoon, Rinsen Jey"
              className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
            />
          </div>

          <div>
            <label className="block text-xs text-slate-400 mb-1">
              Avancement : {form.progress}%
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={form.progress}
              onChange={(e) => setForm({ ...form, progress: e.target.value })}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer accent-violet-600"
            />
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 rounded-lg text-sm font-medium text-slate-500 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-medium hover:bg-violet-700"
            >
              {editingId ? "Enregistrer" : "Créer le projet"}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-2 gap-4">
        {projects.length === 0 && (
          <div className="col-span-2 text-center py-16 text-slate-400 text-sm">
            Aucun projet pour le moment. Crée ton premier projet !
          </div>
        )}

        {projects.map((project) => {
          const style = CATEGORY_STYLES[project.category];
          return (
            <div
              key={project.id}
              className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>
                  {project.category}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditForm(project)}
                    className="text-xs text-slate-400 hover:text-violet-600 px-2 py-1 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-500/10"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => deleteProject(project.id)}
                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                    aria-label="Supprimer le projet"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-semibold text-slate-800 dark:text-white mb-1">{project.name}</h3>
              <p className="text-xs text-slate-400 mb-3">Échéance {project.deadline}</p>

              {project.objectives.length > 0 && (
                <ul className="mb-3 space-y-1">
                  {project.objectives.map((obj, i) => (
                    <li key={i} className="text-xs text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
                      <span className={`mt-1 w-1 h-1 rounded-full ${style.bar} shrink-0`} />
                      {obj}
                    </li>
                  ))}
                </ul>
              )}

              <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden mb-2">
                <div className={`h-full ${style.bar} rounded-full`} style={{ width: `${project.progress}%` }} />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400">{project.progress}% terminées</span>
              </div>

              {project.members.length > 0 && (
                <div className="flex items-center gap-1.5 flex-wrap">
                  <Users size={14} className="text-slate-400" />
                  {project.members.map((m, i) => (
                    <span
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
}

function RapportsPage({ categoryTotals, completedCount, totalCount }) {
  const pendingCount = totalCount - completedCount;
  const statusData = [
    { name: "Terminées", value: completedCount },
    { name: "En cours", value: pendingCount },
  ];

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Tâches par catégorie</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={categoryTotals} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {categoryTotals.map((entry, i) => (
                  <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Statut des tâches</h3>
        <div style={{ width: "100%", height: 220 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={statusData} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={3}>
                <Cell fill="#8b5cf6" />
                <Cell fill="#e2e8f0" />
              </Pie>
              <Legend verticalAlign="bottom" height={24} iconSize={8} wrapperStyle={{ fontSize: 12 }} />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-span-2 bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-100 dark:border-slate-700">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Heures par jour</h3>
        <div style={{ width: "100%", height: 200 }}>
          <ResponsiveContainer>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "#f1f5f9" }} />
              <Bar dataKey="heures" fill="#3b82f6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function ParametresPage({
  profileName,
  setProfileName,
  profileEmail,
  setProfileEmail,
  darkMode,
  setDarkMode,
  notifTasks,
  setNotifTasks,
  notifDeadlines,
  setNotifDeadlines,
  notifWeekly,
  setNotifWeekly,
}) {
  return (
    <div className="max-w-xl space-y-6">
      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Profil</h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-violet-100 dark:bg-violet-500/20 flex items-center justify-center text-violet-700 dark:text-violet-300 font-semibold text-lg">
            {profileName.split(" ").map((n) => n[0]).join("")}
          </div>
          <div>
            <p className="font-medium text-slate-800 dark:text-white">{profileName}</p>
            <p className="text-xs text-slate-400">UI/UX Designer</p>
          </div>
        </div>

        <label className="block text-xs text-slate-400 mb-1">Nom complet</label>
        <input
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
          className="w-full mb-3 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />

        <label className="block text-xs text-slate-400 mb-1">Email</label>
        <input
          value={profileEmail}
          onChange={(e) => setProfileEmail(e.target.value)}
          className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-violet-200"
        />
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Apparence</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
            {darkMode ? <Moon size={16} /> : <Sun size={16} />}
            Mode sombre
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`w-11 h-6 rounded-full transition-colors relative ${
              darkMode ? "bg-violet-600" : "bg-slate-200"
            }`}
          >
            <span
              className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                darkMode ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl p-5">
        <h3 className="text-sm font-medium text-slate-700 dark:text-slate-200 mb-4">Notifications</h3>
        <div className="space-y-3">
          <ToggleRow label="Nouvelles tâches assignées" checked={notifTasks} onChange={setNotifTasks} />
          <ToggleRow label="Rappels d'échéance" checked={notifDeadlines} onChange={setNotifDeadlines} />
          <ToggleRow label="Résumé hebdomadaire" checked={notifWeekly} onChange={setNotifWeekly} />
        </div>
      </div>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-slate-600 dark:text-slate-300">{label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-violet-600" : "bg-slate-200"}`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
            checked ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </button>
    </div>
  );
}