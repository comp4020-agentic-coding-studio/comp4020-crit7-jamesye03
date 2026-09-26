// Fictional catalog data, synced into the database at boot (see syncSeedData
// in db.ts) rather than shipped as a migration — migrations are schema only.
// Course codes borrow ANU's naming convention (COMPnnnn, MATHnnnn, STATnnnn)
// but every title, description, instructor and timetable slot here is made up
// for this prototype; none of it describes a real ANU offering, course or
// person.
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

interface SeedAssessment {
  name: string;
  weight: string;
  description: string;
}

interface SeedCourse {
  code: string;
  title: string;
  summary: string;
  description: string;
  color: string;
  instructor: string;
  prerequisites: string;
  objectives: string[];
  assessments: SeedAssessment[];
  assessmentFormat: string;
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
    instructor: "Dr. Alistair Chen",
    prerequisites: "None — no prior programming experience assumed.",
    objectives: [
      "Read and write small functional programs with confidence",
      "Use recursion as a default tool for repetition and problem decomposition",
      "Reason about a program's types before running it",
      "Break a problem into small, independently testable functions",
    ],
    assessments: [
      {
        name: "Weekly programming exercises",
        weight: "20%",
        description: "Ten short auto-marked exercises across the semester; the lowest two scores are dropped.",
      },
      {
        name: "Assignment 1",
        weight: "25%",
        description: "A small interactive program covering the first four weeks' material.",
      },
      {
        name: "Assignment 2",
        weight: "25%",
        description: "A larger program combining recursion, custom data types and unit tests.",
      },
      { name: "Final exam", weight: "30%", description: "Closed-book written exam covering the whole semester." },
    ],
    assessmentFormat:
      "Exercises and assignments are submitted and auto-marked online; the final exam is an in-person, closed-book paper in the standard end-of-semester exam period.",
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
    instructor: "Dr. Priya Ramanathan",
    prerequisites: "COMP1100, or equivalent experience writing and reading small programs.",
    objectives: [
      "Apply modular design to a codebase larger than one file",
      "Write unit and integration tests that actually catch regressions",
      "Use git branching, review and merging as a real development workflow, not a backup button",
      "Give and act on constructive code review feedback",
    ],
    assessments: [
      {
        name: "Design exercises",
        weight: "15%",
        description: "Short individual exercises on modular design and testing, submitted fortnightly.",
      },
      {
        name: "Group project — milestone 1",
        weight: "20%",
        description: "A working skeleton with a test suite and a documented git history, built in teams of four.",
      },
      {
        name: "Group project — milestone 2",
        weight: "30%",
        description: "The completed system from milestone 1, extended and refactored against changing requirements.",
      },
      {
        name: "Individual reflection & exam",
        weight: "35%",
        description: "A closed-book exam plus a short individual reflection on the group project's design decisions.",
      },
    ],
    assessmentFormat:
      "Group milestones are demoed and submitted with a git history the marker can inspect; the exam is in-person and closed-book.",
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
    instructor: "Prof. Daniel Okafor",
    prerequisites: "MATH1013 and COMP1100, or equivalent linear algebra and programming background.",
    objectives: [
      "Fit and evaluate regression, classification and clustering models",
      "Diagnose why a model fails, not just report that it did",
      "Design an evaluation methodology that would survive a reviewer's scrutiny",
      "Explain the maths behind a method well enough to know its assumptions",
    ],
    assessments: [
      {
        name: "Problem sets",
        weight: "20%",
        description: "Four problem sets mixing derivations with small implementation tasks.",
      },
      {
        name: "Assignment 1 — supervised learning",
        weight: "25%",
        description: "Build, tune and evaluate regression and classification models on a provided dataset.",
      },
      {
        name: "Assignment 2 — unsupervised learning & evaluation",
        weight: "25%",
        description: "Clustering and evaluation methodology, marked on the soundness of the analysis over leaderboard position.",
      },
      { name: "Final exam", weight: "30%", description: "Closed-book exam covering the theoretical content." },
    ],
    assessmentFormat: "Assignments are submitted as a report plus code; the exam is in-person and closed-book.",
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
    instructor: "Dr. Morgan Reyes",
    prerequisites: "COMP2100, or equivalent experience building and shipping a non-trivial program.",
    objectives: [
      "Direct an AI coding agent toward a working prototype from an ambiguous brief",
      "Ground an agent's output against real constraints instead of accepting it uncritically",
      "Recover cleanly when an agent's approach goes wrong",
      "Present a week's build and defend the decisions behind it",
    ],
    assessments: [
      {
        name: "Weekly crit submissions",
        weight: "60%",
        description:
          "Ten weekly prototypes, each briefly presented and defended in a crit session; graded on direction and correction, not lines of code.",
      },
      {
        name: "Process journal",
        weight: "15%",
        description: "A running record of prompts, decisions and corrections kept across the semester.",
      },
      {
        name: "Final showcase",
        weight: "25%",
        description: "A polished version of one semester project, deployed and demoed live.",
      },
    ],
    assessmentFormat: "No written exam — assessment is entirely built artefacts, live crits and a final demo.",
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
    instructor: "Dr. Helena Vogt",
    prerequisites: "A pass in senior secondary mathematics; no prior university-level maths required.",
    objectives: [
      "Construct and check a formal proof",
      "Work fluently with sets, relations and functions",
      "Perform standard matrix operations and interpret them geometrically",
      "Apply propositional and predicate logic to arguments outside mathematics",
    ],
    assessments: [
      {
        name: "Weekly assignments",
        weight: "20%",
        description: "Ten short assignments of proof and computation exercises.",
      },
      {
        name: "Mid-semester test",
        weight: "25%",
        description: "A closed-book test covering logic, sets and proof technique.",
      },
      {
        name: "Final exam",
        weight: "55%",
        description: "A comprehensive closed-book exam covering the whole semester.",
      },
    ],
    assessmentFormat:
      "Assignments are submitted online; the mid-semester test and final exam are in-person and closed-book.",
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
    instructor: "Dr. Samuel Whitfield",
    prerequisites: "MATH1013 or MATH1115.",
    objectives: [
      "Formulate a real decision problem as a linear or integer program",
      "Solve small optimisation problems by hand and larger ones with a solver",
      "Explain why a solver's optimal solution changed after a small input change",
      "Recognise when integer constraints are necessary versus a relaxation would do",
    ],
    assessments: [
      {
        name: "Formulation exercises",
        weight: "25%",
        description: "Weekly exercises translating word problems into linear/integer programs.",
      },
      {
        name: "Assignment — solver project",
        weight: "30%",
        description: "A scheduling or routing problem, formulated, solved with a solver, and written up.",
      },
      {
        name: "Final exam",
        weight: "45%",
        description: "Closed-book exam covering formulation and solution methods.",
      },
    ],
    assessmentFormat: "The solver project is submitted as a written report; the exam is in-person and closed-book.",
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
    instructor: "Dr. Aiko Tanaka",
    prerequisites: "MATH1013 or MATH1115.",
    objectives: [
      "Derive and apply standard probability distributions",
      "Construct and interpret hypothesis tests and confidence intervals",
      "Fit a regression model and critique its assumptions",
      "Analyse a dataset you didn't clean yourself without being misled by it",
    ],
    assessments: [
      {
        name: "Weekly problem sets",
        weight: "20%",
        description: "Eight problem sets across probability, estimation and testing.",
      },
      {
        name: "Data analysis assignment",
        weight: "30%",
        description: "A written report fitting and checking a model against a provided real-world dataset.",
      },
      {
        name: "Final exam",
        weight: "50%",
        description: "Closed-book exam covering the semester's theory and methods.",
      },
    ],
    assessmentFormat: "The data analysis assignment is a written report; the exam is in-person and closed-book.",
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
    instructor: "Prof. Liam O'Connell",
    prerequisites: "COMP2100 and MATH1013, or equivalent.",
    objectives: [
      "Prove an algorithm's correctness rather than test it into plausibility",
      "Bound an algorithm's running time with the right notation",
      "Choose between greedy, divide-and-conquer and dynamic programming for a new problem",
      "Recognise when a problem is NP-complete instead of searching forever for a clever solution",
    ],
    assessments: [
      { name: "Problem sets", weight: "25%", description: "Five problem sets of proof and analysis questions." },
      {
        name: "Assignment — algorithm design",
        weight: "25%",
        description: "Design, prove correct and analyse an algorithm for a novel problem.",
      },
      {
        name: "Final exam",
        weight: "50%",
        description: "Closed-book exam covering design, analysis and NP-completeness.",
      },
    ],
    assessmentFormat:
      "Problem sets and the assignment are submitted as written proofs; the exam is in-person and closed-book.",
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
    instructor: "Dr. Nadia Kessler",
    prerequisites: "COMP1100.",
    objectives: [
      "Manage memory manually and explain what goes wrong when you don't",
      "Read and write C confidently, including pointers and structs",
      "Explain what a process and a system call actually are",
      "Debug a segfault or a hang using real tools, not guesswork",
    ],
    assessments: [
      {
        name: "Lab exercises",
        weight: "20%",
        description: "Weekly hands-on labs; break things on purpose, then explain why.",
      },
      {
        name: "Assignment 1 — memory & pointers",
        weight: "25%",
        description: "A C program exercising manual memory management, marked with sanitiser tooling.",
      },
      {
        name: "Assignment 2 — processes & system calls",
        weight: "25%",
        description: "A small multi-process program using system calls directly.",
      },
      {
        name: "Final exam",
        weight: "30%",
        description: "Closed-book exam covering memory, processes and the toolchain.",
      },
    ],
    assessmentFormat:
      "Assignments are auto-tested with memory-safety tooling in addition to manual marking; the exam is in-person and closed-book.",
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
    instructor: "Dr. Felix Adeyemi",
    prerequisites:
      "A strong senior secondary mathematics background (recommended for students who completed an extension/specialist maths subject). Not a prerequisite for anything else in this catalog — an alternative route, not an extra hurdle.",
    objectives: [
      "Construct rigorous proofs at a first-year level, faster and with less scaffolding than the standard sequence",
      "Work with limits, continuity and convergence formally",
      "Apply linear algebra to systems of equations and linear maps",
      "Read and write mathematics at the standard expected in later theory-heavy courses",
    ],
    assessments: [
      {
        name: "Weekly problem sets",
        weight: "25%",
        description: "Proof-based problem sets, harder and faster-paced than the standard first-year sequence.",
      },
      {
        name: "Mid-semester test",
        weight: "25%",
        description: "A closed-book test on proof technique, limits and linear algebra.",
      },
      { name: "Final exam", weight: "50%", description: "A comprehensive closed-book exam." },
    ],
    assessmentFormat:
      "Problem sets are submitted online; the mid-semester test and final exam are in-person and closed-book.",
    sessions: [
      { kind: "lecture", label: "Lecture", day: 3, startMinutes: at(11), endMinutes: at(12), location: "Haydon-Allen G46" },
      { kind: "tutorial", label: "Tutorial A", day: 1, startMinutes: at(13), endMinutes: at(14), location: "Haydon-Allen 104" },
      { kind: "tutorial", label: "Tutorial B", day: 2, startMinutes: at(10), endMinutes: at(11), location: "Haydon-Allen 104" },
      { kind: "tutorial", label: "Tutorial C", day: 4, startMinutes: at(15), endMinutes: at(16), location: "Haydon-Allen 105" },
    ],
  },
];
