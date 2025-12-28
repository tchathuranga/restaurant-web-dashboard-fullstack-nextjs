import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface JobCardProps {
    title: string;
    location: string;
    employmentType: string;
    experienceLevel: string;
    availability: string;
    skills: string;
    additionalRequirements?: string[];
}

export default function JobCard({
    title,
    location,
    employmentType,
    experienceLevel,
    availability,
    skills,
    additionalRequirements = [],
}: JobCardProps) {
    return (
        <div className="bg-green-50 rounded-lg p-6 flex flex-col gap-4 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800">{title}</h3>

            <div className="flex items-center gap-2 text-gray-600">
                <LocationOnIcon className="text-gray-500" fontSize="small" />
                <span className="text-sm">{location}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-600">
                <AccessTimeIcon className="text-gray-500" fontSize="small" />
                <span className="text-sm">{employmentType}</span>
            </div>

            <div className="flex flex-col gap-1 text-sm text-gray-700">
                <div>• Experience Level: {experienceLevel}</div>
                <div>• Availability: {availability}</div>
                <div>• Skills: {skills}</div>
                {additionalRequirements.map((req, index) => (
                    <div key={index}>• {req}</div>
                ))}
            </div>

            <button className="mt-auto border-2 border-orange-400 bg-orange-50 text-orange-600 font-medium py-2 px-4 rounded-md hover:bg-orange-100 transition-colors">
                View Details
            </button>

            <div className="p-4 flex flex-col items-center">
                <div className="flex gap-4 mb-3">
                    <button className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-400 transition-colors">
                        <EditIcon style={{ color: "white" }} />
                    </button>

                    <button className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
                        <DeleteOutlineIcon style={{ color: "white" }} />
                    </button>
                </div>
            </div>
        </div>
    );
}

