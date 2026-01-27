"use client";

import SearchBar from "@/component/common/SearchBar";
import SectionHeader from "@/component/common/SectionHeader";
import ContainerBox from "@/component/common/ContainerBox";
import NewsContainer from "@/component/news/NewsContainer";
import { NEWS_DATA } from "@/component/const/newsData";
import { useEffect, useRef, useState } from "react";
import Dialog from "@mui/material/Dialog";
import FormContainer from "@/component/common/FormContainer";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { uploadNewsImageToCloudinary } from "@/services/uploadService";
import { Alert, Divider } from "@mui/material";
import Editor from "@/component/common/Editor";
import {
  createNews,
  deleteNews,
  getAllNews,
  getNewsById,
  updateNews,
} from "@/services/newsService";
import { ApiResponse } from "@/services/itemService";
import { News } from "@/interfaces/News";
import { set } from "mongoose";

export default function NewsFields() {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);
  const [html, setHtml] = useState<string>("<p>Enter the description</p>");
  const [imagePreview, setImagePreview] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [postError, setPostError] = useState<string>("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [newsData, setNewsData] = useState<News[]>([]);
  const [deleteSuccess, setDeleteSuccess] = useState<boolean>(false);
  const [deleteNewsId, setDeleteNewsId] = useState<string>("");
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState<boolean>(false);
  const [openUpdate, setOpenUpdate] = useState<boolean>(false);
  const [updateNewsId, setUpdateNewsId] = useState<string>("");
  const [loadingUpdate, setLoadingUpdate] = useState<boolean>(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        const result = await getAllNews();
        if (result.success) {
          setNewsData(result.data || []);
        } else {
          setError(result.error || "Failed to fetch News");
          setLoading(false);
        }
      } catch (err: any) {
        setError(err.message || "Failed to fetch News");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
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

  const handleUpload = async () => {
    setUploading(true);
    if (!selectedFile) {
      setPostError("No file selected for upload");
      return;
    }

    const response = await uploadNewsImageToCloudinary(selectedFile);
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

  const handleClickOpen = () => {
    setImagePreview("");
    setFormData({
      title: "",
      description: "",
      image: "",
    });
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

  const handleSave = async () => {
    // Add save logic here
    try {
      setSaving(true);
      if (!formData.title) {
        setPostError("Title is required");
        return;
      }

      if (!formData.description) {
        setPostError("Description is required");
        return;
      }

      if (!formData.image) {
        setPostError("Image is required");
        return;
      }

      const result = await createNews({
        title: formData.title,
        description: formData.description,
        image: formData.image,
      });

      if (result.success) {
        setSaving(false);
        resetForm();
        handleClose();
        window.location.reload();
      } else {
        setPostError(result.error || "Failed to save news");
      }
    } catch (error: any) {
      setPostError(error.message || "Failed to save news");
    }
  };

  const handleDeleteConfirmation = (id: string) => {
    setDeleteNewsId(id);
    setConfirmDeleteOpen(true);
  };

  const handleDelete = async () => {
    try {
      setConfirmDeleteOpen(true);
      const deletedNews = await deleteNews(deleteNewsId);
      if (deletedNews.success) {
        setDeleteSuccess(true);
        setConfirmDeleteOpen(false);
        window.location.reload();
      } else {
        setError("Failed to delete news item: " + deletedNews.error);
      }
    } catch (error) {
      setError("Delete failed: " + error);
    }
  };

  const handleCloseUpdate = () => {
    setOpenUpdate(false);
  };

  const handleUpdate = async (id: string) => {
    setFormData({
      title: "",
      description: "",
      image: "",
    });

    setUpdateNewsId(id);
    setLoadingUpdate(true);
    setOpenUpdate(true);

    try {
      const newsDetails: ApiResponse<News> = await getNewsById(id);
      if (newsDetails.success && newsDetails.data) {
        setFormData({
          title: newsDetails.data.title,
          description: newsDetails.data.description,
          image: newsDetails.data.image,
        });
      } else {
        console.log("Failed to fetch item details:", newsDetails.error);
      }
    } catch (err) {
      console.log("Error fetching item details:", err);
    } finally {
      setLoadingUpdate(false);
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

      const result = await updateNews(updateNewsId, {
        title: formData.title,
        description: formData.description,
        image: formData.image,
      });

      if (result.success) {
        window.location.reload();
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

  const filteredNews = newsData.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="margin p-10">
      <SectionHeader
        title="News"
        buttonLabel="Add New"
        onButtonClick={handleClickOpen}
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

        {filteredNews.length === 0 && !loading && (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 text-lg">No news found.</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8 px-4">
            <p className="text-gray-500 text-lg">Loading news...</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {filteredNews.map((news, newsIndex) => (
              <NewsContainer
                key={newsIndex}
                title={news.title}
                description={news.description}
                imageUrl={news.image}
                onDelete={() => news._id && handleDeleteConfirmation(news._id)}
                onUpdate={() => news._id && handleUpdate(news._id)}
              />
            ))}
          </div>
        )}
      </ContainerBox>

      <Dialog open={open} onClose={handleClose}>
        <FormContainer
          title={"Add a new News Field"}
          onSave={handleSave}
          onDiscard={handleDiscard}
          actionLabel={"Save"}
        >
          <div className="mb-6">
            <label className="block text-base font-medium mb-2" htmlFor="title">
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Enter the title of the news here"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
            />
          </div>

          <div className="mb-6">
            <label
              className="block text-base font-medium mb-2"
              htmlFor="Description"
            >
              Description
            </label>

            <Editor
              onChange={(html) =>
                setFormData({ ...formData, description: html })
              }
            />
          </div>

          <div className="mb-8">
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
        {loadingUpdate ? (
          <div className="p-8 min-w-125">
            <p>Loading vacancy details...</p>
          </div>
        ) : (
          <FormContainer
            actionLabel="Update"
            title={"Update vacancy"}
            onSave={handleUpdateSave}
            onDiscard={handleDiscardUpdate}
          >
            <div className="mb-6">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter the title of the news here"
                value={formData.title}
                defaultValue={formData.title}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-base"
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-base font-medium mb-2"
                htmlFor="Description"
              >
                Description
              </label>

              <Editor
                key={updateNewsId}
                initialValue={formData.description}
                onChange={(html) =>
                  setFormData({ ...formData, description: html })
                }
              />
            </div>

            <div className="mb-8">
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
                        setFormData({ ...formData, image: "" });
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
        )}
      </Dialog>

      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Confirm Deletion</h2>
          <p className="mb-6">Are you sure you want to delete this News?</p>
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
