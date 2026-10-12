import RowActions from "@/component/common/RowActions";

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
    <div className="sv-panel p-4">
      <div className="flex flex-col md:flex-row gap-5">
        <div className="md:w-2/5 w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-48 md:h-full md:min-h-52 object-cover rounded-xl"
          />
        </div>

        <div className="flex-1 flex flex-col py-2 pr-2">
          <h2 className="text-2xl font-bold text-maroon mb-2">{title}</h2>
          <div
            className="text-sm text-ink prose prose-sm max-w-none max-h-48 overflow-y-auto mb-4"
            dangerouslySetInnerHTML={{ __html: description }}
          />
          <RowActions onEdit={onUpdate} onDelete={onDelete} className="mt-auto pt-3 border-t border-gold/30" />
        </div>
      </div>
    </div>
  );
};

export default NewsContainer;
