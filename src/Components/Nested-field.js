import React from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
const itemSchema = z.object({
  name: z.string().min(1, "Item name is required"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  requiresInsurance: z.boolean(),
  insuranceType: z.string().optional(),
});
const orderSchema = z.object({
  customerName: z.string().min(1, "Customer name is required"),
  items: z.array(itemSchema)
    .min(1, "Order must have at least one item")
    .refine((items) => {
      return items.every(item => !item.requiresInsurance || (item.requiresInsurance && item.insuranceType));
    }, {
      message: "Insurance type is required for items that require insurance",
    }),
});
const ComplexOrderForm = () => {
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      customerName: '',
      items: [{ name: '', quantity: 1, requiresInsurance: false }],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });
  
  const onSubmit = (data) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('customerName')} placeholder="Customer Name" />
      {errors.customerName && <p>{errors.customerName.message}</p>}
      {fields.map((field, index) => {
        const requiresInsurance = watch(`items.${index}.requiresInsurance`);
        return (
          <div key={field.id}>
            <input {...register(`items.${index}.name`)} placeholder="Item Name" />
            {errors.items?.[index]?.name && <p>{errors.items[index].name.message}</p>}
            <input
              type="number"
              {...register(`items.${index}.quantity`, { valueAsNumber: true })}
              placeholder="Quantity"
            />
            {errors.items?.[index]?.quantity && <p>{errors.items[index].quantity.message}</p>}

            <label>
              <input
                type="checkbox"
                {...register(`items.${index}.requiresInsurance`)}
              />
              Requires Insurance
            </label>
            {requiresInsurance && (
                <>
                
                <select {...register(`items.${index}.insuranceType`)}>
                <option value="">Select Insurance Type</option>
                <option value="basic">Basic</option>
                <option value="premium">Premium</option>
              </select>
                </>
              
            )}
            <button type="button" onClick={() => remove(index)}>Remove Item</button>
          </div>
        );
      })}
      <button
        type="button"
        onClick={() => append({ name: '', quantity: 1, requiresInsurance: false })}
      >
        Add Item
      </button>
      {errors.items && <p>{errors.items.message}</p>}
      <button type="submit">Place Order</button>
    </form>
  );
};export default ComplexOrderForm