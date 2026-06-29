import React from "react";
import ProductForm from "./components/ProductForm";
import { ProductDraftValues } from "./productSchema";
import { Product } from "./types";

interface EditProductProps {
  product: Product;
  onCancel: () => void;
  onSubmit: (values: ProductDraftValues) => void | Promise<void>;
}

export default function EditProduct({ product, onCancel, onSubmit }: EditProductProps) {
  return (
    <ProductForm
      mode="edit"
      initialValues={product}
      onCancel={onCancel}
      onSubmit={onSubmit}
    />
  );
}
