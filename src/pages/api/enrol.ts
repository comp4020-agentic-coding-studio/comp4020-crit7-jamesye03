import type { APIRoute } from "astro";
import { enrol } from "../../lib/db";

// Enrolling commits the course's (fixed) lecture immediately; the tutorial
// stays unchosen until the student picks one on the timetable page. Plain
// form POST + redirect, so the catalog page needs no client-side JS to work.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const courseId = Number(form.get("courseId"));
  if (Number.isInteger(courseId)) {
    enrol(courseId);
  }
  const back = String(form.get("back") ?? "/timetable/");
  return redirect(back, 303);
};
