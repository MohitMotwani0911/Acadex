import { useEffect, useMemo, useState } from "react";
import {
  FileText,
  Plus,
  Search,
  X,
} from "lucide-react";

import ExamCard from "../../components/exams/ExamCard";
import ExamForm from "../../components/exams/ExamForm";
import DeleteExamModal from "../../components/exams/DeleteExamModal";

import examService from "../../services/examService";
import subjectService from "../../services/subjectService";

function Exams() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showForm, setShowForm] = useState(false);

  // Currently editing exam
  const [editingExam, setEditingExam] =
    useState(null);

  // Currently deleting exam
  const [deletingExam, setDeletingExam] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  const [subjectFilter, setSubjectFilter] =
    useState("all");

  const [statusFilter, setStatusFilter] =
    useState("all");

  // Fetch exams and subjects
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [examData, subjectData] =
        await Promise.all([
          examService.getExams(),
          subjectService.getSubjects(),
        ]);

      setExams(examData.exams || []);
      setSubjects(subjectData.subjects || []);
    } catch (error) {
      console.error(
        "Failed to load exams:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load exams."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // =========================
  // CREATE EXAM
  // =========================

  const handleCreate = async (formData) => {
    try {
      setError("");

      const data =
        await examService.createExam(
          formData
        );

      setExams((prev) => [
        data.exam,
        ...prev,
      ]);

      setShowForm(false);
    } catch (error) {
      console.error(
        "Failed to create exam:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to create exam."
      );
    }
  };

  // =========================
  // UPDATE EXAM
  // =========================

  const handleUpdate = async (formData) => {
    if (!editingExam) return;

    try {
      setError("");

      const data =
        await examService.updateExam(
          editingExam._id,
          formData
        );

      setExams((prev) =>
        prev.map((exam) =>
          exam._id === editingExam._id
            ? data.exam
            : exam
        )
      );

      setEditingExam(null);
    } catch (error) {
      console.error(
        "Failed to update exam:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to update exam."
      );
    }
  };

  // =========================
  // DELETE EXAM
  // =========================

  const handleDelete = (exam) => {
    setDeletingExam(exam);
  };

  const confirmDelete = async () => {
    if (!deletingExam) return;

    try {
      setDeleting(true);
      setError("");

      await examService.deleteExam(
        deletingExam._id
      );

      setExams((prev) =>
        prev.filter(
          (exam) =>
            exam._id !== deletingExam._id
        )
      );

      setDeletingExam(null);
    } catch (error) {
      console.error(
        "Failed to delete exam:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete exam."
      );
    } finally {
      setDeleting(false);
    }
  };

  // =========================
  // FILTER EXAMS
  // =========================

  const filteredExams = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesSearch =
        !query ||
        exam.title
          ?.toLowerCase()
          .includes(query) ||
        exam.subject?.name
          ?.toLowerCase()
          .includes(query);

      const matchesSubject =
        subjectFilter === "all" ||
        exam.subject?._id === subjectFilter;

      const matchesStatus =
        statusFilter === "all" ||
        exam.status === statusFilter;

      return (
        matchesSearch &&
        matchesSubject &&
        matchesStatus
      );
    });
  }, [
    exams,
    searchQuery,
    subjectFilter,
    statusFilter,
  ]);

  // =========================
  // CLOSE FORM
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingExam(null);
  };

  // =========================
  // RENDER
  // =========================

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Exams
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage your examinations and important academic dates.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingExam(null);
            setShowForm(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
        >
          <Plus size={18} />
          Add Exam
        </button>

      </div>

      {/* Error */}

      {error && (
        <div className="mb-6 flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">

          <span>{error}</span>

          <button
            type="button"
            onClick={() => setError("")}
          >
            <X size={18} />
          </button>

        </div>
      )}

      {/* Filters */}

      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

        <div className="flex flex-col gap-3 lg:flex-row">

          {/* Search */}

          <div className="flex flex-1 items-center rounded-lg border border-slate-200 px-3">

            <Search
              size={18}
              className="text-slate-400"
            />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search exams..."
              className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
            />

          </div>

          {/* Subject */}

          <select
            value={subjectFilter}
            onChange={(e) =>
              setSubjectFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
          >
            <option value="all">
              All Subjects
            </option>

            {subjects.map((subject) => (
              <option
                key={subject._id}
                value={subject._id}
              >
                {subject.name}
              </option>
            ))}
          </select>

          {/* Status */}

          <select
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
            className="rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none"
          >
            <option value="all">
              All Status
            </option>

            <option value="upcoming">
              Upcoming
            </option>

            <option value="completed">
              Completed
            </option>
          </select>

        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">

          <p className="text-sm text-slate-500">
            Loading exams...
          </p>

        </div>
      )}

      {/* Empty */}

      {!loading && exams.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">

            <FileText
              size={26}
              className="text-slate-500"
            />

          </div>

          <h2 className="mt-4 text-lg font-semibold text-slate-900">
            No exams yet
          </h2>

          <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
            Add your upcoming examinations to keep
            your academic schedule organized.
          </p>

          <button
            type="button"
            onClick={() => {
              setEditingExam(null);
              setShowForm(true);
            }}
            className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus size={17} />
            Add Exam
          </button>

        </div>
      )}

      {/* Filtered empty */}

      {!loading &&
        exams.length > 0 &&
        filteredExams.length === 0 && (
          <div className="rounded-xl border border-slate-200 bg-white py-16 text-center">

            <Search
              size={28}
              className="mx-auto text-slate-400"
            />

            <h2 className="mt-3 font-semibold text-slate-900">
              No exams found
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

          </div>
        )}

      {/* Exam Cards */}

      {!loading &&
        filteredExams.length > 0 && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

            {filteredExams.map((exam) => (
              <ExamCard
                key={exam._id}
                exam={exam}
                onEdit={(selectedExam) => {
                  setEditingExam(
                    selectedExam
                  );
                  setShowForm(false);
                }}
                onDelete={handleDelete}
              />
            ))}

          </div>
        )}

      {/* Create / Edit Modal */}

      {(showForm || editingExam) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <ExamForm
              exam={editingExam}
              subjects={subjects}
              onSubmit={
                editingExam
                  ? handleUpdate
                  : handleCreate
              }
              onCancel={closeForm}
            />

          </div>

        </div>
      )}

      {/* Delete Modal */}

      {deletingExam && (
        <DeleteExamModal
          exam={deletingExam}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeletingExam(null)
          }
          deleting={deleting}
        />
      )}

    </div>
  );
}

export default Exams;