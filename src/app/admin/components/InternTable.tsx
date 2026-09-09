import React from "react";
import { ExternalLink, Check, X, FileText, Award, GraduationCap, Trash2, Download } from "lucide-react";

interface InternTableProps {
  isLoading: boolean;
  filteredInterns: any[];
  tracks: Record<string, { title: string }>;
  processingRoll: string | null;
  resendingRoll: string | null;
  handleAction: (rollNumber: string, action: "APPROVE" | "REJECT") => void;
  handleResend: (rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE") => void;
  handleDownload?: (rollNumber: string, type: "OFFER_LETTER" | "CERTIFICATE") => void;
  handleDelete?: (id: string) => void;
  formatDate: (timestamp: any) => string;
  onRowClick?: (intern: any) => void;
}

export const InternTable = React.memo(function InternTable({
  isLoading,
  filteredInterns,
  tracks,
  processingRoll,
  resendingRoll,
  handleAction,
  handleResend,
  handleDownload,
  handleDelete,
  formatDate,
  onRowClick,
}: InternTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-brand-500/30 border-t-brand-500 animate-spin" />
          <div className="absolute inset-2 rounded-full border-2 border-transparent border-b-indigo-500 animate-spin" style={{ animationDirection: "reverse", animationDuration: "0.8s" }} />
        </div>
        <span className="text-sm font-semibold text-slate-500 dark:text-slate-400 tracking-wider uppercase">Loading Application Matrix...</span>
      </div>
    );
  }

