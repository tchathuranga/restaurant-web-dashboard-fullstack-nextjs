interface FormContainerProps {
    title: string;
    children: React.ReactNode;
    onSave:(formData: any) => Promise<void>;
    onDiscard: () => void;
	actionLabel: string;
}

const FormContainer = ({ title, children, onSave, onDiscard, actionLabel }: FormContainerProps) => {
	return (
		<div className="lg:w-lg xs:w-xs sm:w-lg mx-auto bg-white rounded-lg shadow-lg p-8 border border-gray-200">
			<h2 className="text-2xl font-semibold text-center mb-8">{title}</h2>
                {children}
			<div className="flex justify-center gap-4 mt-4">
				<button className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition" onClick={onDiscard}>Discard</button>
				<button className="px-6 py-2 rounded-lg bg-blue-500 text-white font-semibold hover:bg-blue-600 transition" onClick={onSave}>{actionLabel}</button>
			</div>
		</div>
	);
};

export default FormContainer;
