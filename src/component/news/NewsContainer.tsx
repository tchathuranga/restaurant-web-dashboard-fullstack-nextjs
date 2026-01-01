import CheckIcon from "@mui/icons-material/Check";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface NewsContainerProps {
  title: string;
  description: string;
  imageUrl: string;
}

const NewsContainer: React.FC<NewsContainerProps> = ({
  title,
  description,
  imageUrl,
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden p-4">
      <div className="flex flex-col md:flex-row">
        <div className="md:w-2/5 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-36 md:h-full object-cover rounded-xl"
          />
        </div>

        <div className="flex-1 p-6 md:p-8 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              {title}
            </h2>
            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-4">
              {description}
            </p>
            <button className="text-sm font-medium text-orange-500 hover:text-orange-600 flex items-center gap-1">
              see more...
              <span className="text-orange-400 text-lg leading-none">›</span>
            </button>
          </div>

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
      </div>
    </div>
  );
};

export default NewsContainer;