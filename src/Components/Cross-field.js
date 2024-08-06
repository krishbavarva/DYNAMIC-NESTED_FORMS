import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Define the validation schema using Zod
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

// Custom resolver to use Zod with React Hook Form
const customResolver = async (data) => {
  const result = schema.safeParse(data);
  if (!result.success) {
    const formattedErrors = result.error.errors.reduce((acc, error) => {
      const path = error.path.join('.');
      acc[path] = {
        type: 'manual',
        message: error.message,
      };
      return acc;
    }, {});
    return { values: {}, errors: formattedErrors };
  }

  return { values: result.data, errors: {} };
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
      <div>
        <input {...register('username')} placeholder="Username" />
        {errors.username && <p>{errors.username.message}</p>}
      </div>

      <div>
        <input {...register('email')} placeholder="Email" />
        {errors.email && <p>{errors.email.message}</p>}
      </div>

      <div>
        <input type="password" {...register('password')} placeholder="Password" />
        {errors.password && <p>{errors.password.message}</p>}
      </div>

      <div>
        <input type="password" {...register('confirmPassword')} placeholder="Confirm Password" />
        {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
      </div>

      <div>
        <input type="number" {...register('age', { valueAsNumber: true })} placeholder="Age" />
        {errors.age && <p>{errors.age.message}</p>}
      </div>

      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default AdvancedValidationForm;
