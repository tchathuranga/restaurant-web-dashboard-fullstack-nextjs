import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

interface SectionHeaderProps {
    title: string;
    buttonLabel?: string;
    onButtonClick?: () => void;
}

const SectionHeader = ({ title, buttonLabel, onButtonClick }: SectionHeaderProps) => {
    const authState = useSelector((state: RootState) => state.auth);

    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-6 py-5 mb-6 sv-panel">
            <div>
                <p className="text-xs font-semibold tracking-[0.3em] uppercase text-amber-700 mb-1">Sri Vihar Admin</p>
                <h2 className="text-3xl font-bold text-maroon">{title}</h2>
                <p className="text-sm text-ink-muted mt-1">{`Hi, ${authState.user?.name || "User"}. Welcome back!`}</p>
            </div>

            {buttonLabel && (
                <button
                    onClick={onButtonClick}
                    className="sv-btn-primary flex items-center justify-center gap-2 px-5 py-2.5 w-full sm:w-auto"
                >
                    <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                        <path d="M8 3.333v9.334M3.333 8h9.334" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                    {buttonLabel}
                </button>
            )}
        </div>
    );
};

export default SectionHeader;
