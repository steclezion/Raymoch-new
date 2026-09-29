import React, { useMemo } from "react";
import { Building2, CircleDollarSign, UserRound } from "lucide-react";
import "../styles/account-level-badge.css";

const ACCOUNT_LEVELS = {
  individual: {
    label: "Individual",
    icon: UserRound,
    className: "is-individual",
  },
  business: {
    label: "Business",
    icon: Building2,
    className: "is-business",
  },
  investor: {
    label: "Investor",
    icon: CircleDollarSign,
    className: "is-investor",
  },
};

function normalizeAccountType(user) {
  const value = String(
    user?.type_of_account ||
      user?.type_account ||
      user?.account_type_name ||
      "individual",
  )
    .trim()
    .toLowerCase();

  if (value === "basic" || value === "personal") {
    return "individual";
  }

  return ACCOUNT_LEVELS[value] ? value : "individual";
}

export default function AccountLevelBadge({ user, loading = false }) {
  const accountType = useMemo(() => normalizeAccountType(user), [user]);
  const accountLevel = ACCOUNT_LEVELS[accountType];
  const AccountIcon = accountLevel.icon;

  if (loading) {
    return (
      <div
        className="account-level account-level--loading"
        role="status"
        aria-label="Loading account level"
      >
        <span className="account-level__skeleton-icon" aria-hidden="true" />
        <span className="account-level__skeleton-copy" aria-hidden="true" />
      </div>
    );
  }

  return (
    <div
      className={`account-level ${accountLevel.className}`}
      aria-label={`Account level: ${accountLevel.label}`}
      data-tooltip={`Your Raymoch account level is ${accountLevel.label}`}
    >
      <span className="account-level__icon" aria-hidden="true">
        <AccountIcon size={17} strokeWidth={2.2} />
      </span>

      <span className="account-level__copy">
        <small>Account level</small>
        <strong>{accountLevel.label}</strong>
      </span>
    </div>
  );
}
