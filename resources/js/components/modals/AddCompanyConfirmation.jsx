import React, { useEffect, useId, useRef, useState } from "react";
import { AlertCircle, Building2, CheckCircle2, CircleDollarSign, RefreshCw, ShieldCheck, X } from "lucide-react";
import "../services/add-company-confirmation.css";

export function resolveParentCompany(data) {
  if (!Array.isArray(data.companies)) throw new Error("The company list response is invalid. Please retry.");
  const parents = data.companies.filter(company => [true, 1, "1"].includes(company.is_parent_company));
  if (parents.length > 1) throw new Error("More than one parent company is registered. Contact support to resolve the account before adding another company.");
  if (data.companies.length > 0 && parents.length === 0) {
    throw new Error("No parent company is marked on this account. Contact support to identify the parent company before adding another company.");
  }
  const parent = parents[0] ?? null;
  if (parent && (parent.id == null || !parent.company_name?.trim())) {
    throw new Error("The parent company record is incomplete. Contact support before continuing.");
  }
  const suppliedName = data.who_is_parent_company;
  if (parent && suppliedName != null && suppliedName !== parent.company_name) {
    throw new Error("The parent company name does not match the account records. Please retry or contact support.");
  }
  return {
    parentCompany: parent,
    who_is_parent_company: parent ? suppliedName || parent.company_name : null,
  };
}

export default function AddCompanyConfirmation({ open, endpoint, onCancel, onConfirm }) {
  const dialogRef = useRef(null);
  const cancelRef = useRef(null);
  const titleId = useId();
  const [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState({ status: "loading" });

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousFocus = document.activeElement;
    dialog.showModal();
    cancelRef.current?.focus();
    return () => {
      dialog.close();
      if (previousFocus?.isConnected) previousFocus.focus();
    };
  }, [open]);

  // The index endpoint must restrict companies to the authenticated user on the server.
  useEffect(() => {
    if (!open) return;
    const controller = new AbortController();
    setResult({ status: "loading" });
    const checkParent = async () => {
      try {
        const response = await fetch(endpoint, {
          credentials: "include",
          headers: { Accept: "application/json" },
          cache: "no-store",
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to check the parent company. Please retry.");
        const context = resolveParentCompany(data);
        if (!controller.signal.aborted) setResult({ status: "ready", ...context });
      } catch (error) {
        if (!controller.signal.aborted) setResult({ status: "error", message: error.message || "Unable to check the account." });
      }
    };
    checkParent();
    return () => controller.abort();
  }, [open, endpoint, attempt]);

  const ready = result.status === "ready";
  const parentName = ready ? result.who_is_parent_company : null;

  return (
    <dialog ref={dialogRef} className="add-company-dialog" aria-labelledby={titleId}
      onKeyDown={event => event.stopPropagation()}
      onCancel={event => { event.preventDefault(); event.stopPropagation(); onCancel(); }}>
      <header className="add-company-dialog-header">
        <span className="add-company-dialog-icon"><Building2 size={24} aria-hidden="true" /></span>
        <div><h2 id={titleId}>Add a company</h2><p>Review the account relationship before continuing.</p></div>
        <button type="button" className="add-company-close" aria-label="Cancel adding company" onClick={onCancel}><X size={20} aria-hidden="true" /></button>
      </header>
      <div className="add-company-dialog-body" aria-busy={result.status === "loading"}>
        {result.status === "loading" && <div className="add-company-loading" role="status"><RefreshCw className="add-company-spinner" size={30} aria-hidden="true" /><strong>Checking your company records…</strong><p>Identifying the parent company linked to your account.</p></div>}
        {result.status === "error" && <div className="add-company-error" role="alert"><AlertCircle size={22} aria-hidden="true" /><p>{result.message}</p><button type="button" className="add-company-secondary" onClick={() => { setResult({ status: "loading" }); setAttempt(value => value + 1); }}><RefreshCw size={16} aria-hidden="true" /> Retry</button></div>}
        {ready && <>
          <div className="add-company-parent"><ShieldCheck size={23} aria-hidden="true" /><div><span>{parentName ? "Registered parent company" : "First company registration"}</span><strong>{parentName || "No company is currently registered"}</strong></div></div>
          <ol className="add-company-rules">
            <li>{parentName ? <>Raymoch Verification identifies <strong>{parentName}</strong> as the parent company for this account.</> : "This account has no registered companies. You can proceed with its first company registration."}</li>
            <li>{parentName ? <>Any additional company registered here must be a sister company associated with <strong>{parentName}</strong>.</> : "The company relationship must be recorded correctly when your registration is saved."}</li>
            <li>Raymoch account policy does not permit two independent companies under one business account. Create a separate Business account for a new independent company.</li>
            <li>{parentName ? "A sister company requires a separate verification payment. Confirming here does not charge you; payment details must be reviewed separately." : "Any applicable verification payment will be presented separately before you pay."}</li>
          </ol>
          <p className="add-company-consent"><CircleDollarSign size={18} aria-hidden="true" />{parentName ? "Confirm only if the new company belongs to this company group and you understand the separate payment requirement." : "Confirm to continue to the company registration form."}</p>
        </>}
      </div>
      <footer className="add-company-dialog-footer">
        <button ref={cancelRef} type="button" className="add-company-secondary" onClick={onCancel}>Cancel</button>
        <button type="button" className="add-company-primary" disabled={!ready} onClick={() => {
          if (ready) onConfirm({ parentCompany: result.parentCompany, who_is_parent_company: parentName });
        }}><CheckCircle2 size={18} aria-hidden="true" /> Confirm</button>
      </footer>
    </dialog>
  );
}
