interface FormContainerProps {
    title: string;
    children: React.ReactNode;
    onSave: () => void | Promise<void>;
    onDiscard: () => void;
	actionLabel: string;
    /** Disables the buttons and shows progress while a save is running */
    saving?: boolean;
}

const FormContainer = ({ title, children, onSave, onDiscard, actionLabel, saving = false }: FormContainerProps) => {
	return (
		<form
			className="w-full sm:w-lg max-w-full mx-auto bg-ivory p-5 sm:p-8 border-t-4 border-gold"
			onSubmit={(e) => {
				e.preventDefault();
				if (!saving) onSave();
			}}
		>
			<h2 className="text-3xl font-bold text-maroon text-center mb-6">{title}</h2>
			{children}
			<div className="flex justify-center gap-4 mt-4">
				<button type="button" disabled={saving} className="px-6 py-2.5 rounded-xl border border-maroon text-maroon font-semibold hover:bg-maroon hover:text-ivory transition disabled:opacity-50" onClick={onDiscard}>Cancel</button>
				<button type="submit" disabled={saving} className="sv-btn-primary px-6 py-2.5 min-w-28 disabled:opacity-60 disabled:pointer-events-none">{saving ? "Saving..." : actionLabel}</button>
			</div>
		</form>
	);
};

export default FormContainer;
