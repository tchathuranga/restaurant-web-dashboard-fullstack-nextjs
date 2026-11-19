interface FormContainerProps {
    title: string;
    children: React.ReactNode;
    onSave: () => void | Promise<void>;
    onDiscard: () => void;
	actionLabel: string;
    /** Disables the buttons and shows progress while a save is running */
    saving?: boolean;
}

// Dialog form: gold-trimmed title bar, scrollable fields, and actions that stay in reach at the bottom
const FormContainer = ({ title, children, onSave, onDiscard, actionLabel, saving = false }: FormContainerProps) => {
	return (
		<form
			className="flex max-h-[90vh] w-full flex-col bg-ivory"
			onSubmit={(e) => {
				e.preventDefault();
				if (!saving) onSave();
			}}
		>
			<div className="border-b border-gold/30 bg-gradient-to-r from-cream to-ivory px-5 py-4 sm:px-8">
				<div className="mb-2 h-1 w-12 rounded-full bg-gradient-to-r from-saffron to-gold" />
				<h2 className="text-2xl font-bold text-maroon sm:text-3xl">{title}</h2>
				<p className="mt-0.5 text-xs text-ink-muted">Fields marked <span className="text-red-600">*</span> are required</p>
			</div>

			<div className="flex-1 overflow-y-auto px-5 pt-5 sm:px-8">{children}</div>

			<div className="flex justify-end gap-3 border-t border-gold/30 bg-parchment/60 px-5 py-4 sm:px-8">
				<button type="button" disabled={saving} className="rounded-xl border border-gold/60 px-5 py-2.5 font-semibold text-ink transition hover:bg-cream disabled:opacity-50" onClick={onDiscard}>Cancel</button>
				<button type="submit" disabled={saving} className="sv-btn-primary min-w-32 px-6 py-2.5 disabled:pointer-events-none disabled:opacity-60">{saving ? "Saving..." : actionLabel}</button>
			</div>
		</form>
	);
};

export default FormContainer;
