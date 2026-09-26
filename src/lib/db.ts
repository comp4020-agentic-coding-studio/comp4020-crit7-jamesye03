import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import Database from "better-sqlite3";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { SEED_COURSES } from "./seed";
import { type Course, type Enrolment, type Session, courses, enrolments, sessions } from "./schema";

// One SQLite file is the app's whole persistent state. In production
// fly.toml points DATABASE_PATH at the machine's volume (/data), which is
// how state survives a reload and a redeploy; locally it defaults to an
// untracked file in .data/.
const path = process.env.DATABASE_PATH ?? "./.data/app.db";
mkdirSync(dirname(path), { recursive: true });

const client = new Database(path);
client.pragma("journal_mode = WAL");

export const db = drizzle(client);

// Migrations run at boot, on whatever machine holds the volume — the
// recommended shape for SQLite on Fly, where there's no separate machine to
// run them from. The flow: edit src/lib/schema.ts, `pnpm db:generate`,
// commit the migration it writes to drizzle/.
migrate(db, { migrationsFolder: "./drizzle" });

// The catalog is fixed seed data, not something a visitor creates — this
// keeps the database in sync with SEED_COURSES on every boot, matching rows
// by natural key (course `code`; session `courseId`+`kind`+`label`) rather
// than only inserting into an empty table. That matters because the deployed
// Fly volume persists across redeploys: a plain "insert if empty" would never
// backfill new columns or corrected session times onto already-seeded rows.
// Matching by natural key (instead of dropping and reinserting) keeps row ids
// stable, which matters because enrolments references them by id.
function syncSeedData() {
  for (const course of SEED_COURSES) {
    const existingCourse = db.select().from(courses).where(eq(courses.code, course.code)).get();
    const courseFields = {
      title: course.title,
      summary: course.summary,
      description: course.description,
      color: course.color,
      instructor: course.instructor,
      prerequisites: course.prerequisites,
      objectives: JSON.stringify(course.objectives),
      assessments: JSON.stringify(course.assessments),
      assessmentFormat: course.assessmentFormat,
    };
    const courseId = existingCourse
      ? existingCourse.id
      : db
          .insert(courses)
          .values({ code: course.code, ...courseFields })
          .returning({ id: courses.id })
          .get().id;
    if (existingCourse) {
      db.update(courses).set(courseFields).where(eq(courses.id, courseId)).run();
    }

    for (const session of course.sessions) {
      const existingSession = db
        .select()
        .from(sessions)
        .where(
          and(eq(sessions.courseId, courseId), eq(sessions.kind, session.kind), eq(sessions.label, session.label)),
        )
        .get();
      const sessionFields = {
        day: session.day,
        startMinutes: session.startMinutes,
        endMinutes: session.endMinutes,
        location: session.location,
      };
      if (existingSession) {
        db.update(sessions).set(sessionFields).where(eq(sessions.id, existingSession.id)).run();
      } else {
        db.insert(sessions)
          .values({ courseId, kind: session.kind, label: session.label, ...sessionFields })
          .run();
      }
    }
  }
}
syncSeedData();

export type { Course, Session, Enrolment };

export function listCourses(): Course[] {
  return db.select().from(courses).orderBy(courses.code).all();
}

export function getCourseByCode(code: string): Course | undefined {
  return listCourses().find((course) => course.code.toLowerCase() === code.toLowerCase());
}

export function listSessionsForCourse(courseId: number): Session[] {
  return db.select().from(sessions).where(eq(sessions.courseId, courseId)).all();
}

export interface EnrolledCourse {
  course: Course;
  lecture: Session;
  tutorials: Session[];
  chosenTutorialId: number | null;
}

// The full state the timetable page needs: every enrolled course alongside
// its fixed lecture, its tutorial options, and which one (if any) is chosen.
export function listEnrolledCourses(): EnrolledCourse[] {
  const rows = db.select().from(enrolments).all();
  return rows.map((row) => {
    const course = getCourseById(row.courseId);
    const courseSessions = listSessionsForCourse(row.courseId);
    const lecture = courseSessions.find((session) => session.kind === "lecture");
    if (!course || !lecture) {
      throw new Error(`enrolment ${row.id} points at course ${row.courseId}, which has no lecture`);
    }
    return {
      course,
      lecture,
      tutorials: courseSessions.filter((session) => session.kind === "tutorial"),
      chosenTutorialId: row.tutorialSessionId,
    };
  });
}

function getCourseById(id: number): Course | undefined {
  return db.select().from(courses).where(eq(courses.id, id)).get();
}

export function enrolledCourseIds(): Set<number> {
  return new Set(db.select().from(enrolments).all().map((row) => row.courseId));
}

// A real enrolment system caps how much you can take on at once; this
// mirrors that with a fixed number rather than modelling unit-load rules.
export const MAX_ENROLMENTS = 4;

export function canEnrol(courseId: number): boolean {
  const ids = enrolledCourseIds();
  return ids.has(courseId) || ids.size < MAX_ENROLMENTS;
}

export function enrol(courseId: number): void {
  db.insert(enrolments).values({ courseId }).onConflictDoNothing().run();
}

export function drop(courseId: number): void {
  db.delete(enrolments).where(eq(enrolments.courseId, courseId)).run();
}

export function chooseTutorial(courseId: number, sessionId: number): void {
  const session = db.select().from(sessions).where(eq(sessions.id, sessionId)).get();
  if (!session || session.courseId !== courseId || session.kind !== "tutorial") {
    throw new Error(`session ${sessionId} is not a tutorial belonging to course ${courseId}`);
  }
  const updated = db
    .update(enrolments)
    .set({ tutorialSessionId: sessionId })
    .where(eq(enrolments.courseId, courseId))
    .run();
  if (updated.changes === 0) {
    throw new Error(`course ${courseId} isn't enrolled`);
  }
}
