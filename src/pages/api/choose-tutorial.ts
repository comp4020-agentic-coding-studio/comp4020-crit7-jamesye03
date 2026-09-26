import type { APIRoute } from "astro";
import { chooseTutorial } from "../../lib/db";

// This is the step the real system makes miserable: picking a tutorial slot
// with no easy view of what it'd collide with. Here the choice itself is one
// click (the collision-checking already happened on hover, client-side).
export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const courseId = Number(form.get("courseId"));
  const sessionId = Number(form.get("sessionId"));
  if (Number.isInteger(courseId) && Number.isInteger(sessionId)) {
    chooseTutorial(courseId, sessionId);
  }
  return redirect("/timetable/", 303);
};
