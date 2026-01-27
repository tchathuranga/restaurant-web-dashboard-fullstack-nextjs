"use client"

import { useState, useEffect, useRef } from "react";
import SectionHeader from "@/component/common/SectionHeader";
import Categories from "@/component/Menu/Categories";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import ItemContainer from "@/component/Menu/ItemContainer";
import { getAllItems, createItem, ApiResponse, deleteItem, getItemById, updateItem } from "@/services/itemService";
import Dialog from '@mui/material/Dialog';
import FormContainer from "@/component/common/FormContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { IItem, ItemData } from "@/interfaces/Items";
import { uploadMenuImageToCloudinary } from "@/services/uploadService";
import Alert from '@mui/material/Alert';
import { Divider } from "@mui/material";
import { set } from "mongoose";
 
export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [itemsData, setItemsData] = useState<ItemData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const [saving, setSaving] = useState<boolean>(false);
  const [uploading, setUploading] = useState<boolean>(false);
  const [postError, setPostError] = useState<string>("");
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [updateItemId, setUpdateItemId] = useState<string>("");
  const [deleteItemId, setDeleteItemId] = useState<string>("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    image: "",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        setLoading(true);
        setError("");
        const result = await getAllItems(
          selectedCategory === "All" ? undefined : selectedCategory,
        );
        if (result.success) {
          setItemsData(result.data || []);
        } else {
          setError(result.error || "Failed to fetch items");
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch items");
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, [selectedCategory]);

  useEffect(() => {
    if (deleteSuccess) {
      const timer = setTimeout(() => {
        setDeleteSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteSuccess]);

  useEffect(() => {
    if (formData.image) {
      setImagePreview(formData.image);
    }
  }, [formData.image, openUpdate]);

  useEffect(() => {
    if (openUpdate && formData.image) {
      setImagePreview(formData.image);
    }
  }, [openUpdate, formData.image]);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setPostError("");
    setError("");
    setOpen(false);
    resetForm();
  };

  const handleDiscard = () => {
    setPostError("");
    setError("");
    setOpen(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      title: "",
      category: "",
      image: "",
    });
    setSelectedFile(null);
    setImagePreview("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setPostError("Please select an image file");
        return;
      }

      // Validate file size (e.g., max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setPostError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setPostError("");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      setError("");
    }
  };

  const handleUpload = async () => {
    setUploading(true);
    if (!selectedFile) {
      setPostError("No file selected for upload");
      return;
    }

    const response = await uploadMenuImageToCloudinary(
      selectedFile,
      formData.category,
    );
    console.log("Upload response:", response);

    if (response.success && response.url) {
      setUploading(false);
      setFormData((prev) => ({
        ...prev,
        image: response.url!,
      }));
      setPostError("");
    } else {
      setPostError(response.error || "Image upload failed");
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      if (!formData.title) {
        setPostError("Please enter a title");
        setSaving(false);
        return;
      }

      if (!formData.category) {
        setPostError("Please select a category");
        setSaving(false);
        return;
      }
      if (!selectedFile && !formData.image) {
        setPostError("Please upload an image");
        setSaving(false);
        return;
      }

      const result = await createItem({
        image: formData.image,
        title: formData.title,
        category: formData.category,
        description: "null",
        price: "null",
        imageAlt: "null",
      });

      if (result.success) {
        const refreshResult = await getAllItems(
          selectedCategory === "All" ? undefined : selectedCategory,
        );
        if (refreshResult.success) {
          setItemsData(refreshResult.data || []);
        }
        setSaving(false);
        setOpen(false);
        resetForm();
      } else {
        setPostError(result.error || "Failed to create item");
      }
    } catch (err: any) {
      setPostError(err.message || "Failed to create item");
    }
  };

  const handleUpdate = async (id: string) => {
    setOpenUpdate(true);
    setUpdateItemId(id);
    try {
      const itemDetails: ApiResponse<IItem> = await getItemById(id);
      if (itemDetails.success && itemDetails.data) {
        setFormData({
          title: itemDetails.data.title,
          category: itemDetails.data.category,
          image: itemDetails.data.image,
        });
      } else {
        console.log("Failed to fetch item details:", itemDetails.error);
      }
    } catch (err) {
      console.log("Error fetching item details:", err);
    }
    // Fetch item details and populate the update form if needed
  };

  const handleUpdateSave = async () => {
    try {
      setSaving(true);
      if (!formData.title) {
        setPostError("Please enter a title");
        return;
      }

      const result = await updateItem(updateItemId, {
        title: formData.title,
        category: formData.category,
        image: formData.image,
      });

      if (result.success) {
        const refreshResult = await getAllItems(
          selectedCategory === "All" ? undefined : selectedCategory,
        );
        if (refreshResult.success) {
          setItemsData(refreshResult.data || []);
        }
        setSaving(false);
        setOpenUpdate(false);
      } else {
        setPostError(result.error || "Failed to update item");
      }
    } catch (err) {
      console.log("Error fetching item details:", err);
    }
  };

  const handleDiscardUpdate = () => {
    setOpenUpdate(false);
    // Reset update form if needed
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeleteItemId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setConfirmDeleteOpen(true);
      const deletedItems: ApiResponse<IItem> = await deleteItem(deleteItemId);
      if (deletedItems.success) {
        const refreshResult = await getAllItems(
          selectedCategory === "All" ? undefined : selectedCategory,
        );
        if (refreshResult.success) {
          setItemsData(refreshResult.data || []);
        }
        setDeleteSuccess(true);
      }
    } catch (err) {
      console.log("Delete error:", err);
    }
  };

  const categoryFiltered =
    selectedCategory === "All"
      ? itemsData
      : itemsData.filter((category) => category.Category === selectedCategory);

  const filteredCategories = categoryFiltered
    .map((category) => ({
      ...category,
      data: category.data.filter(
        (item) =>
          typeof item.title === "string" &&
          item.title.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
    }))
    .filter((category) => category.data.length > 0);

  return (
    <div className="margin p-10">
      <SectionHeader
        title="Menu Management"
        buttonLabel="Add New"
        onButtonClick={handleClickOpen}
      />

      <Categories
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      <SearchBar searchValue={searchTerm} onSearchChange={setSearchTerm} />

      {deleteSuccess && (
        <div className="mb-4">
          <Alert severity="success" onClose={() => setDeleteSuccess(false)}>
            Item deleted successfully!
          </Alert>
        </div>
      )}

      <ContainerBox>
        {error && (
          <div className="text-center py-8 px-4 bg-red-50 rounded-lg">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}
        {loading ? (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">Loading items...</p>
          </div>
        ) : filteredCategories.length > 0 ? (
          filteredCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <p className="text-2xl text-gray-700 font-medium pb-4 px-4">
                {category.Category}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 px-4 pb-8">
                {category.data.map((item, itemIndex) => (
                  <ItemContainer
                    key={itemIndex}
                    image={item.image}
                    title={item.title}
                    onDelete={() => item._id && handleDeleteConfirmation(item._id)}
                    onUpdate={() => item._id && handleUpdate(item._id)}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 text-lg">
              No items found matching your search.
            </p>
          </div>
        )}
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
        <FormContainer
          actionLabel="Save"
          title={"Add a new item"}
          onSave={handleSave}
          onDiscard={handleDiscard}
        >
          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter the name of the food here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="" disabled>
                Select a category
              </option>
              {require("@/component/const/Filters")
                .FILTERS.filter(
                  (filter: { name: string }) => filter.name !== "All",
                )
                .map((filter: { id: number; name: string }) => (
                  <option key={filter.id} value={filter.name}>
                    {filter.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium mb-2">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview("");
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleBrowseClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="mb-6">
                  <CloudUploadIcon
                    sx={{
                      fontSize: 64,
                      color: "#2563eb",
                    }}
                  />
                </div>
                <span className="font-medium text-gray-700">
                  Browse Files to upload
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  Upload the food image here (drag & drop or click)
                </span>
                <span className="text-xs text-gray-400 mt-2">
                  Max file size: 5MB
                </span>
              </div>
            )}
          </div>

          <Divider className="" />

          {uploading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Uploading image...</p>
            </div>
          )}

          {saving && (
            <div className="text-center py-4">
              <p className="text-gray-500">Saving item...</p>
            </div>
          )}

          {postError && (
            <div className="text-center py-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{postError}</p>
            </div>
          )}
        </FormContainer>
      </Dialog>

      <Dialog open={openUpdate} onClose={handleCloseUpdate}>
        <FormContainer
          actionLabel="Update"
          title={"Update item"}
          onSave={handleUpdateSave}
          onDiscard={handleDiscardUpdate}
        >
          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              // placeholder={formData.title}
              defaultValue={formData.title}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="category"
            >
              Category
            </label>
            <select
              id="category"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              value={formData.category}
              onChange={(e) =>
                setFormData({ ...formData, category: e.target.value })
              }
            >
              <option value="" defaultValue={formData.category} disabled>
                Select a category
              </option>
              {require("@/component/const/Filters")
                .FILTERS.filter(
                  (filter: { name: string }) => filter.name !== "All",
                )
                .map((filter: { id: number; name: string }) => (
                  <option key={filter.id} value={filter.name}>
                    {filter.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium mb-2">Image</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />

            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="flex justify-center mt-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview("");
                      setFormData({ ...formData, image: "" }); // Clear from formData too
                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
                  >
                    Remove
                  </button>
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="bg-green-500 text-white px-3 py-1 rounded-lg hover:bg-green-600"
                  >
                    Upload
                  </button>
                </div>
              </div>
            ) : (
              <div
                className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg py-8 bg-gray-50 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={handleBrowseClick}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="mb-6">
                  <CloudUploadIcon
                    sx={{
                      fontSize: 64,
                      color: "#2563eb",
                    }}
                  />
                </div>
                <span className="font-medium text-gray-700">
                  Browse Files to upload
                </span>
                <span className="text-sm text-gray-400 mt-1">
                  Upload the food image here (drag & drop or click)
                </span>
                <span className="text-xs text-gray-400 mt-2">
                  Max file size: 5MB
                </span>
              </div>
            )}
          </div>

          <Divider className="" />

          {uploading && (
            <div className="text-center py-4">
              <p className="text-gray-500">Uploading image...</p>
            </div>
          )}

          {saving && (
            <div className="text-center py-4">
              <p className="text-gray-500">Saving item...</p>
            </div>
          )}

          {postError && (
            <div className="text-center py-4 bg-red-50 rounded-lg">
              <p className="text-red-600">{postError}</p>
            </div>
          )}
        </FormContainer>
      </Dialog>

      <Dialog open={confirmDeleteOpen} onClose={() => setConfirmDeleteOpen(false)}>
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this item?</p>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
              onClick={() => setConfirmDeleteOpen(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
              onClick={() => {
                handleDelete();
                setConfirmDeleteOpen(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>  
      </Dialog>
    </div>
  );
}