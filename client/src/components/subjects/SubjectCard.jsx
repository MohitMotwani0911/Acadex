import {
  BookOpen,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

function SubjectCard({
  subject,
  onEdit,
  onDelete,
}) {
  const subjectColor =
    subject.color || "#4F46E5";

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Top color section */}

      <div
        className="relative h-24"
        style={{
          background: `linear-gradient(135deg, ${subjectColor}, ${subjectColor}99)`,
        }}
      >

        {/* Decorative circles */}

        <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

        <div className="absolute -bottom-10 right-10 h-24 w-24 rounded-full bg-white/10" />

        {/* Subject icon */}

        <div className="absolute -bottom-6 left-5 flex h-12 w-12 items-center justify-center rounded-xl border-4 border-white bg-white shadow-md">
          <BookOpen
            size={22}
            style={{
              color: subjectColor,
            }}
          />
        </div>

      </div>

      {/* Card content */}

      <div className="px-5 pb-5 pt-9">

        {/* Subject name + menu */}

        <div className="flex items-start justify-between gap-3">

          <div className="min-w-0">

            <h3 className="truncate text-lg font-semibold text-slate-900">
              {subject.name}
            </h3>

            {subject.code && (
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-slate-400">
                {subject.code}
              </p>
            )}

          </div>

          <button
            type="button"
            className="rounded-lg p-1.5 text-slate-400 opacity-0 transition group-hover:opacity-100 hover:bg-slate-100 hover:text-slate-700"
          >
            <MoreVertical size={18} />
          </button>

        </div>

        {/* Description */}

        <p className="mt-4 min-h-[48px] text-sm leading-6 text-slate-500">
          {subject.description ||
            "No description added for this subject."}
        </p>

        {/* Bottom */}

        <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-4">

          <div className="flex items-center gap-2">

            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: subjectColor,
              }}
            />

            <span className="text-xs text-slate-400">
              Academic Subject
            </span>

          </div>

          <div className="flex items-center gap-1">

            <button
              type="button"
              onClick={() => onEdit(subject)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              title="Edit subject"
            >
              <Pencil size={16} />
            </button>

            <button
              type="button"
              onClick={() => onDelete(subject)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500"
              title="Delete subject"
            >
              <Trash2 size={16} />
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}

export default SubjectCard;