import { useEffect, useMemo, useState } from "react";

const initialProjects = [
  {
    id: 1,
    title: "Save the Blue Forest",
    creator: "Belle Studio",
    category: "Environment",
    description:
      "A visual documentary and education campaign to protect endangered forests and inspire sustainable action.",
    goal: 12000,
    raised: 4200,
    image:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1400&q=80",
    pdfName: "forest-campaign.pdf",
    pdfData: null,
    updates: [
      {
        id: 1,
        text: "We completed the first concept trailer and started outreach with schools.",
        date: "2026-04-15",
      },
    ],
    contributions: [
      {
        id: 1,
        name: "Sophia",
        amount: 120,
        method: "Stripe",
        date: "2026-04-16",
      },
    ],
  },
  {
    id: 2,
    title: "Women in Tech Learning Hub",
    creator: "Belle Academy",
    category: "Education",
    description:
      "An accessible digital learning space with workshops, mentorship, and beginner-friendly resources for future developers.",
    goal: 9000,
    raised: 3100,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=80",
    pdfName: "learning-hub.pdf",
    pdfData: null,
    updates: [
      {
        id: 1,
        text: "The first workshop outline is ready and the mentor waiting list is open.",
        date: "2026-04-12",
      },
    ],
    contributions: [],
  },
];

const categories = [
  "All",
  "Technology",
  "Education",
  "Art",
  "Health",
  "Environment",
  "Community",
];

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

