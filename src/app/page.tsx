"use client"

import { useCallback, useEffect, useMemo, useState } from "react";
import SectionHeader from "@/component/common/SectionHeader";
import Categories from "@/component/Menu/Categories";
import SearchBar from "@/component/common/SearchBar";
import ContainerBox from "@/component/common/ContainerBox";
import ItemContainer from "@/component/Menu/ItemContainer";
import ItemFormDialog from "@/component/Menu/ItemFormDialog";
import ConfirmDialog from "@/component/common/ConfirmDialog";
import PageShell from "@/component/common/PageShell";
import { EmptyState, ErrorState, LoadingState } from "@/component/common/StateViews";
import { useToast } from "@/component/common/Toast";
import { getAllItems, deleteItem } from "@/services/itemService";
import CategoryManagerDialog from "@/component/Menu/CategoryManagerDialog";
import { getCategories } from "@/services/categoryService";
import { ICategory } from "@/interfaces/Category";
import { IItem, ItemData } from "@/interfaces/Items";

export default function Home() {
  const toast = useToast();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [itemsData, setItemsData] = useState<ItemData[]>([]);
  const [categories, setCategories] = useState<ICategory[]>([]);
  const [categoriesOpen, setCategoriesOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  const [formOpen, setFormOpen] = useState<boolean>(false);
  const [editingItem, setEditingItem] = useState<IItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<IItem | null>(null);
  const [deleting, setDeleting] = useState<boolean>(false);

  const loadItems = useCallback(async () => {
    const [categoryResult, result] = await Promise.all([getCategories(), getAllItems()]);
    if (categoryResult.success) setCategories(categoryResult.data || []);
    if (result.success) {
      setItemsData(result.data || []);
      setError("");
    } else {
      setError(result.error || "Could not load the menu");
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const counts = useMemo(() => {
    const result: Record<string, number> = { All: 0 };
    for (const group of itemsData) {
      result[group.Category] = group.data.length;
      result.All += group.data.length;
    }
    return result;
  }, [itemsData]);

  const visibleGroups = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return itemsData
      .filter((group) => selectedCategory === "All" || group.Category === selectedCategory)
      .map((group) => ({
        ...group,
        data: group.data.filter((item) => typeof item.title === "string" && item.title.toLowerCase().includes(term)),
      }))
      .filter((group) => group.data.length > 0);
  }, [itemsData, selectedCategory, searchTerm]);

  // Subcategories follow the order set in the category manager; any stray names go last
  const sortSubcategories = (category: string, names: string[]) => {
    const preferred = (categories.find((c) => c.name === category)?.subcategories || []).map((s) => s.name);
    return [
      ...preferred.filter((name) => names.includes(name)),
      ...names.filter((name) => !preferred.includes(name)).sort(),
    ];
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormOpen(true);
  };

  const openEdit = (item: IItem) => {
    setEditingItem(item);
    setFormOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteTarget?._id) return;
    setDeleting(true);
    const result = await deleteItem(deleteTarget._id);
    setDeleting(false);

    if (result.success) {
      toast.success(`"${deleteTarget.title}" deleted`);
      setDeleteTarget(null);
      await loadItems();
    } else {
      toast.error(result.error || "Could not delete the item. Please try again");
    }
  };

  return (
    <PageShell>
      <SectionHeader
        title="Menu Management"
        buttonLabel="Add item"
        onButtonClick={openAdd}
      />

      <div className="flex justify-end px-1 -mt-2 mb-2">
        <button
          type="button"
          onClick={() => setCategoriesOpen(true)}
          className="px-4 py-2 rounded-xl border border-maroon text-maroon text-sm font-semibold hover:bg-maroon hover:text-ivory transition"
        >
          Manage categories
        </button>
      </div>

      <Categories
        categories={categories}
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
        counts={counts}
      />

      <SearchBar searchValue={searchTerm} onSearchChange={setSearchTerm} placeholder="Search dishes by name" />

      <ContainerBox>
        {loading ? (
          <LoadingState label="Loading the menu..." />
        ) : error ? (
          <ErrorState message={error} onRetry={() => { setLoading(true); loadItems(); }} />
        ) : visibleGroups.length === 0 ? (
          searchTerm ? (
            <EmptyState title="No dishes match your search" hint={`Nothing found for "${searchTerm}". Check the spelling or clear the search.`} actionLabel="Clear search" onAction={() => setSearchTerm("")} />
          ) : (
            <EmptyState title="No dishes here yet" hint="Add the first dish to this category." actionLabel="Add item" onAction={openAdd} />
          )
        ) : (
          visibleGroups.map((group) => (
            <div key={group.Category}>
              <h2 className="text-2xl font-bold text-maroon pb-3 px-1">{group.Category}</h2>

              {sortSubcategories(
                group.Category,
                Array.from(new Set(group.data.map((item) => item.subcategory || group.Category))),
              ).map((subcategory) => (
                <div key={subcategory}>
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-amber-700 pb-3 px-1">
                    {subcategory}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 pb-8">
                    {group.data
                      .filter((item) => (item.subcategory || group.Category) === subcategory)
                      .map((item) => (
                        <ItemContainer
                          key={item._id}
                          image={item.image}
                          title={item.title}
                          onDelete={() => setDeleteTarget(item)}
                          onUpdate={() => openEdit(item)}
                        />
                      ))}
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
      </ContainerBox>

      <ItemFormDialog
        open={formOpen}
        item={editingItem}
        categories={categories}
        defaultCategory={selectedCategory === "All" ? undefined : selectedCategory}
        onClose={() => setFormOpen(false)}
        onSaved={loadItems}
      />

      <CategoryManagerDialog
        open={categoriesOpen}
        categories={categories}
        onClose={() => setCategoriesOpen(false)}
        onChanged={async () => {
          // A deleted or renamed category may be the one currently filtered on
          setSelectedCategory("All");
          await loadItems();
        }}
      />

      <ConfirmDialog
        open={deleteTarget !== null}
        title="Delete this dish?"
        message={`"${deleteTarget?.title ?? ""}" will be removed from the website menu. This can't be undone.`}
        busy={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </PageShell>
  );
}
