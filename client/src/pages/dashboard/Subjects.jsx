import { useEffect, useState } from "react";
import {
  Plus,
  Search,
  BookOpen,
  X,
} from "lucide-react";

import SubjectCard from "../../components/subjects/SubjectCard";
import SubjectForm from "../../components/subjects/SubjectForm";
import DeleteSubjectModal from "../../components/subjects/DeleteSubjectModal";
import subjectService from "../../services/subjectService";

function Subjects() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);

  const [deletingSubject, setDeletingSubject] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  // Fetch subjects
  const fetchSubjects = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await subjectService.getSubjects();

      setSubjects(data.subjects || []);
    } catch (error) {
      console.error("Failed to fetch subjects:", error);

      setError(
        error.response?.data?.message ||
          "Unable to load subjects."
      );
    } finally {
      setLoading(false);
    }
  };

  // Fetch subjects when page loads
  useEffect(() => {
    fetchSubjects();
  }, []);

  // Create subject
  const handleCreate = async (formData) => {
    try {
      setError("");

      const data =
        await subjectService.createSubject(formData);

      setSubjects((prev) => [
        data.subject,
        ...prev,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create subject:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create subject."
      );
    }
  };

  // Update subject
  const handleUpdate = async (formData) => {
    if (!editingSubject) return;

    try {
      setError("");

      const data =
        await subjectService.updateSubject(
          editingSubject._id,
          formData
        );

      setSubjects((prev) =>
        prev.map((subject) =>
          subject._id === editingSubject._id
            ? data.subject
            : subject
        )
      );

      setEditingSubject(null);
    } catch (error) {
      console.error(
        "Failed to update subject:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update subject."
      );
    }
  };

  // Open delete confirmation modal
  const handleDelete = (subject) => {
    setDeletingSubject(subject);
  };

  // Actually delete after confirmation
  const confirmDelete = async () => {
    if (!deletingSubject) return;

    try {
      setDeleting(true);
      setError("");

      await subjectService.deleteSubject(
        deletingSubject._id
      );

      setSubjects((prev) =>
        prev.filter(
          (subject) =>
            subject._id !== deletingSubject._id
        )
      );

      setDeletingSubject(null);
    } catch (error) {
      console.error(
        "Failed to delete subject:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete subject."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Open edit modal
  const handleEdit = (subject) => {
    setEditingSubject(subject);
    setShowForm(false);
  };

  // Close form modal
  const closeForm = () => {
    setShowForm(false);
    setEditingSubject(null);
  };

  // Search
  const filteredSubjects = subjects.filter(
    (subject) => {
      const query =
        searchQuery.trim().toLowerCase();

      if (!query) return true;

      return (
        subject.name
          ?.toLowerCase()
          .includes(query) ||
        subject.code
          ?.toLowerCase()
          .includes(query)
      );
    }
  );

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">

      {/* Page Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Subjects
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your academic subjects and courses.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingSubject(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Subject
        </button>

      </div>

      {/* Error Message */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
            className="text-red-500 hover:text-red-700"
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* Search */}

      <div className="mb-6 flex items-center rounded-lg border border-slate-200 bg-white px-4 shadow-sm">

        <Search
          size={19}
          className="text-slate-400"
        />

        <input
          type="text"
          value={searchQuery}
          onChange={(e) =>
            setSearchQuery(e.target.value)
          }
          placeholder="Search subjects..."
          className="w-full bg-transparent px-3 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
        />

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">

          <p className="text-sm text-slate-500">
            Loading subjects...
          </p>

        </div>
      )}

      {/* Empty State */}

      {!loading &&
        subjects.length === 0 && (
          <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
              <BookOpen
                size={26}
                className="text-slate-500"
              />
            </div>

            <h2 className="text-lg font-semibold text-slate-900">
              No subjects yet
            </h2>

            <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
              Add your first subject to start
              organizing your academic work.
            </p>

            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
            >
              <Plus size={17} />
              Add Subject
            </button>

          </div>
        )}

      {/* No Search Results */}

      {!loading &&
        subjects.length > 0 &&
        filteredSubjects.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">

            <Search
              size={28}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-3 font-semibold text-slate-900">
              No subjects found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try a different search term.
            </p>

          </div>
        )}

      {/* Subject Cards */}

      {!loading &&
        filteredSubjects.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredSubjects.map(
              (subject) => (
                <SubjectCard
                  key={subject._id}
                  subject={subject}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )
            )}

          </div>
        )}

      {/* Create / Edit Modal */}

      {(showForm || editingSubject) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl">

            <SubjectForm
              subject={editingSubject}
              onSubmit={
                editingSubject
                  ? handleUpdate
                  : handleCreate
              }
              onCancel={closeForm}
            />

          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}

      {deletingSubject && (
        <DeleteSubjectModal
          subject={deletingSubject}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeletingSubject(null)
          }
          deleting={deleting}
        />
      )}

    </div>
  );
}

export default Subjects;