  if (filteredInterns.length === 0) {
    return (
      <div className="text-center py-20 space-y-4">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/5 flex items-center justify-center">
          <GraduationCap className="w-7 h-7 text-slate-400 dark:text-slate-600" />
        </div>
        <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No application records matched filters.</h3>
        <p className="text-sm text-slate-500 font-mono">Select a different query parameter to examine.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-white/5 bg-slate-50/60 dark:bg-white/[0.02] text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
            <th className="py-4 px-6">Candidate profile</th>
            <th className="py-4 px-6">Specialization</th>
            <th className="py-4 px-6">Workspace submittal</th>
            <th className="py-4 px-6 text-center">Status</th>
            <th className="py-4 px-6 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-white/5 text-slate-700 dark:text-slate-300">
          {filteredInterns.map((intern, idx) => {
            const trackInfo = tracks[intern.trackSelected];

            return (
              <tr
                key={intern.id}
                className="transition-colors hover:bg-slate-50/50 dark:hover:bg-white/[0.015] cursor-pointer group"
                style={{ animationDelay: `${idx * 30}ms` }}
                onClick={() => onRowClick?.(intern)}
              >
                <td className="py-5 px-6">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500/20 to-indigo-500/20 border border-brand-500/10 flex items-center justify-center text-sm font-bold text-brand-600 dark:text-brand-400 shrink-0">
                      {(intern.fullName || intern.name || intern.email || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-bold text-slate-900 dark:text-white text-sm leading-tight">{intern.fullName || intern.name || "Intern"}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-mono flex items-center gap-1.5 flex-wrap">
                        <span className="text-brand-600 dark:text-brand-400 font-semibold">{intern.rollNumber}</span>
                        <span className="text-slate-300 dark:text-white/20">•</span>
                        <span className="truncate max-w-[140px]" title={intern.email}>{intern.email}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 truncate max-w-[200px]" title={intern.university}>
                        {intern.university}
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6 align-top">
                  <div className="space-y-1">
                    <span className="inline-block px-2.5 py-1 rounded-md bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/15 text-xs font-bold text-brand-700 dark:text-brand-300">
                      {trackInfo?.title || intern.trackSelected}
                    </span>
                    <div className="text-[11px] text-slate-500 font-mono">
                      Applied: {formatDate(intern.applicationTimestamp)}
                    </div>
                  </div>
                </td>

                <td className="py-5 px-6 align-top">
                  {intern.submissionData ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {intern.submissionData.githubRepositoryUrl && (
                          <a
                            href={intern.submissionData.githubRepositoryUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-500/30 transition-all"
                          >
                            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                              <path d="M9 18c-4.51 2-5-2-7-2" />
                            </svg>
                            Repo <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {intern.submissionData.figmaProjectUrl && (
                          <a
                            href={intern.submissionData.figmaProjectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-500/30 transition-all"
                          >
                            <svg className="w-3.5 h-3.5 text-rose-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M5 5.5A3.5 3.5 0 0 1 8.5 2H12v7H8.5A3.5 3.5 0 0 1 5 5.5z" />
                              <path d="M12 2h3.5a3.5 3.5 0 1 1 0 7H12V2z" />
                              <path d="M12 12.5a3.5 3.5 0 1 1 7 0 3.5 3.5 0 1 1-7 0z" />
                              <path d="M5 12.5A3.5 3.5 0 0 1 8.5 9H12v7H8.5A3.5 3.5 0 0 1 5 12.5z" />
                              <path d="M5 19.5A3.5 3.5 0 0 1 8.5 16H12v3.5a3.5 3.5 0 1 1-7 0z" />
                            </svg>
                            Design <ExternalLink className="w-3 h-3" />
                          </a>
                        )}

                        {intern.submissionData.liveDeploymentUrl && (
                          <a
                            href={intern.submissionData.liveDeploymentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 text-[11px] font-mono text-slate-700 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-500/30 transition-all"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-emerald-500" />
                            Live Build
                          </a>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-600 dark:text-slate-400 max-w-xs line-clamp-2 leading-relaxed" title={intern.submissionData.studentNotes}>
                        <span className="font-semibold mr-1">Notes:</span>
                        &ldquo;{intern.submissionData.studentNotes || "None"}&rdquo;
                      </div>

                      <div className="flex items-center gap-3 text-[11px]">
                        <span className="font-mono font-semibold text-brand-600 dark:text-brand-400">
                          Tasks: {intern.submissionData.completedTaskCount} / 5
                        </span>
                        <span className="text-slate-500 font-mono">
                          Sub: {formatDate(intern.submissionData.submissionTimestamp)}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 font-mono italic">No submission</div>
                  )}
                </td>

                <td className="py-5 px-6 text-center">
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                    intern.status === "SUBMITTED" ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200 dark:border-amber-500/20" :
                    intern.status === "APPROVED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20" :
                    intern.status === "REJECTED" ? "bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20" :
                    "bg-slate-50 text-slate-600 dark:bg-white/5 dark:text-slate-400 border border-slate-200 dark:border-white/10"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      intern.status === "SUBMITTED" ? "bg-amber-500" :
                      intern.status === "APPROVED" ? "bg-emerald-500" :
                      intern.status === "REJECTED" ? "bg-rose-500" :
                      "bg-slate-400"
                    }`} />
                    {intern.status.toLowerCase()}
                  </span>
                </td>

                <td className="py-5 px-6 text-right">
                  <div className="flex flex-col items-end gap-2" onClick={(e) => e.stopPropagation()}>

                    {intern.status === "SUBMITTED" && (
                      <>
                        <div className="flex items-center gap-2">
                          <button
                            disabled={processingRoll !== null}
                            onClick={() => handleAction(intern.rollNumber, "APPROVE")}
                            className="px-3 py-1.5 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 text-xs font-bold rounded-lg border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            {processingRoll === intern.rollNumber ? (
                              <span className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <Check className="w-4 h-4" />
                            )}
                            Approve
                          </button>
                          <button
                            disabled={processingRoll !== null}
                            onClick={() => handleAction(intern.rollNumber, "REJECT")}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 text-xs font-bold rounded-lg border border-rose-200 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20 hover:shadow-lg hover:shadow-rose-500/10 transition-all flex items-center gap-1.5 disabled:opacity-50"
                          >
                            <X className="w-4 h-4" />
                            Reject
                          </button>
                        </div>
                        <div className="flex flex-col items-end gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5 w-full">
                          <div className="flex gap-2">
                            <button
                              disabled={resendingRoll !== null}
                              onClick={() => handleResend(intern.rollNumber, "OFFER_LETTER")}
                              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                            >
                              {resendingRoll === `${intern.rollNumber}-OFFER_LETTER` ? (
                                <span className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              Email Offer
                            </button>
                            {handleDownload && (
                              <button
                                onClick={() => handleDownload(intern.rollNumber, "OFFER_LETTER")}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3 h-3" />
                                Download
                              </button>
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {intern.status === "APPROVED" && (
                      <>
                        {intern.certificateNumber && (
                          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand-50 dark:bg-brand-500/10 border border-brand-200 dark:border-brand-500/15 text-xs font-mono font-bold text-brand-700 dark:text-brand-300 select-all">
                            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
                            {intern.certificateNumber}
                          </div>
                        )}
                        <div className="flex flex-col items-end gap-2 mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5 w-full">
                          <div className="flex gap-2">
                            <button
                              disabled={resendingRoll !== null}
                              onClick={() => handleResend(intern.rollNumber, "OFFER_LETTER")}
                              className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                            >
                              {resendingRoll === `${intern.rollNumber}-OFFER_LETTER` ? (
                                <span className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <FileText className="w-3 h-3" />
                              )}
                              Offer
                            </button>
                            <button
                              disabled={resendingRoll !== null}
                              onClick={() => handleResend(intern.rollNumber, "CERTIFICATE")}
                              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-600 dark:bg-amber-500/10 dark:hover:bg-amber-500/20 dark:text-amber-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                            >
                              {resendingRoll === `${intern.rollNumber}-CERTIFICATE` ? (
                                <span className="w-3 h-3 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                              ) : (
                                <Award className="w-3 h-3" />
                              )}
                              Cert
                            </button>
                          </div>
                          {handleDownload && (
                            <div className="flex gap-2 mt-1">
                              <button
                                onClick={() => handleDownload(intern.rollNumber, "OFFER_LETTER")}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3 h-3" />
                                Offer
                              </button>
                              <button
                                onClick={() => handleDownload(intern.rollNumber, "CERTIFICATE")}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                              >
                                <Download className="w-3 h-3" />
                                Cert
                              </button>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {intern.status === "REJECTED" && (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            disabled={resendingRoll !== null}
                            onClick={() => handleResend(intern.rollNumber, "OFFER_LETTER")}
                            className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                          >
                            {resendingRoll === `${intern.rollNumber}-OFFER_LETTER` ? (
                              <span className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileText className="w-3 h-3" />
                            )}
                            Email Offer
                          </button>
                          {handleDownload && (
                            <button
                              onClick={() => handleDownload(intern.rollNumber, "OFFER_LETTER")}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {intern.status === "APPLIED" && (
                      <div className="flex flex-col items-end gap-2">
                        <div className="flex gap-2">
                          <button
                            disabled={resendingRoll !== null}
                            onClick={() => handleResend(intern.rollNumber, "OFFER_LETTER")}
                            className="px-2.5 py-1 bg-brand-50 hover:bg-brand-100 text-brand-600 dark:bg-brand-500/10 dark:hover:bg-brand-500/20 dark:text-brand-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                          >
                            {resendingRoll === `${intern.rollNumber}-OFFER_LETTER` ? (
                              <span className="w-3 h-3 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <FileText className="w-3 h-3" />
                            )}
                            Email Offer
                          </button>
                          {handleDownload && (
                            <button
                              onClick={() => handleDownload(intern.rollNumber, "OFFER_LETTER")}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-600 dark:bg-white/5 dark:hover:bg-white/10 dark:text-slate-300 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                            >
                              <Download className="w-3 h-3" />
                              Download
                            </button>
                          )}
                        </div>
                      </div>
                    )}

                    {handleDelete && (
                      <div className="mt-3 pt-3 border-t border-slate-200/50 dark:border-white/5 w-full flex justify-end">
                        <button
                          onClick={() => handleDelete(intern.id)}
                          className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-600 dark:bg-rose-500/10 dark:hover:bg-rose-500/20 dark:text-rose-400 text-[10px] font-bold rounded flex items-center gap-1.5 transition-all"
                          title="Delete Intern Record"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
});
