import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  BookOpen,
  FileText,
  Plus,
  Search,
  X,
} from "lucide-react";

import NoteCard from "../../components/notes/NoteCard";
import NoteUploadForm from "../../components/notes/NoteUploadForm";
import DeleteNoteModal from "../../components/notes/DeleteNoteModal";

import noteService from "../../services/noteService";
import subjectService from "../../services/subjectService";

function Notes() {
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);

  const [selectedSubject, setSelectedSubject] =
    useState(null);

  const [loading, setLoading] = useState(true);
  const [notesLoading, setNotesLoading] =
    useState(false);

  const [error, setError] = useState("");

  const [showUploadForm, setShowUploadForm] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [deletingNote, setDeletingNote] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");

  // Fetch subjects and all notes
  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const [subjectData, noteData] =
        await Promise.all([
          subjectService.getSubjects(),
          noteService.getNotes(),
        ]);

      setSubjects(subjectData.subjects || []);
      setNotes(noteData.notes || []);
    } catch (error) {
      console.error(
        "Failed to load notes:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Open a subject
  const handleSubjectClick = async (subject) => {
    try {
      setSelectedSubject(subject);
      setNotesLoading(true);
      setError("");

      const data =
        await noteService.getSubjectNotes(
          subject._id
        );

      setNotes(data.notes || []);
    } catch (error) {
      console.error(
        "Failed to load subject notes:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to load subject notes."
      );
    } finally {
      setNotesLoading(false);
    }
  };

  // Go back to subject cards
  const handleBack = async () => {
    setSelectedSubject(null);
    setSearchQuery("");
    setError("");

    try {
      const data =
        await noteService.getNotes();

      setNotes(data.notes || []);
    } catch (error) {
      console.error(
        "Failed to reload notes:",
        error
      );
    }
  };

  // Upload note
  const handleUpload = async (formData) => {
    try {
      setUploading(true);
      setError("");

      const data =
        await noteService.uploadNote(
          formData
        );

      const uploadedNote = data.note;

      setNotes((prev) => [
        uploadedNote,
        ...prev,
      ]);

      setShowUploadForm(false);
    } catch (error) {
      console.error(
        "Failed to upload note:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to upload note."
      );

      throw error;
    } finally {
      setUploading(false);
    }
  };

  // Open delete modal
  const handleDelete = (note) => {
    setDeletingNote(note);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deletingNote) return;

    try {
      setDeleting(true);
      setError("");

      await noteService.deleteNote(
        deletingNote._id
      );

      setNotes((prev) =>
        prev.filter(
          (note) =>
            note._id !== deletingNote._id
        )
      );

      setDeletingNote(null);
    } catch (error) {
      console.error(
        "Failed to delete note:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Unable to delete note."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Number of notes for each subject
  const getSubjectNoteCount = (subjectId) => {
    return notes.filter(
      (note) =>
        note.subject?._id === subjectId ||
        note.subject === subjectId
    ).length;
  };

  // Filter displayed notes
  const filteredNotes = useMemo(() => {
    const query =
      searchQuery.trim().toLowerCase();

    if (!query) return notes;

    return notes.filter((note) => {
      return (
        note.topic
          ?.toLowerCase()
          .includes(query) ||
        note.fileName
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [notes, searchQuery]);

  return (
    <div className="min-h-screen bg-slate-50 px-8 py-8">

      {/* Header */}

      <div className="mb-8 flex items-center justify-between">

        <div className="flex items-center gap-4">

          {selectedSubject && (
            <button
              type="button"
              onClick={handleBack}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              title="Back to subjects"
            >
              <ArrowLeft size={18} />
            </button>
          )}

          <div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              {selectedSubject
                ? selectedSubject.name
                : "Notes"}
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              {selectedSubject
                ? `Study material for ${selectedSubject.name}.`
                : "Organize your study material subject-wise."}
            </p>

          </div>

        </div>

        <button
          type="button"
          onClick={() =>
            setShowUploadForm(true)
          }
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          <Plus size={18} />
          Upload Note
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

      {/* Loading subjects */}

      {loading && (
        <div className="flex min-h-[350px] items-center justify-center rounded-xl border border-slate-200 bg-white">

          <p className="text-sm text-slate-500">
            Loading notes...
          </p>

        </div>
      )}

      {/* Subject Cards */}

      {!loading && !selectedSubject && (
        <>
          {subjects.length === 0 ? (
            <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                <BookOpen
                  size={26}
                  className="text-slate-500"
                />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-slate-900">
                No subjects yet
              </h2>

              <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                Create a subject first to organize
                your notes.
              </p>

            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">

              {subjects.map((subject) => {
                const noteCount =
                  getSubjectNoteCount(
                    subject._id
                  );

                return (
                  <button
                    type="button"
                    key={subject._id}
                    onClick={() =>
                      handleSubjectClick(
                        subject
                      )
                    }
                    className="group text-left"
                  >
                    <div className="h-full rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md">

                      {/* Subject color */}

                      <div className="flex items-start justify-between">

                        <div
                          className="flex h-11 w-11 items-center justify-center rounded-xl"
                          style={{
                            backgroundColor: `${
                              subject.color ||
                              "#64748B"
                            }15`,
                            color:
                              subject.color ||
                              "#64748B",
                          }}
                        >
                          <BookOpen size={21} />
                        </div>

                        <span className="text-xs font-medium text-slate-400">
                          {noteCount}{" "}
                          {noteCount === 1
                            ? "Note"
                            : "Notes"}
                        </span>

                      </div>

                      {/* Subject name */}

                      <h2 className="mt-5 text-base font-semibold text-slate-900">
                        {subject.name}
                      </h2>

                      {subject.code && (
                        <p className="mt-1 text-xs font-medium text-slate-400">
                          {subject.code}
                        </p>
                      )}

                      {/* Bottom */}

                      <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">

                        <span className="text-xs text-slate-500">
                          View notes
                        </span>

                        <span className="text-sm font-medium text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700">
                          →
                        </span>

                      </div>

                    </div>
                  </button>
                );
              })}

            </div>
          )}
        </>
      )}

      {/* Selected Subject Notes */}

      {!loading && selectedSubject && (
        <>

          {/* Search */}

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-3 shadow-sm">

            <div className="flex items-center rounded-lg border border-slate-200 px-3">

              <Search
                size={18}
                className="text-slate-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(
                    e.target.value
                  )
                }
                placeholder="Search notes by topic or filename..."
                className="w-full bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-slate-400"
              />

            </div>

          </div>

          {/* Subject information */}

          <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5">

            <div className="flex items-center gap-4">

              <div
                className="flex h-12 w-12 items-center justify-center rounded-xl"
                style={{
                  backgroundColor: `${
                    selectedSubject.color ||
                    "#64748B"
                  }15`,
                  color:
                    selectedSubject.color ||
                    "#64748B",
                }}
              >
                <BookOpen size={22} />
              </div>

              <div>

                <h2 className="text-lg font-semibold text-slate-900">
                  {selectedSubject.name}
                </h2>

                {selectedSubject.code && (
                  <p className="mt-1 text-sm text-slate-500">
                    {selectedSubject.code}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* Loading subject notes */}

          {notesLoading && (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border border-slate-200 bg-white">

              <p className="text-sm text-slate-500">
                Loading notes...
              </p>

            </div>
          )}

          {/* Empty subject */}

          {!notesLoading &&
            filteredNotes.length === 0 && (
              <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white">

                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
                  <FileText
                    size={26}
                    className="text-slate-500"
                  />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-slate-900">
                  {searchQuery
                    ? "No notes found"
                    : "No notes for this subject"}
                </h2>

                <p className="mt-1 max-w-sm text-center text-sm text-slate-500">
                  {searchQuery
                    ? "Try a different topic or filename."
                    : "Upload your first PDF note for this subject."}
                </p>

                {!searchQuery && (
                  <button
                    type="button"
                    onClick={() =>
                      setShowUploadForm(
                        true
                      )
                    }
                    className="mt-5 flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                  >
                    <Plus size={17} />
                    Upload Note
                  </button>
                )}

              </div>
            )}

          {/* Notes Grid */}

          {!notesLoading &&
            filteredNotes.length > 0 && (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

                {filteredNotes.map((note) => (
                  <NoteCard
                    key={note._id}
                    note={note}
                    onDelete={handleDelete}
                  />
                ))}

              </div>
            )}

        </>
      )}

      {/* Upload Modal */}

      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">

            <NoteUploadForm
              subjects={subjects}
              onSubmit={handleUpload}
              onCancel={() =>
                setShowUploadForm(false)
              }
              uploading={uploading}
            />

          </div>

        </div>
      )}

      {/* Delete Modal */}

      {deletingNote && (
        <DeleteNoteModal
          note={deletingNote}
          onConfirm={confirmDelete}
          onCancel={() =>
            setDeletingNote(null)
          }
          deleting={deleting}
        />
      )}

    </div>
  );
}

export default Notes;