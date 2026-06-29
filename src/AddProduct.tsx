import React from "react";
import ProductForm from "./components/ProductForm";
import { createEmptyProductDraft, ProductDraftValues } from "./productSchema";

interface AddProductProps {
  onCancel: () => void;
  onSubmit: (values: ProductDraftValues) => void | Promise<void>;
}

export default function AddProduct({ onCancel, onSubmit }: AddProductProps) {
  const draft = createEmptyProductDraft();

  return (
    <ProductForm
      mode="create"
      initialValues={draft}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
}
