import type { APIRoute } from "astro";
import { canEnrol, enrol } from "../../lib/db";

// Enrolling commits the course's (fixed) lecture immediately; the tutorial
// stays unchosen until the student picks one on the timetable page. Plain
// form POST + redirect, so the catalog page needs no client-side JS to work.
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const courseId = Number(form.get("courseId"));
  const back = String(form.get("back") ?? "/timetable/");
  if (Number.isInteger(courseId)) {
    if (!canEnrol(courseId)) {
      return redirect(`${back}${back.includes("?") ? "&" : "?"}error=cap`, 303);
    }
    enrol(courseId);
  }
  return redirect(back, 303);
};
