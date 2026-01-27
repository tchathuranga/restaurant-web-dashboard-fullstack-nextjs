import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

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
        <div className="bg-green-50 rounded-lg p-6 flex flex-col gap-4 shadow-sm max-h-120 overflow-auto">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>

            <div className="flex items-center gap-2 text-gray-600">
                <LocationOnIcon className="text-gray-500" fontSize="small" />
                <span className="text-sm">{location}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
                <AccessTimeIcon className="text-gray-500" fontSize="small" />
                <span className="text-sm">{employmentType}</span>
            </div>

            <div 
                className="flex flex-col gap-1 text-sm text-gray-700 prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: description }}
            />

            <div className="p-4 flex flex-col items-center">
                <div className="flex gap-4 mb-3">
                    <button onClick={onEdit} className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-400 transition-colors">
                        <EditIcon style={{ color: "white" }} />
                    </button>

                    <button onClick={onDelete} className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
                        <DeleteOutlineIcon style={{ color: "white" }} />
                    </button>
                </div>
            </div>
        </div>
    );
}

