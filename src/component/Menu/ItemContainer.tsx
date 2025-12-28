import Image from "next/image";
import EditIcon from '@mui/icons-material/Edit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

interface ItemContainerProps {
    image : string ;
    title : string ;
    imageAlt : string ;
}

const ItemContainer = ({image, title, imageAlt} : ItemContainerProps ) => {
    return(
        <div
          className="rounded-xl shadow-md bg-white dark:bg-darkgray overflow-hidden hover:shadow-lg transition-shadow duration-200"
        >
          {/* Item Image Section with Orange-Yellow Background */}
          <div className="w-full h-48 overflow-hidden bg-orange-100 flex items-center justify-center">
            <Image
              src={image}
              alt={imageAlt}
              width={200}
              height={200}
              className="object-contain"
            />
          </div>
          
          {/* Action Buttons and Title */}
          <div className="p-4 flex flex-col items-center">
            {/* Action Buttons */}
            <div className="flex gap-4 mb-3">
              {/* update Button */}
              <button className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center hover:bg-green-400 transition-colors">
                <EditIcon style={{color:"white"}}/>
              </button>
              
              {/* Delete Button */}
              <button className="w-10 h-10 rounded-full bg-red-700 flex items-center justify-center hover:bg-red-400 transition-colors">
                <DeleteOutlineIcon style={{color:"white"}}/>   
              </button>
            </div>
            
            <h3 className="text-lg font-medium text-orange-600 italic text-center" style={{ fontFamily: 'cursive' }}>
              {title}
            </h3>
          </div>
        </div>
    )
}

export default ItemContainer;