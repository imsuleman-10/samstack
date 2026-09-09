"use client";

import React from "react";
import {
  X, ExternalLink, FileText, Award, Download, Check,
  GraduationCap, Calendar, Mail, Hash, Building2, Trash2, KeyRound
} from "lucide-react";

interface InternDrawerProps {
  intern: any;
  tracks: Record<string, { title: string }>;
  processingRoll: string | null;
  resendingRoll: string | null;
  handleAction: (roll: string, action: "APPROVE" | "REJECT") => void;
  handleResend: (roll: string, type: "OFFER_LETTER" | "CERTIFICATE") => void;
  handleDownload?: (roll: string, type: "OFFER_LETTER" | "CERTIFICATE") => void;
  handleDelete?: (id: string) => void;
  handleUpdateCredentials?: (intern: any) => void;
  formatDate: (ts: any) => string;
  onClose: () => void;
}

const statusConfig: Record<string, { label: string; cls: string; dot: string }> = {
  APPLIED: {
    label: "Applied",
    cls: "bg-slate-100 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10",
    dot: "bg-slate-400",
  },
  SUBMITTED: {
    label: "Submitted",
    cls: "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20",
    dot: "bg-amber-500 animate-pulse",
  },
  APPROVED: {
    label: "Approved",
    cls: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    cls: "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20",
    dot: "bg-rose-500",
  },
};

