import Image from "next/image";
import RowActions from "@/components/common/RowActions";

interface ItemContainerProps {
    image : string ;
    title : string ;
    imageAlt? : string ;
    price? : string ;
    onDelete? : () => void;
    onUpdate? : () => void;
}

// Dish card: photo on a warm backdrop, price tag, and labelled actions
const ItemContainer = ({image, title, imageAlt, price, onDelete, onUpdate} : ItemContainerProps ) => {
    return(
        <div className="sv-panel sv-card-hover group flex flex-col overflow-hidden">
          <div className="relative flex h-44 w-full items-center justify-center overflow-hidden bg-[radial-gradient(circle_at_50%_40%,#fffdf8,#fff1d6_70%)]">
            <Image
              src={image}
              alt={imageAlt && imageAlt !== "null" ? imageAlt : title}
              width={200}
              height={200}
              className="h-full w-auto object-contain p-2 transition-transform duration-500 group-hover:scale-105"
            />
            {price && (
              <span className="absolute right-3 top-3 rounded-full bg-maroon px-2.5 py-1 text-xs font-semibold text-ivory shadow-md">
                {price}
              </span>
            )}
          </div>

          <div className="flex flex-1 flex-col items-center gap-3 border-t border-gold/20 p-4">
            <h3 className="text-center text-xl font-bold leading-tight text-maroon">
              {title}
            </h3>
            <RowActions onEdit={onUpdate} onDelete={onDelete} className="mt-auto" />
          </div>
        </div>
    )
}

export default ItemContainer;
