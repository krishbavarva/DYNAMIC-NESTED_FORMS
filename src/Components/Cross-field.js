import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Simulated API call for username availability check


const schema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  age: z.number().min(18, "You must be at least 18 years old"),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

const customResolver = async (data, context, options) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    return { values: {}, errors: result.error.format() };
  }

 

  return { values: data, errors: {} };
};

const AdvancedValidationForm = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: customResolver,
  });

  const onSubmit = async (data) => {
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log(data);

    let usernames = JSON.parse(localStorage.getItem('usernames')) || [];

    if (usernames.includes(data.username)) {
      window.alert("User already exists");
    } else {
      usernames.push(data.username);
      localStorage.setItem('usernames', JSON.stringify(usernames));
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('username')} placeholder="Username" />
      {errors.username && <p>{errors.username.message}</p>}

      <input {...register('email')} placeholder="Email" />
      {errors.email && <p>{errors.email.message}</p>}

      <input type="password" {...register('password')} placeholder="Password" />
      {errors.password && <p>{errors.password.message}</p>}

      <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" />
      {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}

      <input type="number" {...register('age', { valueAsNumber: true })} placeholder="Age" />
      {errors.age && <p>{errors.age.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default AdvancedValidationForm;