export function InternDrawer({
  intern,
  tracks,
  processingRoll,
  resendingRoll,
  handleAction,
  handleResend,
  handleDownload,
  handleDelete,
  handleUpdateCredentials,
  formatDate,
  onClose,
}: InternDrawerProps) {
  const track = tracks[intern.trackSelected];
  const sc = statusConfig[intern.status] ?? statusConfig.APPLIED;
  const initial = (intern.fullName || intern.name || intern.email || "U").charAt(0).toUpperCase();

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col bg-white dark:bg-[#0c111d] border-l border-slate-200 dark:border-white/8 shadow-2xl overflow-y-auto">

        {/* Header */}
        <div className="sticky top-0 bg-white/80 dark:bg-[#0c111d]/80 backdrop-blur-lg border-b border-slate-200 dark:border-white/8 px-6 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/15 flex items-center justify-center text-base font-black text-brand-600 dark:text-brand-400">
              {initial}
            </div>
            <div>
              <div className="font-bold text-sm text-slate-900 dark:text-white leading-tight">{intern.fullName || intern.name || "Intern"}</div>
              <div className="text-[11px] font-mono text-brand-500 dark:text-brand-400">{intern.rollNumber}</div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-white/5 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 px-6 py-5 space-y-6">

          {/* Status + Track */}
          <div className="flex flex-wrap gap-2">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${sc.cls}`}>
              <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
              {sc.label}
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/15 text-[11px] font-bold text-brand-700 dark:text-brand-300">
              {track?.title || intern.trackSelected}
            </span>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: Mail, label: "Email", value: intern.email },
              { icon: Building2, label: "University", value: intern.university },
              { icon: Hash, label: "Roll Number", value: intern.rollNumber },
              { icon: Calendar, label: "Applied On", value: formatDate(intern.applicationTimestamp) },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-white/[0.025] border border-slate-100 dark:border-white/5">
                <div className="p-2 rounded-lg bg-white dark:bg-white/5 border border-slate-200 dark:border-white/8 shrink-0">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</div>
                  <div className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5 break-all">{value}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Certificate */}
          {intern.certificateNumber && (
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/20 flex items-center gap-3">
              <GraduationCap className="w-4 h-4 text-brand-500 shrink-0" />
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-brand-500">Certificate Number</div>
                <div className="text-sm font-black font-mono text-brand-700 dark:text-brand-300 select-all">{intern.certificateNumber}</div>
              </div>
            </div>
          )}

          {/* Submission */}
          {intern.submissionData && (
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Submitted Work</h4>
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-white/[0.025] border border-slate-100 dark:border-white/5 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {intern.submissionData.githubRepositoryUrl && (
                    <a href={intern.submissionData.githubRepositoryUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white/10 text-white dark:text-slate-200 text-[11px] font-semibold hover:bg-slate-700 dark:hover:bg-white/20 transition-all">
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.17 6.839 9.49.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.342-3.369-1.342-.454-1.155-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.202 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.741 0 .267.18.578.688.48C19.138 20.167 22 16.418 22 12c0-5.523-4.477-10-10-10z"/></svg>
                      GitHub Repo <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {intern.submissionData.liveDeploymentUrl && (
                    <a href={intern.submissionData.liveDeploymentUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-semibold hover:bg-emerald-500/20 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Live Demo
                    </a>
                  )}
                  {intern.submissionData.figmaProjectUrl && (
                    <a href={intern.submissionData.figmaProjectUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500 text-[11px] font-semibold hover:bg-rose-500/20 transition-all">
                      <ExternalLink className="w-3.5 h-3.5" /> Figma
                    </a>
                  )}
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="font-mono font-bold text-brand-600 dark:text-brand-400">
                    Tasks: {intern.submissionData.completedTaskCount}/5
                  </span>
                  <span className="text-slate-400 font-mono">
                    Submitted: {formatDate(intern.submissionData.submissionTimestamp)}
                  </span>
                </div>
                {intern.submissionData.studentNotes && (
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 italic leading-relaxed border-t border-slate-200 dark:border-white/5 pt-3">
                    "{intern.submissionData.studentNotes}"
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Actions</h4>

            {/* Approve/Reject */}
            {intern.status === "SUBMITTED" && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  disabled={processingRoll !== null}
                  onClick={() => handleAction(intern.rollNumber, "APPROVE")}
                  className="py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-emerald-500/20"
                >
                  {processingRoll === intern.rollNumber ? (
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : <Check className="w-3.5 h-3.5" />}
                  Approve
                </button>
                <button
                  disabled={processingRoll !== null}
                  onClick={() => handleAction(intern.rollNumber, "REJECT")}
                  className="py-2.5 bg-rose-500 hover:bg-rose-400 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
                >
                  <X className="w-3.5 h-3.5" />
                  Reject
                </button>
              </div>
            )}

            {/* Email buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                disabled={resendingRoll !== null}
                onClick={() => handleResend(intern.rollNumber, "OFFER_LETTER")}
                className="py-2.5 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 text-brand-600 dark:text-brand-400 border border-brand-200 dark:border-brand-500/20 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {resendingRoll === `${intern.rollNumber}-OFFER_LETTER` ? (
                  <span className="w-3.5 h-3.5 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                ) : <FileText className="w-3.5 h-3.5" />}
                Email Offer
              </button>
              <button
                disabled={resendingRoll !== null}
                onClick={() => handleResend(intern.rollNumber, "CERTIFICATE")}
                className="py-2.5 bg-amber-50 hover:bg-amber-100 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {resendingRoll === `${intern.rollNumber}-CERTIFICATE` ? (
                  <span className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                ) : <Award className="w-3.5 h-3.5" />}
                Email Cert
              </button>
            </div>

            {/* Download buttons */}
            {handleDownload && (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleDownload(intern.rollNumber, "OFFER_LETTER")}
                  className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Offer
                </button>
                <button
                  onClick={() => handleDownload(intern.rollNumber, "CERTIFICATE")}
                  className="py-2 bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
                >
                  <Download className="w-3.5 h-3.5" /> Download Cert
                </button>
              </div>
            )}

            {/* Credentials */}
            {handleUpdateCredentials && (
              <button
                onClick={() => handleUpdateCredentials(intern)}
                className="w-full py-2 bg-orange-50 hover:bg-orange-100 dark:bg-orange-500/10 dark:hover:bg-orange-500/20 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-500/20 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <KeyRound className="w-3.5 h-3.5" />
                Change Email / Password
              </button>
            )}

            {/* Delete */}
            {handleDelete && (
              <button
                onClick={() => { handleDelete(intern.id); onClose(); }}
                className="w-full py-2 bg-rose-50 hover:bg-rose-100 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete Intern Record
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
