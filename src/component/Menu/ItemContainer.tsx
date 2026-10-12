import Image from "next/image";
import RowActions from "@/component/common/RowActions";

interface ItemContainerProps {
    image : string ;
    title : string ;
    imageAlt? : string ;
    onDelete? : () => void;
    onUpdate? : () => void;
}

const ItemContainer = ({image, title, imageAlt, onDelete, onUpdate} : ItemContainerProps ) => {
    return(
        <div className="sv-panel overflow-hidden hover:-translate-y-1 hover:shadow-xl transition duration-200">
          <div className="w-full h-44 overflow-hidden bg-gradient-to-b from-cream to-parchment flex items-center justify-center">
            <Image
              src={image}
              alt={imageAlt && imageAlt !== "null" ? imageAlt : title}
              width={200}
              height={200}
              className="object-contain h-full w-auto"
            />
          </div>

          <div className="p-4 flex flex-col items-center gap-3">
            <h3 className="text-xl font-bold text-maroon text-center leading-tight">
              {title}
            </h3>
            <RowActions onEdit={onUpdate} onDelete={onDelete} />
          </div>
        </div>
    )
}

export default ItemContainer;
