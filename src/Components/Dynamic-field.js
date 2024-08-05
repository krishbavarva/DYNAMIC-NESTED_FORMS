import React, { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Define the schema for product validation
const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  price: z.number().min(0, "Price cannot be negative"),
});

// Define the schema for bundle validation
const bundleSchema = z.object({
  bundleName: z.string().min(1, "Bundle name is required"),
  products: z.array(productSchema)
    .min(2, "Bundle must have at least 2 products")
    .max(5, "Bundle cannot have more than 5 products"),
}).refine((data) => {
  const totalPrice = data.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
  return totalPrice <= 1000;
}, {
  message: "Total bundle price cannot exceed $1000",
  path: ["products"],
});

const DynamicBundleForm = () => {
  const [priceValue, setPriceValue] = useState(0);
  const { register, control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bundleSchema),
    defaultValues: {
      bundleName: '',
      products: [{ name: '', quantity: 1, price: 0 }],
    },
  });
  
  const { fields, append, remove } = useFieldArray({
    control,
    name: "products",
  });

  const onSubmit = (data) => {
    const totalPrice = data.products.reduce((sum, product) => sum + product.price * product.quantity, 0);
    setPriceValue(totalPrice);
   
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <input {...register('bundleName')} placeholder="Bundle Name" />
        {errors.bundleName && <p>{errors.bundleName.message}</p>}
      </div>

      {fields.map((field, index) => (
        <div key={field.id}>
          <input
            {...register(`products.${index}.name`)}
            placeholder="Product Name"
          />
          {errors.products?.[index]?.name && <p>{errors.products[index].name.message}</p>}

          <input
            type="number"
            {...register(`products.${index}.quantity`, { valueAsNumber: true })}
            placeholder="Quantity"
          />
          {errors.products?.[index]?.quantity && <p>{errors.products[index].quantity.message}</p>}

          <input
            type="number"
            step="0.01"
            {...register(`products.${index}.price`, { valueAsNumber: true })}
            placeholder="Price"
          />
          {errors.products?.[index]?.price && <p>{errors.products[index].price.message}</p>}

          <button type="button" onClick={() => remove(index)}>Remove</button>
        </div>
      ))}

      {errors.products?.message && (
        <p>{errors.products.message}</p>
      )}

      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, price: 0 })}
      >
        Add Product
      </button>
      <button type="submit">Create Bundle</button>

      {priceValue > 0 && (
        <div>
          <p>Total Price: ${priceValue.toFixed(2)}</p>
        </div>
      )}
    </form>
  );
};

export default DynamicBundleForm;
