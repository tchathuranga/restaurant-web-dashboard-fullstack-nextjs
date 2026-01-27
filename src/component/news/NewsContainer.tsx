import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

interface NewsContainerProps {
  title: string;
  description: string;
  imageUrl: string;
  onDelete? : () => void;
  onUpdate? : () => void;
}

const NewsContainer: React.FC<NewsContainerProps> = ({
  title,
  description,
  imageUrl,
  onDelete,
  onUpdate
}) => {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-4 ">
      <div className="flex flex-col md:flex-row ">
        <div className="md:w-2/5 w-full">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-36 md:h-full object-cover rounded-xl"
          />
        </div>

        <div 
          className="flex-1 p-6 md:p-8 flex flex-col" 
          id="content-container"
          style={{ maxHeight: '300px', overflowY: 'auto' }}
        >
          <div className="flex-1">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-3">
              {title}
            </h2>
            <div 
              className="flex flex-col gap-1 text-sm text-gray-700 prose prose-sm max-w-none"
              dangerouslySetInnerHTML={{ __html: description }}
            />
          </div>

          <div className="p-4 flex flex-col items-center mt-auto">
            <div className="flex gap-4 mb-3">
              <button className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-400 transition-colors">
                <EditIcon onClick={onUpdate} style={{ color: "white" }} />
              </button>

              <button onClick={onDelete} className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
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