// Fictional catalog data, seeded into an empty database at boot (see
// seedIfEmpty in db.ts) rather than shipped as a migration — migrations are
// schema only. Course codes borrow ANU's naming convention (COMPnnnn,
// MATHnnnn, STATnnnn) but every title, description and timetable slot here is
// made up for this prototype; none of it describes a real ANU offering.
//
// Two lecture times deliberately collide (COMP1100 and MATH1013, both Mon
// 10:00) and a couple of tutorial options do too — real first-year timetables
// do this constantly, and it's the one scenario worth seeding on purpose so
// the conflict highlighting has something to show.

interface SeedSession {
  kind: "lecture" | "tutorial";
  label: string;
  day: number; // 0 = Monday
  startMinutes: number;
  endMinutes: number;
  location: string;
}

interface SeedCourse {
  code: string;
  title: string;
  summary: string;
  description: string;
  color: string;
  sessions: SeedSession[];
}

const at = (h: number, m = 0) => h * 60 + m;

export const SEED_COURSES: SeedCourse[] = [
  {
    code: "COMP1100",
    title: "Introduction to Programming and Algorithms",
    summary: "First-year functional programming, from expressions to small programs.",
    description:
      "Builds a working model of computation from the ground up: values, functions, recursion and types, using a functional language before touching anything imperative. Assumes no prior programming experience. The problem sets are small and specific on purpose — the aim is a solid mental model, not breadth.",
    color: "#2f6fed",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 0, startMinutes: at(10), endMinutes: at(11), location: "Manning Clark 1" },
      { kind: "tutorial", label: "Tutorial A", day: 1, startMinutes: at(9), endMinutes: at(10), location: "CSIT N101" },
      { kind: "tutorial", label: "Tutorial B", day: 1, startMinutes: at(14), endMinutes: at(15), location: "CSIT N102" },
      { kind: "tutorial", label: "Tutorial C", day: 3, startMinutes: at(11), endMinutes: at(12), location: "CSIT N101" },
    ],
  },
  {
    code: "COMP2100",
    title: "Software Design Methodologies",
    summary: "Design, testing and version control for programs bigger than one file.",
    description:
      "Where 'it works on my machine' stops being good enough: modular design, unit and integration testing, code review, and git used properly rather than as a backup button. Group assignments run across most of the semester, so the design decisions from week 3 are the ones you're debugging in week 10.",
    color: "#e2662b",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 2, startMinutes: at(10), endMinutes: at(11), location: "Manning Clark 2" },
      { kind: "tutorial", label: "Tutorial A", day: 0, startMinutes: at(13), endMinutes: at(14), location: "CSIT N103" },
      { kind: "tutorial", label: "Tutorial B", day: 2, startMinutes: at(14), endMinutes: at(15), location: "CSIT N103" },
      { kind: "tutorial", label: "Tutorial C", day: 4, startMinutes: at(9), endMinutes: at(10), location: "CSIT N104" },
    ],
  },
  {
    code: "COMP3120",
    title: "Introduction to Machine Learning",
    summary: "The standard toolbox: regression, classification, clustering, evaluation.",
    description:
      "A first pass at the models everything else in the field builds on, with enough of the underlying maths to know why a method fails rather than just that it did. Assignments are graded on whether your evaluation methodology holds up, not on leaderboard position.",
    color: "#1f9d55",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 1, startMinutes: at(11), endMinutes: at(12), location: "Manning Clark 1" },
      { kind: "tutorial", label: "Tutorial A", day: 2, startMinutes: at(9), endMinutes: at(10), location: "CSIT N201" },
      { kind: "tutorial", label: "Tutorial B", day: 3, startMinutes: at(15), endMinutes: at(16), location: "CSIT N201" },
    ],
  },
  {
    code: "COMP4020",
    title: "Agentic Coding Studio",
    summary: "A weekly studio: brief, build with an agent, present, repeat.",
    description:
      "Twelve weeks of shipping small full-stack prototypes with an AI coding agent doing most of the typing — the actual skill being assessed is direction, grounding and correction, not lines of code. Static sites for the first half, databases and deploys for the second. This entry is the one honest bit of self-reference in the catalog.",
    color: "#8952e0",
    sessions: [
      { kind: "lecture", label: "Studio", day: 0, startMinutes: at(14), endMinutes: at(15, 30), location: "Hanna Neumann G51" },
      { kind: "tutorial", label: "Crit slot A", day: 0, startMinutes: at(15, 30), endMinutes: at(17), location: "Hanna Neumann G51" },
      { kind: "tutorial", label: "Crit slot B", day: 3, startMinutes: at(13), endMinutes: at(14, 30), location: "Hanna Neumann G52" },
    ],
  },
  {
    code: "MATH1013",
    title: "Mathematical Foundations for Computing",
    summary: "Discrete maths and linear algebra for CS: proofs, logic, matrices.",
    description:
      "The maths that computing courses assume you already have: propositional and predicate logic, proof technique, sets and relations, and enough linear algebra to make sense of graphics, ML and cryptography later. Runs alongside COMP1100 for most students, which is exactly why their timetables tend to collide.",
    color: "#d1364a",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 0, startMinutes: at(10), endMinutes: at(11), location: "Manning Clark 3" },
      { kind: "tutorial", label: "Tutorial A", day: 1, startMinutes: at(10), endMinutes: at(11), location: "Haydon-Allen 101" },
      { kind: "tutorial", label: "Tutorial B", day: 2, startMinutes: at(13), endMinutes: at(14), location: "Haydon-Allen 102" },
      { kind: "tutorial", label: "Tutorial C", day: 4, startMinutes: at(11), endMinutes: at(12), location: "Haydon-Allen 101" },
    ],
  },
  {
    code: "MATH2320",
    title: "Mathematical Programming and Optimisation",
    summary: "Linear and integer programming, and when to reach for each.",
    description:
      "Formulating real decisions — scheduling, allocation, routing — as optimisation problems, then solving them with the standard methods and knowing why a solver's answer changed. Numerical assignments are marked on the formulation, not the solver output.",
    color: "#c98a1b",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 3, startMinutes: at(9), endMinutes: at(10), location: "Haydon-Allen G45" },
      { kind: "tutorial", label: "Tutorial A", day: 1, startMinutes: at(15), endMinutes: at(16), location: "Haydon-Allen 103" },
      { kind: "tutorial", label: "Tutorial B", day: 4, startMinutes: at(14), endMinutes: at(15), location: "Haydon-Allen 103" },
    ],
  },
  {
    code: "STAT2001",
    title: "Probability and Statistical Models",
    summary: "Probability theory through to fitting and checking real models.",
    description:
      "From first-principles probability to the statistical models used to actually analyse data: estimation, hypothesis testing, and enough regression to critique a model rather than just run one. Weekly problem sets; two of them use a dataset you didn't clean yourself, on purpose.",
    color: "#0f9b8e",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 2, startMinutes: at(11), endMinutes: at(12), location: "Manning Clark 4" },
      { kind: "tutorial", label: "Tutorial A", day: 0, startMinutes: at(9), endMinutes: at(10), location: "Haydon-Allen 201" },
      { kind: "tutorial", label: "Tutorial B", day: 3, startMinutes: at(10), endMinutes: at(11), location: "Haydon-Allen 201" },
      { kind: "tutorial", label: "Tutorial C", day: 4, startMinutes: at(13), endMinutes: at(14), location: "Haydon-Allen 202" },
    ],
  },
  {
    code: "COMP3600",
    title: "Algorithms",
    summary: "Design and analysis: greedy, divide-and-conquer, DP, NP-completeness.",
    description:
      "The standard algorithms course: proving correctness and bounding running time, not just producing code that happens to pass the sample cases. The back third is NP-completeness, aimed at recognising when a problem is hard rather than searching forever for a clever solution.",
    color: "#b23fd6",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 1, startMinutes: at(13), endMinutes: at(14), location: "Manning Clark 2" },
      { kind: "tutorial", label: "Tutorial A", day: 2, startMinutes: at(15), endMinutes: at(16), location: "CSIT N202" },
      { kind: "tutorial", label: "Tutorial B", day: 3, startMinutes: at(14), endMinutes: at(15), location: "CSIT N202" },
    ],
  },
  {
    code: "COMP2560",
    title: "Systems Programming",
    summary: "C, memory, processes and the machine underneath the abstractions.",
    description:
      "What's actually happening below the languages that hide it: manual memory management, pointers, processes and system calls, and enough of the toolchain to debug a segfault without guessing. The lab exercises assume you'll break things; that's the point.",
    color: "#46647a",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 4, startMinutes: at(10), endMinutes: at(11), location: "CSIT N103" },
      { kind: "tutorial", label: "Tutorial A", day: 0, startMinutes: at(11), endMinutes: at(12), location: "CSIT Lab 3" },
      { kind: "tutorial", label: "Tutorial B", day: 1, startMinutes: at(9), endMinutes: at(10), location: "CSIT Lab 3" },
      { kind: "tutorial", label: "Tutorial C", day: 3, startMinutes: at(9), endMinutes: at(10), location: "CSIT Lab 4" },
    ],
  },
  {
    code: "MATH1115",
    title: "Advanced Mathematics and Applications",
    summary: "A faster-paced first-year sequence for students with strong maths.",
    description:
      "Covers the same ground as the standard first-year maths sequence at a steeper pace, with more proof and less hand-holding, aimed at students who want the rigour up front rather than added later. Not a prerequisite for anything in this catalog — it's an alternative route, not an extra hurdle.",
    color: "#7a5230",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 3, startMinutes: at(11), endMinutes: at(12), location: "Haydon-Allen G46" },
      { kind: "tutorial", label: "Tutorial A", day: 1, startMinutes: at(13), endMinutes: at(14), location: "Haydon-Allen 104" },
      { kind: "tutorial", label: "Tutorial B", day: 2, startMinutes: at(10), endMinutes: at(11), location: "Haydon-Allen 104" },
      { kind: "tutorial", label: "Tutorial C", day: 4, startMinutes: at(15), endMinutes: at(16), location: "Haydon-Allen 105" },
    ],
  },
];
