import type { APIRoute } from "astro";
import { drop } from "../../lib/db";

export const POST: APIRoute = async ({ request, redirect }) => {
  const form = await request.formData();
  const courseId = Number(form.get("courseId"));
  if (Number.isInteger(courseId)) {
    drop(courseId);
  }
  const back = String(form.get("back") ?? "/timetable/");
  return redirect(back, 303);
};
