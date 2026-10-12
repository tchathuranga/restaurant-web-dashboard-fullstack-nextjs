import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface RowActionsProps {
  onEdit?: () => void;
  onDelete?: () => void;
  className?: string;
}

// Labelled Edit / Delete buttons so people don't have to guess what an icon does
const RowActions = ({ onEdit, onDelete, className = "" }: RowActionsProps) => (
  <div className={`flex gap-2 ${className}`}>
    {onEdit && (
      <button
        type="button"
        onClick={onEdit}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#0f5c5b] text-white text-sm font-medium hover:opacity-85 transition"
      >
        <EditIcon sx={{ fontSize: 16 }} />
        Edit
      </button>
    )}
    {onDelete && (
      <button
        type="button"
        onClick={onDelete}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-red-300 text-red-700 text-sm font-medium hover:bg-red-700 hover:text-white hover:border-red-700 transition"
      >
        <DeleteOutlineIcon sx={{ fontSize: 16 }} />
        Delete
      </button>
    )}
  </div>
);

export default RowActions;