export default function App() {
  const [projects, setProjects] = useState(() => {
    try {
      const saved = localStorage.getItem("belle_crowdfunding_projects");
      return saved ? JSON.parse(saved) : initialProjects;
    } catch {
      return initialProjects;
    }
  });

  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);


  const [projectForm, setProjectForm] = useState({
    title: "",
    creator: "",
    category: "Technology",
    description: "",
    goal: "",
    imageFile: null,
    imagePreview: "",
    pdfFile: null,
    pdfName: "",
    pdfData: null,
  });

  const [contributionForm, setContributionForm] = useState({
    name: "",
    amount: "",
    method: "Stripe",
  });

  const [updateText, setUpdateText] = useState("");

  useEffect(() => {
    localStorage.setItem(
      "belle_crowdfunding_projects",
      JSON.stringify(projects)
    );
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const matchesSearch = `${project.title} ${project.creator} ${project.category} ${project.description}`
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesCategory =
        filterCategory === "All" || project.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [projects, search, filterCategory]);

  const totalRaised = projects.reduce((sum, project) => sum + project.raised, 0);
  const totalBackers = projects.reduce(
    (sum, project) => sum + project.contributions.length,
    0
  );

  const handleProjectInput = (e) => {
    const { name, value } = e.target;
    setProjectForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload a JPG or PNG image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm((prev) => ({
        ...prev,
        imageFile: file,
        imagePreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf =
      file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      alert("Please upload a PDF file.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setProjectForm((prev) => ({
        ...prev,
        pdfFile: file,
        pdfName: file.name,
        pdfData: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  };

 

  const handleCreateProject = (e) => {
    e.preventDefault();

    const newProject = {
      id: Date.now(),
      title: projectForm.title,
      creator: projectForm.creator,
      category: projectForm.category,
      description: projectForm.description,
      goal: Number(projectForm.goal),
      raised: 0,
      image:
        projectForm.imagePreview ||
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      pdfName: projectForm.pdfName,
      pdfData: projectForm.pdfData,
      updates: [
        {
          id: Date.now(),
          text: "Project created successfully.",
          date: new Date().toISOString().split("T")[0],
        },
      ],
      contributions: [],
    };

    setProjects((prev) => [newProject, ...prev]);
    setShowCreateModal(false);

    setProjectForm({
      title: "",
      creator: "",
      category: "Technology",
      description: "",
      goal: "",
      imageFile: null,
      imagePreview: "",
      pdfFile: null,
      pdfName: "",
      pdfData: null,
    });
  };

  const openProject = (project) => {
    setSelectedProject(project);
    setContributionForm({
      name: "",
      amount: "",
      method: "Stripe",
    });
    setUpdateText("");
  };

  const closeProject = () => {
    setSelectedProject(null);
    setShowPaymentModal(false);
  };

  const handleContributionInput = (e) => {
    const { name, value } = e.target;
    setContributionForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const startFakeStripeCheckout = (e) => {
    e.preventDefault();

    if (!contributionForm.name || !contributionForm.amount) return;

    setShowPaymentModal(true);
  };

  const confirmFakePayment = () => {
    if (!selectedProject) return;

    const newContribution = {
      id: Date.now(),
      name: contributionForm.name,
      amount: Number(contributionForm.amount),
      method: contributionForm.method,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          raised: project.raised + newContribution.amount,
          contributions: [newContribution, ...project.contributions],
        };
      }
      return project;
    });

    setProjects(updatedProjects);

    const updatedSelected = updatedProjects.find(
      (project) => project.id === selectedProject.id
    );
    setSelectedProject(updatedSelected);
    setShowPaymentModal(false);

    setContributionForm({
      name: "",
      amount: "",
      method: "Stripe",
    });
  };

  const handleAddUpdate = (e) => {
    e.preventDefault();
    if (!selectedProject || !updateText.trim()) return;

    const newUpdate = {
      id: Date.now(),
      text: updateText,
      date: new Date().toISOString().split("T")[0],
    };

    const updatedProjects = projects.map((project) => {
      if (project.id === selectedProject.id) {
        return {
          ...project,
          updates: [newUpdate, ...project.updates],
        };
      }
      return project;
    });

    setProjects(updatedProjects);

    const updatedSelected = updatedProjects.find(
      (project) => project.id === selectedProject.id
    );
    setSelectedProject(updatedSelected);
    setUpdateText("");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80')] bg-cover bg-center opacity-25" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-emerald-900/70" />

        <div className="relative mx-auto max-w-7xl px-6 py-6">
          <nav className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="text-2xl font-black tracking-[0.25em]">
              BELLE CROWDFUNDING
            </div>

            <div className="flex flex-wrap items-center gap-3 text-sm font-medium text-white/85">
            
              <button
  onClick={() => setShowCreateModal(true)}
  className="transition hover:text-white"
>
  Start a Project
</button>
             
              <button
                onClick={() => setShowCreateModal(true)}
                className="rounded-full bg-white px-5 py-2 text-slate-900 transition hover:bg-slate-200"
              >
                Create Project
              </button>
            </div>
          </nav>

          <div className="grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
            <div>
              <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/90">
                Belle Crowdfunding Platform
              </span>

              <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight md:text-7xl">
                Fund beautiful ideas with community support
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-white/75">
                Launch creative, educational, and social impact projects with a
                premium crowdfunding experience built for storytelling and trust.
              </p>

              <div className="mt-8 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="rounded-full bg-emerald-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-emerald-300"
                >
                  Start your project
                </button>
                <a
                  href="#projects"
                  className="rounded-full border border-white/20 px-6 py-3 font-semibold text-white transition hover:bg-white/10"
                >
                  Explore projects
                </a>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm text-white/70">Total Raised</p>
                <h3 className="mt-3 text-4xl font-black">
                  {formatCurrency(totalRaised)}
                </h3>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">
                <p className="text-sm text-white/70">Active Projects</p>
                <h3 className="mt-3 text-4xl font-black">{projects.length}</h3>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur md:col-span-2">
                <p className="text-sm text-white/70">Backers</p>
                <h3 className="mt-3 text-4xl font-black">{totalBackers}</h3>
                <p className="mt-2 text-sm text-white/65">
                  Simulated frontend experience with local project persistence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main id="projects" className="mx-auto max-w-7xl px-6 py-14">
        <section className="mb-10 grid gap-4 rounded-[2rem] bg-white p-5 shadow-sm ring-1 ring-slate-200 md:grid-cols-[1fr_220px_180px]">
          <input
            type="text"
            placeholder="Search projects, creators, or categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          />

          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-emerald-500"
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>

          <button
            onClick={() => setShowCreateModal(true)}
            className="rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            New Project
          </button>
        </section>

        <section className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-600">
              Curated campaigns
            </p>
            <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
              Discover projects worth backing
            </h2>
          </div>
        </section>

        <section className="grid gap-7 md:grid-cols-2 xl:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => {
              const progress = Math.min((project.raised / project.goal) * 100, 100);

              return (
                <article
                  key={project.id}
                  className="group overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-slate-900 backdrop-blur">
                      {project.category}
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className="text-sm text-slate-500">
                        by {project.creator}
                      </span>
                      <span className="text-sm font-medium text-emerald-600">
                        {project.contributions.length} backers
                      </span>
                    </div>

                    <h3 className="text-2xl font-black text-slate-950">
                      {project.title}
                    </h3>

                    <p className="mt-3 line-clamp-3 text-sm leading-7 text-slate-600">
                      {project.description}
                    </p>

                    {project.pdfName && (
                      <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                        Attached PDF:{" "}
                        <span className="font-semibold text-slate-900">
                          {project.pdfName}
                        </span>
                      </div>
                    )}

                    <div className="mt-6">
                      <div className="mb-2 flex items-center justify-between text-sm text-slate-600">
                        <span>{formatCurrency(project.raised)} raised</span>
                        <span>{formatCurrency(project.goal)} goal</span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-slate-200">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => openProject(project)}
                      className="mt-6 w-full rounded-2xl bg-slate-950 px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
                    >
                      View project
                    </button>
                  </div>
                </article>
              );
            })
          ) : (
            <div className="col-span-full rounded-[2rem] border border-dashed border-slate-300 bg-white p-16 text-center">
              <h3 className="text-2xl font-bold text-slate-900">
                No projects found
              </h3>
              <p className="mt-3 text-slate-500">
                Try a different search or create your first campaign.
              </p>
            </div>
          )}
        </section>
      </main>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 px-4 py-8">
          <div className="mx-auto max-w-3xl rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-8 flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  New Campaign
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950">
                  Create a project on Belle Crowdfunding
                </h2>
              </div>

              <button
                onClick={() => setShowCreateModal(false)}
                className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="grid gap-5">
              <div className="grid gap-5 md:grid-cols-2">
                <input
                  type="text"
                  name="title"
                  placeholder="Project title"
                  value={projectForm.title}
                  onChange={handleProjectInput}
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
                <input
                  type="text"
                  name="creator"
                  placeholder="Creator name"
                  value={projectForm.creator}
                  onChange={handleProjectInput}
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid gap-5 md:grid-cols-2">
                <select
                  name="category"
                  value={projectForm.category}
                  onChange={handleProjectInput}
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                >
                  {categories
                    .filter((item) => item !== "All")
                    .map((category) => (
                      <option key={category}>{category}</option>
                    ))}
                </select>

                <input
                  type="number"
                  name="goal"
                  placeholder="Funding goal"
                  value={projectForm.goal}
                  onChange={handleProjectInput}
                  min="1"
                  required
                  className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                />
              </div>

              <textarea
                name="description"
                placeholder="Project description"
                value={projectForm.description}
                onChange={handleProjectInput}
                rows="5"
                required
                className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
              />

              <div className="grid gap-5 md:grid-cols-2">
                <label className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5">
                  <span className="mb-3 block text-sm font-semibold text-slate-700">
                    Upload cover image (JPG / PNG)
                  </span>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                    onChange={handleImageUpload}
                    className="block w-full text-sm"
                  />
                  {projectForm.imagePreview && (
                    <img
                      src={projectForm.imagePreview}
                      alt="Preview"
                      className="mt-4 h-44 w-full rounded-2xl object-cover"
                    />
                  )}
                </label>

                <label className="rounded-[1.5rem] border border-dashed border-slate-300 bg-slate-50 p-5">
                  <span className="mb-3 block text-sm font-semibold text-slate-700">
                    Upload project PDF
                  </span>
                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handlePdfUpload}
                    className="block w-full text-sm"
                  />
                  {projectForm.pdfName && (
                    <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm text-slate-700 ring-1 ring-slate-200">
                      Selected file:{" "}
                      <span className="font-semibold">{projectForm.pdfName}</span>
                    </div>
                  )}
                </label>
              </div>

              <button
                type="submit"
                className="mt-2 rounded-2xl bg-emerald-500 px-6 py-4 text-base font-bold text-slate-950 transition hover:bg-emerald-400"
              >
                Publish project
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProject && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 px-4 py-8">
          <div className="mx-auto max-w-6xl rounded-[2rem] bg-white p-6 shadow-2xl md:p-8">
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600">
                  {selectedProject.category}
                </p>
                <h2 className="mt-2 text-3xl font-black text-slate-950 md:text-4xl">
                  {selectedProject.title}
                </h2>
                <p className="mt-2 text-slate-500">
                  Created by {selectedProject.creator}
                </p>
              </div>

              <button
                onClick={closeProject}
                className="rounded-full border border-slate-200 px-4 py-2 font-medium text-slate-600 hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
              <div>
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="h-80 w-full rounded-[1.75rem] object-cover"
                />

                <p className="mt-6 text-base leading-8 text-slate-600">
                  {selectedProject.description}
                </p>

                {selectedProject.pdfName && (
                  <div className="mt-6 rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-sm font-semibold text-slate-700">
                      Project PDF
                    </p>
                    <p className="mt-2 text-slate-600">{selectedProject.pdfName}</p>
                    {selectedProject.pdfData && (
                      <a
                        href={selectedProject.pdfData}
                        download={selectedProject.pdfName}
                        className="mt-4 inline-flex rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                      >
                        Download PDF
                      </a>
                    )}
                  </div>
                )}

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Goal</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-950">
                      {formatCurrency(selectedProject.goal)}
                    </h3>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Raised</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-950">
                      {formatCurrency(selectedProject.raised)}
                    </h3>
                  </div>

                  <div className="rounded-[1.5rem] bg-slate-50 p-5 ring-1 ring-slate-200">
                    <p className="text-sm text-slate-500">Backers</p>
                    <h3 className="mt-2 text-2xl font-black text-slate-950">
                      {selectedProject.contributions.length}
                    </h3>
                  </div>
                </div>

                <div className="mt-8 rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-950">
                      Project updates
                    </h3>
                  </div>

                  <form onSubmit={handleAddUpdate} className="mb-6 grid gap-4">
                    <textarea
                      rows="4"
                      placeholder="Share a new update..."
                      value={updateText}
                      onChange={(e) => setUpdateText(e.target.value)}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />
                    <button
                      type="submit"
                      className="w-full rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white hover:bg-slate-800 md:w-fit"
                    >
                      Add update
                    </button>
                  </form>

                  <div className="space-y-4">
                    {selectedProject.updates.length > 0 ? (
                      selectedProject.updates.map((update) => (
                        <div
                          key={update.id}
                          className="rounded-[1.5rem] bg-slate-50 p-5"
                        >
                          <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-400">
                            {update.date}
                          </p>
                          <p className="mt-3 leading-7 text-slate-700">
                            {update.text}
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">No updates yet.</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200">
                  <h3 className="text-2xl font-black text-slate-950">
                    Support this project
                  </h3>

                  <form onSubmit={startFakeStripeCheckout} className="mt-5 grid gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Your name"
                      value={contributionForm.name}
                      onChange={handleContributionInput}
                      required
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <input
                      type="number"
                      name="amount"
                      placeholder="Contribution amount"
                      value={contributionForm.amount}
                      onChange={handleContributionInput}
                      min="1"
                      required
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    />

                    <select
                      name="method"
                      value={contributionForm.method}
                      onChange={handleContributionInput}
                      className="rounded-2xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-500"
                    >
                      <option>Stripe</option>
                      <option>Card</option>
                      <option>Wallet</option>
                    </select>

                    <button
                      type="submit"
                      className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 font-bold text-white transition hover:opacity-95"
                    >
                      Continue to Stripe (Simulated)
                    </button>

                    <p className="text-sm leading-6 text-slate-500">
                      This frontend demo simulates a Stripe checkout flow. No real
                      payment is processed.
                    </p>
                  </form>
                </div>

                <div className="rounded-[1.75rem] bg-white p-6 ring-1 ring-slate-200">
                  <h3 className="text-2xl font-black text-slate-950">
                    Contributions
                  </h3>

                  <div className="mt-5 space-y-4">
                    {selectedProject.contributions.length > 0 ? (
                      selectedProject.contributions.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-slate-50 p-4"
                        >
                          <div>
                            <p className="font-semibold text-slate-900">
                              {item.name}
                            </p>
                            <p className="text-sm text-slate-500">
                              {item.method} · {item.date}
                            </p>
                          </div>
                          <span className="text-base font-black text-emerald-600">
                            {formatCurrency(item.amount)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-slate-500">No contributions yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPaymentModal && selectedProject && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/80 px-4">
          <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl">
            <div className="mb-6 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100 text-2xl font-black text-indigo-600">
                S
              </div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">
                Simulated Stripe Checkout
              </p>
              <h3 className="mt-2 text-2xl font-black text-slate-950">
                Confirm your contribution
              </h3>
            </div>

            <div className="space-y-3 rounded-[1.5rem] bg-slate-50 p-5">
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Project</span>
                <span className="font-medium text-slate-900">
                  {selectedProject.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Backer</span>
                <span className="font-medium text-slate-900">
                  {contributionForm.name}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm text-slate-500">
                <span>Method</span>
                <span className="font-medium text-slate-900">
                  {contributionForm.method}
                </span>
              </div>
              <div className="flex items-center justify-between border-t border-slate-200 pt-3 text-base font-bold text-slate-950">
                <span>Total</span>
                <span>{formatCurrency(Number(contributionForm.amount || 0))}</span>
              </div>
            </div>

            <div className="mt-6 grid gap-3">
              <button
                onClick={confirmFakePayment}
                className="rounded-2xl bg-indigo-600 px-5 py-3 font-bold text-white hover:bg-indigo-500"
              >
                Pay now
              </button>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="rounded-2xl border border-slate-200 px-5 py-3 font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}