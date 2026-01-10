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
        <div className="grid grid-cols-1 sm:grid-cols-7 items-center px-4 sm:px-6 py-4 rounded-md mb-6 gap-4 sm:gap-0">
            <div className="col-span-1 sm:col-span-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-1">{title}</h2>
                <p className="text-sm text-gray-400">{`Hi, ${authState.user?.name || "User"}. Welcome to Sri Vihar Admin!`}</p>
            </div>

            <div className="col-span-1 sm:col-span-1">
                {buttonLabel && (
                    <button
                        onClick={onButtonClick}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-blue-600 border border-blue-100 rounded-md shadow-sm hover:bg-blue-50 transition w-full sm:w-auto"
                    >
                        <span className="flex items-center justify-center w-6 h-6 bg-blue-100 rounded-full">
                            <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                <path d="M8 3.333v9.334M3.333 8h9.334" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                        </span>
                        {buttonLabel}
                    </button>
                )}
            </div>

        </div>
    );
};

export default SectionHeader;