import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import RowActions from "@/component/common/RowActions";

interface JobCardProps {
    title: string;
    location: string;
    employmentType: string;
    description: string;
    onDelete?: () => void;
    onEdit?: () => void;
}

export default function JobCard({
    title,
    location,
    employmentType,
    description,
    onDelete,
    onEdit
}: JobCardProps) {
    return (
        <div className="sv-panel p-6 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3">
                <h3 className="text-2xl font-bold text-maroon leading-tight">{title}</h3>
                <span className="shrink-0 text-xs font-semibold px-3 py-1 rounded-full bg-cream text-amber-800">
                    {employmentType}
                </span>
            </div>

            <div className="flex items-center gap-1.5 text-ink-muted">
                <LocationOnIcon fontSize="small" />
                <span className="text-sm">{location}</span>
            </div>

            <div
                className="text-sm text-ink prose prose-sm max-w-none max-h-40 overflow-y-auto"
                dangerouslySetInnerHTML={{ __html: description }}
            />

            <RowActions onEdit={onEdit} onDelete={onDelete} className="mt-auto pt-3 border-t border-gold/30" />
        </div>
    );
}
